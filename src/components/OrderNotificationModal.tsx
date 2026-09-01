import React, { useState } from 'react';
import {
  X,
  Mail,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Sparkles,
  MapPin,
  Send,
  Code,
  Package,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { Order, Currency, OrderStatus } from '../types';
import { formatPrice } from '../utils/currency';
import { Logo } from './Logo';

interface OrderNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  triggerStatus?: OrderStatus;
  currency?: Currency;
  onNavigateToTracking?: (orderId: string) => void;
  userEmail?: string;
}

export const OrderNotificationModal: React.FC<OrderNotificationModalProps> = ({
  isOpen,
  onClose,
  order,
  triggerStatus,
  currency = 'INR',
  onNavigateToTracking,
  userEmail = 'abdans52@gmail.com'
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'sms' | 'html'>('email');
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [emailSentToast, setEmailSentToast] = useState(false);

  if (!isOpen || !order) return null;

  const currentStatus = triggerStatus || order.status;
  const isOutForDelivery = currentStatus === 'Out for Delivery';
  const isShipped = currentStatus === 'Shipped' || currentStatus === 'Dispatched';

  const recipientName = order.shippingAddress.fullName || 'Valued Customer';
  const recipientEmail = order.shippingAddress.email || userEmail;

  const emailSubject = isOutForDelivery
    ? `🚚 Out for Delivery: Your AL-NOUREEN Order #${order.id} is arriving today!`
    : `✨ Your AL-NOUREEN Order #${order.id} has been Shipped via ${order.carrier}`;

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(order.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleSendTestEmail = () => {
    setEmailSentToast(true);
    setTimeout(() => setEmailSentToast(false), 4000);
  };

  const rawHtmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${emailSubject}</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; color: #1E1A17; }
    .container { max-width: 600px; margin: 0 auto; background: #FFFDF9; border: 1px solid #C59B27; border-radius: 12px; overflow: hidden; }
    .header { background: #14100D; color: #F5D77F; text-align: center; padding: 32px 20px; }
    .badge { display: inline-block; padding: 4px 12px; background: #25201B; border: 1px solid #C59B27; color: #E8D59E; border-radius: 20px; font-size: 11px; text-transform: uppercase; }
    .content { padding: 28px 24px; }
    .tracking-card { background: #F6EFE2; border: 1px solid #DDD3BC; border-radius: 8px; padding: 18px; margin: 20px 0; }
    .cta-btn { display: block; width: 100%; text-align: center; background: #181411; color: #F5D77F; border: 1px solid #C59B27; padding: 14px 0; font-weight: bold; text-decoration: none; border-radius: 8px; margin-top: 16px; }
    .footer { text-align: center; font-size: 11px; color: #8C7A6B; padding: 20px; border-top: 1px solid #E8DFC9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>AL-NOUREEN</h2>
      <p style="color: #E8D59E; font-size: 13px; margin: 4px 0;">Official Dispatch Notification</p>
      <div class="badge">${currentStatus}</div>
    </div>
    <div class="content">
      <p>Dear <strong>${recipientName}</strong>,</p>
      <p>Your order <strong>#${order.id}</strong> has updated to <strong>${currentStatus}</strong>.</p>
      <div class="tracking-card">
        <p><strong>Carrier:</strong> ${order.carrier}</p>
        <p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>
        <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery}</p>
        <p><strong>Destination:</strong> ${order.shippingAddress.city}, ${order.shippingAddress.country}</p>
      </div>
      <a href="https://alnoureen.com/track?id=${order.id}" class="cta-btn">TRACK PACKAGE LIVE</a>
    </div>
    <div class="footer">
      <p>AL-NOUREEN Atelier • Support WhatsApp: +91 93262 94187</p>
    </div>
  </div>
</body>
</html>`;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(rawHtmlCode);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const whatsappInquiryUrl = `https://wa.me/919326294187?text=${encodeURIComponent(
    `Hello AL-NOUREEN, I received the ${currentStatus} notification for Order #${order.id} (Tracking: ${order.trackingNumber}). Please share live updates.`
  )}`;

  return (
    <div
      id="order-notification-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF7F2] border border-[#C59B27]/50 max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative my-6 max-h-[94vh] overflow-y-auto rounded-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DFC9]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#181411] border border-[#C59B27] flex items-center justify-center text-[#E8D59E]">
              {isOutForDelivery ? (
                <Truck className="w-4 h-4 text-[#25D366]" />
              ) : (
                <Mail className="w-4 h-4 text-[#D4AF37]" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-cinzel tracking-widest text-[#8C6B1B] uppercase flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                Automated Notification Triggered
              </span>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#1E1A17]">
                {isOutForDelivery ? 'Out for Delivery Alert' : 'Order Shipped / Dispatched Alert'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#6B635B] hover:text-[#1E1A17] hover:bg-[#EAE2D2] transition-colors rounded-full"
            aria-label="Close notification preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher Tabs */}
        <div className="flex border-b border-[#E0D5BE] mt-3 gap-1">
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 text-xs font-cinzel font-semibold tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'email'
                ? 'border-[#C59B27] text-[#1E1A17] bg-[#F2ECE1] rounded-t-lg'
                : 'border-transparent text-[#7A6B5D] hover:text-[#1E1A17]'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-[#C59B27]" />
            Email Template View
          </button>

          <button
            onClick={() => setActiveTab('sms')}
            className={`px-4 py-2 text-xs font-cinzel font-semibold tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'sms'
                ? 'border-[#C59B27] text-[#1E1A17] bg-[#F2ECE1] rounded-t-lg'
                : 'border-transparent text-[#7A6B5D] hover:text-[#1E1A17]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#C59B27]" />
            SMS / WhatsApp View
          </button>

          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 text-xs font-cinzel font-semibold tracking-wider flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'html'
                ? 'border-[#C59B27] text-[#1E1A17] bg-[#F2ECE1] rounded-t-lg'
                : 'border-transparent text-[#7A6B5D] hover:text-[#1E1A17]'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-[#C59B27]" />
            Raw HTML Code
          </button>
        </div>

        {/* TAB 1: Luxury Email Template */}
        {activeTab === 'email' && (
          <div className="mt-4 space-y-4 font-sans-ui">
            {/* Email Metadata Envelope Bar */}
            <div className="bg-[#F0EAE0] border border-[#DDD3BC] rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[#6B5D50]">
                <div>
                  <span className="font-semibold text-[#1E1A17]">From:</span> AL-NOUREEN Atelier &lt;orders@alnoureen.com&gt;
                </div>
                <div>
                  <span className="font-semibold text-[#1E1A17]">To:</span> {recipientName} &lt;{recipientEmail}&gt;
                </div>
              </div>
              <div className="pt-1 border-t border-[#DDD3BC] text-[#1E1A17] font-medium">
                <span className="text-[#8C7A6B] font-normal">Subject: </span>
                {emailSubject}
              </div>
            </div>

            {/* Email Canvas Preview Container */}
            <div className="bg-[#FFFDF9] border border-[#C59B27]/40 rounded-2xl overflow-hidden shadow-md">
              {/* Header */}
              <div className="bg-[#14100D] text-white p-6 text-center border-b border-[#C59B27]/50">
                <div className="w-16 h-16 mx-auto mb-2">
                  <Logo variant="seal" />
                </div>
                <h4 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#FAF7F2]">
                  AL-NOUREEN
                </h4>
                <p className="text-[11px] text-[#D8C7A8] font-sans-ui mt-0.5 tracking-wider">
                  Two Lights. One Beautiful Vision.
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#241F1B] border border-[#C59B27]/60 rounded-full text-[10px] font-cinzel text-[#F5D77F] uppercase tracking-widest font-semibold">
                  <Truck className="w-3 h-3 text-[#D4AF37]" />
                  Status Update: {currentStatus}
                </div>
              </div>

              {/* Email Body */}
              <div className="p-5 sm:p-6 space-y-5 text-xs text-[#3E342B]">
                <div>
                  <p className="text-sm font-semibold text-[#1E1A17]">
                    Dear {recipientName},
                  </p>
                  <p className="mt-1.5 text-[#594E43] leading-relaxed">
                    {isOutForDelivery ? (
                      <>
                        Exciting news! Your AL-NOUREEN package is currently <strong>Out for Delivery</strong> with the local courier driver and will arrive at your address today.
                      </>
                    ) : (
                      <>
                        We are delighted to inform you that your custom order <strong>#{order.id}</strong> has passed final quality audit and has been dispatched via <strong>{order.carrier}</strong>.
                      </>
                    )}
                  </p>
                </div>

                {/* Key Dispatch / Courier Card */}
                <div className="bg-[#F7F2E8] border border-[#DDD3BC] rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-[#DDD3BC]">
                    <div>
                      <span className="text-[10px] font-cinzel uppercase text-[#8C7A6B] block">Courier Partner</span>
                      <strong className="text-xs sm:text-sm text-[#1E1A17] font-cinzel">{order.carrier}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-cinzel uppercase text-[#8C7A6B] block">Estimated Delivery</span>
                      <strong className="text-xs sm:text-sm text-[#0A7B54]">{order.estimatedDelivery}</strong>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                    <div>
                      <span className="text-[10px] font-cinzel uppercase text-[#8C7A6B] block">Waybill / Tracking No.</span>
                      <span className="font-mono text-xs sm:text-sm font-bold text-[#1E1A17]">{order.trackingNumber}</span>
                    </div>

                    <button
                      onClick={handleCopyTracking}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE2D2] border border-[#DDD3BC] text-[#1E1A17] rounded-lg text-xs font-semibold transition-colors"
                    >
                      {copiedTracking ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#8C6B1B]" /> Copy Tracking
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Destination */}
                <div className="p-3 bg-[#FAF7F2] border border-[#DDD3BC] rounded-xl flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-semibold text-[#1E1A17] block">Delivery Address:</span>
                    <span className="text-[#594E43]">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                    </span>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="space-y-2">
                  <span className="font-cinzel text-[11px] font-bold uppercase tracking-wider text-[#1E1A17] block">
                    Items in Shipment ({order.itemsCount || order.items.length})
                  </span>
                  <div className="divide-y divide-[#EFE8DA]">
                    {order.items.map((item, idx) => (
                      <div key={`order-notif-item-${item.id || item.productId || item.name}-${item.size || ''}-${idx}`} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-12 object-cover rounded-md border border-[#DDD3BC]"
                          />
                          <div>
                            <p className="font-serif font-semibold text-[#1E1A17] line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-[#8C7A6B]">
                              Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-[#1E1A17]">
                          {formatPrice(item.price * item.quantity, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      if (onNavigateToTracking) onNavigateToTracking(order.id);
                      onClose();
                    }}
                    className="w-full py-3 bg-[#181411] hover:bg-[#2B231D] text-[#F5D77F] border border-[#C59B27] font-cinzel text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4 text-[#D4AF37]" />
                    Track Shipment in Real-Time
                  </button>

                  <a
                    href={whatsappInquiryUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-cinzel text-xs font-semibold tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 text-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Receive WhatsApp Delivery Alerts
                  </a>
                </div>

                {/* Email Footer Note */}
                <div className="pt-4 border-t border-[#E8DFC9] text-center text-[10.5px] text-[#8C7A6B] space-y-1">
                  <p>Questions regarding your shipment? Reply directly to this email or reach us on WhatsApp at +91 93262 94187.</p>
                  <p className="font-cinzel text-[9.5px] text-[#B0A292]">AL-NOUREEN • All Rights Reserved © 2026</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SMS / WhatsApp Preview */}
        {activeTab === 'sms' && (
          <div className="mt-4 space-y-4 font-sans-ui">
            <div className="max-w-md mx-auto bg-[#E5DDD5] p-4 rounded-2xl border border-[#C8B89A] shadow-inner space-y-3">
              {/* WhatsApp Message Bubble */}
              <div className="bg-white rounded-xl rounded-tl-none p-3.5 shadow-sm text-xs text-[#1E1A17] space-y-2 border border-black/5 relative">
                <div className="flex items-center gap-1.5 text-[#075E54] font-bold text-[11px]">
                  <MessageCircle className="w-3.5 h-3.5" /> AL-NOUREEN Official
                </div>
                <p className="text-xs leading-relaxed">
                  {isOutForDelivery ? (
                    <>
                      Assalamu Alaikum <strong>{recipientName}</strong>, your AL-NOUREEN order <strong>#{order.id}</strong> is <strong>OUT FOR DELIVERY</strong> today via {order.carrier}!
                    </>
                  ) : (
                    <>
                      Assalamu Alaikum <strong>{recipientName}</strong>, your AL-NOUREEN order <strong>#{order.id}</strong> has been <strong>SHIPPED</strong> via {order.carrier}!
                    </>
                  )}
                </p>
                <div className="bg-[#F0F2F5] p-2.5 rounded-lg text-[11px] space-y-1 border border-black/5">
                  <p>📦 <strong>Tracking:</strong> {order.trackingNumber}</p>
                  <p>🚚 <strong>Carrier:</strong> {order.carrier}</p>
                  <p>🗓️ <strong>Arrival:</strong> {order.estimatedDelivery}</p>
                  <p>📍 <strong>City:</strong> {order.shippingAddress.city}, {order.shippingAddress.country}</p>
                </div>
                <p className="text-[10.5px] text-[#075E54] font-medium">
                  Track online: https://alnoureen.com/track/{order.id}
                </p>
                <span className="text-[9px] text-[#8C7A6B] block text-right">Just now • Delivered ✓✓</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-xl shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Open in WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* TAB 3: Raw HTML Code */}
        {activeTab === 'html' && (
          <div className="mt-4 space-y-3 font-sans-ui">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#6B5D50] font-medium">Production-Ready Email HTML Template:</span>
              <button
                onClick={handleCopyHtml}
                className="px-3 py-1.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-lg font-cinzel text-[11px] font-bold tracking-wider flex items-center gap-1.5 transition-colors"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedHtml ? 'Copied HTML!' : 'Copy Code'}
              </button>
            </div>
            <pre className="bg-[#181411] text-[#E8D59E] p-4 rounded-xl text-[11px] font-mono overflow-x-auto max-h-72 border border-[#C59B27]/40 leading-relaxed">
              {rawHtmlCode}
            </pre>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-[#E8DFC9] flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSendTestEmail}
              className="w-full sm:w-auto px-4 py-2 bg-[#EAE2D2] hover:bg-[#DDD3BC] text-[#1E1A17] text-xs font-cinzel font-semibold tracking-wider rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-[#8C6B1B]" />
              Send Test Email to {recipientEmail}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-[#181411] text-[#E8D59E] hover:bg-[#2B231D] text-xs font-cinzel font-semibold tracking-wider rounded-xl transition-colors"
          >
            Close Preview
          </button>
        </div>

        {/* Test Email Sent Toast */}
        {emailSentToast && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Automated dispatch notification email dispatched to <strong>{recipientEmail}</strong> with tracking number <strong>{order.trackingNumber}</strong>!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
