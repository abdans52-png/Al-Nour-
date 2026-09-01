import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  ChevronDown,
  ChevronUp,
  Activity,
  Award,
  Check
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { hapticLight } from '../utils/haptics';

interface AtelierOrderProgressTrackerProps {
  order: Order;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
  className?: string;
  defaultExpanded?: boolean;
}

interface TrackingMilestone {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle: string;
  carrier: string;
  timeSpent: string;
  progressPercent: number;
  status: 'completed' | 'in_progress' | 'upcoming';
  detail: string;
}

export const AtelierOrderProgressTracker: React.FC<AtelierOrderProgressTrackerProps> = ({
  order,
  onUpdateStatus,
  className = '',
  defaultExpanded = true
}) => {
  const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(defaultExpanded);

  // Standard E-Commerce Logistics Stages
  const STAGES: { status: OrderStatus; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { status: 'Order Confirmed', label: 'Order Confirmed', shortLabel: 'Confirmed', icon: CheckCircle2 },
    { status: 'In Atelier Tailoring', label: 'Processing & Prep', shortLabel: 'Processing', icon: Package },
    { status: 'Quality Inspection', label: 'Quality Check', shortLabel: 'Inspection', icon: ShieldCheck },
    { status: 'Shipped', label: 'Dispatched & Transit', shortLabel: 'Shipped', icon: Truck },
    { status: 'Out for Delivery', label: 'Out for Delivery', shortLabel: 'Out for Del.', icon: Clock },
    { status: 'Delivered', label: 'Delivered', shortLabel: 'Delivered', icon: CheckCircle2 }
  ];

  // Calculate current stage index
  const getStageIndex = (status: OrderStatus): number => {
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
  };

  const currentStageIndex = getStageIndex(order.status);
  const totalStages = STAGES.length;

  // 4 Standard Logistics Delivery Milestones
  const trackingMilestones: TrackingMilestone[] = [
    {
      id: 'phase-1',
      phaseNumber: 1,
      title: 'Order Verification & Allocation',
      subtitle: 'Order verified & payment processed successfully',
      carrier: 'Fulfillment Operations',
      timeSpent: 'Completed',
      progressPercent: currentStageIndex >= 0 ? 100 : 0,
      status: currentStageIndex > 0 ? 'completed' : currentStageIndex === 0 ? 'in_progress' : 'upcoming',
      detail: 'Items reviewed, invoice issued, and inventory safely reserved for dispatch.'
    },
    {
      id: 'phase-2',
      phaseNumber: 2,
      title: 'Packaging & Quality Inspection',
      subtitle: 'Premium garment packaging & seal verification',
      carrier: 'Quality Assurance Team',
      timeSpent: currentStageIndex > 1 ? 'Passed' : currentStageIndex === 1 ? 'In Progress' : 'Pending',
      progressPercent: currentStageIndex > 1 ? 100 : currentStageIndex === 1 ? 75 : 0,
      status: currentStageIndex > 1 ? 'completed' : currentStageIndex === 1 ? 'in_progress' : 'upcoming',
      detail: 'Precision stitching inspection, fabric steam pressing, and protective garment bag sealing.'
    },
    {
      id: 'phase-3',
      phaseNumber: 3,
      title: 'Dispatched with Express Carrier',
      subtitle: `${order.carrier} Air Cargo Transit`,
      carrier: order.carrier || 'DHL Express',
      timeSpent: currentStageIndex > 3 ? 'Dispatched' : currentStageIndex === 3 ? 'In Flight' : 'Pending',
      progressPercent: currentStageIndex > 3 ? 100 : currentStageIndex === 3 ? 75 : 0,
      status: currentStageIndex > 3 ? 'completed' : currentStageIndex === 3 ? 'in_progress' : 'upcoming',
      detail: `Consignment airway bill #${order.trackingNumber} generated and processed through regional sorting hub.`
    },
    {
      id: 'phase-4',
      phaseNumber: 4,
      title: 'Out for Doorstep Delivery',
      subtitle: 'Courier vehicle en route to delivery address',
      carrier: 'Local Delivery Agent',
      timeSpent: currentStageIndex >= 5 ? 'Delivered' : currentStageIndex === 4 ? 'Out on Route' : 'Scheduled',
      progressPercent: currentStageIndex >= 5 ? 100 : currentStageIndex === 4 ? 60 : 0,
      status: currentStageIndex >= 5 ? 'completed' : currentStageIndex === 4 ? 'in_progress' : 'upcoming',
      detail: `Package assigned to local courier agent for delivery to ${order.shippingAddress.city}, ${order.shippingAddress.country}.`
    }
  ];

  // Calculate overall progress percentage
  const trackingProgressPercentage =
    currentStageIndex === 0
      ? 20
      : currentStageIndex === 1
      ? 40
      : currentStageIndex === 2
      ? 60
      : currentStageIndex === 3
      ? 80
      : currentStageIndex === 4
      ? 90
      : 100;

  return (
    <div
      id={`order-progress-tracker-${order.id}`}
      className={`bg-[#FAF7F2] dark:bg-[#1A1613] border border-[#DDD3BC] dark:border-[#332A22] rounded-2xl p-4 sm:p-5 shadow-xs transition-all ${className}`}
    >
      {/* 1. Header: Live Status Badge & Progress Percentage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-[#E8DFC8] dark:border-[#2E2620]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#181411] border border-[#C59B27]/50 flex items-center justify-center text-[#E8D59E] shrink-0 shadow-xs">
            <Truck className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2] tracking-wider uppercase">
                Order Tracking
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-[9.5px] font-sans-ui font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Status
              </span>
            </div>
            <p className="text-[10.5px] text-[#7A6B5D] dark:text-[#A69788] font-sans-ui">
              {order.carrier} • Tracking #{order.trackingNumber}
            </p>
          </div>
        </div>

        {/* Progress Percentage pill & expand toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="text-right">
            <span className="text-[10px] font-mono uppercase text-[#8C7A6B] dark:text-[#9E8E7C] block">
              Fulfillment Progress
            </span>
            <span className="font-cinzel text-xs sm:text-sm font-bold text-[#C59B27] dark:text-[#E8D59E]">
              {trackingProgressPercentage}% Completed
            </span>
          </div>

          <button
            onClick={() => {
              hapticLight();
              setIsDetailedViewOpen(!isDetailedViewOpen);
            }}
            className="p-1.5 rounded-lg bg-[#F0EAE0] dark:bg-[#251F1A] hover:bg-[#E4DBCB] dark:hover:bg-[#332A22] text-[#1E1A17] dark:text-[#E8D59E] transition-colors border border-[#DDD3BC] dark:border-[#382F26]"
            aria-label="Toggle Tracking Details"
            title="Toggle Tracking Milestones"
          >
            {isDetailedViewOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Visual Multi-Step Horizontal Stepper Bar */}
      <div className="py-4">
        {/* Stepper Bar line background */}
        <div className="relative mb-6 sm:mb-7">
          <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-[#E0D5BE] dark:bg-[#2E2620] rounded-full z-0" />
          <motion.div
            className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-gradient-to-r from-[#C59B27] via-[#E2BF5A] to-[#D4AF37] rounded-full z-0 shadow-xs"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(100, Math.max(8, (currentStageIndex / (STAGES.length - 1)) * 100))}%`
            }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Stepper Icons Nodes */}
          <div className="relative z-10 flex justify-between items-center">
            {STAGES.map((st, idx) => {
              const IconComp = st.icon;
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={`atelier-prog-st-${order.id}-${st.status}-${idx}`} className="flex flex-col items-center group">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onUpdateStatus && onUpdateStatus(order.id, st.status)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-semibold cursor-pointer transition-all ${
                      isPast
                        ? 'bg-[#C59B27] text-[#181411] shadow-xs'
                        : isCurrent
                        ? 'bg-[#181411] text-[#F5D77F] border-2 border-[#C59B27] shadow-[0_0_12px_rgba(197,155,39,0.5)] ring-4 ring-[#C59B27]/20 scale-110'
                        : 'bg-[#EDE4D5] dark:bg-[#241F1A] text-[#8C7A6B] dark:text-[#6E6053] border border-[#DDD3BC] dark:border-[#382E26]'
                    }`}
                    title={`Click to update status: ${st.label}`}
                  >
                    <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </motion.div>

                  <span
                    className={`text-[9px] sm:text-[10px] font-cinzel mt-1.5 text-center leading-tight whitespace-nowrap hidden xs:block ${
                      isCurrent
                        ? 'text-[#C59B27] dark:text-[#E8D59E] font-bold'
                        : isPast
                        ? 'text-[#54463A] dark:text-[#C5BAAC] font-semibold'
                        : 'text-[#8C7E72] dark:text-[#6E6053]'
                    }`}
                  >
                    <span className="sm:hidden">{st.shortLabel}</span>
                    <span className="hidden sm:inline">{st.label}</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Milestone Summary Card */}
        <div className="bg-[#F2ECE1] dark:bg-[#201A16] border border-[#DDD3BC] dark:border-[#382F27] rounded-xl p-3.5 sm:p-4 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-lg bg-[#C59B27]/20 border border-[#C59B27]/40 text-[#B38A1E] dark:text-[#F5D77F] shrink-0 mt-0.5">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-cinzel text-xs font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase">
                    Current Milestone: {order.status}
                  </span>
                </div>
                <p className="text-xs text-[#594E43] dark:text-[#C5BAAC] font-sans-ui mt-0.5">
                  {order.status === 'In Atelier Tailoring' || order.status === 'Order Confirmed'
                    ? 'Garment being prepared and packaged with care for express dispatch.'
                    : order.status === 'Quality Inspection'
                    ? 'Quality inspection complete. Security seal and packaging applied.'
                    : order.status === 'Shipped' || order.status === 'Dispatched'
                    ? `Package en route via ${order.carrier} (AWB: ${order.trackingNumber}).`
                    : order.status === 'Out for Delivery'
                    ? 'Local courier driver assigned for final delivery to your doorstep.'
                    : order.status === 'Delivered'
                    ? 'Package safely delivered. Thank you for choosing AL-NOUREEN.'
                    : 'Order confirmed and registered in fulfillment queue.'}
                </p>
              </div>
            </div>

            {/* Live Delivery Info Pill */}
            <div className="shrink-0 self-start sm:self-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#181411] text-[#E8D59E] border border-[#C59B27]/40 text-[10px] font-mono">
                <Activity className="w-3 h-3 text-[#0A7B54] animate-pulse" />
                Est. Delivery: {order.estimatedDelivery}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Expandable Detailed Milestones Accordion */}
      <AnimatePresence>
        {isDetailedViewOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden pt-2 border-t border-[#E8DFC8] dark:border-[#2E2620] space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-cinzel font-bold text-[#8C7A6B] dark:text-[#9E8E7C] uppercase tracking-wider">
                Fulfillment Milestones (4 Checkpoints)
              </span>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Carrier Verified
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {trackingMilestones.map((m, mIdx) => {
                const isDone = m.status === 'completed';
                const isWorking = m.status === 'in_progress';

                return (
                  <div
                    key={`atelier-milestone-${order.id}-${m.id}-${mIdx}`}
                    className={`p-3 rounded-xl border transition-all text-left relative ${
                      isWorking
                        ? 'bg-gradient-to-br from-[#FFF9EE] to-[#F6EDDB] dark:from-[#261E18] dark:to-[#1E1814] border-[#C59B27] shadow-xs'
                        : isDone
                        ? 'bg-[#F2ECE1]/60 dark:bg-[#1E1915]/60 border-[#DDD3BC] dark:border-[#2D241E]'
                        : 'bg-[#F7F2E8]/40 dark:bg-[#181411]/40 border-[#E8DFC8] dark:border-[#261F1A] opacity-75'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                            isDone
                              ? 'bg-[#C59B27] text-[#181411]'
                              : isWorking
                              ? 'bg-[#181411] text-[#F5D77F] border border-[#C59B27]'
                              : 'bg-[#DDD3BC] dark:bg-[#2A231D] text-[#7A6B5D]'
                          }`}
                        >
                          {isDone ? '✓' : m.phaseNumber}
                        </span>
                        <h5 className="font-cinzel text-xs font-semibold text-[#1E1A17] dark:text-[#FAF7F2] leading-tight">
                          {m.title}
                        </h5>
                      </div>

                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs shrink-0 font-semibold ${
                          isDone
                            ? 'bg-[#0A7B54]/15 text-[#0A7B54] dark:text-[#4ade80]'
                            : isWorking
                            ? 'bg-[#C59B27]/20 text-[#A07B18] dark:text-[#F5D77F] animate-pulse'
                            : 'bg-black/5 dark:bg-white/5 text-[#8C7E72]'
                        }`}
                      >
                        {isDone ? 'Completed' : isWorking ? 'In Progress' : 'Scheduled'}
                      </span>
                    </div>

                    <p className="text-[10px] text-[#7A6B5D] dark:text-[#A69788] font-sans-ui mt-1.5 leading-normal">
                      {m.detail}
                    </p>

                    <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[9.5px] text-[#8C7A6B] dark:text-[#9E8E7C] font-mono">
                      <span>📍 {m.carrier}</span>
                      <span className="font-semibold text-[#C59B27]">{m.timeSpent}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Fast Simulation Controls for Testing All Statuses */}
      {onUpdateStatus && (
        <div className="mt-3 pt-3 border-t border-[#E8DFC8] dark:border-[#2E2620] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[9.5px] font-cinzel uppercase font-semibold text-[#8C7E72] dark:text-[#9E8E7C]">
            Update Order Status:
          </span>
          <div className="flex items-center gap-1 flex-wrap">
            {STAGES.map((st, sIdx) => (
              <button
                key={`atelier-st-btn-${order.id}-${st.status}-${sIdx}`}
                type="button"
                onClick={() => {
                  hapticLight();
                  onUpdateStatus(order.id, st.status);
                }}
                className={`px-2 py-1 text-[9.5px] font-cinzel rounded-md border transition-all cursor-pointer ${
                  order.status === st.status
                    ? 'bg-[#C59B27] text-[#181411] border-[#C59B27] font-bold shadow-xs'
                    : 'bg-white dark:bg-[#1F1A16] text-[#594E43] dark:text-[#C5BAAC] border-[#DDD3BC] dark:border-[#382F26] hover:border-[#C59B27]'
                }`}
              >
                {st.shortLabel}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
