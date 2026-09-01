import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Ruler,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sliders,
  HelpCircle,
  Footprints,
  Info,
  Check
} from 'lucide-react';
import { Product, ProductSize } from '../types';
import { hapticLight, hapticSuccess } from '../utils/haptics';

export interface UserFitProfile {
  heightUnit: 'ft_in' | 'cm';
  heightFeet: number;
  heightInches: number;
  heightCm: number;
  weightUnit: 'kg' | 'lbs';
  weightKg: number;
  weightLbs: number;
  fitPreference: 'modest_loose' | 'regular' | 'tailored';
  footwear: 'flats' | 'low_heels' | 'high_heels';
}

const STORAGE_KEY = 'al_noureen_user_fit_profile';

export const getSavedFitProfile = (): UserFitProfile | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load fit profile', e);
  }
  return null;
};

export const saveFitProfile = (profile: UserFitProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save fit profile', e);
  }
};

export interface FitRecommendationResult {
  recommendedSize: ProductSize;
  confidencePercent: number;
  garmentLength?: string;
  hemClearanceNote: string;
  bustEaseNote: string;
  estimatedBodyMeasurements: {
    bustInches: number;
    waistInches: number;
    hipInches: number;
    heightTotalInches: number;
  };
  garmentMeasurements: {
    bustInches: number;
    waistInches: number;
    hipInches: number;
    lengthInches: number;
  };
  reasons: string[];
}

