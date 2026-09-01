import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  MessageCircle,
  AlertCircle,
  Mail,
  RefreshCw,
  Send,
  Eye,
  Radio,
  Activity,
  Zap,
  ShieldCheck,
  Plane,
  Layers,
  ChevronRight,
  FileText,
  Download
} from 'lucide-react';
import { ScreenType, Order, OrderStatus, Currency } from '../types';
import { formatPrice } from '../utils/currency';
import { TrackingVisualMap } from '../components/TrackingVisualMap';
import { DeliveryDelayModal } from '../components/DeliveryDelayModal';
import { hapticLight, hapticSuccess } from '../utils/haptics';
import { playNotificationChime } from '../utils/notificationSound';
import { generateInvoicePdf } from '../utils/invoicePdf';

interface TrackOrderScreenProps {
  onNavigate: (screen: ScreenType) => void;
  orders: Order[];
  currency?: Currency;
  onUpdateOrderStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onOpenNotificationModal?: (order: Order, triggerStatus?: OrderStatus) => void;
  initialOrderId?: string;
  onUpdateOrderDeliveryDate?: (orderId: string, newDeliveryDate: string, reason: string, notes: string) => void;
}

interface TelemetryLog {
  id: string;
  timestamp: string;
  location: string;
  message: string;
  status: OrderStatus;
  isLatest?: boolean;
}

