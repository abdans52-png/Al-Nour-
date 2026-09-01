import React, { useState } from 'react';
import {
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  RefreshCw,
  KeyRound
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { MERCHANT_NAME } from '../utils/paymentGateway';
import { hapticLight, hapticSuccess } from '../utils/haptics';
import { playNotificationChime } from '../utils/notificationSound';
import { PaymentSuccessResult } from './GooglePayGatewayModal';

interface NetBankingGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: Currency;
  orderId: string;
  bankName: string;
  customerName: string;
  customerPhone: string;
  onPaymentSuccess: (result: PaymentSuccessResult) => void;
}

export const NetBankingGatewayModal: React.FC<NetBankingGatewayModalProps> = ({
  isOpen,
  onClose,
  amount,
  currency = 'INR',
  orderId,
  bankName,
  customerName,
  customerPhone,
  onPaymentSuccess
}) => {
  const [step, setStep] = useState<'credentials' | 'otp' | 'processing' | 'success'>('credentials');
  const [userId, setUserId] = useState<string>('USER' + customerPhone.slice(-4));
  const [otp, setOtp] = useState<string>('849201');
  const [generatedUtr, setGeneratedUtr] = useState<string>('');

  if (!isOpen) return null;

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    hapticLight();
    setStep('otp');
  };

  const handleAuthorizeBankPayment = (e: React.FormEvent) => {
    e.preventDefault();
    hapticLight();
    setStep('processing');

    setTimeout(() => {
      const utr = `NB/${bankName.slice(0, 4).toUpperCase()}/${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      setGeneratedUtr(utr);
      setStep('success');
      hapticSuccess();
      playNotificationChime();

      setTimeout(() => {
        onPaymentSuccess({
          transactionId: `NETBANK-${orderId}`,
          method: `Net Banking (${bankName})`,
          utr,
          paidAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        });
      }, 1300);
    }, 1500);
  };

  return (
    <div
      id="netbanking-gateway-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="netbanking-gateway-modal"
        className="relative w-full max-w-lg bg-[#FAF7F2] dark:bg-[#15120F] border border-[#C59B27] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-[#1E1A17] dark:text-[#FAF7F2]"
      >
        {/* Bank Portal Header */}
        <div className="bg-[#181411] p-5 text-white border-b border-[#C59B27]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#28211A] border border-[#C59B27]/40 rounded-xl text-[#F5D77F]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-[#C5BAAC] uppercase font-cinzel font-semibold">
                Official Bank Gateway
              </p>
              <h3 className="font-playfair text-lg font-bold text-[#F5D77F]">{bankName}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#C5BAAC] hover:text-white rounded-full bg-[#2A231D] transition-colors cursor-pointer"
            aria-label="Cancel"
            title="Cancel and return to checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 font-sans-ui text-xs">
          {step === 'success' ? (
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#25D366] text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#25D366]/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="font-playfair text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  Bank Authorization Successful!
                </h3>
                <p className="text-xs text-[#6B5D50] dark:text-[#C5BAAC]">
                  Payment received from <strong>{bankName}</strong> account.
                </p>
              </div>

              <div className="bg-[#F2ECE1] dark:bg-[#1E1915] p-4 rounded-2xl border border-[#C59B27]/40 text-left space-y-2">
                <div className="flex justify-between border-b border-[#DDD3BC] dark:border-[#2E2620] pb-2">
                  <span className="font-cinzel text-[10px] font-bold text-[#8C6B1B] dark:text-[#F5D77F] uppercase">
                    Bank Reference / UTR
                  </span>
                  <span className="font-mono font-bold text-[#1E1A17] dark:text-white">{generatedUtr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5D50] dark:text-[#A69788]">Amount:</span>
                  <span className="font-bold text-[#1E1A17] dark:text-white">{formatPrice(amount, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B5D50] dark:text-[#A69788]">Beneficiary:</span>
                  <span className="font-medium text-[#1E1A17] dark:text-white">{MERCHANT_NAME}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#25D366] font-cinzel font-semibold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Confirming Order with AL-NOUREEN Atelier...
              </div>
            </div>
          ) : step === 'processing' ? (
            <div className="text-center py-10 space-y-5 animate-in fade-in">
              <div className="w-14 h-14 mx-auto rounded-full border-4 border-[#C59B27]/20 border-t-[#C59B27] animate-spin"></div>
              <div className="space-y-1">
                <h3 className="font-playfair text-lg font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                  Authenticating with {bankName}...
                </h3>
                <p className="text-xs text-[#6B5D50] dark:text-[#C5BAAC]">
                  Transferring {formatPrice(amount, currency)} via RBI High-Value Secure Interbank Protocol.
                </p>
              </div>
            </div>
          ) : step === 'otp' ? (
            <form onSubmit={handleAuthorizeBankPayment} className="space-y-4 animate-in fade-in">
              <div className="p-3.5 bg-amber-50 dark:bg-[#1E1915] border border-amber-300 dark:border-amber-700/50 rounded-2xl space-y-1">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  <h4 className="font-cinzel text-xs font-bold text-amber-950 dark:text-amber-200 uppercase">
                    High Security OTP Verification
                  </h4>
                </div>
                <p className="text-[11px] text-amber-900 dark:text-amber-300">
                  A one-time passcode has been generated for phone <strong>{customerPhone}</strong> to approve {formatPrice(amount, currency)}.
                </p>
              </div>

              <div>
                <label className="block text-[#6B5D50] dark:text-[#A69788] mb-1 font-semibold">
                  Enter 6-Digit OTP *
                </label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] px-3.5 py-2.5 rounded-xl font-mono text-base font-bold text-center tracking-widest text-[#1E1A17] dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="px-4 py-3 bg-[#EAE2D2] dark:bg-[#201A15] text-[#1E1A17] dark:text-[#FAF7F2] rounded-xl font-cinzel text-xs font-semibold uppercase tracking-wider"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4 text-[#D4AF37]" />
                  Verify & Pay {formatPrice(amount, currency)}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleProceedToOtp} className="space-y-4 animate-in fade-in">
              <div className="bg-[#F2ECE1] dark:bg-[#1E1915] p-3.5 rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620] space-y-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#6B5D50] dark:text-[#A69788]">Payment To:</span>
                  <span className="font-semibold text-[#1E1A17] dark:text-white">{MERCHANT_NAME}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#6B5D50] dark:text-[#A69788]">Amount:</span>
                  <span className="font-bold text-[#8C6B1B] dark:text-[#F5D77F]">
                    {formatPrice(amount, currency)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#6B5D50] dark:text-[#A69788] mb-1 font-semibold">
                  Customer ID / User ID *
                </label>
                <input
                  required
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] px-3.5 py-2.5 rounded-xl text-[#1E1A17] dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-[#6B5D50] dark:text-[#A69788] mb-1 font-semibold">
                  IPIN / Net Banking Password *
                </label>
                <input
                  required
                  type="password"
                  defaultValue="••••••••••••"
                  className="w-full bg-white dark:bg-[#201A15] border border-[#DDD3BC] dark:border-[#2E2620] px-3.5 py-2.5 rounded-xl text-[#1E1A17] dark:text-white font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                Continue to OTP Verification <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              <div className="pt-2 text-center border-t border-[#DDD3BC] dark:border-[#2E2620]">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#8C7A6B] hover:text-[#181411] dark:hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Cancel & Return to Checkout
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