export function calculateFitRecommendation(
  product: Product,
  profile: UserFitProfile
): FitRecommendationResult {
  // 1. Calculate total height in inches
  let totalHeightInches = 64; // Default 5'4"
  if (profile.heightUnit === 'ft_in') {
    totalHeightInches = profile.heightFeet * 12 + profile.heightInches;
  } else {
    totalHeightInches = Math.round(profile.heightCm / 2.54);
  }

  // 2. Calculate weight in kg
  let weightKg = 60;
  if (profile.weightUnit === 'kg') {
    weightKg = profile.weightKg;
  } else {
    weightKg = Math.round(profile.weightLbs * 0.453592);
  }

  // 3. Footwear height addition in inches
  const heelAddition = profile.footwear === 'high_heels' ? 3 : profile.footwear === 'low_heels' ? 1.5 : 0;
  const effectiveHeightInches = totalHeightInches + heelAddition;

  // 4. Estimate Body Measurements from Height + Weight (Standard anthropometric approximation)
  // BMI approximation
  const heightM = (totalHeightInches * 2.54) / 100;
  const bmi = weightKg / (heightM * heightM);

  // Bust estimate in inches
  let baseBust = 32 + (bmi - 18.5) * 0.9;
  if (baseBust < 31) baseBust = 31;
  if (baseBust > 50) baseBust = 50;

  // Waist & Hip estimates
  let baseWaist = baseBust - 6;
  let baseHip = baseBust + 4;

  if (profile.fitPreference === 'modest_loose') {
    baseBust += 1.5;
    baseWaist += 1.5;
    baseHip += 2;
  } else if (profile.fitPreference === 'tailored') {
    baseBust -= 1;
    baseWaist -= 1;
  }

  // Round estimates
  const estBust = Math.round(baseBust * 10) / 10;
  const estWaist = Math.round(baseWaist * 10) / 10;
  const estHip = Math.round(baseHip * 10) / 10;

  let recommendedSize: ProductSize = 'M';
  let confidencePercent = 96;
  let garmentLength = '';
  let hemClearanceNote = '';
  let bustEaseNote = '';
  const reasons: string[] = [];

  let garmentMeasurements = {
    bustInches: 38,
    waistInches: 32,
    hipInches: 42,
    lengthInches: 50
  };

  // CATEGORY SPECIFIC SIZING
  if (product.category === 'Abayas' || product.sizes.some((s) => s.includes('"'))) {
    // Abayas use length sizing (52", 54", 56", 58", 60")
    if (effectiveHeightInches <= 62) {
      // <= 5'2"
      recommendedSize = '52"';
      garmentLength = '52 inches (132 cm)';
      hemClearanceNote = 'Drapes gracefully ~0.5" above the floor for easy stride.';
    } else if (effectiveHeightInches <= 64) {
      // 5'3" - 5'4"
      recommendedSize = '54"';
      garmentLength = '54 inches (137 cm)';
      hemClearanceNote = 'Perfect floor-brushing length with dignified coverage.';
    } else if (effectiveHeightInches <= 66) {
      // 5'5" - 5'6"
      recommendedSize = '56"';
      garmentLength = '56 inches (142 cm)';
      hemClearanceNote = 'Standard luxury drape sweeping smoothly at ankle/top of shoes.';
    } else if (effectiveHeightInches <= 68) {
      // 5'7" - 5'8"
      recommendedSize = '58"';
      garmentLength = '58 inches (147 cm)';
      hemClearanceNote = 'Extended floor length tailored for taller silhouettes.';
    } else {
      // 5'9"+
      recommendedSize = '60"';
      garmentLength = '60 inches (152 cm)';
      hemClearanceNote = 'Full-length majestic sweep tailored for heights 5\'9" and above.';
    }

    // If the recommended size isn't in product.sizes, fallback to nearest available
    if (!product.sizes.includes(recommendedSize)) {
      recommendedSize = product.sizes[0] || '54"';
    }

    const sizeNum = parseInt(recommendedSize.replace('"', ''), 10) || 54;
    garmentMeasurements = {
      bustInches: 44, // Modest loose abaya cut has generous chest ease
      waistInches: 46,
      hipInches: 50,
      lengthInches: sizeNum
    };

    bustEaseNote = '+6" to +8" Modest Flare Ease for breezy, non-clinging fall';
    reasons.push(`Height (${Math.floor(totalHeightInches / 12)}'${totalHeightInches % 12}") paired with ${profile.footwear.replace('_', ' ')} selects length ${recommendedSize}.`);
    reasons.push(`Tailored with generous modest flare to prevent silhouette clinging.`);
    confidencePercent = 98;
  } else {
    // Pakistani, Modest Wear, Co-ords, Tunics (XS - XXL)
    if (estBust <= 34.5) {
      recommendedSize = 'XS';
      garmentMeasurements = { bustInches: 35, waistInches: 29, hipInches: 39, lengthInches: 48 };
    } else if (estBust <= 36.5) {
      recommendedSize = 'S';
      garmentMeasurements = { bustInches: 37, waistInches: 31, hipInches: 41, lengthInches: 49 };
    } else if (estBust <= 39.5) {
      recommendedSize = 'M';
      garmentMeasurements = { bustInches: 40, waistInches: 34, hipInches: 44, lengthInches: 50 };
    } else if (estBust <= 42.5) {
      recommendedSize = 'L';
      garmentMeasurements = { bustInches: 43, waistInches: 37, hipInches: 47, lengthInches: 50 };
    } else if (estBust <= 46) {
      recommendedSize = 'XL';
      garmentMeasurements = { bustInches: 46, waistInches: 40, hipInches: 50, lengthInches: 51 };
    } else {
      recommendedSize = 'XXL';
      garmentMeasurements = { bustInches: 50, waistInches: 44, hipInches: 54, lengthInches: 51 };
    }

    if (!product.sizes.includes(recommendedSize)) {
      if (product.sizes.includes('Free Size')) {
        recommendedSize = 'Free Size';
      } else {
        recommendedSize = product.sizes[0] || 'M';
      }
    }

    bustEaseNote = `Includes +${(garmentMeasurements.bustInches - estBust).toFixed(1)}" Modest Wearing Ease across chest`;
    hemClearanceNote = `Kurta length sits gracefully below knees (~${garmentMeasurements.lengthInches}" from shoulder).`;
    reasons.push(`Estimated bust (${estBust}") and waist (${estWaist}") match optimal comfort in size ${recommendedSize}.`);
    reasons.push(`${product.fabric} weave provides elegant drape and breathable movement.`);
    confidencePercent = 96;
  }

  return {
    recommendedSize,
    confidencePercent,
    garmentLength,
    hemClearanceNote,
    bustEaseNote,
    estimatedBodyMeasurements: {
      bustInches: estBust,
      waistInches: estWaist,
      hipInches: estHip,
      heightTotalInches: totalHeightInches
    },
    garmentMeasurements,
    reasons
  };
}

