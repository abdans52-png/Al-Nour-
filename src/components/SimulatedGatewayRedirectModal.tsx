import React, { useState, useEffect } from 'react';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Fingerprint,
  Smartphone,
  CreditCard,
  Building2,
  Clock,
  Check,
  AlertTriangle,
  ArrowLeft,
  X,
  Copy
} from 'lucide-react';
import { Currency, FailedPaymentInfo } from '../types';
import { formatPrice } from '../utils/currency';
import {
  MERCHANT_NAME,
  MERCHANT_PHONE,
  MERCHANT_UPI_ID,
  openGooglePayApp,
  openApplePayApp,
  getUpiPaymentUri,
  triggerNativePaymentRequest
} from '../utils/paymentGateway';
import { hapticLight, hapticSuccess, hapticWarning } from '../utils/haptics';
import { playNotificationChime } from '../utils/notificationSound';

export type GatewayType = 'razorpay' | 'gpay' | 'applepay' | 'card' | 'netbanking';

export interface RedirectPaymentResult {
  status: 'success' | 'cancelled' | 'failed';
  gateway: GatewayType;
  orderId: string;
  transactionId: string;
  gatewayRef: string;
  amount: number;
  paidAt: string;
  returnUrl: string;
}

interface SimulatedGatewayRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  gateway: GatewayType;
  amount: number;
  currency?: Currency;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  cardLast4?: string;
  bankName?: string;
  apiKey?: string;
  onRedirectSuccess: (result: RedirectPaymentResult) => void;
  onRedirectFailure: (info: FailedPaymentInfo) => void;
}