export const TrackOrderScreen: React.FC<TrackOrderScreenProps> = ({
  onNavigate,
  orders,
  currency = 'INR',
  onUpdateOrderStatus,
  onOpenNotificationModal,
  initialOrderId,
  onUpdateOrderDeliveryDate
}) => {
  const [searchId, setSearchId] = useState(initialOrderId || '');
  const [activeOrder, setActiveOrder] = useState<Order | null>(
    (initialOrderId ? orders.find(o => o.id.toLowerCase() === initialOrderId.toLowerCase()) : null) || orders[0] || null
  );
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // WebSocket / Polling simulation states
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDeliveryDelayModalOpen, setIsDeliveryDelayModalOpen] = useState(false);
  const [pingLatency, setPingLatency] = useState(19);
  const [packetsReceived, setPacketsReceived] = useState(142);
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toLocaleTimeString());
  const [logs, setLogs] = useState<TelemetryLog[]>([]);

  useEffect(() => {
    if (initialOrderId) {
      const found = orders.find(o => o.id.toLowerCase() === initialOrderId.toLowerCase());
      if (found) {
        setActiveOrder(found);
        setSearchId(initialOrderId);
      }
    } else if (!activeOrder && orders.length > 0) {
      setActiveOrder(orders[0]);
    }
  }, [initialOrderId, orders]);

  // Keep activeOrder up to date when orders state changes in parent
  useEffect(() => {
    if (activeOrder) {
      const fresh = orders.find(o => o.id === activeOrder.id);
      if (fresh) setActiveOrder(fresh);
    }
  }, [orders]);

  // Handle confirming delivery delay request
  const handleConfirmDeliveryDelay = (
    orderId: string,
    newEstimatedDate: string,
    reason: string,
    instructions: string,
    delayDays: number
  ) => {
    if (!activeOrder) return;
    playNotificationChime();
    hapticSuccess();

    // Update active order state locally
    const updatedOrder: Order = {
      ...activeOrder,
      estimatedDelivery: newEstimatedDate,
      orderNotes: activeOrder.orderNotes
        ? `${activeOrder.orderNotes} | Delivery Hold Requested: ${reason} (Hold until ${newEstimatedDate}). Instructions: ${instructions}`
        : `Delivery Hold Requested: ${reason} (Hold until ${newEstimatedDate}). Instructions: ${instructions}`
    };
    setActiveOrder(updatedOrder);

    // Add milestone log to telemetry feed
    const newLog: TelemetryLog = {
      id: `delay-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: `${activeOrder.carrier} Regional Hub - Secure Hold Vault`,
      message: `Delivery hold confirmed per patron request: "${reason}". Rescheduled delivery window set to ${newEstimatedDate}. Instructions: "${instructions}"`,
      status: activeOrder.status,
      isLatest: true
    };

    setLogs((prev) => [newLog, ...prev.map((l) => ({ ...l, isLatest: false }))]);
    setPacketsReceived((p) => p + 1);
    setLastSyncTime(new Date().toLocaleTimeString());

    if (onUpdateOrderDeliveryDate) {
      onUpdateOrderDeliveryDate(orderId, newEstimatedDate, reason, instructions);
    }
  };
  useEffect(() => {
    if (!activeOrder) return;
    const baseLogs: TelemetryLog[] = [
      {
        id: '1',
        timestamp: '10:14 AM',
        location: 'AL-NOUREEN Atelier (Bandra West, Mumbai)',
        message: 'Order verified & fabric allocation completed by Head Karigar.',
        status: 'Order Placed'
      },
      {
        id: '2',
        timestamp: '11:30 AM',
        location: 'Embroidery & Zardozi Suite',
        message: 'Pure silk base fabric mounted on loom. Hand zardozi needlework in progress.',
        status: 'In Atelier Tailoring'
      },
      {
        id: '3',
        timestamp: '02:45 PM',
        location: 'Master Quality Lab',
        message: '14-point modest drape, seam tension & zari thread inspection passed.',
        status: 'Quality Inspection'
      },
      {
        id: '4',
        timestamp: '04:10 PM',
        location: 'Chhatrapati Shivaji Maharaj International Airport (BOM)',
        message: 'Airway Bill generated. Transferred to DHL Express Priority Boeing 777.',
        status: 'Shipped'
      },
      {
        id: '5',
        timestamp: '06:20 PM',
        location: 'Regional Express Sorting Hub',
        message: 'Sorted for final mile courier route. Security & tamper-evident seals verified.',
        status: 'Out for Delivery'
      },
      {
        id: '6',
        timestamp: '07:45 PM',
        location: `${activeOrder.shippingAddress.city}, ${activeOrder.shippingAddress.country}`,
        message: 'Delivered and signed by client at residential concierge.',
        status: 'Delivered'
      }
    ];

    const currentIdx = getStepIndex(activeOrder.status);
    const visibleLogs = baseLogs.slice(0, currentIdx + 1).map((l, i, arr) => ({
      ...l,
      isLatest: i === arr.length - 1
    }));
    setLogs(visibleLogs);
  }, [activeOrder?.status, activeOrder?.id]);

  // WebSocket Live Polling Heartbeat Simulation
  useEffect(() => {
    if (!isLiveStreaming || !activeOrder) return;

    const interval = setInterval(() => {
      // Simulate ping jitter and incoming packets
      setPingLatency(Math.floor(16 + Math.random() * 8));
      setPacketsReceived((prev) => prev + 1);
      setLastSyncTime(new Date().toLocaleTimeString());
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveStreaming, activeOrder]);

  // Auto-Progression Simulator Effect
  useEffect(() => {
    if (!autoAdvanceEnabled || !activeOrder || !onUpdateOrderStatus) return;

    const sequence: OrderStatus[] = [
      'Order Placed',
      'In Atelier Tailoring',
      'Quality Inspection',
      'Shipped',
      'Out for Delivery',
      'Delivered'
    ];

    const advanceTimer = setInterval(() => {
      const currentIdx = getStepIndex(activeOrder.status);
      if (currentIdx < sequence.length - 1) {
        const nextStatus = sequence[currentIdx + 1];
        onUpdateOrderStatus(activeOrder.id, nextStatus);
        hapticSuccess();
        playNotificationChime();
      } else {
        setAutoAdvanceEnabled(false);
      }
    }, 8000);

    return () => clearInterval(advanceTimer);
  }, [autoAdvanceEnabled, activeOrder, onUpdateOrderStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setSearched(true);

    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === searchId.trim().toLowerCase() ||
        o.trackingNumber.toLowerCase() === searchId.trim().toLowerCase()
    );

    if (found) {
      setActiveOrder(found);
      setErrorMsg('');
      hapticSuccess();
    } else {
      setActiveOrder(null);
      setErrorMsg(`No active order found matching reference "${searchId}". Please check your order confirmation.`);
    }
  };

  const handleDownloadInvoicePdf = async () => {
    if (!activeOrder) return;
    hapticLight();
    setIsDownloadingPdf(true);
    try {
      await generateInvoicePdf(activeOrder, currency);
      hapticSuccess();
    } catch (err) {
      console.error('Error generating PDF bill from tracking:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const steps: { title: OrderStatus; desc: string; subDetail: string; icon: string }[] = [
    {
      title: 'Order Placed',
      desc: 'Order received & verified',
      subDetail: 'Order verified, payment confirmed & allocated for packaging',
      icon: '✨'
    },
    {
      title: 'In Atelier Tailoring',
      desc: 'Processing & preparation',
      subDetail: 'Garment preparation, precision finishing & careful packaging',
      icon: '📦'
    },
    {
      title: 'Quality Inspection',
      desc: 'Quality & fit audit',
      subDetail: 'Length verification, seam inspection & security seal locking',
      icon: '🔍'
    },
    {
      title: 'Shipped',
      desc: 'Dispatched via Express Courier',
      subDetail: 'Airway bill generated, customs cleared & handed to transit carrier',
      icon: '✈️'
    },
    {
      title: 'Out for Delivery',
      desc: 'With local courier agent',
      subDetail: 'Courier vehicle en route to delivery destination address',
      icon: '🚚'
    },
    {
      title: 'Delivered',
      desc: 'Delivered at destination address',
      subDetail: 'Handed to recipient in gold-embossed signature packaging',
      icon: '🎁'
    }
  ];

  function getStepIndex(status: OrderStatus) {
    switch (status) {
      case 'Order Placed':
      case 'Order Confirmed':
        return 0;
      case 'In Atelier Tailoring':
        return 1;
      case 'Quality Inspection':
        return 2;
      case 'Dispatched':
      case 'Shipped':
        return 3;
      case 'Out for Delivery':
        return 4;
      case 'Delivered':
        return 5;
      default:
        return 1;
    }
  }

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!activeOrder) return;
    hapticLight();
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(activeOrder.id, newStatus);
    }
  };

  const currentStepIdx = activeOrder ? getStepIndex(activeOrder.status) : 1;

  return (
    <div id="screen-track-order" className="w-full bg-[#FAF7F2] text-[#1E1A17] pb-20">
      {/* Hero Header */}
      <div className="bg-[#181411] text-[#FAF7F2] py-12 px-4 sm:px-6 text-center border-b border-[#C59B27]/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C59B27_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#28221D] border border-[#C59B27]/50 rounded-full text-[11px] font-sans-ui text-[#E8D59E] uppercase tracking-widest font-semibold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <Package className="w-3.5 h-3.5 text-[#C59B27]" /> Live Real-Time Telemetry & Courier Feed
          </div>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wide text-white">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui max-w-xl mx-auto">
            Live real-time courier telemetry, consignment logistics, and doorstep delivery updates.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        {/* Search Box & Quick Orders Bar */}
        <form
          onSubmit={handleSearch}
          className="bg-[#F7F2E8] p-4 sm:p-6 rounded-3xl border border-[#DDD3BC] shadow-xs flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#8C6B1B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID (e.g. ALN-902814 or ALN-489201)"
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#DDD3BC] rounded-xl text-xs font-sans-ui focus:outline-hidden focus:border-[#C59B27] shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel font-bold text-xs tracking-wider transition-all shadow-sm whitespace-nowrap cursor-pointer hover:scale-[1.02]"
          >
            Track Order
          </button>
        </form>

        {errorMsg && (
          <div className="p-4 bg-[#FBEBEB] border border-[#E0B4B4] rounded-2xl text-xs text-[#9E2A2B] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Active Order Details */}
        {activeOrder && (
          <div className="bg-[#FAF7F2] border border-[#E0D5BE] rounded-3xl p-5 sm:p-8 space-y-7 shadow-xs">
            {/* Top Order Meta & Live WebSocket Connection Banner */}
            <div className="space-y-4 pb-6 border-b border-[#E8DFC8]">
              {/* WebSocket Telemetry Status Strip */}
              <div className="bg-[#181411] text-[#FAF7F2] px-4 py-3 rounded-2xl border border-[#C59B27]/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping absolute" />
                    <span className="w-2 h-2 rounded-full bg-[#10B981] relative" />
                  </div>
                  <div className="font-mono text-[11px]">
                    <span className="text-[#E8D59E] font-bold">WEBSOCKET POLLING STREAM:</span>{' '}
                    <span className="text-[#10B981]">ONLINE</span> • {pingLatency}ms latency
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] font-sans-ui text-[#A69788]">
                  <span>Telemetry Packets: <strong className="text-white font-mono">{packetsReceived}</strong></span>
                  <span>Last Sync: <strong className="text-white font-mono">{lastSyncTime}</strong></span>
                  <button
                    onClick={() => {
                      hapticLight();
                      setPacketsReceived(p => p + 3);
                      setLastSyncTime(new Date().toLocaleTimeString());
                    }}
                    className="p-1 text-[#C59B27] hover:text-white rounded hover:bg-[#28221D] transition-colors cursor-pointer"
                    title="Force telemetry refresh"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Order Header Meta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#1E1A17]">
                      Order #{activeOrder.id}
                    </h2>
                    <span className="px-3 py-1 bg-[#181411] text-[#E8D59E] text-xs font-cinzel font-bold rounded-full border border-[#C59B27]/50 shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                      {activeOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#7A6B5D] font-sans-ui mt-1">
                    Placed on {activeOrder.date} • Carrier: <strong className="text-[#1E1A17]">{activeOrder.carrier}</strong> (AWB: <span className="font-mono font-bold">{activeOrder.trackingNumber}</span>)
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#8C7A6B]">Estimated Delivery Window:</span>
                    <span className="font-cinzel text-xs sm:text-sm font-bold text-[#0A7B54] bg-[#EBF7EE] px-2.5 py-0.5 rounded-lg border border-[#A7E1BE]">
                      {activeOrder.estimatedDelivery}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap sm:justify-end">
                    <button
                      id="request-delivery-delay-btn"
                      onClick={() => {
                        hapticLight();
                        setIsDeliveryDelayModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE2D2] text-[#8C6B1B] border border-[#C59B27]/60 rounded-xl text-xs font-cinzel font-bold tracking-wider transition-all shadow-2xs hover:scale-101 active:scale-98 cursor-pointer"
                      title="Request a Delivery Hold or Delay if away"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>Request Delivery Delay</span>
                    </button>

                    <button
                      onClick={handleDownloadInvoicePdf}
                      disabled={isDownloadingPdf}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EAE2D2] text-[#1E1A17] border border-[#DDD3BC] rounded-xl text-xs font-cinzel font-semibold tracking-wider transition-colors cursor-pointer"
                      title="Download Certified PDF Tax Invoice"
                    >
                      <Download className="w-3.5 h-3.5 text-[#C59B27]" />
                      {isDownloadingPdf ? 'Generating...' : 'Download PDF Bill'}
                    </button>

                    {onOpenNotificationModal && (
                      <button
                        onClick={() => onOpenNotificationModal(activeOrder)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F0EAE0] hover:bg-[#E5DDD0] text-[#1E1A17] border border-[#DDD3BC] rounded-xl text-xs font-cinzel font-semibold tracking-wider transition-colors cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#C59B27]" /> Notification
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation Controller Bar with Auto-Advance Switch */}
            <div className="bg-[#181411] text-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#C59B27]/50 space-y-3 shadow-md">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-cinzel text-xs sm:text-sm font-bold text-[#FAF7F2]">
                    Interactive Live Progression & WebSocket Simulator
                  </span>
                </div>

                {/* Auto-Advance Toggle */}
                <button
                  onClick={() => {
                    hapticLight();
                    setAutoAdvanceEnabled(!autoAdvanceEnabled);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    autoAdvanceEnabled
                      ? 'bg-[#10B981] text-white shadow-lg ring-2 ring-[#10B981]/40'
                      : 'bg-[#28221D] text-[#E8D59E] border border-[#C59B27]/40'
                  }`}
                >
                  <Zap className={`w-3.5 h-3.5 ${autoAdvanceEnabled ? 'fill-white animate-bounce' : ''}`} />
                  {autoAdvanceEnabled ? '⚡ Auto-Simulating (Advancing Every 8s)' : 'Enable Live Auto-Progression'}
                </button>
              </div>

              {/* Status Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {(['In Atelier Tailoring', 'Quality Inspection', 'Shipped', 'Out for Delivery', 'Delivered'] as OrderStatus[]).map((st, sIdx) => {
                  const isSelected = activeOrder.status === st || (st === 'Shipped' && activeOrder.status === 'Dispatched');
                  return (
                    <button
                      key={`track-status-btn-${st}-${sIdx}`}
                      onClick={() => handleStatusChange(st)}
                      className={`px-3 py-2 text-[11px] font-cinzel font-bold rounded-xl border transition-all text-center cursor-pointer ${
                        isSelected
                          ? 'bg-[#C59B27] text-[#181411] border-[#C59B27] shadow-md scale-102 font-extrabold'
                          : 'bg-[#28221D] text-[#E8D59E] border-[#C59B27]/30 hover:bg-[#383029] hover:border-[#C59B27]'
                      }`}
                    >
                      {st === 'Shipped' ? '📦 Shipped' : st === 'Out for Delivery' ? '🚚 Out for Delivery' : st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Visual Map with Real-time GPS coordinates */}
            <div className="pt-2">
              <TrackingVisualMap order={activeOrder} />
            </div>

            {/* Live Status Timeline with Animated Stepper */}
            <div className="space-y-5 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="font-cinzel text-sm font-bold text-[#1E1A17] uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#C59B27]" /> Live Status Timeline & Journey Milestones
                </h3>
                <span className="text-xs font-mono text-[#8C6B1B] font-semibold">
                  Stage {currentStepIdx + 1} of 6
                </span>
              </div>

              {/* Animated Progress Timeline Bar (Desktop & Tablet) */}
              <div className="relative bg-[#F4EDE2] p-6 rounded-3xl border border-[#DDD3BC] overflow-hidden">
                {/* Connecting glowing progress track */}
                <div className="hidden sm:block absolute top-[44px] left-[8%] right-[8%] h-1 bg-[#E0D5BE] z-0 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C59B27] to-[#10B981] transition-all duration-700 relative"
                    style={{ width: `${(currentStepIdx / 5) * 100}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/40 animate-pulse" />
                  </div>
                </div>

                {/* Stepper Node Grid */}
                <div className="hidden sm:grid grid-cols-6 gap-2 text-center relative z-10">
                  {steps.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={`track-step-d-${activeOrder.id}-${step.title}-${idx}`} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all duration-500 ${
                            isCurrent
                              ? 'bg-[#181411] border-[#C59B27] text-[#E8D59E] scale-110 shadow-lg ring-4 ring-[#C59B27]/30'
                              : isDone
                              ? 'bg-[#C59B27] border-[#C59B27] text-[#181411]'
                              : 'bg-white border-[#DDD3BC] text-[#A69788]'
                          }`}
                        >
                          {isCurrent ? (
                            <span className="animate-spin text-sm">✦</span>
                          ) : isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-[#181411]" />
                          ) : (
                            <span className="text-xs font-cinzel font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <span
                          className={`text-xs font-cinzel font-bold leading-tight ${
                            isCurrent ? 'text-[#8C6B1B]' : isDone ? 'text-[#1E1A17]' : 'text-[#A69788]'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[10px] text-[#7A6B5D] leading-tight mt-1 font-sans-ui line-clamp-2">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Stepper Vertical Timeline */}
                <div className="sm:hidden space-y-4 relative">
                  {steps.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={`track-step-m-${activeOrder.id}-${step.title}-${idx}`} className="flex items-start gap-3 relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 mt-0.5 transition-all ${
                            isCurrent
                              ? 'bg-[#181411] border-[#C59B27] text-[#E8D59E] shadow-md ring-2 ring-[#C59B27]'
                              : isDone
                              ? 'bg-[#C59B27] border-[#C59B27] text-[#181411]'
                              : 'bg-white border-[#DDD3BC] text-[#A69788]'
                          }`}
                        >
                          {isCurrent ? (
                            <span className="text-xs animate-pulse">●</span>
                          ) : isDone ? (
                            <CheckCircle2 className="w-4 h-4" />
                          ) : (
                            <span className="text-[11px] font-bold">{idx + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-xs font-cinzel font-bold ${
                                isCurrent ? 'text-[#8C6B1B]' : isDone ? 'text-[#1E1A17]' : 'text-[#A69788]'
                              }`}
                            >
                              {step.title}
                            </p>
                            {isCurrent && (
                              <span className="text-[9px] font-mono uppercase bg-[#C59B27]/20 text-[#8C6B1B] px-1.5 py-0.5 rounded font-bold">
                                Active Step
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#7A6B5D] mt-0.5">{step.subDetail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Real-time Telemetry Event Stream Logs */}
            <div className="bg-[#181411] text-[#FAF7F2] p-5 rounded-3xl border border-[#C59B27]/40 space-y-4">
              <div className="flex items-center justify-between border-b border-[#C59B27]/30 pb-3">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#10B981] animate-pulse" />
                  <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#E8D59E]">
                    Real-Time Telemetry Event Log
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-[#A69788]">
                  Auto-updated via Courier Telemetry Socket
                </span>
              </div>

              <div className="space-y-3 font-sans-ui text-xs">
                {logs.map((log, lIdx) => (
                  <div
                    key={`telemetry-log-${log.id || lIdx}-${lIdx}`}
                    className={`p-3 rounded-2xl border transition-all ${
                      log.isLatest
                        ? 'bg-[#28221D] border-[#C59B27] shadow-inner'
                        : 'bg-[#1F1A15] border-[#383028] opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-mono text-[11px] text-[#E8D59E] font-bold flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#C59B27]" /> {log.timestamp}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/20">
                        {log.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#FAF7F2] font-medium mt-1">
                      {log.message}
                    </p>
                    <span className="text-[10px] text-[#A69788] flex items-center gap-1 mt-1">
                      <MapPin className="w-2.5 h-2.5 text-[#C59B27]" /> {log.location}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Courier Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#E8DFC8]">
              <div className="p-4 bg-[#F7F2E8] rounded-2xl border border-[#DDD3BC] space-y-2">
                <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#1E1A17] uppercase tracking-wider">
                  <Truck className="w-4 h-4 text-[#C59B27]" /> Courier & Express Dispatch
                </div>
                <div className="text-xs space-y-1 text-[#594E43]">
                  <p><strong>Carrier:</strong> {activeOrder.carrier}</p>
                  <p><strong>Tracking Number:</strong> <span className="font-mono font-bold text-[#1E1A17]">{activeOrder.trackingNumber}</span></p>
                  <p><strong>Status:</strong> <span className="text-[#0A7B54] font-semibold">{activeOrder.status}</span></p>
                </div>
              </div>

              <div className="p-4 bg-[#F7F2E8] rounded-2xl border border-[#DDD3BC] space-y-2">
                <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#1E1A17] uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-[#C59B27]" /> Shipping Destination
                </div>
                <div className="text-xs space-y-0.5 text-[#594E43]">
                  <p className="font-semibold text-[#1E1A17]">{activeOrder.shippingAddress.fullName}</p>
                  <p>{activeOrder.shippingAddress.street}</p>
                  <p>{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} {activeOrder.shippingAddress.postalCode}</p>
                  <p>{activeOrder.shippingAddress.country}</p>
                </div>
              </div>
            </div>

            {/* Order Notes & Special Instructions if present */}
            {activeOrder.orderNotes && (
              <div className="p-4 bg-[#F7F2E8] rounded-2xl border border-[#C59B27]/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#8C6B1B] uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-[#C59B27]" /> Order Notes & Customer Instructions
                </div>
                <p className="text-xs text-[#1E1A17] bg-white p-3 rounded-xl border border-[#DDD3BC] whitespace-pre-line leading-relaxed font-sans-ui">
                  {activeOrder.orderNotes}
                </p>
              </div>
            )}

            {/* Items Summary in this Order */}
            <div className="pt-4 border-t border-[#E8DFC8]">
              <h3 className="font-cinzel text-sm font-bold text-[#1E1A17] uppercase tracking-wider mb-3">
                Items in This Package ({activeOrder.itemsCount || activeOrder.items.length})
              </h3>
              <div className="space-y-3">
                {activeOrder.items.map((item, idx) => (
                  <div
                    key={`track-order-item-${item.id || item.productId || item.name}-${item.size || ''}-${idx}`}
                    className="flex items-center justify-between p-3.5 bg-[#F7F2E8] rounded-2xl border border-[#DDD3BC]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover rounded-xl border border-[#DDD3BC]"
                      />
                      <div>
                        <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#1E1A17]">
                          {item.name}
                        </h4>
                        <p className="text-xs text-[#7A6B5D] font-sans-ui">
                          Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-cinzel font-bold text-xs sm:text-sm text-[#1E1A17]">
                      {formatPrice(item.price * item.quantity, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Updates Integration */}
            <div className="bg-[#181411] text-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#C59B27]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h4 className="font-cinzel text-xs font-bold text-[#E8D59E]">
                    Receive WhatsApp Dispatch Alerts
                  </h4>
                  <p className="text-[11px] text-[#A69788] font-sans-ui">
                    Get instant courier tracking and live delivery updates directly on your phone.
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/919326294187?text=${encodeURIComponent(
                  `Hello, I would like live WhatsApp tracking alerts for AL-NOUREEN Order #${activeOrder.id}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#25D366] hover:bg-[#1EBE5B] text-white rounded-xl text-xs font-cinzel font-semibold tracking-wider transition-colors whitespace-nowrap shadow-sm"
              >
                Enable WhatsApp Alerts
              </a>
            </div>
          </div>
        )}
      </div>

      <DeliveryDelayModal
        isOpen={isDeliveryDelayModalOpen}
        onClose={() => setIsDeliveryDelayModalOpen(false)}
        order={activeOrder}
        currency={currency}
        onConfirmDelay={handleConfirmDeliveryDelay}
      />
    </div>
  );
};

