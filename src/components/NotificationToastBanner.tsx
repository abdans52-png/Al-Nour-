import React from 'react';
import { Truck, Mail, X, ArrowRight, Sparkles, TrendingDown, Scissors, Bell } from 'lucide-react';
import { OrderNotification } from '../types';

interface NotificationToastBannerProps {
  notification: OrderNotification | null;
  onClose: () => void;
  onViewEmail: (notification: OrderNotification) => void;
}

export const NotificationToastBanner: React.FC<NotificationToastBannerProps> = ({
  notification,
  onClose,
  onViewEmail
}) => {
  if (!notification) return null;

  const isOutForDelivery = notification.type === 'out_for_delivery';
  const isPriceDrop = notification.type === 'price_drop';
  const isSwatch = notification.type === 'swatch_dispatched';
  const isRestock = notification.type === 'restock';

  return (
    <div
      id="notification-toast-alert"
      className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] bg-[#181411] text-[#FAF7F2] border-2 border-[#C59B27] rounded-2xl shadow-2xl p-4 sm:p-4.5 animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-auto"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#28221D] border border-[#C59B27] flex items-center justify-center text-[#E8D59E] shrink-0 mt-0.5">
          {isOutForDelivery ? (
            <Truck className="w-5 h-5 text-[#25D366] animate-pulse" />
          ) : isPriceDrop ? (
            <TrendingDown className="w-5 h-5 text-[#F5D77F] animate-bounce" />
          ) : isSwatch ? (
            <Scissors className="w-5 h-5 text-[#F5D77F]" />
          ) : isRestock ? (
            <Bell className="w-5 h-5 text-[#F5D77F] animate-pulse" />
          ) : (
            <Mail className="w-5 h-5 text-[#D4AF37]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-cinzel font-bold tracking-widest text-[#E8D59E] uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              {isPriceDrop
                ? 'VIP Flash Price Drop Alert'
                : isSwatch
                ? 'Maison Swatch Dispatched'
                : isRestock
                ? 'VIP Atelier Restock Event'
                : 'Automated Email & Status Trigger'}
            </span>
            <button
              onClick={onClose}
              className="text-[#8C7A6B] hover:text-white p-1 rounded-full cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="font-cinzel text-xs sm:text-sm font-bold text-white mt-0.5">
            {notification.title}
          </h4>

          <p className="text-[11px] text-[#C5BAAC] font-sans-ui mt-1 leading-snug">
            {notification.message}
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={() => onViewEmail(notification)}
              className="px-3 py-1.5 bg-[#C59B27] hover:bg-[#B38A1E] text-[#181411] rounded-lg font-cinzel text-[10.5px] font-bold tracking-wider uppercase transition-colors shadow-sm flex items-center gap-1 cursor-pointer"
            >
              {isPriceDrop ? 'View VIP Alert' : isSwatch ? 'View Swatch Tracking' : isRestock ? 'View Restocked Piece' : 'View Email Template'} <ArrowRight className="w-3 h-3" />
            </button>
            {notification.trackingNumber && (
              <span className="text-[10px] font-mono text-[#D4AF37]">
                #{notification.trackingNumber}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

