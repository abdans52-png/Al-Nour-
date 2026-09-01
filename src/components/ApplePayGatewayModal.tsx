import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Fingerprint
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { MERCHANT_PHONE, MERCHANT_NAME, openApplePayApp } from '../utils/paymentGateway';
import { hapticLight, hapticSuccess } from '../utils/haptics';
import { playNotificationChime } from '../utils/notificationSound';
import { PaymentSuccessResult } from './GooglePayGatewayModal';

interface ApplePayGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  currency?: Currency;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  onPaymentSuccess: (result: PaymentSuccessResult) => void;
}

export const ApplePayGatewayModal: React.FC<ApplePayGatewayModalProps> = ({
  isOpen,
  onClose,
  amount,
  currency = 'INR',
  orderId,
  customerName,
  customerPhone,
  customerEmail,
  customerAddress,
  onPaymentSuccess
}) => {
  const [selectedCard, setSelectedCard] = useState<'apple_card' | 'visa'>('apple_card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAuthorizingBiometrics, setIsAuthorizingBiometrics] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [authCode, setAuthCode] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setIsAuthorizingBiometrics(false);
      setIsSuccess(false);
      return;
    }

    // Try native Apple Pay session if available on Apple Safari/iOS
    openApplePayApp({
      amount,
      orderId,
      customerPhone
    });
  }, [isOpen, amount, orderId, customerPhone]);

  if (!isOpen) return null;

  const handleAuthorizeApplePay = () => {
    hapticLight();
    setIsAuthorizingBiometrics(true);

    // Simulate Face ID / Touch ID Biometric scan
    setTimeout(() => {
      setIsAuthorizingBiometrics(false);
      setIsProcessing(true);

      setTimeout(() => {
        const generatedAuth = `APAY-AUTH-${Math.floor(100000000 + Math.random() * 900000000)}`;
        setAuthCode(generatedAuth);
        setIsProcessing(false);
        setIsSuccess(true);
        hapticSuccess();
        playNotificationChime();

        setTimeout(() => {
          onPaymentSuccess({
            transactionId: `APAY-${orderId}`,
            method: 'Apple Pay (Touch ID / Face ID Authorized)',
            utr: generatedAuth,
            paidAt: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          });
        }, 1300);
      }, 1400);
    }, 1200);
  };

  return (
    <div
      id="apple-pay-sheet-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="apple-pay-sheet"
        className="relative w-full max-w-md bg-[#18181A] border border-[#3A3A3C] rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-200 text-white font-sans"
      >
        {/* Apple Pay Sheet Header */}
        <div className="p-4 sm:p-5 border-b border-[#2C2C2E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Apple Logo + Pay */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#2C2C2E] rounded-full border border-[#3A3A3C]">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1 font-sans">
                <span className="text-base leading-none"></span>Pay
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
              Secure Enclave
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#8E8E93] hover:text-white rounded-full bg-[#2C2C2E] transition-colors cursor-pointer"
            aria-label="Cancel Apple Pay"
            title="Cancel and return to checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {isSuccess ? (
            /* Success State */
            <div className="text-center py-6 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#34C759] text-white flex items-center justify-center mx-auto shadow-lg ring-4 ring-[#34C759]/20 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Done</h3>
                <p className="text-xs text-[#8E8E93]">
                  Payment authorized to <strong>{MERCHANT_NAME}</strong>
                </p>
              </div>

              <div className="bg-[#242426] p-4 rounded-2xl border border-[#3A3A3C] text-left space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-[#3A3A3C] pb-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#8E8E93] font-semibold">
                    Apple Device Account Auth
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{authCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Total Authorized:</span>
                  <span className="font-bold text-white">{formatPrice(amount, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Card Used:</span>
                  <span className="text-white">
                    {selectedCard === 'apple_card' ? 'Apple Card (•••• 8821)' : 'Visa Signature (•••• 4192)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8E93]">Order Reference:</span>
                  <span className="font-mono text-white">#{orderId}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-[#34C759] font-medium pt-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Confirming Order with AL-NOUREEN Atelier...
              </div>
            </div>
          ) : isAuthorizingBiometrics ? (
            /* Biometric Verification Pulse (Face ID / Touch ID) */
            <div className="text-center py-10 space-y-5 animate-in fade-in">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-[#0A84FF] animate-ping opacity-75"></div>
                <div className="w-16 h-16 rounded-full bg-[#1C1C1E] border-2 border-[#0A84FF] flex items-center justify-center shadow-lg text-[#0A84FF]">
                  <Fingerprint className="w-10 h-10 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Authorizing with Face ID / Touch ID...</h3>
                <p className="text-xs text-[#8E8E93]">
                  Verifying biometric credential on device secure element
                </p>
              </div>
            </div>
          ) : isProcessing ? (
            /* Processing State */
            <div className="text-center py-10 space-y-5 animate-in fade-in">
              <div className="w-14 h-14 mx-auto rounded-full border-3 border-[#3A3A3C] border-t-white animate-spin"></div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Connecting to Apple Wallet...</h3>
                <p className="text-xs text-[#8E8E93]">
                  Authorizing {formatPrice(amount, currency)} with payment network
                </p>
              </div>
            </div>
          ) : (
            /* Apple Pay Sheet View */
            <div className="space-y-4">
              {/* Payment Card Selection */}
              <div className="space-y-2">
                <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">
                  Payment Card
                </p>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setSelectedCard('apple_card');
                    }}
                    className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                      selectedCard === 'apple_card'
                        ? 'bg-[#2C2C2E] border-[#E8D59E] ring-1 ring-[#E8D59E]/40'
                        : 'bg-[#242426] border-[#3A3A3C] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-gradient-to-tr from-white to-[#E8E8E8] text-black rounded-md flex items-center justify-center shadow-xs font-bold text-[9px]">
                        Card
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Apple Card</p>
                        <p className="text-[10px] text-[#8E8E93]">Mastercard •••• 8821 • 3% Daily Cash</p>
                      </div>
                    </div>
                    {selectedCard === 'apple_card' && (
                      <span className="w-2 h-2 rounded-full bg-[#E8D59E]"></span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      hapticLight();
                      setSelectedCard('visa');
                    }}
                    className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                      selectedCard === 'visa'
                        ? 'bg-[#2C2C2E] border-[#0A84FF] ring-1 ring-[#0A84FF]/40'
                        : 'bg-[#242426] border-[#3A3A3C] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-6 bg-[#1A1F71] text-white rounded-md flex items-center justify-center shadow-xs font-bold text-[9px]">
                        VISA
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">Chase Sapphire Reserve</p>
                        <p className="text-[10px] text-[#8E8E93]">Visa •••• 4192</p>
                      </div>
                    </div>
                    {selectedCard === 'visa' && (
                      <span className="w-2 h-2 rounded-full bg-[#0A84FF]"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Delivery & Recipient Summary */}
              <div className="bg-[#242426] p-3.5 rounded-2xl border border-[#3A3A3C] space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px] pb-1.5 border-b border-[#3A3A3C]">
                  <span className="text-[#8E8E93]">Recipient:</span>
                  <span className="font-semibold text-white">{customerName}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-1.5 border-b border-[#3A3A3C]">
                  <span className="text-[#8E8E93]">Merchant:</span>
                  <span className="font-semibold text-amber-300">{MERCHANT_NAME}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#8E8E93]">Shipping:</span>
                  <span className="text-[#34C759] font-medium">DHL Express Priority (FREE)</span>
                </div>
              </div>

              {/* Total Payable Summary */}
              <div className="bg-[#2C2C2E] p-3.5 rounded-2xl border border-[#3A3A3C] flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[#8E8E93] uppercase font-semibold">Total Payable</p>
                  <p className="text-xs font-mono text-[#8E8E93]">Order #{orderId}</p>
                </div>
                <p className="text-2xl font-bold text-white tracking-tight">
                  {formatPrice(amount, currency)}
                </p>
              </div>

              {/* Action Button: Apple Pay Authorization */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleAuthorizeApplePay}
                  className="w-full py-4 bg-white hover:bg-[#F2F2F7] text-black font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span className="text-base leading-none"></span>
                  <span>Pay with Touch ID / Face ID</span>
                </button>

                <p className="text-[11px] text-center text-[#8E8E93] flex items-center justify-center gap-1.5">
                  <Fingerprint className="w-3.5 h-3.5 text-[#0A84FF]" />
                  Double-click side button or confirm biometrics to pay
                </p>
              </div>

              {/* Cancel Button */}
              <div className="pt-2 text-center border-t border-[#2C2C2E]">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-[#8E8E93] hover:text-white underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Cancel & Return to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
