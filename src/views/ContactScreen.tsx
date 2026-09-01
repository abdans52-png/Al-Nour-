import React, { useState } from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { Mail, Phone, MapPin, MessageCircle, Clock, Sparkles, Send, Check, Instagram } from 'lucide-react';
import { ScreenType } from '../types';
import { apiSubmitContact } from '../utils/api';

interface ContactScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({ onNavigate }) => {
  const { siteContent } = useSiteContent();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Modest Styling & Sizing',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const contactEmail = siteContent.contactEmail || 'care@alnoureen.com';
  const contactPhone = siteContent.contactPhone || '+91 93262 94187';
  const whatsappNumber = siteContent.whatsappNumber || '+91 93262 94187';
  const cleanWhatsappNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const contactAddress = siteContent.contactAddress || 'Mumbai, Maharashtra, India — Specializing in Fine Modest Wear, Abayas & Bridal Lehengas';
  const contactHours = siteContent.contactHours || 'Mon – Sat: 10:00 AM – 8:00 PM IST';
  const instagramHandle = siteContent.instagramHandle || '@alnoureen.couture';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);

    // Dispatch inquiry to backend and Zapier webhook
    apiSubmitContact({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      inquiryType: formData.inquiryType,
      message: formData.message
    }).catch((err) => {
      console.warn('Contact submission notice:', err);
    });

    setTimeout(() => {
      setIsSent(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'Modest Styling & Sizing',
        message: ''
      });
    }, 3000);
  };

  return (
    <div id="screen-contact-al-noureen" className="w-full bg-[#FAF7F2] text-[#1E1A17] pb-16">
      {/* Hero */}
      <div className="bg-[#181411] text-[#FAF7F2] py-14 px-4 sm:px-6 text-center border-b border-[#C59B27]/40">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#28221D] border border-[#C59B27]/40 rounded-full text-[11px] font-sans-ui text-[#E8D59E] uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Atelier Concierge & Client Services
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wide text-white">
            Connect With {siteContent.brandName || 'AL-NOUREEN'}
          </h1>
          <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui max-w-xl mx-auto">
            Whether inquiring about bespoke bridal Pakistani outfits, choosing your abaya length, or tracking an existing package, our atelier is at your service.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Atelier Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="font-cinzel text-xl font-bold text-[#1E1A17]">
                Atelier Houses & Flagships
              </h2>
              <p className="text-xs text-[#7A6B5D] font-sans-ui mt-1">
                Private styling consultations by appointment.
              </p>
            </div>

            {/* WhatsApp VIP Card */}
            <div className="p-5 rounded-2xl bg-[#181411] text-[#FAF7F2] border border-[#C59B27]/40 space-y-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="font-cinzel text-sm font-bold text-[#E8D59E]">
                    Instant WhatsApp Concierge
                  </h3>
                  <p className="text-[10px] text-[#A69788]">Available 7 Days • {contactHours}</p>
                </div>
              </div>
              <p className="text-xs text-[#FAF7F2]/90 leading-relaxed font-sans-ui">
                Connect with our head stylists for live consultations, fabric swatches, and instant sizing guidance.
              </p>
              <a
                href={`https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent('Hello AL-NOUREEN, I would like styling consultation and assistance with your couture collection.')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-[#25D366] hover:bg-[#1EBE5B] text-white rounded-xl text-xs font-cinzel font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                Start WhatsApp Chat ({whatsappNumber})
              </a>
            </div>

            {/* Locations and Contact */}
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-[#F7F2E8] border border-[#DDD3BC] rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-cinzel font-bold text-[#1E1A17]">
                  <MapPin className="w-4 h-4 text-[#C59B27]" /> Head Atelier & Boutique
                </div>
                <p className="text-xs text-[#5E5043] font-sans-ui pl-6 leading-relaxed">
                  {contactAddress}
                </p>
              </div>

              <div className="p-4 bg-[#F7F2E8] border border-[#DDD3BC] rounded-2xl space-y-2 text-xs text-[#5E5043] font-sans-ui">
                <p className="flex items-center gap-2 font-medium text-[#1E1A17]">
                  <Mail className="w-4 h-4 text-[#C59B27]" /> {contactEmail}
                </p>
                <p className="flex items-center gap-2 font-medium text-[#1E1A17]">
                  <Phone className="w-4 h-4 text-[#C59B27]" /> {contactPhone}
                </p>
                {instagramHandle && (
                  <p className="flex items-center gap-2 font-medium text-[#1E1A17]">
                    <Instagram className="w-4 h-4 text-[#C59B27]" /> {instagramHandle}
                  </p>
                )}
                <p className="flex items-center gap-2 text-[#7A6B5D] pt-1 border-t border-[#DDD3BC]/60">
                  <Clock className="w-4 h-4 text-[#C59B27]" /> {contactHours}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Concierge Inquiry Form */}
          <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#E0D5BE] p-6 sm:p-8 rounded-3xl shadow-xs">
            <h2 className="font-cinzel text-xl font-bold text-[#1E1A17] mb-1">
              Send an Atelier Inquiry
            </h2>
            <p className="text-xs text-[#7A6B5D] font-sans-ui mb-6">
              Our styling team typically responds within 2 hours.
            </p>

            {isSent ? (
              <div className="p-8 text-center bg-[#F0EAE0] border border-[#C59B27]/40 rounded-2xl space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-[#181411] text-[#E8D59E] mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6 text-[#C59B27]" />
                </div>
                <h3 className="font-cinzel text-lg font-bold text-[#1E1A17]">
                  Inquiry Received with Honour
                </h3>
                <p className="text-xs text-[#5E5043] font-sans-ui max-w-md mx-auto">
                  A personal stylist from Maison AL-NOUREEN has been assigned to your request and will contact you via email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-cinzel font-semibold text-[#1E1A17] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Layla Al-Mansoor"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DDD3BC] rounded-xl text-xs text-[#1E1A17] focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-cinzel font-semibold text-[#1E1A17] block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="layla@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DDD3BC] rounded-xl text-xs text-[#1E1A17] focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-cinzel font-semibold text-[#1E1A17] block mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+971 50 123 4567"
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DDD3BC] rounded-xl text-xs text-[#1E1A17] focus:border-[#C59B27] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-cinzel font-semibold text-[#1E1A17] block mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#DDD3BC] rounded-xl text-xs text-[#1E1A17] focus:border-[#C59B27] focus:outline-hidden"
                    >
                      <option>Modest Styling & Sizing</option>
                      <option>Custom Bridal Pakistani Couture</option>
                      <option>Abaya Fabric & Length Consultation</option>
                      <option>International Shipping & Customs</option>
                      <option>Wholesale & Private Showrooms</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-cinzel font-semibold text-[#1E1A17] block mb-1">
                    Your Message / Styling Request *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the occasion, preferred colors, height/sizing requirements, or specific design inquiries..."
                    className="w-full px-3.5 py-2.5 bg-white border border-[#DDD3BC] rounded-xl text-xs text-[#1E1A17] focus:border-[#C59B27] focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C59B27]" />
                  <span>Submit Atelier Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
