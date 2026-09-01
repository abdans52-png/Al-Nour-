import React, { useState, useEffect } from 'react';
import {
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  RefreshCw,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Send,
  Sparkles,
  Layers,
  ArrowRight,
  Bell,
  Mail,
  ShoppingBag,
  Clock,
  Code
} from 'lucide-react';
import { ZAPIER_WEBHOOK_URL, sendTestZapierPing, getZapierStatus, ZapierWebhookLog } from '../utils/zapier';
import { hapticLight, hapticSuccess } from '../utils/haptics';

export const AdminZapierManager: React.FC = () => {
  const [logs, setLogs] = useState<ZapierWebhookLog[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStatus = async () => {
    setIsLoading(true);
    try {
      const res = await getZapierStatus();
      if (res && res.recentLogs) {
        setLogs(res.recentLogs);
      }
    } catch (err) {
      console.warn('Failed to fetch Zapier status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleCopyUrl = () => {
    hapticLight();
    navigator.clipboard.writeText(ZAPIER_WEBHOOK_URL);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleTestPing = async () => {
    hapticLight();
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await sendTestZapierPing();
      if (res.success) {
        hapticSuccess();
        setTestResult({
          success: true,
          message: res.message || 'Test event delivered to Zapier Webhook (HTTP 200)!'
        });
      } else {
        setTestResult({
          success: false,
          message: res.error || 'Failed to deliver test event to Zapier.'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Error executing test ping.'
      });
    } finally {
      setIsTesting(false);
      fetchStatus();
    }
  };

  const EVENT_TRIGGERS = [
    {
      event: 'order.created',
      title: 'New Order Placed',
      description: 'Dispatches full client details, items breakdown, shipping address, totals, and payment status.',
      icon: ShoppingBag,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      event: 'order.status_updated',
      title: 'Order Status & Tracking Updated',
      description: 'Triggers when order transitions to Confirmed, In Atelier, Shipped, or Delivered.',
      icon: Clock,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
    },
    {
      event: 'contact.submitted',
      title: 'Concierge Inquiry Received',
      description: 'Forwards contact form messages, client styling requests, and custom tailoring inquiries.',
      icon: Mail,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    },
    {
      event: 'newsletter.subscribed',
      title: 'Maison Private Circle Subscription',
      description: 'Forwards new VIP subscriber emails for welcome drips and marketing campaigns.',
      icon: Sparkles,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
    },
    {
      event: 'stock_notification.requested',
      title: 'Restock Notification Request',
      description: 'Sends alerts when shoppers sign up for out-of-stock sizes or colors.',
      icon: Bell,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    },
    {
      event: 'price_drop.requested',
      title: 'Price Drop Alert Signup',
      description: 'Captures target discounts and shopper emails for flash deal follow-ups.',
      icon: Layers,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
    },
    {
      event: 'fabric_swatch.requested',
      title: 'Fabric Swatch Delivery Request',
      description: 'Sends shipping address & bespoke color choices for velvet, silk, and organza swatches.',
      icon: Send,
      color: 'text-[#C59B27] bg-[#C59B27]/10 border-[#C59B27]/30'
    }
  ];

  return (
    <div id="admin-zapier-integration-panel" className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#181411] border border-[#2E2620] rounded-2xl p-6 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-linear-to-bl from-[#C59B27]/10 to-transparent rounded-full pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#28221D] border border-[#C59B27]/40 text-[#E8D59E] text-[11px] font-sans-ui font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-[#C59B27] animate-pulse" />
              Automations & Webhooks
            </div>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#FAF7F2]">
              Zapier Automation Hub
            </h2>
            <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui">
              Seamlessly streams real-time orders, concierge inquiries, stock alerts, and swatch requests directly into your Zapier workflows, Google Sheets, Slack, Klaviyo, and WhatsApp bots.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestPing}
              disabled={isTesting}
              className="px-4 py-2.5 bg-linear-to-r from-[#C59B27] to-[#D4AF37] hover:from-[#B08920] hover:to-[#C59B27] text-[#14100D] font-cinzel font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Test Ping...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Send Test Ping</span>
                </>
              )}
            </button>

            <button
              onClick={fetchStatus}
              disabled={isLoading}
              className="p-2.5 bg-[#221C17] hover:bg-[#2E2620] text-[#C5BAAC] hover:text-[#FAF7F2] border border-[#3A3027] rounded-xl transition-all cursor-pointer"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Test Result Toast */}
        {testResult && (
          <div
            className={`mt-5 p-3.5 rounded-xl border flex items-start gap-3 text-xs font-sans-ui animate-in fade-in duration-200 ${
              testResult.success
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <span className="font-semibold">{testResult.success ? 'Success: ' : 'Notice: '}</span>
              {testResult.message}
            </div>
            <button
              onClick={() => setTestResult(null)}
              className="text-[#C5BAAC] hover:text-white text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Webhook URL Endpoint Box */}
      <div className="bg-[#181411] border border-[#2E2620] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-cinzel font-semibold text-[#FAF7F2]">
            <Code className="w-4 h-4 text-[#C59B27]" />
            <span>Active Webhook Catch Endpoint</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-sans-ui font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Connected & Live
          </span>
        </div>

        <div className="flex items-center gap-2 bg-[#100D0B] border border-[#2E2620] rounded-xl p-2.5">
          <input
            type="text"
            readOnly
            value={ZAPIER_WEBHOOK_URL}
            className="flex-1 bg-transparent text-xs font-mono text-[#E8D59E] outline-hidden select-all"
          />
          <button
            onClick={handleCopyUrl}
            className="px-3 py-1.5 bg-[#28221D] hover:bg-[#342C25] text-xs font-sans-ui text-[#FAF7F2] border border-[#3E342B] rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Copy URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid of Automated Triggers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-cinzel text-base font-bold text-[#FAF7F2] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C59B27]" />
            <span>Automated Event Stream Triggers</span>
          </h3>
          <span className="text-xs text-[#C5BAAC] font-sans-ui">
            7 Native Event Types
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {EVENT_TRIGGERS.map((trig, tIdx) => {
            const Icon = trig.icon;
            return (
              <div
                key={`zap-trig-${trig.event}-${tIdx}`}
                className="bg-[#181411] border border-[#2E2620] rounded-xl p-4 space-y-2 hover:border-[#3E342B] transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${trig.color}`}>
                    <Icon className="w-3 h-3" />
                    {trig.event}
                  </span>
                  <span className="text-[10px] font-sans-ui text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
                <h4 className="font-cinzel text-xs font-bold text-[#FAF7F2]">{trig.title}</h4>
                <p className="text-[11px] text-[#A69989] font-sans-ui leading-relaxed">
                  {trig.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Webhook Activity History */}
      <div className="bg-[#181411] border border-[#2E2620] rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-cinzel text-sm font-bold text-[#FAF7F2] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C59B27]" />
            <span>Recent Webhook Dispatch Log</span>
          </h3>
          <span className="text-[11px] text-[#8C8072] font-sans-ui">
            Showing last {logs.length} dispatches
          </span>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center bg-[#14100D] border border-dashed border-[#2E2620] rounded-xl text-xs text-[#8C8072] font-sans-ui space-y-2">
            <Zap className="w-6 h-6 text-[#C59B27]/40 mx-auto" />
            <p>No webhook dispatches recorded in this server session yet.</p>
            <p className="text-[11px] text-[#C5BAAC]">
              Click <strong className="text-white">"Send Test Ping"</strong> above or place a test order to see live dispatches.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {logs.map((log, lIdx) => (
              <div
                key={`zap-log-${log.id || lIdx}-${lIdx}`}
                className="bg-[#14100D] border border-[#2E2620] rounded-xl p-3 flex items-center justify-between text-xs font-sans-ui"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      log.status === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-[#FAF7F2] text-[11px]">{log.event}</span>
                    <p className="text-[10px] text-[#8C8072]">{log.summary}</p>
                  </div>
                </div>

                <div className="text-right space-y-0.5">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-sm ${
                      log.status === 'success'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {log.statusCode ? `HTTP ${log.statusCode}` : log.status.toUpperCase()}
                  </span>
                  <p className="text-[9px] text-[#6E6356] font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