export const SimulatedGatewayRedirectModal: React.FC<SimulatedGatewayRedirectModalProps> = ({
  isOpen,
  onClose,
  gateway,
  amount,
  currency = 'INR',
  orderId,
  customerName,
  customerPhone,
  customerEmail,
  cardLast4 = '4242',
  bankName = 'State Bank of India',
  apiKey = 'rzp_test_TSNf0OSCTf7Uv3',
  onRedirectSuccess,
  onRedirectFailure
}) => {
  // Stages: 'redirecting_out' -> 'on_gateway' -> 'authorizing' -> 'redirecting_back_success' | 'redirecting_back_failed'
  const [stage, setStage] = useState<
    | 'redirecting_out'
    | 'on_gateway'
    | 'authorizing'
    | 'redirecting_back_success'
    | 'redirecting_back_failed'
  >('redirecting_out');

  const [simulatedUrl, setSimulatedUrl] = useState<string>('');
  const [authRef, setAuthRef] = useState<string>('');
  const [failureReason, setFailureReason] = useState<string>('');
  const [enteredOtp, setEnteredOtp] = useState<string>('582914');
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [razorpayMethod, setRazorpayMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');

  const handleCopyUpiId = async () => {
    hapticSuccess();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(MERCHANT_UPI_ID);
      } else {
        const ta = document.createElement('textarea');
        ta.value = MERCHANT_UPI_ID;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  // Initial gateway URL based on selection
  const gatewayUrlMap: Record<GatewayType, string> = {
    razorpay: `https://checkout.razorpay.com/v1/checkout.js?key_id=${apiKey}&order_id=${orderId}&amount=${Math.round(amount * 100)}`,
    gpay: `https://pay.google.com/gp/p/ui/pay?session_id=sess_gpay_${Math.random().toString(36).substring(2, 9)}&merchant_id=al_noureen&order_id=${orderId}&amount=${amount}`,
    applepay: `https://apple.com/apple-pay/checkout?token=tok_applepay_${Math.random().toString(36).substring(2, 9)}&merchant=al_noureen&order_id=${orderId}&amount=${amount}`,
    card: `https://secure.cardgateway.com/3dsecure/verify?txn_id=txn_${Math.random().toString(36).substring(2, 9)}&card_bin=424242&order=${orderId}`,
    netbanking: `https://netbanking.${bankName.toLowerCase().replace(/[^a-z]/g, '')}.com/corp/auth?ref_id=${orderId}`
  };

  const returnSuccessUrl = `https://al-noureen.luxury/checkout?payment_status=success&session_id=sess_${Math.random().toString(36).substring(2, 10)}&order_id=${orderId}&gateway=${gateway}`;
  const returnFailedUrl = `https://al-noureen.luxury/checkout?payment_status=failed&reason=payment_declined_by_bank&order_id=${orderId}&gateway=${gateway}`;

  useEffect(() => {
    if (!isOpen) {
      setStage('redirecting_out');
      return;
    }

    // Step 1: Initial redirecting animation to gateway
    setSimulatedUrl(gatewayUrlMap[gateway]);
    setStage('redirecting_out');

    // Trigger mobile phone deep linking if Google Pay or Apple Pay is selected on a mobile device
    if (typeof window !== 'undefined') {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      if (isMobile) {
        if (gateway === 'gpay') {
          try {
            openGooglePayApp({ amount, orderId, customerName, customerPhone });
          } catch (e) {
            console.log('Mobile GPay trigger:', e);
          }
        } else if (gateway === 'applepay') {
          try {
            openApplePayApp({ amount, orderId, customerName, customerPhone });
          } catch (e) {
            console.log('Mobile Apple Pay trigger:', e);
          }
        }
      }
    }

    const outTimer = setTimeout(() => {
      setStage('on_gateway');
    }, 1300);

    return () => clearTimeout(outTimer);
  }, [isOpen, gateway, orderId, amount, bankName]);

  if (!isOpen) return null;

  // Handle successful gateway payment approval
  const handleApproveGatewayPayment = () => {
    hapticLight();
    setStage('authorizing');

    const generatedRef =
      gateway === 'gpay'
        ? `UPI/GPAY/${Math.floor(100000000000 + Math.random() * 900000000000)}`
        : gateway === 'applepay'
        ? `APAY-ENC-${Math.floor(100000000 + Math.random() * 900000000)}`
        : gateway === 'card'
        ? `CARD-3DS-${Math.floor(10000000 + Math.random() * 90000000)}`
        : `NB-${bankName.slice(0, 3).toUpperCase()}-${Math.floor(100000000 + Math.random() * 900000000)}`;

    setAuthRef(generatedRef);

    // Step 2: Gateway authorization complete -> Redirect return to merchant
    setTimeout(() => {
      setSimulatedUrl(returnSuccessUrl);
      setStage('redirecting_back_success');
      hapticSuccess();
      playNotificationChime();

      // Step 3: Land safely on merchant website with verified return query params
      setTimeout(() => {
        onRedirectSuccess({
          status: 'success',
          gateway,
          orderId,
          transactionId: `${gateway.toUpperCase()}-${orderId}`,
          gatewayRef: generatedRef,
          amount,
          paidAt: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          returnUrl: returnSuccessUrl
        });
      }, 1500);
    }, 1400);
  };

  // Handle simulated failed / declined payment from gateway
  const handleSimulateDeclinePayment = (customReason?: string) => {
    hapticWarning();
    const reasonText =
      customReason ||
      (gateway === 'gpay'
        ? 'Payment authorization cancelled or declined in Google Pay UPI application. Transaction to seller was not completed.'
        : gateway === 'applepay'
        ? 'Biometric authorization failed or Apple Pay transaction was cancelled.'
        : gateway === 'card'
        ? '3D Secure OTP verification failed or card authorization was declined by issuer.'
        : 'NetBanking authentication timed out or was rejected by bank clearing portal.');

    setFailureReason(reasonText);
    setSimulatedUrl(returnFailedUrl);
    setStage('redirecting_back_failed');

    setTimeout(() => {
      onRedirectFailure({
        gateway:
          gateway === 'gpay'
            ? 'Google Pay (UPI)'
            : gateway === 'applepay'
            ? 'Apple Pay'
            : gateway === 'card'
            ? 'Credit / Debit Card'
            : `NetBanking (${bankName})`,
        orderId,
        amount,
        currency,
        reason: reasonText,
        errorCode: 'ERR_GATEWAY_DECLINED_BY_USER_OR_BANK',
        timestamp: new Date().toLocaleTimeString(),
        customerName,
        customerPhone,
        customerEmail
      });
    }, 1500);
  };

  const handleCloseManually = () => {
    handleSimulateDeclinePayment('Payment session was closed by the user before completing authorization.');
  };

  return (
    <div
      id="simulated-gateway-redirect-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="simulated-gateway-browser-window"
        className="relative w-full max-w-xl bg-[#1C1A17] border border-[#C59B27]/50 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-white font-sans flex flex-col"
      >
        {/* Browser Top Navigation Bar Simulation */}
        <div className="bg-[#141210] px-4 py-3 border-b border-[#2C2723] flex items-center gap-3 select-none">
          {/* Window action buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCloseManually}
              className="w-3 h-3 rounded-full bg-[#FF5F56] hover:opacity-80 transition-opacity cursor-pointer"
              title="Decline / Cancel transaction and return to store"
            />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>

          {/* Browser address bar */}
          <div className="flex-1 bg-[#221D18] border border-[#3D352D] rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs font-mono text-[#D4CBBF] truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{simulatedUrl}</span>
          </div>

          {/* Reload / Security badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full font-medium">
              <ShieldCheck className="w-3 h-3" /> 256-Bit SSL
            </span>
            <button
              onClick={handleCloseManually}
              className="text-[#8E867E] hover:text-white transition-colors p-1"
              title="Close Gateway & Return"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Phase 1: Redirecting OUT to Gateway */}
        {stage === 'redirecting_out' && (
          <div className="p-8 sm:p-12 text-center space-y-6 animate-in fade-in">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-3 border-[#C59B27]/20"></div>
              <div className="absolute inset-0 rounded-full border-3 border-t-[#0C2340] border-r-[#0C2340] border-b-[#3395FF] border-l-[#C59B27] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                {gateway === 'razorpay' ? (
                  <span className="font-extrabold text-base text-[#3395FF] tracking-tighter">Rzp</span>
                ) : gateway === 'gpay' ? (
                  <Smartphone className="w-6 h-6 text-[#4285F4]" />
                ) : gateway === 'applepay' ? (
                  <span className="font-bold text-lg leading-none"></span>
                ) : (
                  <CreditCard className="w-6 h-6 text-[#C59B27]" />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#C59B27]">
                Secure Gateway Handshake
              </span>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F5D77F]">
                {gateway === 'razorpay'
                  ? 'Connecting to Razorpay Payments Gateway...'
                  : gateway === 'gpay'
                  ? 'Redirecting to Google Pay App / Portal...'
                  : gateway === 'applepay'
                  ? 'Connecting to Apple Pay Enclave...'
                  : gateway === 'card'
                  ? 'Connecting to 3D Secure Card Gateway...'
                  : `Connecting to ${bankName} Portal...`}
              </h3>
              <p className="text-xs text-[#A69788] max-w-md mx-auto">
                Opening merchant checkout session for order <strong>#{orderId}</strong> amounting to{' '}
                <strong className="text-white">{formatPrice(amount, currency)}</strong>.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#25201A] rounded-full border border-[#3D352D] text-xs text-[#E8D59E] font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Merchant: {MERCHANT_NAME}
            </div>
          </div>
        )}

        {/* Phase 2: On Gateway Portal */}
        {stage === 'on_gateway' && (
          <div className="p-6 sm:p-8 space-y-6 animate-in fade-in">
            {/* Gateway Brand Banner */}
            <div className="flex items-center justify-between border-b border-[#2C2723] pb-4">
              <div className="flex items-center gap-2.5">
                {gateway === 'razorpay' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0A192F] border border-[#3395FF]/60 rounded-full">
                    <span className="font-extrabold text-xs text-[#3395FF] tracking-tight">RAZORPAY</span>
                    <span className="text-white text-xs font-semibold">Secure Checkout</span>
                  </div>
                ) : gateway === 'gpay' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#25201A] border border-[#4285F4]/60 rounded-full">
                    <span className="flex items-center font-bold text-sm">
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-[#EA4335]">o</span>
                      <span className="text-[#FBBC05]">o</span>
                      <span className="text-[#4285F4]">g</span>
                      <span className="text-[#34A853]">l</span>
                      <span className="text-[#EA4335]">e</span>
                      <span className="text-white ml-1 font-semibold">Pay</span>
                    </span>
                  </div>
                ) : gateway === 'applepay' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#2C2C2E] border border-[#E8D59E]/40 rounded-full">
                    <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                      <span className="text-base leading-none"></span>Pay
                    </span>
                  </div>
                ) : gateway === 'card' ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#25201A] border border-[#C59B27]/40 rounded-full">
                    <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-bold text-[#F5D77F]">3D Secure Card Verification</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-[#25201A] border border-[#C59B27]/40 rounded-full">
                    <Building2 className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-xs font-bold text-[#F5D77F]">{bankName}</span>
                  </div>
                )}

                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
                  Active Payment Session
                </span>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-[#A69788] uppercase">Payable Total</p>
                <p className="text-lg sm:text-xl font-serif font-bold text-[#F5D77F]">
                  {formatPrice(amount, currency)}
                </p>
              </div>
            </div>

            {/* Gateway Order Summary Card */}
            <div className="bg-[#241F1A] p-4 rounded-2xl border border-[#3D352D] space-y-2.5 text-xs">
              <div className="flex justify-between items-center border-b border-[#352D26] pb-2">
                <span className="text-[#A69788]">Recipient Merchant:</span>
                <span className="font-semibold text-white">{MERCHANT_NAME}</span>
              </div>
              <div className="flex justify-between items-center border-b border-[#352D26] pb-2">
                <span className="text-[#A69788]">Order Docket:</span>
                <span className="font-mono text-[#F5D77F] font-semibold">#{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#A69788]">Payer:</span>
                <span className="text-white">
                  {customerName} ({customerPhone})
                </span>
              </div>
            </div>

            {/* Razorpay Gateway Specific Content */}
            {gateway === 'razorpay' && (
              <div className="space-y-3.5 bg-gradient-to-b from-[#0F1E36] to-[#0A1424] p-4 rounded-2xl border border-[#3395FF]/40 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#3395FF] text-white flex items-center justify-center font-bold text-[10px]">
                      ₹
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Razorpay Live Payment Stack
                      </h4>
                      <p className="text-[10px] text-[#8CB7FE] font-mono">Key ID: {apiKey}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified Merchant
                  </span>
                </div>

                {/* Razorpay Methods Tabs */}
                <div className="grid grid-cols-4 gap-1.5 p-1 bg-[#060D18] rounded-xl border border-[#1E3A66]">
                  {(['upi', 'card', 'netbanking', 'wallet'] as const).map((m, mIdx) => (
                    <button
                      key={`razorpay-method-${m}-${mIdx}`}
                      type="button"
                      onClick={() => setRazorpayMethod(m)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all ${
                        razorpayMethod === m
                          ? 'bg-[#3395FF] text-white shadow-xs'
                          : 'text-[#8CB7FE] hover:text-white'
                      }`}
                    >
                      {m === 'upi' ? 'UPI / QR' : m === 'card' ? 'Cards' : m === 'netbanking' ? 'NetBank' : 'Wallets'}
                    </button>
                  ))}
                </div>

                {razorpayMethod === 'upi' && (
                  <div className="p-3 bg-[#081220] rounded-xl border border-[#1E3A66] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#A6C4FE]">Instant UPI (GPay, PhonePe, Paytm, BHIM)</span>
                      <button
                        type="button"
                        onClick={handleCopyUpiId}
                        className="text-[10px] font-bold text-[#3395FF] bg-[#10223D] px-2 py-0.5 rounded border border-[#3395FF]/40 cursor-pointer"
                      >
                        {copiedUpi ? 'Copied UPI!' : `VPA: ${MERCHANT_UPI_ID}`}
                      </button>
                    </div>
                    <p className="text-[10px] text-[#7899CC]">
                      Pay directly via any UPI app or scan the dynamic Razorpay QR on payment authorization.
                    </p>
                  </div>
                )}

                {razorpayMethod === 'card' && (
                  <div className="p-3 bg-[#081220] rounded-xl border border-[#1E3A66] space-y-1.5 text-xs">
                    <div className="flex justify-between text-[11px] text-[#A6C4FE]">
                      <span>Card Acceptance:</span>
                      <span className="font-mono text-white">Visa, Mastercard, RuPay, Amex</span>
                    </div>
                    <p className="text-[10px] text-[#7899CC]">
                      256-Bit SSL tokenized checkout powered by Razorpay Shield.
                    </p>
                  </div>
                )}

                {razorpayMethod === 'netbanking' && (
                  <div className="p-3 bg-[#081220] rounded-xl border border-[#1E3A66] space-y-1 text-xs">
                    <p className="text-[11px] text-[#A6C4FE] font-medium">Supported Banks (50+ Banks):</p>
                    <p className="text-[10px] text-[#7899CC]">
                      HDFC, SBI, ICICI, Axis, Kotak, PNB, Bank of Baroda & all major Indian banks.
                    </p>
                  </div>
                )}

                {razorpayMethod === 'wallet' && (
                  <div className="p-3 bg-[#081220] rounded-xl border border-[#1E3A66] space-y-1 text-xs">
                    <p className="text-[11px] text-[#A6C4FE] font-medium">Supported Wallets & PayLater:</p>
                    <p className="text-[10px] text-[#7899CC]">
                      Amazon Pay, Mobikwik, Freecharge, Airtel Money, Ola Money & Simpl PayLater.
                    </p>
                  </div>
                )}

                {/* Direct UPI / Payment Action */}
                <div className="pt-1">
                  <a
                    href={getUpiPaymentUri({ amount, orderId, customerName, customerPhone })}
                    onClick={() => hapticSuccess()}
                    className="w-full py-2.5 px-3 bg-[#10223D] hover:bg-[#183158] text-[#8CB7FE] border border-[#3395FF]/30 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
                  >
                    <span>Open UPI Direct</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </a>
                </div>
              </div>
            )}

            {/* Google Pay Gateway Specific Content */}
            {gateway === 'gpay' && (
              <div className="space-y-3.5 bg-gradient-to-b from-[#201B16] to-[#181411] p-4 rounded-2xl border border-[#4285F4]/40 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#4285F4]" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Google Pay Phone Integration
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpiId}
                    className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-900 transition-colors"
                  >
                    {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUpi ? 'Copied!' : `UPI: ${MERCHANT_UPI_ID}`}</span>
                  </button>
                </div>

                <div className="p-3 bg-[#13110E] rounded-xl border border-[#2D2620] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] text-[#A69788]">Paying to Verified Merchant Account</p>
                    <p className="text-xs font-serif text-white font-bold">{MERCHANT_NAME}</p>
                    <p className="text-[10px] font-mono text-[#E8D59E] mt-0.5">UPI ID: {MERCHANT_UPI_ID} • MC: 5691</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpiId}
                    className="text-[11px] font-bold text-[#F5D77F] bg-[#25201A] hover:bg-[#332B22] px-2.5 py-1.5 rounded-lg border border-[#3D352D] shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Copy className="w-3 h-3 text-[#C59B27]" />
                    <span>{copiedUpi ? 'Copied UPI!' : 'Copy UPI'}</span>
                  </button>
                </div>

                {/* Direct App Launch Trigger on Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      hapticSuccess();
                      openGooglePayApp({ amount, orderId, customerName, customerPhone });
                    }}
                    className="py-2.5 px-3.5 bg-gradient-to-r from-[#1A73E8] to-[#174EA6] hover:from-[#174EA6] hover:to-[#153e87] text-white rounded-xl text-xs font-bold font-sans-ui flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Open Google Pay App</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </button>

                  <a
                    href={getUpiPaymentUri({ amount, orderId, customerName, customerPhone })}
                    onClick={() => hapticSuccess()}
                    className="py-2.5 px-3.5 bg-[#25201A] hover:bg-[#332B22] text-[#E8D59E] border border-[#C59B27]/40 rounded-xl text-xs font-bold font-sans-ui flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
                  >
                    <span>Open Any UPI App</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </a>
                </div>

                <div className="p-2.5 bg-[#171410] rounded-xl border border-[#2D2620] flex items-center gap-2 text-[11px] text-[#C5BAAC]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>To confirm placement, authorize transfer to seller. If payment fails or is cancelled, order will not be placed.</span>
                </div>
              </div>
            )}

            {/* Apple Pay Gateway Specific Content */}
            {gateway === 'applepay' && (
              <div className="space-y-3.5 bg-gradient-to-b from-[#201B16] to-[#181411] p-4 rounded-2xl border border-[#E8D59E]/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-[#E8D59E]" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Apple Pay Biometric Confirmation
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpiId}
                    className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 cursor-pointer hover:bg-emerald-900 transition-colors"
                  >
                    {copiedUpi ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUpi ? 'Copied!' : `UPI: ${MERCHANT_UPI_ID}`}</span>
                  </button>
                </div>
                <div className="p-3 bg-[#13110E] rounded-xl border border-[#2D2620] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-5 bg-gradient-to-tr from-white to-[#E8E8E8] text-black rounded text-[8px] font-bold flex items-center justify-center">
                      Card
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">Apple Card (Mastercard •••• 8821)</p>
                      <p className="text-[10px] text-[#A69788]">Default Card on Device Enclave</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Touch ID / Face ID
                  </span>
                </div>

                {/* Direct Apple Pay / Wallet Launcher on iOS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      hapticSuccess();
                      const result = await triggerNativePaymentRequest('applepay', {
                        amount,
                        orderId,
                        customerName,
                        customerPhone
                      });
                      if (result.success) {
                        handleApproveGatewayPayment();
                      }
                    }}
                    className="py-2.5 px-3.5 bg-black hover:bg-neutral-900 text-white rounded-xl text-xs font-bold font-sans-ui flex items-center justify-center gap-2 border border-white/20 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span className="text-sm leading-none"></span>
                    <span>Launch Apple Pay</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </button>

                  <a
                    href={getUpiPaymentUri({ amount, orderId, customerName, customerPhone })}
                    onClick={() => hapticSuccess()}
                    className="py-2.5 px-3.5 bg-[#25201A] hover:bg-[#332B22] text-[#E8D59E] border border-[#C59B27]/40 rounded-xl text-xs font-bold font-sans-ui flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer text-center"
                  >
                    <span>Pay via UPI App</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </a>
                </div>
              </div>
            )}

            {/* Card Gateway Specific Content */}
            {gateway === 'card' && (
              <div className="space-y-3 bg-[#201B16] p-4 rounded-2xl border border-[#C59B27]/30">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Bank 3D-Secure One-Time Passcode
                  </h4>
                </div>
                <p className="text-[11px] text-[#A69788]">
                  An OTP has been dispatched to phone registered with Card ending in •••• {cardLast4}.
                </p>
                <div>
                  <label className="block text-[11px] text-[#D4CBBF] mb-1 font-mono">
                    Enter 6-Digit Bank OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full bg-[#141210] border border-[#3D352D] px-3 py-2 rounded-xl text-center font-mono text-base font-bold tracking-widest text-[#F5D77F] focus:outline-[#C59B27]"
                  />
                </div>
              </div>
            )}

            {/* Net Banking Specific Content */}
            {gateway === 'netbanking' && (
              <div className="space-y-3 bg-[#201B16] p-4 rounded-2xl border border-[#C59B27]/30">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {bankName} NetBanking Login
                  </h4>
                </div>
                <div className="p-3 bg-[#13110E] rounded-xl border border-[#2D2620] text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#A69788]">User ID:</span>
                    <span className="font-mono text-white font-semibold">USER{customerPhone.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A69788]">Corporate Portal:</span>
                    <span className="text-emerald-400">Authenticated & Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dual Action Toolbar: Approve (Success) vs Decline (Fail) */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                id="gateway-authorize-success-btn"
                onClick={handleApproveGatewayPayment}
                className="w-full py-4 bg-gradient-to-r from-[#C59B27] via-[#D4AF37] to-[#E8D59E] hover:opacity-95 text-[#141210] font-cinzel font-bold text-xs tracking-widest uppercase rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                {gateway === 'razorpay' ? (
                  <>
                    <Lock className="w-4 h-4 text-[#141210]" />
                    Authorize & Complete with Razorpay ({formatPrice(amount, currency)})
                  </>
                ) : gateway === 'gpay' ? (
                  <>
                    <Smartphone className="w-4 h-4 text-[#141210]" />
                    Authorize & Complete on Google Pay ({formatPrice(amount, currency)})
                  </>
                ) : gateway === 'applepay' ? (
                  <>
                    <Fingerprint className="w-4 h-4 text-[#141210]" />
                    Authorize & Complete with Apple Pay ({formatPrice(amount, currency)})
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-[#141210]" />
                    Authorize Payment of {formatPrice(amount, currency)}
                  </>
                )}
              </button>

              <button
                type="button"
                id="gateway-simulate-failure-btn"
                onClick={() => handleSimulateDeclinePayment()}
                className="w-full py-2.5 px-4 bg-[#2A1715] hover:bg-[#3D1E1B] text-[#FF9E9E] border border-[#E53935]/40 rounded-xl font-sans-ui text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                title="Simulate payment failure or cancellation in payment app"
              >
                <XCircle className="w-4 h-4 text-[#FF6B6B]" />
                <span>Simulate Failed / Declined Payment (Test Failure Redirect)</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#2C2723]">
                <button
                  type="button"
                  onClick={handleCloseManually}
                  className="text-[#A69788] hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Cancel & Return to Merchant
                </button>
                <span className="text-[10px] text-[#A69788] font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  PCI-DSS Level 1 Encrypted
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Phase 3: Authorizing Transaction on Gateway */}
        {stage === 'authorizing' && (
          <div className="p-8 sm:p-12 text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-[#3D352D] border-t-[#C59B27] animate-spin"></div>

            <div className="space-y-2">
              <h3 className="font-playfair text-xl font-bold text-white">
                Authorizing with Payment Network...
              </h3>
              <p className="text-xs text-[#A69788] max-w-sm mx-auto">
                Processing {formatPrice(amount, currency)} authorization with clearing house. Please do
                not close or navigate away.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#25201A] rounded-full text-xs text-[#E8D59E] font-mono">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#C59B27]" />
              Securing Bank Reference...
            </div>
          </div>
        )}

        {/* Phase 4A: Redirecting Return Back to Merchant (SUCCESS) */}
        {stage === 'redirecting_back_success' && (
          <div className="p-8 sm:p-12 text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#25D366]/20 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold">
                Payment Authorized
              </span>
              <h3 className="font-playfair text-2xl font-bold text-[#F5D77F]">
                Redirecting Back to AL-NOUREEN Atelier...
              </h3>
              <p className="text-xs text-[#A69788] max-w-md mx-auto">
                Payment of <strong>{formatPrice(amount, currency)}</strong> confirmed to seller via{' '}
                <strong>
                  {gateway === 'gpay'
                    ? 'Google Pay'
                    : gateway === 'applepay'
                    ? 'Apple Pay'
                    : gateway === 'card'
                    ? 'Card 3D-Secure'
                    : bankName}
                </strong>
                . Generating your order confirmation docket.
              </p>
            </div>

            {/* Gateway Reference Box */}
            <div className="bg-[#241F1A] p-3.5 rounded-2xl border border-[#3D352D] max-w-md mx-auto text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#A69788]">Gateway Reference:</span>
                <span className="text-emerald-400 font-bold">{authRef}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#A69788]">Return Endpoint:</span>
                <span className="text-[#F5D77F] truncate ml-2">/checkout?payment_status=success</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Opening Order Confirmation...
            </div>
          </div>
        )}

        {/* Phase 4B: Redirecting Return Back to Merchant (FAILED / NOT PLACED) */}
        {stage === 'redirecting_back_failed' && (
          <div className="p-8 sm:p-12 text-center space-y-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-[#E53935] text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#E53935]/20 animate-pulse">
              <XCircle className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-[#FF8A80] font-bold">
                Payment Failed / Cancelled
              </span>
              <h3 className="font-playfair text-2xl font-bold text-[#FFCDD2]">
                Redirecting Back to AL-NOUREEN...
              </h3>
              <p className="text-xs text-[#E0B4AF] max-w-md mx-auto">
                Payment of <strong>{formatPrice(amount, currency)}</strong> was not captured. <br />
                Order will <strong>not</strong> be placed. Returning to store with your bag preserved.
              </p>
            </div>

            {/* Gateway Reference Box */}
            <div className="bg-[#2A1816] p-3.5 rounded-2xl border border-[#5C231E] max-w-md mx-auto text-left text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#E0B4AF]">Status:</span>
                <span className="text-[#FF8A80] font-bold">UNPAID / DECLINED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#E0B4AF]">Return Endpoint:</span>
                <span className="text-[#FFCDD2] truncate ml-2">/checkout?payment_status=failed</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#FF8A80] font-medium">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Opening Order Not Placed Screen...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
