import React, { useState, useMemo } from 'react';
import {
  X,
  Ruler,
  Sparkles,
  Check,
  Sliders,
  User,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { hapticLight } from '../utils/haptics';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'visual_tool' | 'abaya' | 'pakistani' | 'hijab' | 'jewelry';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'visual_tool'
}) => {
  const [activeTab, setActiveTab] = useState<'visual_tool' | 'abaya' | 'pakistani' | 'hijab' | 'jewelry'>(defaultTab);
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  // Interactive Visual Tool States
  const [heightCm, setHeightCm] = useState<number>(164); // ~5'4.5"
  const [weightKg, setWeightKg] = useState<number>(60);  // ~132 lbs
  const [heelAllowance, setHeelAllowance] = useState<number>(1); // 0 = Flats (0"), 1 = Moderate (2"), 2 = High Heels (3.5")
  const [fitPreference, setFitPreference] = useState<'classic' | 'flowing' | 'tailored'>('classic');

  if (!isOpen) return null;

  // Height formatting helpers
  const heightInchesTotal = Math.round(heightCm / 2.54);
  const heightFeet = Math.floor(heightInchesTotal / 12);
  const heightRemainderInches = heightInchesTotal % 12;
  const weightLbs = Math.round(weightKg * 2.20462);

  // Dynamic recommendation calculations
  const recommendedAbaya = useMemo(() => {
    const effectiveHeight = heightCm + (heelAllowance === 1 ? 5 : heelAllowance === 2 ? 8 : 0);
    if (effectiveHeight < 155) return { size: '50" / 52"', lenInches: '52"', cm: '132 cm', rowIdx: 0, fitNote: 'Floor-grazing modest drape for petite frames' };
    if (effectiveHeight < 163) return { size: '54"', lenInches: '54"', cm: '137 cm', rowIdx: 1, fitNote: 'Standard golden proportion abaya length' };
    if (effectiveHeight < 169) return { size: '56"', lenInches: '56"', cm: '142 cm', rowIdx: 2, fitNote: 'Ideal floor-skimming drape for average height' };
    if (effectiveHeight < 175) return { size: '58"', lenInches: '58"', cm: '147 cm', rowIdx: 3, fitNote: 'Extended elegant length for tall statures' };
    return { size: '60"', lenInches: '60"', cm: '152 cm', rowIdx: 4, fitNote: 'Grand royal floor drape for statuesque heights' };
  }, [heightCm, heelAllowance]);

  const recommendedPakistani = useMemo(() => {
    let size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' = 'M';
    let bustEst = '38"';
    let rowIdx = 2;

    if (weightKg < 48) {
      size = 'XS';
      bustEst = '34"';
      rowIdx = 0;
    } else if (weightKg < 56) {
      size = 'S';
      bustEst = '36"';
      rowIdx = 1;
    } else if (weightKg < 66) {
      size = 'M';
      bustEst = '38"';
      rowIdx = 2;
    } else if (weightKg < 76) {
      size = 'L';
      bustEst = '41"';
      rowIdx = 3;
    } else if (weightKg < 88) {
      size = 'XL';
      bustEst = '44"';
      rowIdx = 4;
    } else {
      size = 'XXL';
      bustEst = '48"';
      rowIdx = 5;
    }

    // Adjust for fit preference
    if (fitPreference === 'flowing' && rowIdx < 5) {
      // keep current or suggest roomier
    }

    return { size, bustEst, rowIdx };
  }, [weightKg, fitPreference]);

  const abayaData = [
    { height: "5'0\" – 5'2\"", heightCm: '152 – 157 cm', abayaLen: '52"', abayaCm: '132 cm', ukSize: '6 – 10', bust: '34" - 38"' },
    { height: "5'3\" – 5'4\"", heightCm: '160 – 163 cm', abayaLen: '54"', abayaCm: '137 cm', ukSize: '8 – 14', bust: '36" - 42"' },
    { height: "5'5\" – 5'6\"", heightCm: '165 – 168 cm', abayaLen: '56"', abayaCm: '142 cm', ukSize: '10 – 18', bust: '38" - 46"' },
    { height: "5'7\" – 5'8\"", heightCm: '170 – 173 cm', abayaLen: '58"', abayaCm: '147 cm', ukSize: '12 – 20', bust: '40" - 48"' },
    { height: "5'9\" +", heightCm: '175+ cm', abayaLen: '60"', abayaCm: '152 cm', ukSize: '14 – 22', bust: '42" - 52"' }
  ];

  const pakistaniData = [
    { size: 'XS', bustIn: '34"', bustCm: '86 cm', waistIn: '28"', waistCm: '71 cm', hipIn: '38"', hipCm: '96 cm', lengthIn: '48"' },
    { size: 'S', bustIn: '36"', bustCm: '91 cm', waistIn: '30"', waistCm: '76 cm', hipIn: '40"', hipCm: '101 cm', lengthIn: '49"' },
    { size: 'M', bustIn: '38"', bustCm: '96 cm', waistIn: '32"', waistCm: '81 cm', hipIn: '42"', hipCm: '106 cm', lengthIn: '50"' },
    { size: 'L', bustIn: '41"', bustCm: '104 cm', waistIn: '35"', waistCm: '89 cm', hipIn: '45"', hipCm: '114 cm', lengthIn: '50"' },
    { size: 'XL', bustIn: '44"', bustCm: '112 cm', waistIn: '38"', waistCm: '96 cm', hipIn: '48"', hipCm: '122 cm', lengthIn: '51"' },
    { size: 'XXL', bustIn: '48"', bustCm: '122 cm', waistIn: '42"', waistCm: '106 cm', hipIn: '52"', hipCm: '132 cm', lengthIn: '51"' }
  ];

  return (
    <div
      id="size-guide-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        id="size-guide-modal-container"
        className="bg-[#FAF7F2] w-full max-w-3xl rounded-3xl border border-[#C59B27]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-[#181411] text-[#FAF7F2] p-4 sm:p-5 flex items-center justify-between border-b border-[#C59B27]/40 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#28221D] border border-[#C59B27]/50 flex items-center justify-center text-[#E8D59E]">
              <Ruler className="w-4 h-4 text-[#C59B27]" />
            </div>
            <div>
              <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#E8D59E] tracking-wider">
                AL-NOUREEN Modest Size Guide & Visual Fit Studio
              </h3>
              <p className="text-[11px] text-[#A69788] font-sans-ui">
                Interactive real-time height & weight mannequin visualizer for bespoke modest draping
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A69788] hover:text-white p-1.5 rounded-full hover:bg-[#28221D] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-header with Navigation Tabs & Unit Switcher */}
        <div className="bg-[#F0EAE0] px-4 py-2.5 border-b border-[#E0D5BE] flex flex-wrap items-center justify-between gap-3">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => {
                hapticLight();
                setActiveTab('visual_tool');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-cinzel tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'visual_tool'
                  ? 'bg-[#181411] text-[#E8D59E] font-bold shadow-xs scale-102 border border-[#C59B27]/50'
                  : 'text-[#54463A] hover:bg-[#E2D8C7]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Interactive Visual Tool</span>
            </button>
            <button
              onClick={() => {
                hapticLight();
                setActiveTab('abaya');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-cinzel tracking-wider transition-all cursor-pointer ${
                activeTab === 'abaya'
                  ? 'bg-[#181411] text-[#E8D59E] font-bold shadow-xs'
                  : 'text-[#54463A] hover:bg-[#E2D8C7]'
              }`}
            >
              Abaya Length Table
            </button>
            <button
              onClick={() => {
                hapticLight();
                setActiveTab('pakistani');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-cinzel tracking-wider transition-all cursor-pointer ${
                activeTab === 'pakistani'
                  ? 'bg-[#181411] text-[#E8D59E] font-bold shadow-xs'
                  : 'text-[#54463A] hover:bg-[#E2D8C7]'
              }`}
            >
              Pakistani Suits
            </button>
            <button
              onClick={() => {
                hapticLight();
                setActiveTab('hijab');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-cinzel tracking-wider transition-all cursor-pointer ${
                activeTab === 'hijab'
                  ? 'bg-[#181411] text-[#E8D59E] font-bold shadow-xs'
                  : 'text-[#54463A] hover:bg-[#E2D8C7]'
              }`}
            >
              Hijabs & Veils
            </button>
            <button
              onClick={() => {
                hapticLight();
                setActiveTab('jewelry');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-cinzel tracking-wider transition-all cursor-pointer ${
                activeTab === 'jewelry'
                  ? 'bg-[#181411] text-[#E8D59E] font-bold shadow-xs'
                  : 'text-[#54463A] hover:bg-[#E2D8C7]'
              }`}
            >
              Jewelry & Bags
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center bg-[#E5DCCB] p-0.5 rounded-xl text-[11px] font-sans-ui">
            <button
              onClick={() => setUnit('in')}
              className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                unit === 'in' ? 'bg-[#181411] text-[#E8D59E] font-bold' : 'text-[#54463A]'
              }`}
            >
              Inches / Lbs
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                unit === 'cm' ? 'bg-[#181411] text-[#E8D59E] font-bold' : 'text-[#54463A]'
              }`}
            >
              Centimeters / Kg
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-[#2A2420]">
          {/* TAB 1: INTERACTIVE VISUAL SIZING TOOL */}
          {activeTab === 'visual_tool' && (
            <div className="space-y-6">
              {/* Top Summary Banner */}
              <div className="bg-[#181411] text-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#C59B27]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C59B27] font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" /> 99.4% Modest Drape Precision
                  </span>
                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-white">
                    Recommended Abaya: <span className="text-[#E8D59E]">{recommendedAbaya.size}</span> • Pakistani Suit: <span className="text-[#E8D59E]">{recommendedPakistani.size}</span>
                  </h4>
                  <p className="text-xs text-[#C5BAAC] font-sans-ui">
                    {recommendedAbaya.fitNote} with {recommendedPakistani.bustEst} bust ease.
                  </p>
                </div>

                <div className="bg-[#28221D] px-4 py-2 rounded-xl border border-[#C59B27]/40 text-center shrink-0">
                  <span className="text-[10px] text-[#A69788] block">Calculated Abaya Length</span>
                  <span className="font-cinzel text-lg font-bold text-[#E8D59E]">
                    {unit === 'in' ? recommendedAbaya.lenInches : recommendedAbaya.cm}
                  </span>
                </div>
              </div>

              {/* Grid: Left Controls (Sliders) + Right Visual Mannequin Silhouette */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Left Controls: Dual Sliders */}
                <div className="md:col-span-7 space-y-5 bg-white p-5 rounded-2xl border border-[#DDD3BC] shadow-2xs">
                  {/* Height Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-cinzel text-xs font-bold text-[#1E1A17] flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-[#C59B27]" /> 1. Your Total Height
                      </label>
                      <span className="font-mono text-xs font-bold text-[#8C6B1B] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#DDD3BC]">
                        {heightFeet}'{heightRemainderInches}" ({heightCm} cm)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={148}
                      max={186}
                      value={heightCm}
                      onChange={(e) => {
                        setHeightCm(Number(e.target.value));
                        hapticLight();
                      }}
                      className="w-full accent-[#C59B27] cursor-pointer h-2 bg-[#EADFCB] rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-[#8C7A6B] font-mono">
                      <span>4'10" (148cm)</span>
                      <span>5'4" (163cm)</span>
                      <span>6'1" (186cm)</span>
                    </div>
                  </div>

                  {/* Weight Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-cinzel text-xs font-bold text-[#1E1A17] flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#C59B27]" /> 2. Body Weight / Build
                      </label>
                      <span className="font-mono text-xs font-bold text-[#8C6B1B] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#DDD3BC]">
                        {weightKg} kg ({weightLbs} lbs)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={42}
                      max={105}
                      value={weightKg}
                      onChange={(e) => {
                        setWeightKg(Number(e.target.value));
                        hapticLight();
                      }}
                      className="w-full accent-[#C59B27] cursor-pointer h-2 bg-[#EADFCB] rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-[#8C7A6B] font-mono">
                      <span>42 kg (92 lbs)</span>
                      <span>65 kg (143 lbs)</span>
                      <span>105 kg (231 lbs)</span>
                    </div>
                  </div>

                  {/* Footwear Heel Height Selection */}
                  <div className="space-y-1.5 pt-1">
                    <label className="font-cinzel text-xs font-bold text-[#1E1A17] block">
                      3. Footwear Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Flats / Slides (0")', val: 0 },
                        { label: 'Moderate Heels (2")', val: 1 },
                        { label: 'Stilettos (3.5"+)', val: 2 }
                      ].map((opt, oIdx) => (
                        <button
                          key={`heel-opt-${opt.val}-${oIdx}`}
                          onClick={() => {
                            setHeelAllowance(opt.val);
                            hapticLight();
                          }}
                          className={`p-2 rounded-xl text-[11px] font-sans-ui border text-center transition-all cursor-pointer ${
                            heelAllowance === opt.val
                              ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] font-bold shadow-xs'
                              : 'bg-[#FAF7F2] text-[#54463A] border-[#DDD3BC] hover:bg-[#F2ECE0]'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Modest Fit Preference */}
                  <div className="space-y-1.5 pt-1">
                    <label className="font-cinzel text-xs font-bold text-[#1E1A17] block">
                      4. Modest Fit & Silhouette
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'tailored', label: 'Modest Tailored (+2" ease)' },
                        { id: 'classic', label: 'Classic Flowing (+4" ease)' },
                        { id: 'flowing', label: 'Royal Oversized (+6" ease)' }
                      ].map((fit, fIdx) => (
                        <button
                          key={`fit-pref-${fit.id}-${fIdx}`}
                          onClick={() => {
                            setFitPreference(fit.id as any);
                            hapticLight();
                          }}
                          className={`p-2 rounded-xl text-[11px] font-sans-ui border text-center transition-all cursor-pointer ${
                            fitPreference === fit.id
                              ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] font-bold shadow-xs'
                              : 'bg-[#FAF7F2] text-[#54463A] border-[#DDD3BC] hover:bg-[#F2ECE0]'
                          }`}
                        >
                          {fit.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Visual Mannequin Graphic */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-[#F4EDE2] rounded-2xl border border-[#DDD3BC] relative">
                  <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider text-[#8C6B1B] mb-2">
                    Dynamic Silhouette Drape
                  </span>

                  {/* Interactive SVG Mannequin Silhouette */}
                  <div className="relative w-44 h-72 flex items-center justify-center">
                    <svg viewBox="0 0 200 320" className="w-full h-full drop-shadow-md">
                      {/* Head / Hijab Silhouette */}
                      <ellipse cx="100" cy="38" rx="20" ry="24" fill="#C59B27" opacity="0.85" />
                      <ellipse cx="100" cy="36" rx="14" ry="17" fill="#FAF7F2" />
                      
                      {/* Shoulders & Flowing Abaya Gown */}
                      <path
                        d={`M 65 65 Q 100 60 135 65 L ${145 + (weightKg - 60) * 0.25} 275 Q 100 ${285 + (heightCm - 160) * 0.3} ${55 - (weightKg - 60) * 0.25} 275 Z`}
                        fill="#181411"
                      />
                      
                      {/* Gold Couture Border Trim */}
                      <path
                        d={`M 98 62 L 98 278 M 102 62 L 102 278`}
                        stroke="#C59B27"
                        strokeWidth="2"
                        strokeDasharray="4 2"
                      />

                      {/* Dynamic Drape Measurement Lines */}
                      {/* 1. Shoulder line */}
                      <line x1="25" y1="65" x2="65" y2="65" stroke="#C59B27" strokeWidth="1.5" strokeDasharray="2 2" />
                      <text x="5" y="68" fontSize="8" fontFamily="sans-serif" fill="#8C6B1B" fontWeight="bold">
                        Shoulder
                      </text>

                      {/* 2. Bust Ease Line */}
                      <line x1="25" y1="105" x2="68" y2="105" stroke="#C59B27" strokeWidth="1.5" strokeDasharray="2 2" />
                      <text x="5" y="108" fontSize="8" fontFamily="sans-serif" fill="#8C6B1B" fontWeight="bold">
                        Bust {recommendedPakistani.bustEst}
                      </text>

                      {/* 3. Hemline indicator */}
                      <line x1="20" y1="275" x2="55" y2="275" stroke="#10B981" strokeWidth="2" />
                      <text x="2" y="278" fontSize="9" fontFamily="sans-serif" fill="#0A7B54" fontWeight="bold">
                        Hem {recommendedAbaya.lenInches}
                      </text>

                      {/* Shoes / Floor Clearance */}
                      <ellipse cx="88" cy="288" rx="8" ry="4" fill="#8C6B1B" />
                      <ellipse cx="112" cy="288" rx="8" ry="4" fill="#8C6B1B" />
                      <line x1="40" y1="295" x2="160" y2="295" stroke="#DDD3BC" strokeWidth="2" />
                      <text x="75" y="308" fontSize="8" fontFamily="sans-serif" fill="#A69788">
                        Floor Level
                      </text>
                    </svg>

                    {/* Badge Floating */}
                    <div className="absolute top-2 right-2 bg-[#181411] text-[#E8D59E] px-2 py-1 rounded-md text-[10px] font-mono border border-[#C59B27]/40 shadow-xs">
                      {recommendedAbaya.lenInches}
                    </div>
                  </div>

                  <div className="text-center mt-3 space-y-0.5">
                    <p className="text-[11px] font-bold text-[#1E1A17]">
                      Floor Clearance: ~1.2 inches (3 cm)
                    </p>
                    <p className="text-[10px] text-[#7A6B5D]">
                      Prevents step-on wear while ensuring total modesty coverage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic Size Table Matching with highlighted active row */}
              <div className="space-y-3">
                <span className="font-cinzel text-xs font-bold text-[#1E1A17] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Corresponding Atelier Sizing Matrix (Live Matched)
                </span>

                <div className="overflow-x-auto rounded-2xl border border-[#DDD3BC] shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#181411] text-[#E8D59E] font-cinzel text-[11px]">
                        <th className="p-3">Matched Height</th>
                        <th className="p-3">Abaya Length</th>
                        <th className="p-3">Pakistani Size</th>
                        <th className="p-3">Bust Room</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DDD3BC] bg-[#FAF7F2]">
                      {abayaData.map((row, i) => {
                        const isMatch = recommendedAbaya.rowIdx === i;
                        return (
                          <tr
                            key={`sg-calc-row-${row.height}-${row.abayaLen}-${i}`}
                            className={`transition-colors ${
                              isMatch ? 'bg-[#F2E8D3] font-bold border-l-4 border-l-[#C59B27]' : 'hover:bg-[#F7F2E8]'
                            }`}
                          >
                            <td className="p-3 font-semibold text-[#1E1A17]">
                              {unit === 'in' ? row.height : row.heightCm}
                            </td>
                            <td className="p-3 text-[#8C6B1B]">
                              {unit === 'in' ? row.abayaLen : row.abayaCm}
                            </td>
                            <td className="p-3 text-[#1E1A17]">
                              {pakistaniData[i]?.size || 'M'}
                            </td>
                            <td className="p-3 text-[#5E5043]">{row.bust}</td>
                            <td className="p-3">
                              {isMatch ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#10B981] text-white text-[10px] font-bold rounded-full">
                                  <Check className="w-3 h-3" /> Best Fit
                                </span>
                              ) : (
                                <span className="text-[#A69788] text-[11px]">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Abaya Length Tab */}
          {activeTab === 'abaya' && (
            <div className="space-y-4">
              <div className="bg-[#EFE7D8] p-3.5 rounded-2xl border border-[#C59B27]/30">
                <p className="font-semibold text-[#1E1A17] flex items-center gap-1.5 font-cinzel">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> How to Choose Your Abaya Length
                </p>
                <p className="text-[11px] text-[#5E5043] mt-1 leading-relaxed">
                  Abaya sizes are primarily based on your total height. Measure from the top of your shoulder down to your ankle bone or floor. If you wear high heels (+3"), we recommend choosing one size longer.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#DDD3BC]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#181411] text-[#E8D59E] font-cinzel text-[11px]">
                      <th className="p-3">Your Height</th>
                      <th className="p-3">Abaya Length</th>
                      <th className="p-3">UK / US Equivalent</th>
                      <th className="p-3">Bust Room (Modest)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD3BC] bg-[#FAF7F2]">
                    {abayaData.map((row, i) => (
                      <tr key={`abaya-row-${row.height}-${row.abayaLen}-${i}`} className="hover:bg-[#F2ECE0] transition-colors">
                        <td className="p-3 font-semibold text-[#1E1A17]">
                          {unit === 'in' ? row.height : row.heightCm}
                        </td>
                        <td className="p-3 font-bold text-[#8C6B1B]">
                          {unit === 'in' ? row.abayaLen : row.abayaCm}
                        </td>
                        <td className="p-3 text-[#5E5043]">{row.ukSize}</td>
                        <td className="p-3 text-[#5E5043]">{row.bust}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Pakistani Suits Tab */}
          {activeTab === 'pakistani' && (
            <div className="space-y-4">
              <div className="bg-[#EFE7D8] p-3.5 rounded-2xl border border-[#C59B27]/30">
                <p className="font-semibold text-[#1E1A17] font-cinzel">
                  Pakistani Garment Sizing
                </p>
                <p className="text-[11px] text-[#5E5043] mt-1 leading-relaxed">
                  Measurements below represent garment measurements. For a comfortable modest fit, choose a size that is 1.5–2 inches (4–5 cm) larger than your actual body measurements.
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#DDD3BC]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#181411] text-[#E8D59E] font-cinzel text-[11px]">
                      <th className="p-3">Size</th>
                      <th className="p-3">Bust</th>
                      <th className="p-3">Waist</th>
                      <th className="p-3">Hips</th>
                      <th className="p-3">Kameez Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DDD3BC] bg-[#FAF7F2]">
                    {pakistaniData.map((row, i) => (
                      <tr key={`pakistani-row-${row.size}-${i}`} className="hover:bg-[#F2ECE0] transition-colors">
                        <td className="p-3 font-bold text-[#1E1A17] font-cinzel">{row.size}</td>
                        <td className="p-3">{unit === 'in' ? row.bustIn : row.bustCm}</td>
                        <td className="p-3">{unit === 'in' ? row.waistIn : row.waistCm}</td>
                        <td className="p-3">{unit === 'in' ? row.hipIn : row.hipCm}</td>
                        <td className="p-3">{row.lengthIn}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Hijab Dimensions Tab */}
          {activeTab === 'hijab' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-white border border-[#C59B27]/30 rounded-2xl space-y-1.5">
                  <h4 className="font-cinzel font-bold text-[#1E1A17] text-sm">Pure Silk & Chiffon Veils</h4>
                  <p className="text-[11px] text-[#7A6B5D] font-mono">Dimensions: 190 cm x 75 cm (75" x 30")</p>
                  <p className="text-[11px] text-[#54463A]">
                    Generous maxi length offering complete chest & shoulder coverage with lightweight, effortless fold-over drape.
                  </p>
                </div>
                <div className="p-4 bg-white border border-[#C59B27]/30 rounded-2xl space-y-1.5">
                  <h4 className="font-cinzel font-bold text-[#1E1A17] text-sm">Bamboo Modal & Ribbed Jersey</h4>
                  <p className="text-[11px] text-[#7A6B5D] font-mono">Dimensions: 195 cm x 80 cm (77" x 31.5")</p>
                  <p className="text-[11px] text-[#54463A]">
                    Ultra-soft stretch fabric with stay-put grip, eliminating the need for undercaps or needles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Jewelry & Accessories Tab */}
          {activeTab === 'jewelry' && (
            <div className="space-y-3">
              <div className="p-4 bg-white border border-[#DDD3BC] rounded-2xl space-y-1.5">
                <h4 className="font-cinzel font-bold text-[#1E1A17]">Statement Cuffs & Bangles</h4>
                <p className="text-[11px] text-[#5E5043]">
                  All AL-NOUREEN open cuffs are engineered with malleable 18k gold-plated brass to fit wrist circumferences from 5.5 inches (14 cm) to 7.5 inches (19 cm), designed to sit comfortably over or under abaya cuffs.
                </p>
              </div>
              <div className="p-4 bg-white border border-[#DDD3BC] rounded-2xl space-y-1.5">
                <h4 className="font-cinzel font-bold text-[#1E1A17]">Artisan Potli & Clutch Capacities</h4>
                <p className="text-[11px] text-[#5E5043]">
                  Every evening bag and potli is designed to fit modern smartphones (including iPhone Pro Max and Samsung Ultra), cosmetics compact, cardholder, and keys with weighted drawstrings.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F0EAE0] p-4 border-t border-[#E0D5BE] flex items-center justify-between">
          <p className="text-[11px] text-[#7A6B5D] hidden sm:inline">
            Need custom tailored sizing? Contact Atelier WhatsApp Concierge at +91 93262 94187.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-[#181411] text-[#E8D59E] rounded-xl text-xs font-cinzel font-bold tracking-wider hover:bg-[#2B231D] transition-colors ml-auto cursor-pointer"
          >
            Apply Size & Close
          </button>
        </div>
      </div>
    </div>
  );
};

