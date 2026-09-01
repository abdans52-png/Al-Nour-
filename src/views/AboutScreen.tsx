import React from 'react';
import { useSiteContent } from '../context/SiteContentContext';
import { Logo } from '../components/Logo';
import { Sparkles, Heart, Shield, Award, ArrowRight, MessageCircle } from 'lucide-react';
import { ScreenType, Currency } from '../types';
import { VideoTestimonialsSection } from '../components/VideoTestimonialsSection';

interface AboutScreenProps {
  onNavigate: (screen: ScreenType) => void;
  currency?: Currency;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onNavigate, currency = 'INR' }) => {
  const { siteContent } = useSiteContent();

  const heroBadge = siteContent.aboutHeroBadge || 'The Story of AL-NOUREEN';
  const heroTitle = siteContent.aboutHeroTitle || 'Two Lights. One Beautiful Vision.';
  const heroSubtitle = siteContent.aboutHeroSubtitle || 'Illuminating the path where modesty meets haute couture.';
  const heroArabic = siteContent.aboutHeroArabic || 'النورين — النور والوقار في حلة ملكية';

  const ethosTitle = siteContent.aboutEthosTitle || 'The Meaning of Al-Noureen (النورين)';
  const ethosDesc = siteContent.aboutEthosDesc || 'In the Arabic tongue, Al-Noureen (النورين) translates to "The Two Lights". For us, these two twin beams of radiant illumination represent the eternal dialogue between heritage craftsmanship and modern dignified elegance.';

  const p1Title = siteContent.aboutPillar1Title || 'Tradition & Modernity';
  const p1Desc = siteContent.aboutPillar1Desc || 'Honoring centuries-old Mughal zardozi, hand-shadow chikankari, and regal craftsmanship, distilled into sleek modern silhouettes for today’s global lifestyle.';

  const p2Title = siteContent.aboutPillar2Title || 'Modesty & Elegance';
  const p2Desc = siteContent.aboutPillar2Desc || 'Believing that true beauty never requires compromising one’s modesty. Dignified floor-length drapes, non-sheer textiles, and generous cuts.';

  const p3Title = siteContent.aboutPillar3Title || 'Heritage & Contemporary Fashion';
  const p3Desc = siteContent.aboutPillar3Desc || 'Harmonizing authentic South Asian handwork with Parisian minimalist tailoring, breathable European linens, and Grade 6A pure mulberry silks.';

  const artisanTitle = siteContent.aboutArtisanTitle || 'Craftsmanship Preserved with Dignity';
  const artisanDesc = siteContent.aboutArtisanDesc || 'Every AL-NOUREEN garment begins in our dedicated master atelier located in Mumbai, India. We work hand-in-hand with multi-generational karigars whose lineages have perfected the art of real gold-plated zardozi needlework.';

  const nasreenQuote = siteContent.aboutNasreenQuote || 'Every stitch in our atelier is a tribute to womanhood, spirituality, and grace. We design for the woman who carries both royal heritage and contemporary dignity with pride.';
  const nasreenTitle = siteContent.aboutNasreenTitle || 'Nasreen, Founder & Creative Director';

  return (
    <div id="screen-about-al-noureen" className="w-full bg-[#FAF7F2] text-[#1E1A17] pb-16">
      {/* Editorial Hero Banner */}
      <div className="relative w-full bg-[#181411] text-[#FAF7F2] py-20 px-4 sm:px-6 overflow-hidden border-b border-[#C59B27]/40 text-center">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#28221D] border border-[#C59B27]/40 rounded-full text-[11px] font-sans-ui text-[#E8D59E] uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> {heroBadge}
          </div>

          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-white">
            {heroTitle}
          </h1>

          <p className="font-serif text-lg sm:text-xl text-[#E8D59E] italic">
            {heroArabic} — {heroSubtitle}
          </p>
        </div>

        {/* Ambient Decorative Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Narrative Article */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 space-y-14">
        {/* Section 1: The Meaning of Al-Noureen (النورين) */}
        <div className="bg-[#FAF7F2] border border-[#E0D5BE] p-6 sm:p-10 rounded-3xl shadow-xs space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-cinzel uppercase tracking-widest text-[#8C6B1B] font-bold">
              Our Name & Ethos
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1A17]">
              {ethosTitle}
            </h2>
            <div className="w-16 h-0.5 bg-[#C59B27] mx-auto my-2" />
          </div>

          <p className="text-sm sm:text-base font-sans-ui text-[#4A3E34] leading-relaxed text-justify">
            {ethosDesc}
          </p>

          {/* Three Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-[#F0EAE0] border border-[#C59B27]/30 space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-[#181411] text-[#E8D59E] flex items-center justify-center font-cinzel font-bold text-xs">
                I
              </div>
              <h3 className="font-cinzel font-bold text-sm text-[#1E1A17]">
                {p1Title}
              </h3>
              <p className="text-xs text-[#6E6053] leading-relaxed font-sans-ui">
                {p1Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F0EAE0] border border-[#C59B27]/30 space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-[#181411] text-[#E8D59E] flex items-center justify-center font-cinzel font-bold text-xs">
                II
              </div>
              <h3 className="font-cinzel font-bold text-sm text-[#1E1A17]">
                {p2Title}
              </h3>
              <p className="text-xs text-[#6E6053] leading-relaxed font-sans-ui">
                {p2Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F0EAE0] border border-[#C59B27]/30 space-y-2.5">
              <div className="w-8 h-8 rounded-full bg-[#181411] text-[#E8D59E] flex items-center justify-center font-cinzel font-bold text-xs">
                III
              </div>
              <h3 className="font-cinzel font-bold text-sm text-[#1E1A17]">
                {p3Title}
              </h3>
              <p className="text-xs text-[#6E6053] leading-relaxed font-sans-ui">
                {p3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: The Artisan Atelier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-md aspect-4/5 bg-[#181411]">
            <img
              src="https://images.unsplash.com/photo-1596783074918-c84cb06531ca?auto=format&fit=crop&w=800&q=85"
              alt="Artisan Karigar at work"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[10px] uppercase font-cinzel tracking-widest text-[#E8D59E]">
                Mumbai Atelier
              </span>
              <p className="font-serif text-sm font-semibold text-white">
                Master karigars hand-applying antique tilla and bullion beads.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-cinzel uppercase tracking-widest text-[#8C6B1B] font-bold">
              Ethical Haute Couture
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#1E1A17]">
              {artisanTitle}
            </h2>
            <p className="text-sm font-sans-ui text-[#54463A] leading-relaxed">
              {artisanDesc}
            </p>
            <p className="text-sm font-sans-ui text-[#54463A] leading-relaxed">
              A single festive ensemble can take between 80 to 160 hours of focused handwork. When you wear AL-NOUREEN, you are carrying forward a living legacy of artistic dignity.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-cinzel font-semibold text-[#1E1A17]">
                <Award className="w-4 h-4 text-[#C59B27]" /> 100% Pure Natural Fibers
              </div>
              <div className="flex items-center gap-2 text-xs font-cinzel font-semibold text-[#1E1A17]">
                <Shield className="w-4 h-4 text-[#C59B27]" /> Fair Trade Certified
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Video Testimonials Section */}
        <VideoTestimonialsSection onNavigate={onNavigate} currency={currency} />

        {/* Section 4: Founder's Note */}
        <div className="bg-[#181411] text-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#C59B27]/40 relative overflow-hidden space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#28221D] border border-[#C59B27]/40 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#C59B27]" />
            </div>
            <div>
              <h3 className="font-cinzel text-lg font-bold text-[#E8D59E]">
                A Note from the Creative Director
              </h3>
              <p className="text-xs text-[#A69788] font-sans-ui">{nasreenTitle}</p>
            </div>
          </div>

          <blockquote className="font-serif text-base sm:text-lg italic text-[#FAF7F2]/90 leading-relaxed pl-4 border-l-2 border-[#C59B27]">
            “{nasreenQuote}”
          </blockquote>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('pakistani')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel font-semibold text-xs tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
          >
            Explore Pakistani Collection <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('abayas')}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#F0EAE0] hover:bg-[#E2D8C7] text-[#1E1A17] border border-[#DDD3BC] rounded-xl font-cinzel font-semibold text-xs tracking-wider transition-all cursor-pointer hover:scale-[1.02]"
          >
            Discover Haute Abayas
          </button>
        </div>
      </div>
    </div>
  );
};
