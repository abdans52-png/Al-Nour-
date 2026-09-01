import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Plane,
  Truck,
  Building2,
  Home,
  CheckCircle2,
  Clock,
  Compass,
  Navigation,
  Sparkles,
  Info,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface TrackingVisualMapProps {
  order: Order;
  className?: string;
}

interface Waypoint {
  id: string;
  name: string;
  subhead: string;
  type: 'atelier' | 'airhub' | 'customs' | 'courier' | 'destination';
  city: string;
  x: number; // percentage on SVG
  y: number; // percentage on SVG
  timestamp: string;
  note: string;
  weather?: string;
}

export const TrackingVisualMap: React.FC<TrackingVisualMapProps> = ({ order, className = '' }) => {
  const [selectedWaypoint, setSelectedWaypoint] = useState<string | null>(null);

  // Determine numerical progress (0 to 100) based on order status
  const getStatusProgress = (status: OrderStatus): number => {
    switch (status) {
      case 'Order Placed':
        return 12;
      case 'In Atelier Tailoring':
        return 28;
      case 'Quality Inspection':
        return 42;
      case 'Shipped':
      case 'Dispatched':
        return 65;
      case 'Out for Delivery':
        return 88;
      case 'Delivered':
        return 100;
      default:
        return 35;
    }
  };

  const progressPct = getStatusProgress(order.status);

  // Defined luxury route waypoints
  const destinationCity = order.shippingAddress.city || 'Mumbai';
  const destinationCountry = order.shippingAddress.country || 'India';

  const waypoints: Waypoint[] = [
    {
      id: 'wp-1',
      name: 'Mumbai Master Atelier',
      subhead: 'Master Zari Weaving & Tagging',
      type: 'atelier',
      city: 'Mumbai Master Atelier',
      x: 10,
      y: 70,
      timestamp: 'Day 1 • 09:30 AM',
      note: 'Garment handcrafted, hand-pressed, and encased in luxury breathable keepsake dustbag.',
      weather: '28°C Pleasant'
    },
    {
      id: 'wp-2',
      name: 'DHL Express Air Terminal',
      subhead: 'Direct Airfreight Manifest Scanned',
      type: 'airhub',
      city: 'Intl Aviation Air Hub',
      x: 32,
      y: 30,
      timestamp: 'Day 2 • 02:15 PM',
      note: 'Air waybill generated and loaded into DHL Boeing 777F priority temperature-controlled cargo hold.',
      weather: '19°C Clear Skies'
    },
    {
      id: 'wp-3',
      name: 'Customs & Regional Gateway',
      subhead: 'Import Inspection & Duty Cleared',
      type: 'customs',
      city: `${destinationCity} Gateway Hub`,
      x: 58,
      y: 65,
      timestamp: 'Day 3 • 11:45 PM',
      note: 'Priority diplomatic clearance completed without duties hold.',
      weather: '27°C Moderate'
    },
    {
      id: 'wp-4',
      name: 'Local Courier Dispatch Depot',
      subhead: 'Assigned to Dedicated Courier',
      type: 'courier',
      city: `${destinationCity} Metro Station`,
      x: 78,
      y: 35,
      timestamp: 'Today • 08:30 AM',
      note: 'Van dispatch ID #DHL-994. Courier handling silk/velvet sealed packaging.',
      weather: '28°C Fair'
    },
    {
      id: 'wp-5',
      name: 'Customer Residence',
      subhead: 'Final Handover with OTP / Signature',
      type: 'destination',
      city: `${order.shippingAddress.street}, ${destinationCity}`,
      x: 92,
      y: 68,
      timestamp: order.status === 'Delivered' ? 'Delivered' : order.estimatedDelivery || 'Arriving Soon',
      note: 'White-glove doorstep delivery directly to recipient.',
      weather: '28°C Fair'
    }
  ];

  // Active waypoint index based on status progress
  const activeWpIndex =
    progressPct >= 100
      ? 4
      : progressPct >= 85
      ? 3
      : progressPct >= 60
      ? 2
      : progressPct >= 30
      ? 1
      : 0;

  // Active waypoint details
  const activeWp = waypoints[activeWpIndex];
  const highlightedWp = waypoints.find((w) => w.id === selectedWaypoint) || activeWp;

  // Calculate courier coordinates along the bezier curve
  // Route curve formula: (x, y) approximation based on progress
  const getCourierPos = (pct: number) => {
    // 5 segments across 100%
    const normalized = Math.max(0, Math.min(100, pct)) / 100;
    // Cubic bezier interpolation approximation across the 5 nodes
    const x = 10 + normalized * (92 - 10);
    // Sine wave oscillation to create fluid aerial transit arch
    const y = 50 + Math.sin(normalized * Math.PI * 2.5) * 22;
    return { x, y };
  };

  const courierPos = getCourierPos(progressPct);

  return (
    <div
      id="tracking-visual-map"
      className={`relative w-full bg-[#120F0D] rounded-3xl border border-[#C59B27]/50 shadow-2xl overflow-hidden text-[#FAF7F2] ${className}`}
    >
      {/* Top Map HUD Bar */}
      <div className="p-4 sm:p-5 bg-[#1A1512] border-b border-[#C59B27]/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#241E1A] border border-[#C59B27]/60 flex items-center justify-center text-[#F5D77F] shadow-xs">
            <Compass className="w-5 h-5 animate-spin-slow text-[#D4AF37]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-cinzel uppercase font-bold tracking-widest text-[#D4AF37]">
                Live Satellite Transit Radar
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0E3827] border border-[#25D366]/50 text-[9px] font-sans-ui text-[#38D39F] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-ping" />
                Active Link
              </span>
            </div>
            <h4 className="font-playfair text-base sm:text-lg font-bold text-[#FAF7F2]">
              Consignment Route: Atelier → {destinationCity}
            </h4>
          </div>
        </div>

        {/* Real-time stats */}
        <div className="flex items-center gap-4 text-xs font-sans-ui">
          <div className="bg-[#241E1A] px-3 py-1.5 rounded-xl border border-[#3D332B] text-right">
            <span className="text-[9.5px] uppercase font-cinzel text-[#A69788] block">ETA Window</span>
            <span className="font-serif font-bold text-[#F5D77F]">
              {order.status === 'Delivered' ? 'Completed' : order.estimatedDelivery.split('via')[0] || 'On Schedule'}
            </span>
          </div>

          <div className="bg-[#241E1A] px-3 py-1.5 rounded-xl border border-[#3D332B] text-right">
            <span className="text-[9.5px] uppercase font-cinzel text-[#A69788] block">Transit Completion</span>
            <span className="font-mono font-bold text-[#38D39F]">{progressPct}%</span>
          </div>
        </div>
      </div>

      {/* Cartographic Visual Canvas */}
      <div className="relative w-full h-80 sm:h-96 overflow-hidden bg-[#100D0B] select-none">
        {/* Map Background Textures & Latitude Grids */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(197, 155, 39, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(197, 155, 39, 0.1) 0%, transparent 60%),
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px'
          }}
        />

        {/* Decorative Compass Rose */}
        <div className="absolute top-4 right-4 text-[#C59B27]/20 pointer-events-none">
          <Navigation className="w-20 h-20 transform -rotate-45" />
        </div>

        {/* SVG Route Canvas */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1000 400"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8C6B1B" />
              <stop offset="50%" stopColor="#F5D77F" />
              <stop offset="100%" stopColor="#38D39F" />
            </linearGradient>

            <linearGradient id="uncompletedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A3F35" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#2E2620" stopOpacity="0.3" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Full Planned Route Curve */}
          <path
            d="M 100 280 C 220 100, 420 300, 580 260 C 680 230, 800 120, 920 272"
            fill="none"
            stroke="url(#uncompletedGradient)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Active / Traversed Route Curve (interpolated glow path) */}
          <path
            d="M 100 280 C 220 100, 420 300, 580 260 C 680 230, 800 120, 920 272"
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="4"
            filter="url(#glow)"
            strokeDasharray="1200"
            strokeDashoffset={1200 - (progressPct / 100) * 1200}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Interactive Waypoints */}
        {waypoints.map((wp, idx) => {
          const isPassed = idx <= activeWpIndex;
          const isCurrent = idx === activeWpIndex;
          const isSelected = selectedWaypoint === wp.id;

          const IconComponent =
            wp.type === 'atelier'
              ? Building2
              : wp.type === 'airhub'
              ? Plane
              : wp.type === 'customs'
              ? ShieldCheck
              : wp.type === 'courier'
              ? Truck
              : Home;

          return (
            <div
              key={`tracking-wp-${order.id || 'order'}-${wp.id}-${idx}`}
              onClick={() => setSelectedWaypoint(wp.id)}
              style={{ left: `${wp.x}%`, top: `${wp.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
            >
              {/* Radar Pulsing Wave for Active Node */}
              {isCurrent && (
                <div className="absolute -inset-3 rounded-full bg-[#C59B27]/30 animate-ping pointer-events-none" />
              )}

              {/* Waypoint Marker Pin */}
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center transition-all duration-300 border shadow-lg ${
                  isCurrent
                    ? 'bg-[#F5D77F] text-[#14100D] border-white ring-4 ring-[#C59B27]/40 scale-110'
                    : isPassed
                    ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27]'
                    : 'bg-[#201A15] text-[#7A6B5D] border-[#3D332B]'
                }`}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>

              {/* Waypoint Label Badge */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap text-center pointer-events-none">
                <span
                  className={`text-[10px] sm:text-xs font-cinzel font-bold block px-2 py-0.5 rounded-md border backdrop-blur-xs transition-colors ${
                    isSelected || isCurrent
                      ? 'bg-[#181411]/95 text-[#F5D77F] border-[#C59B27]'
                      : isPassed
                      ? 'bg-[#14100D]/80 text-[#FAF7F2] border-[#3D332B]'
                      : 'bg-[#14100D]/60 text-[#8C7A6B] border-transparent'
                  }`}
                >
                  {wp.name}
                </span>
                <span className="text-[9px] text-[#A69788] font-sans-ui hidden sm:block">
                  {wp.city}
                </span>
              </div>
            </div>
          );
        })}

        {/* Animated Moving Courier Marker */}
        <motion.div
          animate={{
            left: `${courierPos.x}%`,
            top: `${courierPos.y}%`
          }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#181411] border-2 border-[#25D366] text-[#25D366] flex items-center justify-center shadow-2xl ring-4 ring-[#25D366]/30">
              {progressPct < 60 ? (
                <Plane className="w-5 h-5 transform rotate-12 text-[#F5D77F]" />
              ) : (
                <Truck className="w-5 h-5 text-[#25D366]" />
              )}
            </div>

            {/* Courier Tooltip floating */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#25D366] text-[#0A2E1A] font-cinzel font-bold text-[9px] rounded-full whitespace-nowrap shadow-md">
              LIVE CARRIER
            </div>
          </div>
        </motion.div>
      </div>

      {/* Waypoint Details Drawer / Interactive Inspector */}
      <div className="p-4 sm:p-5 bg-[#161210] border-t border-[#C59B27]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-cinzel uppercase font-bold text-[#D4AF37] px-2 py-0.5 bg-[#241E1A] rounded-md border border-[#C59B27]/40">
                Checkpoint {waypoints.findIndex((w) => w.id === highlightedWp.id) + 1} of {waypoints.length}
              </span>
              <span className="text-xs text-[#A69788] font-sans-ui">• {highlightedWp.timestamp}</span>
              {highlightedWp.weather && (
                <span className="text-xs text-[#8C7A6B] font-sans-ui hidden md:inline">
                  • Weather: {highlightedWp.weather}
                </span>
              )}
            </div>

            <h3 className="font-playfair text-base sm:text-lg font-bold text-[#FAF7F2]">
              {highlightedWp.name} ({highlightedWp.city})
            </h3>
            <p className="text-xs text-[#C5BAAC] font-sans-ui max-w-2xl leading-relaxed">
              {highlightedWp.note}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-[#201A15] border border-[#3D332B] text-right">
              <span className="text-[9.5px] uppercase font-cinzel text-[#8C7A6B] block">Tracking Code</span>
              <span className="font-mono text-xs font-bold text-[#F5D77F]">
                {order.trackingNumber}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