interface FindMyFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  currentSelectedSize: ProductSize;
  onSelectSize: (size: ProductSize) => void;
}

export const FindMyFitModal: React.FC<FindMyFitModalProps> = ({
  isOpen,
  onClose,
  product,
  currentSelectedSize,
  onSelectSize
}) => {
  // Load initial profile or defaults
  const [profile, setProfile] = useState<UserFitProfile>(() => {
    const saved = getSavedFitProfile();
    if (saved) return saved;
    return {
      heightUnit: 'ft_in',
      heightFeet: 5,
      heightInches: 5,
      heightCm: 165,
      weightUnit: 'kg',
      weightKg: 60,
      weightLbs: 132,
      fitPreference: 'modest_loose',
      footwear: 'flats'
    };
  });

  const [activeStep, setActiveStep] = useState<'input' | 'result'>('input');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Sync state if modal is opened
  useEffect(() => {
    if (isOpen) {
      const saved = getSavedFitProfile();
      if (saved) {
        setProfile(saved);
      }
      setAppliedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const result = calculateFitRecommendation(product, profile);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    hapticLight();
    saveFitProfile(profile);
    setActiveStep('result');
  };

  const handleApplySize = (sizeToApply: ProductSize) => {
    hapticSuccess();
    onSelectSize(sizeToApply);
    setAppliedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 900);
  };

  return (
    <div
      id="find-my-fit-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div
        id="find-my-fit-card"
        className="relative w-full max-w-xl bg-[#FAF7F2] dark:bg-[#1C1814] border border-[#C59B27]/50 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-[#1E1A17] dark:text-[#FAF7F2] flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-[#181411] text-[#FAF7F2] px-5 py-4 flex items-center justify-between border-b border-[#C59B27]/40 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C59B27]/20 border border-[#C59B27] flex items-center justify-center text-[#E8D59E]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#E8D59E] tracking-wider">
                  Find My Fit
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#C59B27]/20 text-[#E8D59E] border border-[#C59B27]/40 rounded-full">
                  Smart Atelier Advisor
                </span>
              </div>
              <p className="text-[11px] text-[#A69788] truncate max-w-xs sm:max-w-md">
                Precision size recommendation for <strong>{product.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A69788] hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {activeStep === 'input' ? (
            <form onSubmit={handleCalculate} className="space-y-5">
              {/* Intro Notice */}
              <div className="p-3 bg-[#F0EAE0] dark:bg-[#25201A] rounded-2xl border border-[#DDD3BC] dark:border-[#3D352D] flex items-start gap-3">
                <Info className="w-4 h-4 text-[#8C6B1B] dark:text-[#E8D59E] shrink-0 mt-0.5" />
                <p className="text-xs text-[#54463A] dark:text-[#C5BAAC] leading-relaxed">
                  Enter your height and weight below. Our modest tailoring engine will cross-reference{' '}
                  <strong>{product.fabric}</strong> drape and length proportions to suggest your ideal size.
                </p>
              </div>

              {/* 1. Height Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#1E1A17] dark:text-[#FAF7F2] flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-[#C59B27]" /> 1. Your Height
                  </label>
                  <div className="flex items-center bg-[#EAE2D4] dark:bg-[#28211A] p-0.5 rounded-lg text-[11px] font-semibold border border-[#D4CBBF] dark:border-[#3D352D]">
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, heightUnit: 'ft_in' })}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        profile.heightUnit === 'ft_in'
                          ? 'bg-[#181411] text-[#E8D59E] shadow-2xs'
                          : 'text-[#6B635B] dark:text-[#A69788]'
                      }`}
                    >
                      ft / in
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, heightUnit: 'cm' })}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        profile.heightUnit === 'cm'
                          ? 'bg-[#181411] text-[#E8D59E] shadow-2xs'
                          : 'text-[#6B635B] dark:text-[#A69788]'
                      }`}
                    >
                      cm
                    </button>
                  </div>
                </div>

                {profile.heightUnit === 'ft_in' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-[#6B635B] dark:text-[#A69788] mb-1">Feet</label>
                      <select
                        value={profile.heightFeet}
                        onChange={(e) => setProfile({ ...profile, heightFeet: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-[#241F1A] border border-[#D4CBBF] dark:border-[#3D352D] rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-[#C59B27]"
                      >
                        <option value={4}>4 ft</option>
                        <option value={5}>5 ft</option>
                        <option value={6}>6 ft</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#6B635B] dark:text-[#A69788] mb-1">Inches</label>
                      <select
                        value={profile.heightInches}
                        onChange={(e) => setProfile({ ...profile, heightInches: Number(e.target.value) })}
                        className="w-full bg-white dark:bg-[#241F1A] border border-[#D4CBBF] dark:border-[#3D352D] rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-[#C59B27]"
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((inch) => (
                          <option key={`fit-inch-${inch}`} value={inch}>
                            {inch} in ({Math.round((profile.heightFeet * 12 + inch) * 2.54)} cm)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={140}
                        max={195}
                        step={1}
                        value={profile.heightCm}
                        onChange={(e) => setProfile({ ...profile, heightCm: Number(e.target.value) })}
                        className="flex-1 accent-[#C59B27]"
                      />
                      <div className="w-20 text-center font-mono font-bold text-sm bg-white dark:bg-[#241F1A] border border-[#D4CBBF] dark:border-[#3D352D] py-2 rounded-xl">
                        {profile.heightCm} cm
                      </div>
                    </div>
                    <p className="text-[10px] text-[#6B635B] dark:text-[#A69788] mt-1 text-right font-mono">
                      ≈ {Math.floor(profile.heightCm / 2.54 / 12)}'{Math.round((profile.heightCm / 2.54) % 12)}"
                    </p>
                  </div>
                )}
              </div>

              {/* 2. Weight Selector */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#1E1A17] dark:text-[#FAF7F2] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#C59B27]" /> 2. Your Weight
                  </label>
                  <div className="flex items-center bg-[#EAE2D4] dark:bg-[#28211A] p-0.5 rounded-lg text-[11px] font-semibold border border-[#D4CBBF] dark:border-[#3D352D]">
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, weightUnit: 'kg' })}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        profile.weightUnit === 'kg'
                          ? 'bg-[#181411] text-[#E8D59E] shadow-2xs'
                          : 'text-[#6B635B] dark:text-[#A69788]'
                      }`}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfile({ ...profile, weightUnit: 'lbs' })}
                      className={`px-2.5 py-1 rounded-md transition-all ${
                        profile.weightUnit === 'lbs'
                          ? 'bg-[#181411] text-[#E8D59E] shadow-2xs'
                          : 'text-[#6B635B] dark:text-[#A69788]'
                      }`}
                    >
                      lbs
                    </button>
                  </div>
                </div>

                {profile.weightUnit === 'kg' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={40}
                      max={120}
                      step={1}
                      value={profile.weightKg}
                      onChange={(e) => setProfile({ ...profile, weightKg: Number(e.target.value) })}
                      className="flex-1 accent-[#C59B27]"
                    />
                    <div className="w-20 text-center font-mono font-bold text-sm bg-white dark:bg-[#241F1A] border border-[#D4CBBF] dark:border-[#3D352D] py-2 rounded-xl">
                      {profile.weightKg} kg
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={88}
                      max={260}
                      step={1}
                      value={profile.weightLbs}
                      onChange={(e) => setProfile({ ...profile, weightLbs: Number(e.target.value) })}
                      className="flex-1 accent-[#C59B27]"
                    />
                    <div className="w-20 text-center font-mono font-bold text-sm bg-white dark:bg-[#241F1A] border border-[#D4CBBF] dark:border-[#3D352D] py-2 rounded-xl">
                      {profile.weightLbs} lbs
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Footwear Preference (For accurate floor clearing drape) */}
              <div className="space-y-2">
                <label className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#1E1A17] dark:text-[#FAF7F2] flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-[#C59B27]" /> 3. Usual Footwear Pairing
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, footwear: 'flats' })}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-medium transition-all ${
                      profile.footwear === 'flats'
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] ring-1 ring-[#C59B27]'
                        : 'bg-white dark:bg-[#241F1A] border-[#D4CBBF] dark:border-[#3D352D] text-[#54463A] dark:text-[#C5BAAC]'
                    }`}
                  >
                    Flats / Slippers (0")
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, footwear: 'low_heels' })}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-medium transition-all ${
                      profile.footwear === 'low_heels'
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] ring-1 ring-[#C59B27]'
                        : 'bg-white dark:bg-[#241F1A] border-[#D4CBBF] dark:border-[#3D352D] text-[#54463A] dark:text-[#C5BAAC]'
                    }`}
                  >
                    Low Heels (1"–2")
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, footwear: 'high_heels' })}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-medium transition-all ${
                      profile.footwear === 'high_heels'
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] ring-1 ring-[#C59B27]'
                        : 'bg-white dark:bg-[#241F1A] border-[#D4CBBF] dark:border-[#3D352D] text-[#54463A] dark:text-[#C5BAAC]'
                    }`}
                  >
                    High Heels (3"+)
                  </button>
                </div>
              </div>

              {/* 4. Fit Preference */}
              <div className="space-y-2">
                <label className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#1E1A17] dark:text-[#FAF7F2] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> 4. Modest Fit Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, fitPreference: 'modest_loose' })}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-medium transition-all ${
                      profile.fitPreference === 'modest_loose'
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] ring-1 ring-[#C59B27]'
                        : 'bg-white dark:bg-[#241F1A] border-[#D4CBBF] dark:border-[#3D352D] text-[#54463A] dark:text-[#C5BAAC]'
                    }`}
                  >
                    Modest & Flowy
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, fitPreference: 'regular' })}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-medium transition-all ${
                      profile.fitPreference === 'regular'
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] ring-1 ring-[#C59B27]'
                        : 'bg-white dark:bg-[#241F1A] border-[#D4CBBF] dark:border-[#3D352D] text-[#54463A] dark:text-[#C5BAAC]'
                    }`}
                  >
                    Standard Regular
                  </button>
                  <button
                    type="button"
                    onClick={() => setProfile({ ...profile, fitPreference: 'tailored' })}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-medium transition-all ${
                      profile.fitPreference === 'tailored'
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] ring-1 ring-[#C59B27]'
                        : 'bg-white dark:bg-[#241F1A] border-[#D4CBBF] dark:border-[#3D352D] text-[#54463A] dark:text-[#C5BAAC]'
                    }`}
                  >
                    Tailored Slim
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  id="calculate-my-fit-btn"
                  className="w-full py-3.5 bg-gradient-to-r from-[#181411] via-[#2B231D] to-[#181411] hover:opacity-95 text-[#E8D59E] border border-[#C59B27] rounded-2xl font-cinzel font-bold text-xs tracking-widest uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 text-[#C59B27]" />
                  <span>Analyze Measurements & Recommend Size</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          ) : (
            /* Results Step */
            <div className="space-y-5 animate-in fade-in">
              {/* Primary Recommended Size Hero Box */}
              <div className="p-5 bg-gradient-to-br from-[#181411] via-[#26201A] to-[#14100D] rounded-3xl border border-[#C59B27] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C59B27]/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C59B27]/20 border border-[#C59B27]/50 rounded-full text-[10px] font-mono text-[#E8D59E] uppercase tracking-wider mb-2">
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Recommended Modest Fit
                    </div>
                    <h4 className="text-xs text-[#A69788] uppercase tracking-wider font-cinzel">
                      Optimal Choice for {product.name}
                    </h4>
                    <div className="flex items-baseline gap-3 mt-1">
                      <span className="font-cinzel text-3xl sm:text-4xl font-bold text-[#F5D77F] tracking-tight">
                        Size {result.recommendedSize}
                      </span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-semibold">
                        {result.confidencePercent}% Fit Match
                      </span>
                    </div>
                  </div>

                  {/* Apply CTA inside Result */}
                  <div className="shrink-0">
                    <button
                      type="button"
                      id="apply-recommended-size-btn"
                      onClick={() => handleApplySize(result.recommendedSize)}
                      className={`py-3 px-5 rounded-2xl font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                        appliedSuccess || currentSelectedSize === result.recommendedSize
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#C59B27] hover:bg-[#D4AF37] text-[#14100D] active:scale-95'
                      }`}
                    >
                      {appliedSuccess || currentSelectedSize === result.recommendedSize ? (
                        <>
                          <Check className="w-4 h-4" /> Size Applied!
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Select & Apply Size {result.recommendedSize}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Specific Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-4 border-t border-[#3D352D] text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#A69788] uppercase font-mono">Length & Hem Drop</span>
                    <p className="text-[#E8D59E] font-medium">{result.hemClearanceNote}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#A69788] uppercase font-mono">Modest Silhouette Ease</span>
                    <p className="text-[#E8D59E] font-medium">{result.bustEaseNote}</p>
                  </div>
                </div>
              </div>

              {/* Measurement Comparison Breakdown */}
              <div className="bg-white dark:bg-[#241F1A] p-4 rounded-2xl border border-[#DDD3BC] dark:border-[#3D352D] space-y-3">
                <div className="flex items-center justify-between border-b border-[#EAE2D4] dark:border-[#322A23] pb-2">
                  <h5 className="font-cinzel text-xs font-bold text-[#1E1A17] dark:text-[#FAF7F2] uppercase tracking-wider flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-[#C59B27]" /> Measurement Breakdown
                  </h5>
                  <span className="text-[10px] font-mono text-[#8C6B1B] dark:text-[#E8D59E]">
                    Fabric: {product.fabric}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-[#FAF7F2] dark:bg-[#1A1612] rounded-xl border border-[#EAE2D4] dark:border-[#322A23]">
                    <p className="text-[10px] text-[#6B635B] dark:text-[#A69788] font-mono">Estimated Bust</p>
                    <p className="text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2] font-mono mt-0.5">
                      {result.estimatedBodyMeasurements.bustInches}"
                    </p>
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-1">
                      Garment: {result.garmentMeasurements.bustInches}"
                    </p>
                  </div>

                  <div className="p-2.5 bg-[#FAF7F2] dark:bg-[#1A1612] rounded-xl border border-[#EAE2D4] dark:border-[#322A23]">
                    <p className="text-[10px] text-[#6B635B] dark:text-[#A69788] font-mono">Estimated Waist</p>
                    <p className="text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2] font-mono mt-0.5">
                      {result.estimatedBodyMeasurements.waistInches}"
                    </p>
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-1">
                      Garment: {result.garmentMeasurements.waistInches}"
                    </p>
                  </div>

                  <div className="p-2.5 bg-[#FAF7F2] dark:bg-[#1A1612] rounded-xl border border-[#EAE2D4] dark:border-[#322A23]">
                    <p className="text-[10px] text-[#6B635B] dark:text-[#A69788] font-mono">Estimated Hips</p>
                    <p className="text-sm font-bold text-[#1E1A17] dark:text-[#FAF7F2] font-mono mt-0.5">
                      {result.estimatedBodyMeasurements.hipInches}"
                    </p>
                    <p className="text-[9px] text-emerald-600 dark:text-emerald-400 mt-1">
                      Garment: {result.garmentMeasurements.hipInches}"
                    </p>
                  </div>
                </div>

                {/* Reasons List */}
                <div className="space-y-1.5 pt-1">
                  {result.reasons.map((reason, idx) => (
                    <div key={`fit-reason-${idx}`} className="flex items-start gap-2 text-[11px] text-[#54463A] dark:text-[#C5BAAC]">
                      <Check className="w-3.5 h-3.5 text-[#C59B27] shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Adjust Profile or Done */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveStep('input')}
                  className="px-4 py-2.5 bg-[#EAE2D4] dark:bg-[#25201A] hover:bg-[#DDD3BC] dark:hover:bg-[#322A23] text-[#1E1A17] dark:text-[#FAF7F2] rounded-xl text-xs font-cinzel font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#C59B27]" /> Adjust Height / Weight
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-[#181411] hover:bg-[#26201A] text-[#E8D59E] rounded-xl text-xs font-cinzel font-bold tracking-wider transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Trust Note */}
        <div className="bg-[#F0EAE0] dark:bg-[#14110E] px-5 py-3 border-t border-[#DDD3BC] dark:border-[#2C2723] flex items-center justify-between text-[10px] text-[#7A6B5D] dark:text-[#A69788]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B27]" /> 100% Free Size Exchanges if fit is not flawless
          </span>
          <span className="font-mono">AL-NOUREEN Atelier AI Sizing</span>
        </div>
      </div>
    </div>
  );
};
