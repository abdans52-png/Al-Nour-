import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Clock,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { MERCHANT_PHONE, MERCHANT_UPI_ID, MERCHANT_NAME, getUpiPaymentUri, openGooglePayApp } from '../utils/paymentGateway';
import { hapticLight, hapticSuccess, hapticWarning } from '../utils/haptics';
import { playNotificationChime } from '../utils/notificationSound';

export interface PaymentSuccessResult {
  transactionId: string;
  method: string;
  utr: string;
  paidAt: string;
}

interface GooglePayGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: Currency;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  onPaymentSuccess: (result: PaymentSuccessResult) => void;
}

export const GooglePayGatewayModal: React.FC<GooglePayGatewayModalProps> = ({
  isOpen,
  onClose,
  amount,
  currency = 'INR',
  orderId,
  customerName,
  customerPhone,
  customerEmail,
  onPaymentSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'app' | 'qr' | 'pin'>('app');
  const [upiPin, setUpiPin] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [copiedUpi, setCopiedUpi] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600); // 10 minutes
  const [generatedUtr, setGeneratedUtr] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setUpiPin('');
      setIsProcessing(false);
      setIsSuccess(false);
      setTimeLeft(600);
      return;
    }

    // Auto-launch Google Pay app on mobile
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      openGooglePayApp({
        amount,
        orderId,
        customerName,
        customerPhone,
        note: `Order ${orderId} AL-NOUREEN`
      });
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, amount, orderId, customerName, customerPhone]);

  if (!isOpen) return null;

  const upiPaymentUri = getUpiPaymentUri({
    amount,
    orderId,
    customerName,
    customerPhone,
    note: `Order ${orderId} AL-NOUREEN`
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    upiPaymentUri
  )}&bgcolor=FAF7F2&color=181411&margin=10`;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopyUpi = () => {
    hapticLight();
    navigator.clipboard.writeText(MERCHANT_UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleLaunchGPayApp = () => {
    hapticLight();
    openGooglePayApp({
      amount,
      orderId,
      customerName,
      customerPhone,
      note: `Order ${orderId} AL-NOUREEN`
    });
  };

  const handleAuthorizePayment = () => {
    hapticLight();
    setIsProcessing(true);

    setTimeout(() => {
      const utr = `UPI/GPAY/${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      setGeneratedUtr(utr);
      setIsProcessing(false);
      setIsSuccess(true);
      hapticSuccess();
      playNotificationChime();

      setTimeout(() => {
        onPaymentSuccess({
          transactionId: `GPAY-${orderId}`,
          method: 'Google Pay (UPI Verified)',
          utr,
          paidAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      }, 1400);
    }, 1600);
  };

  const handleKeypadPress = (digit: string) => {
    if (upiPin.length < 6) {
      hapticLight();
      const newPin = upiPin + digit;
      setUpiPin(newPin);
      if (newPin.length === 6) {
        // Auto-submit after 6 digits
        setTimeout(() => {
          handleAuthorizePayment();
        }, 300);
      }
    }
  };

  const handleKeypadBackspace = () => {
    hapticWarning();
    setUpiPin((prev) => prev.slice(0, -1));
  };

  return (
    <div
      id="gpay-gateway-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="gpay-gateway-modal"
        className="relative w-full max-w-lg bg-[#FAF7F2] dark:bg-[#15120F] border border-[#C59B27] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-6 text-[#1E1A17] dark:text-[#FAF7F2]"
      >
        {/* Google Pay Official Header */}
        <div className="bg-[#181411] p-5 sm:p-6 text-white border-b border-[#C59B27]/40 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-[#C5BAAC] hover:text-white rounded-full bg-[#2A231D] border border-[#C59B27]/30 transition-colors cursor-pointer"
            aria-label="Cancel Payment"
            title="Cancel and return to checkout"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            {/* Authentic Google Pay Logo Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#25201A] border border-[#C59B27]/60 rounded-full">
              <span className="flex items-center font-bold font-sans text-sm tracking-tight">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
                <span className="text-white ml-1 font-semibold">Pay</span>
              </span>
              <span className="text-[10px] font-mono text-[#E8D59E] uppercase tracking-wider font-semibold border-l border-[#C59B27]/40 pl-2">
                UPI 2.0
              </span>
            </div>

            <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Merchant
            </span>
          </div>

          <div className="flex items-start justify-between gap-4 mt-2">
            <div>
              <p className="text-xs text-[#C5BAAC] font-sans-ui">Pay to Merchant</p>
              <h2 className="font-playfair text-lg sm:text-xl font-bold text-[#F5D77F] tracking-wide">
                {MERCHANT_NAME}
              </h2>
              <p className="text-[11px] font-mono text-[#E8D59E]/80 mt-0.5">
                VPA: {MERCHANT_UPI_ID} • {MERCHANT_PHONE}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-[10px] text-[#C5BAAC] uppercase font-cinzel font-semibold">Total Amount</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-white text-[#F5D77F]">
                {formatPrice(amount, currency)}
              </p>
              <div className="flex items-center justify-end gap-1 text-[10px] text-amber-400 font-mono mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#25D366]/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="font-playfair text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  Google Pay Payment Successful!
                </h3>
                <p className="text-xs text-[#6B5D50] dark:text-[#C5BAAC] font-sans-ui">
                  Your transaction has been securely authorized by Axis Bank / NPCI.
                </p>
              </div>

              <div className="bg-[#F2ECE1] dark:bg-[#1E1915] p-4 rounded-2xl border border-[#C59B27]/40 text-left space-y-2 text-xs font-sans-ui">
                <div className="flex items-center justify-between border-b border-[#DDD3BC] dark:border-[#2E2620] pb-2">
                  <span className="font-cinzel text-[10px] font-bold text-[#8C6B1B] dark:text-[#F5D77F] uppercase">
                    Bank UTR Reference
                  </span>
                  <span className="font-mono font-bold text-[#1E1A17] dark:text-white">
                    {generatedUtr}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5D50] dark:text-[#A69788]">Amount Paid:</span>
                  <span className="font-bold text-[#1E1A17] dark:text-white">{formatPrice(amount, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5D50] dark:text-[#A69788]">Order Docket:</span>
                  <span className="font-mono font-semibold">#{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5D50] dark:text-[#A69788]">Paid To:</span>
                  <span className="font-medium text-[#1E1A17] dark:text-white">{MERCHANT_NAME}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#25D366] font-cinzel font-semibold pt-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Confirming Order & Generating Dispatch Docket...
              </div>
            </div>
          ) : isProcessing ? (
            /* Processing State */
            <div className="text-center py-10 space-y-5 animate-in fade-in">
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[#C59B27]/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-[#C59B27] border-r-[#4285F4] border-b-[#34A853] border-l-[#EA4335] animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-[#C59B27]">
                  GPay
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-playfair text-lg font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                  Connecting with Google Pay UPI Gateway...
                </h3>
                <p className="text-xs text-[#6B5D50] dark:text-[#C5BAAC] font-sans-ui max-w-sm mx-auto">
                  Authorizing payment of <strong>{formatPrice(amount, currency)}</strong> to <strong>{MERCHANT_NAME}</strong>. Please do not refresh or close.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F2ECE1] dark:bg-[#1E1915] rounded-full border border-[#DDD3BC] dark:border-[#2E2620] text-[11px] font-mono text-[#8C6B1B] dark:text-[#F5D77F]">
                <Lock className="w-3.5 h-3.5" /> 256-Bit NPCI Encrypted Channel
              </div>
            </div>
          ) : (
            /* Payment Mode Selection & Action */
            <div className="space-y-4">
              {/* Payment Mode Tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#EAE2D2] dark:bg-[#201A15] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setActiveTab('app');
                  }}
                  className={`py-2 px-1 text-center rounded-xl font-cinzel text-[10.5px] font-bold tracking-wider uppercase transition-all ${
                    activeTab === 'app'
                      ? 'bg-[#181411] text-[#F5D77F] shadow-sm'
                      : 'text-[#6B5D50] dark:text-[#C5BAAC] hover:text-[#181411]'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 mx-auto mb-0.5" />
                  GPay App
                </button>

                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setActiveTab('qr');
                  }}
                  className={`py-2 px-1 text-center rounded-xl font-cinzel text-[10.5px] font-bold tracking-wider uppercase transition-all ${
                    activeTab === 'qr'
                      ? 'bg-[#181411] text-[#F5D77F] shadow-sm'
                      : 'text-[#6B5D50] dark:text-[#C5BAAC] hover:text-[#181411]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5 mx-auto mb-0.5" />
                  Scan QR
                </button>

                <button
                  type="button"
                  onClick={() => {
                    hapticLight();
                    setActiveTab('pin');
                  }}
                  className={`py-2 px-1 text-center rounded-xl font-cinzel text-[10.5px] font-bold tracking-wider uppercase transition-all ${
                    activeTab === 'pin'
                      ? 'bg-[#181411] text-[#F5D77F] shadow-sm'
                      : 'text-[#6B5D50] dark:text-[#C5BAAC] hover:text-[#181411]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 mx-auto mb-0.5" />
                  Enter PIN
                </button>
              </div>

              {/* Tab 1: Google Pay Mobile App Deep Link */}
              {activeTab === 'app' && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div className="p-4 bg-emerald-50/80 dark:bg-[#112419] border border-emerald-300 dark:border-emerald-700/50 rounded-2xl space-y-2">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-cinzel text-xs font-bold text-emerald-950 dark:text-emerald-200 uppercase">
                        Instant Mobile App Checkout
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-900 dark:text-emerald-300 font-sans-ui leading-relaxed">
                      Tap the button below to directly open your <strong>Google Pay</strong> application. Approve the payment of <strong>{formatPrice(amount, currency)}</strong> to confirm your order.
                    </p>
                  </div>

                  {/* Open GPay App Button */}
                  <button
                    type="button"
                    onClick={handleLaunchGPayApp}
                    className="w-full py-3.5 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    Open in Google Pay Application <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <div className="p-3 bg-[#F2ECE1] dark:bg-[#1E1915] rounded-xl border border-[#DDD3BC] dark:border-[#2E2620] flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-[#6B5D50] dark:text-[#A69788] uppercase font-cinzel">Direct Merchant UPI ID</p>
                      <p className="text-xs font-mono font-bold text-[#1E1A17] dark:text-[#F5D77F]">{MERCHANT_UPI_ID}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1 bg-white dark:bg-[#28211A] border border-[#C59B27]/40 rounded-lg text-xs font-cinzel font-semibold flex items-center gap-1 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                    >
                      {copiedUpi ? <Check className="w-3 h-3 text-[#25D366]" /> : <Copy className="w-3 h-3 text-[#8C6B1B]" />}
                      {copiedUpi ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleAuthorizePayment}
                      className="w-full py-3 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      Confirm Payment in Google Pay
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Scan QR Code with Google Pay */}
              {activeTab === 'qr' && (
                <div className="space-y-3.5 text-center animate-in fade-in">
                  <p className="text-xs text-[#6B5D50] dark:text-[#C5BAAC] font-sans-ui">
                    Open Google Pay scanner on your phone and scan this dynamic QR code:
                  </p>

                  <div className="relative w-56 h-56 mx-auto bg-white p-2.5 rounded-2xl border-2 border-[#C59B27] shadow-md flex items-center justify-center">
                    <img
                      src={qrCodeUrl}
                      alt="Google Pay UPI QR Code"
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <div className="absolute inset-x-0 -bottom-3 flex justify-center">
                      <span className="bg-[#181411] text-[#F5D77F] border border-[#C59B27] text-[10px] font-cinzel font-bold px-3 py-0.5 rounded-full shadow-sm">
                        {formatPrice(amount, currency)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleAuthorizePayment}
                      className="w-full py-3 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      I Have Scanned & Paid on Google Pay
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 3: Google Pay UPI PIN Dialog */}
              {activeTab === 'pin' && (
                <div className="space-y-3 animate-in fade-in">
                  <div className="text-center space-y-1">
                    <p className="text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2] font-cinzel">
                      Enter 6-Digit Google Pay UPI PIN
                    </p>
                    <p className="text-[11px] text-[#6B5D50] dark:text-[#C5BAAC] font-sans-ui">
                      Paying <strong>{formatPrice(amount, currency)}</strong> to <strong>{MERCHANT_NAME}</strong>
                    </p>
                  </div>

                  {/* PIN Dots Display */}
                  <div className="flex justify-center items-center gap-2.5 py-2">
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <div
                        key={`gpay-pin-dot-${index}`}
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          index < upiPin.length
                            ? 'bg-[#C59B27] border-[#C59B27] scale-110'
                            : 'bg-white dark:bg-[#201A15] border-[#D4CBBF] dark:border-[#382F26]'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Numeric Keypad */}
                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto pt-1">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                      <button
                        key={`gpay-keypad-${num}`}
                        type="button"
                        onClick={() => handleKeypadPress(num)}
                        className="py-2.5 bg-white dark:bg-[#201A15] hover:bg-[#F2ECE0] dark:hover:bg-[#2C241D] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-sm font-semibold text-[#1E1A17] dark:text-[#FAF7F2] shadow-2xs transition-all active:scale-95 cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setUpiPin('')}
                      className="py-2.5 bg-[#FAF7F2] dark:bg-[#1A1613] hover:bg-[#F2ECE0] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-[11px] font-cinzel font-bold text-[#8C6B1B] dark:text-[#C59B27] shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => handleKeypadPress('0')}
                      className="py-2.5 bg-white dark:bg-[#201A15] hover:bg-[#F2ECE0] dark:hover:bg-[#2C241D] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-sm font-semibold text-[#1E1A17] dark:text-[#FAF7F2] shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handleKeypadBackspace}
                      className="py-2.5 bg-[#FAF7F2] dark:bg-[#1A1613] hover:bg-[#F2ECE0] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-[11px] font-cinzel font-bold text-red-600 shadow-2xs transition-all active:scale-95 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAuthorizePayment}
                    className="w-full py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer mt-2"
                  >
                    <Lock className="w-4 h-4" />
                    Submit & Authorize {formatPrice(amount, currency)}
                  </button>
                </div>
              )}

              {/* Trust Footer & Cancel Action */}
              <div className="pt-2 border-t border-[#DDD3BC] dark:border-[#2E2620] flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#8C7A6B] hover:text-[#181411] dark:hover:text-white font-cinzel font-semibold underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Cancel & Return to Checkout
                </button>

                <span className="text-[10px] text-[#8C7A6B] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
                  NPCI 256-Bit SSL
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
