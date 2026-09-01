import React from 'react';
import { Bell, Truck, Mail, CheckCircle2, ChevronRight, X, ExternalLink, Sparkles, Inbox, TrendingDown, Tag, Scissors } from 'lucide-react';
import { OrderNotification, Product } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: OrderNotification[];
  onSelectNotification: (notif: OrderNotification) => void;
  onMarkAllAsRead: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onSelectNotification,
  onMarkAllAsRead,
  onSelectProduct
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="notification-center-drawer"
      className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF7F2] dark:bg-[#181411] h-full shadow-2xl border-l border-[#C59B27]/40 flex flex-col animate-in slide-in-from-right duration-300 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#181411] text-white flex items-center justify-between border-b border-[#C59B27]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2B231D] border border-[#C59B27] flex items-center justify-center text-[#E8D59E]">
              <Bell className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#FAF7F2]">
                Automated Alerts
              </h3>
              <p className="text-[10px] text-[#C5BAAC] font-sans-ui">
                Dispatch, Delivery & Price Drop Alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.read) && (
              <button
                onClick={onMarkAllAsRead}
                className="text-[10px] text-[#E8D59E] hover:underline font-cinzel tracking-wider uppercase cursor-pointer"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#8C7A6B] hover:text-white hover:bg-[#2B231D] rounded-full transition-colors cursor-pointer"
              aria-label="Close notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of Notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-16 px-4 text-[#8C7A6B] space-y-2">
              <Inbox className="w-10 h-10 mx-auto text-[#C59B27]/60 stroke-1" />
              <h4 className="font-cinzel text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                No Notifications Yet
              </h4>
              <p className="text-xs font-sans-ui text-[#7A6B5D] dark:text-[#A69788]">
                Automated alerts for courier dispatch, deliveries, and price drop watches will trigger here.
              </p>
            </div>
          ) : (
            notifications.map((item, idx) => (
              <div
                key={`notif-${item.id}-${idx}`}
                onClick={() => {
                  if (item.type === 'price_drop' && item.product && onSelectProduct) {
                    onSelectProduct(item.product);
                  }
                  onSelectNotification(item);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                  item.read
                    ? 'bg-[#F2ECE1] dark:bg-[#201A15] border-[#DDD3BC] dark:border-[#2E2620]'
                    : 'bg-[#FFFDF9] dark:bg-[#28201A] border-[#C59B27] ring-1 ring-[#C59B27]/40 shadow-xs'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#181411] border border-[#C59B27] flex items-center justify-center text-[#E8D59E] shrink-0 mt-0.5">
                    {item.type === 'out_for_delivery' ? (
                      <Truck className="w-4 h-4 text-[#25D366]" />
                    ) : item.type === 'price_drop' ? (
                      <TrendingDown className="w-4 h-4 text-[#F5D77F]" />
                    ) : item.type === 'swatch_dispatched' ? (
                      <Scissors className="w-4 h-4 text-[#E8D59E]" />
                    ) : item.type === 'restock' ? (
                      <Bell className="w-4 h-4 text-[#F5D77F] animate-pulse" />
                    ) : (
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[9.5px] font-cinzel font-bold uppercase tracking-wider ${
                        item.type === 'price_drop'
                          ? 'text-[#0F5A47] dark:text-[#38D39F]'
                          : item.type === 'swatch_dispatched'
                          ? 'text-[#8C6B1B] dark:text-[#D4AF37]'
                          : item.type === 'restock'
                          ? 'text-[#B45309] dark:text-[#F5D77F]'
                          : 'text-[#8C6B1B] dark:text-[#E8D59E]'
                      }`}>
                        {item.type === 'out_for_delivery'
                          ? 'Out for Delivery'
                          : item.type === 'price_drop'
                          ? '🔥 Price Drop Alert'
                          : item.type === 'swatch_dispatched'
                          ? '✨ Fabric Swatch Dispatched'
                          : item.type === 'restock'
                          ? '🔔 Back In Stock'
                          : 'Dispatched / Shipped'}
                      </span>
                      <span className="text-[9.5px] text-[#8C7A6B] dark:text-[#A69788]">
                        {item.timestamp}
                      </span>
                    </div>

                    <h5 className="font-serif font-bold text-xs text-[#1E1A17] dark:text-[#FAF7F2] truncate mt-0.5">
                      {item.title}
                    </h5>

                    <p className="text-[11px] text-[#6B5D50] dark:text-[#C5BAAC] font-sans-ui mt-0.5 line-clamp-2">
                      {item.message}
                    </p>

                    <div className="mt-2 flex items-center justify-between pt-2 border-t border-[#E8DFC9] dark:border-[#2E2620] text-[10px]">
                      <span className="font-mono font-semibold text-[#8C6B1B] dark:text-[#D4AF37]">
                        {item.carrier && item.trackingNumber ? (
                          `${item.carrier} • ${item.trackingNumber}`
                        ) : item.recipientEmail ? (
                          `Sent to ${item.recipientEmail}`
                        ) : (
                          'Atelier Automated Alert'
                        )}
                      </span>
                      <span className="text-[#1E1A17] dark:text-[#FAF7F2] font-semibold flex items-center gap-0.5 hover:underline">
                        {item.type === 'price_drop' || item.type === 'restock' ? 'Shop Item' : 'View Email'}{' '}
                        <ChevronRight className="w-3 h-3 text-[#C59B27]" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-[#F0EAE0] dark:bg-[#14100D] border-t border-[#DDD3BC] dark:border-[#2E2620] text-center text-[10.5px] text-[#8C7A6B] dark:text-[#A69788]">
          Automated email notifications are synchronized with live carrier & atelier catalogs.
        </div>
      </div>
    </div>
  );
};
