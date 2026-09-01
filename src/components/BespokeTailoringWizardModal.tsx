import React, { useState, useEffect } from 'react';
import { BespokeTailoringProfile, ProductSize } from '../types';
import { hapticLight, hapticSuccess } from '../utils/haptics';
import {
  X,
  Ruler,
  Sparkles,
  Scissors,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
  Sliders,
  Footprints,
  FileText,
  Download,
  Copy,
  Check,
  Crown,
  Heart
} from 'lucide-react';

interface BespokeTailoringWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: BespokeTailoringProfile) => void;
  initialProfile?: BespokeTailoringProfile | null;
}

const STORAGE_KEY = 'al_noureen_bespoke_tailoring_profile';

export const getSavedBespokeProfile = (): BespokeTailoringProfile | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load bespoke tailoring profile', e);
  }
  return null;
};

export const saveBespokeProfileToStorage = (profile: BespokeTailoringProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save bespoke tailoring profile', e);
  }
};

export const BespokeTailoringWizardModal: React.FC<BespokeTailoringWizardModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Form State
  const [clientName, setClientName] = useState('Eleanor Vance');
  const [clientEmail, setClientEmail] = useState('abdans52@gmail.com');
  const [clientPhone, setClientPhone] = useState('+44 7700 900821');

  // Step 1: Height & Footwear
  const [heightUnit, setHeightUnit] = useState<'ft_in' | 'cm'>('ft_in');
  const [heightFeet, setHeightFeet] = useState(5);
  const [heightInches, setHeightInches] = useState(5);
  const [heightCm, setHeightCm] = useState(165);
  const [footwear, setFootwear] = useState<'flats' | 'low_heels' | 'high_heels'>('low_heels');

  // Step 2: Tape measurements
  const [bustInches, setBustInches] = useState(36);
  const [waistInches, setWaistInches] = useState(29);
  const [hipInches, setHipInches] = useState(39);
  const [acrossShouldersInches, setAcrossShouldersInches] = useState(15.5);
  const [sleeveLengthInches, setSleeveLengthInches] = useState(23);
  const [desiredLengthInches, setDesiredLengthInches] = useState(55);

  // Step 3: Modest Silhouette & Cut
  const [fitStyle, setFitStyle] = useState<
    'ultra_modest_loose' | 'classic_regular' | 'tailored_structured'
  >('ultra_modest_loose');
  const [sleeveStyle, setSleeveStyle] = useState<
    'wide_kimono' | 'modest_wrist_buttons' | 'elasticated_cuff' | 'lace_trim'
  >('wide_kimono');
  const [necklineStyle, setNecklineStyle] = useState<
    'high_mandarin' | 'bandh_gala' | 'boat_neck' | 'modest_v_inset'
  >('high_mandarin');
  const [pocketPreference, setPocketPreference] = useState(true);
  const [nursingZipper, setNursingZipper] = useState(false);
  const [matchingBelt, setMatchingBelt] = useState(true);

  // Step 4: Monogram & Notes
  const [monogramInitials, setMonogramInitials] = useState('E.V.');
  const [specialInstructions, setSpecialInstructions] = useState(
    'Please ensure ample armhole room for layering over modest slips and a floor-grazing modest hem when paired with 2-inch kitten heels.'
  );

  // Unique Blueprint ID
  const [tailorCode, setTailorCode] = useState('ATELIER-BESPOKE-9048');

  useEffect(() => {
    const existing = initialProfile || getSavedBespokeProfile();
    if (existing) {
      setClientName(existing.clientName || 'Eleanor Vance');
      setClientEmail(existing.email || 'abdans52@gmail.com');
      setClientPhone(existing.phone || '+44 7700 900821');
      setHeightUnit(existing.heightUnit);
      setHeightFeet(existing.heightFeet);
      setHeightInches(existing.heightInches);
      setHeightCm(existing.heightCm);
      setFootwear(existing.footwear);
      setBustInches(existing.bustInches);
      setWaistInches(existing.waistInches);
      setHipInches(existing.hipInches);
      setAcrossShouldersInches(existing.acrossShouldersInches);
      setSleeveLengthInches(existing.sleeveLengthInches);
      setDesiredLengthInches(existing.desiredLengthInches);
      setFitStyle(existing.fitStyle);
      setSleeveStyle(existing.sleeveStyle);
      setNecklineStyle(existing.necklineStyle);
      setPocketPreference(existing.pocketPreference);
      setNursingZipper(existing.nursingZipper);
      setMatchingBelt(existing.matchingBelt);
      setMonogramInitials(existing.monogramInitials || 'E.V.');
      setSpecialInstructions(existing.specialInstructions || '');
      setTailorCode(existing.id);
    }
  }, [initialProfile, isOpen]);

  // Height and Hem calculation
  const totalHeightInches =
    heightUnit === 'ft_in' ? heightFeet * 12 + heightInches : Math.round(heightCm / 2.54);

  const heelAddition = footwear === 'high_heels' ? 3 : footwear === 'low_heels' ? 1.5 : 0;
  const recommendedAbayaLength = Math.max(50, Math.min(62, totalHeightInches - 10 + Math.round(heelAddition)));

  // Auto Estimate Tape measurements from Height & Standard Size
  const handleAutoEstimateMeasurements = () => {
    hapticLight();
    if (totalHeightInches >= 68) {
      // Tall
      setBustInches(38);
      setWaistInches(31);
      setHipInches(41);
      setAcrossShouldersInches(16.5);
      setSleeveLengthInches(24.5);
      setDesiredLengthInches(58);
    } else if (totalHeightInches >= 64) {
      // Medium
      setBustInches(36);
      setWaistInches(29);
      setHipInches(39);
      setAcrossShouldersInches(15.5);
      setSleeveLengthInches(23);
      setDesiredLengthInches(55);
    } else {
      // Petite
      setBustInches(34);
      setWaistInches(27);
      setHipInches(37);
      setAcrossShouldersInches(14.5);
      setSleeveLengthInches(22);
      setDesiredLengthInches(52);
    }
  };

  const handleNext = () => {
    hapticLight();
    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    hapticLight();
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleCompleteAndSave = () => {
    hapticSuccess();
    const profile: BespokeTailoringProfile = {
      id: tailorCode,
      clientName,
      email: clientEmail,
      phone: clientPhone,
      heightUnit,
      heightFeet,
      heightInches,
      heightCm,
      footwear,
      bustInches,
      waistInches,
      hipInches,
      acrossShouldersInches,
      sleeveLengthInches,
      desiredLengthInches,
      fitStyle,
      sleeveStyle,
      necklineStyle,
      pocketPreference,
      nursingZipper,
      matchingBelt,
      monogramInitials,
      specialInstructions,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    saveBespokeProfileToStorage(profile);
    onSaveProfile(profile);
    onClose();
  };

  const handleCopyCard = () => {
    hapticLight();
    const text = `⚜️ MAISON AL-NOUREEN ATELIER BESPOKE BLUEPRINT [${tailorCode}]
Patron: ${clientName} (${clientEmail})
Height: ${heightUnit === 'ft_in' ? `${heightFeet}'${heightInches}"` : `${heightCm}cm`} (Footwear: ${footwear})
Target Garment Length: ${desiredLengthInches}" | Sleeve: ${sleeveLengthInches}" | Across-Shoulders: ${acrossShouldersInches}"
Bust: ${bustInches}" | Waist: ${waistInches}" | Hips: ${hipInches}"
Fit Style: ${fitStyle.replace(/_/g, ' ').toUpperCase()}
Sleeve Cut: ${sleeveStyle.replace(/_/g, ' ').toUpperCase()}
Neckline: ${necklineStyle.replace(/_/g, ' ').toUpperCase()}
Monogram: ${monogramInitials || 'None'} | Pockets: ${pocketPreference ? 'Yes' : 'No'}
Special Instructions: ${specialInstructions}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="bespoke-tailoring-wizard-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[94vh] bg-[#FAF7F2] dark:bg-[#181411] rounded-3xl border border-[#C59B27]/40 shadow-2xl flex flex-col overflow-hidden text-[#1E1A17] dark:text-[#FAF7F2]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8DFC8] dark:border-[#2E2620] flex items-center justify-between bg-[#FAF7F2] dark:bg-[#181411]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#181411] border border-[#C59B27] flex items-center justify-center text-[#E8D59E] shadow-sm">
              <Scissors className="w-5 h-5 text-[#C59B27]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-widest">
                  Haute Couture Concierge
                </span>
                <span className="px-2 py-0.2 rounded-full bg-[#C59B27]/20 border border-[#C59B27]/50 text-[#8C6B1B] dark:text-[#E8D59E] text-[9.5px] font-bold">
                  Bespoke Stitching
                </span>
              </div>
              <h2 className="font-cinzel text-lg sm:text-2xl font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                Custom Tailoring & Measurement Wizard
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EAE2D4] dark:hover:bg-[#2B231D] text-[#7A6B5D] dark:text-[#A69788] hover:text-[#181411] dark:hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-[#F0EAE0] dark:bg-[#120F0D] border-b border-[#E8DFC8] dark:border-[#2E2620]">
          <div className="flex items-center justify-between text-xs font-cinzel font-bold text-[#8C7A6B] dark:text-[#A69788] mb-2">
            <span className={currentStep >= 1 ? 'text-[#8C6B1B] dark:text-[#D4AF37]' : ''}>
              1. Height & Hem
            </span>
            <span className={currentStep >= 2 ? 'text-[#8C6B1B] dark:text-[#D4AF37]' : ''}>
              2. Tape Measures
            </span>
            <span className={currentStep >= 3 ? 'text-[#8C6B1B] dark:text-[#D4AF37]' : ''}>
              3. Modest Silhouette
            </span>
            <span className={currentStep >= 4 ? 'text-[#8C6B1B] dark:text-[#D4AF37]' : ''}>
              4. Monogram
            </span>
            <span className={currentStep >= 5 ? 'text-[#8C6B1B] dark:text-[#D4AF37]' : ''}>
              5. Tailor Blueprint
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-1.5 bg-[#DDD3BC] dark:bg-[#2E2620] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C59B27] transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* STEP 1: HEIGHT, FOOTWEAR & HEM */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <span className="text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-wider">
                  Step 1 of 5: Proportions & Stance
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold">
                  Your Height & Desired Shoe Stance
                </h3>
                <p className="text-xs text-[#7A6B5D] dark:text-[#A69788]">
                  Ensures our master tailors calculate exact floor-grazing length without stepping on the hem.
                </p>
              </div>

              {/* Height Unit Toggle */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setHeightUnit('ft_in')}
                  className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold transition-all ${
                    heightUnit === 'ft_in'
                      ? 'bg-[#181411] text-[#E8D59E] border border-[#C59B27]'
                      : 'bg-[#F0EAE0] dark:bg-[#241E19] text-[#7A6B5D] dark:text-[#A69788]'
                  }`}
                >
                  Feet & Inches (ft/in)
                </button>
                <button
                  onClick={() => setHeightUnit('cm')}
                  className={`px-4 py-1.5 rounded-full text-xs font-cinzel font-bold transition-all ${
                    heightUnit === 'cm'
                      ? 'bg-[#181411] text-[#E8D59E] border border-[#C59B27]'
                      : 'bg-[#F0EAE0] dark:bg-[#241E19] text-[#7A6B5D] dark:text-[#A69788]'
                  }`}
                >
                  Centimeters (cm)
                </button>
              </div>

              {/* Height Selectors */}
              {heightUnit === 'ft_in' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                    <label className="block text-xs font-cinzel font-bold text-[#8C7A6B] mb-2">
                      Feet (ft)
                    </label>
                    <select
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(Number(e.target.value))}
                      className="w-full p-2.5 bg-white dark:bg-[#181411] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-sm font-semibold"
                    >
                      {[4, 5, 6].map((f) => (
                        <option key={`bespoke-height-ft-${f}`} value={f}>
                          {f} feet
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                    <label className="block text-xs font-cinzel font-bold text-[#8C7A6B] mb-2">
                      Inches (in)
                    </label>
                    <select
                      value={heightInches}
                      onChange={(e) => setHeightInches(Number(e.target.value))}
                      className="w-full p-2.5 bg-white dark:bg-[#181411] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-sm font-semibold"
                    >
                      {Array.from({ length: 12 }).map((_, i) => (
                        <option key={`bespoke-height-in-${i}`} value={i}>
                          {i} inches
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-cinzel font-bold text-[#8C7A6B]">
                      Height in Centimeters
                    </label>
                    <span className="text-sm font-bold font-mono text-[#C59B27]">{heightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="145"
                    max="195"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className="w-full accent-[#C59B27] cursor-pointer"
                  />
                </div>
              )}

              {/* Footwear Choice */}
              <div className="space-y-2">
                <label className="block text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-wider">
                  Primary Footwear Paired with Garment
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setFootwear('flats')}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      footwear === 'flats'
                        ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#241E19] ring-2 ring-[#C59B27]/40 shadow-sm'
                        : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#F0EAE0]/60 dark:bg-[#1A1613]'
                    }`}
                  >
                    <Footprints className="w-5 h-5 text-[#C59B27] mx-auto mb-1" />
                    <span className="block text-xs font-bold font-serif">Flats & Juttis</span>
                    <span className="text-[10px] text-[#8C7A6B]">0" Heel Height</span>
                  </button>

                  <button
                    onClick={() => setFootwear('low_heels')}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      footwear === 'low_heels'
                        ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#241E19] ring-2 ring-[#C59B27]/40 shadow-sm'
                        : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#F0EAE0]/60 dark:bg-[#1A1613]'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 text-[#C59B27] mx-auto mb-1" />
                    <span className="block text-xs font-bold font-serif">Kitten Heels</span>
                    <span className="text-[10px] text-[#8C7A6B]">1.5"–2" Lift</span>
                  </button>

                  <button
                    onClick={() => setFootwear('high_heels')}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      footwear === 'high_heels'
                        ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#241E19] ring-2 ring-[#C59B27]/40 shadow-sm'
                        : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#F0EAE0]/60 dark:bg-[#1A1613]'
                    }`}
                  >
                    <Crown className="w-5 h-5 text-[#C59B27] mx-auto mb-1" />
                    <span className="block text-xs font-bold font-serif">Bridal Heels</span>
                    <span className="text-[10px] text-[#8C7A6B]">3"+ Stilettos</span>
                  </button>
                </div>
              </div>

              {/* Real-time Hem Clearance Insight */}
              <div className="p-4 bg-[#181411] text-[#FAF7F2] rounded-2xl border border-[#C59B27]/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-cinzel font-bold text-[#E8D59E]">
                  <Ruler className="w-4 h-4 text-[#C59B27]" /> Calculated Abaya & Peshwas Cut: {recommendedAbayaLength}" (Length {recommendedAbayaLength})
                </div>
                <p className="text-[11px] text-[#C5BAAC]">
                  Based on your {heightUnit === 'ft_in' ? `${heightFeet}'${heightInches}"` : `${heightCm}cm`} height with {footwear.replace('_', ' ')}, our Lahore master tailors will cut at exactly {recommendedAbayaLength} inches from high shoulder point for ideal modest drape without drag.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: PRECISION TAPE MEASUREMENTS */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-wider">
                    Step 2 of 5: Anatomical Tape
                  </span>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold">
                    Body & Garment Dimensions (Inches)
                  </h3>
                </div>

                <button
                  onClick={handleAutoEstimateMeasurements}
                  className="px-3 py-1.5 bg-[#C59B27]/20 border border-[#C59B27] text-[#8C6B1B] dark:text-[#E8D59E] hover:bg-[#C59B27] hover:text-[#181411] rounded-xl text-xs font-cinzel font-bold transition-all flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Auto-Estimate
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Bust */}
                <div className="p-3.5 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                      Bust / Chest Circumference
                    </label>
                    <span className="text-xs font-mono font-bold text-[#C59B27]">{bustInches}"</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="54"
                    step="0.5"
                    value={bustInches}
                    onChange={(e) => setBustInches(Number(e.target.value))}
                    className="w-full accent-[#C59B27] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#8C7A6B]">Measure fullest part across bust</span>
                </div>

                {/* Waist */}
                <div className="p-3.5 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                      Natural Waist Circumference
                    </label>
                    <span className="text-xs font-mono font-bold text-[#C59B27]">{waistInches}"</span>
                  </div>
                  <input
                    type="range"
                    min="24"
                    max="48"
                    step="0.5"
                    value={waistInches}
                    onChange={(e) => setWaistInches(Number(e.target.value))}
                    className="w-full accent-[#C59B27] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#8C7A6B]">Measure narrowest point above navel</span>
                </div>

                {/* Hips */}
                <div className="p-3.5 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                      Full Hips Circumference
                    </label>
                    <span className="text-xs font-mono font-bold text-[#C59B27]">{hipInches}"</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="58"
                    step="0.5"
                    value={hipInches}
                    onChange={(e) => setHipInches(Number(e.target.value))}
                    className="w-full accent-[#C59B27] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#8C7A6B]">Measure fullest part around hips/seat</span>
                </div>

                {/* Across Shoulders */}
                <div className="p-3.5 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                      Across-Shoulder Span
                    </label>
                    <span className="text-xs font-mono font-bold text-[#C59B27]">{acrossShouldersInches}"</span>
                  </div>
                  <input
                    type="range"
                    min="13"
                    max="20"
                    step="0.5"
                    value={acrossShouldersInches}
                    onChange={(e) => setAcrossShouldersInches(Number(e.target.value))}
                    className="w-full accent-[#C59B27] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#8C7A6B]">Tip of shoulder bone to shoulder bone</span>
                </div>

                {/* Sleeve Length */}
                <div className="p-3.5 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                      Sleeve Length (Shoulder to Wrist)
                    </label>
                    <span className="text-xs font-mono font-bold text-[#C59B27]">{sleeveLengthInches}"</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="28"
                    step="0.5"
                    value={sleeveLengthInches}
                    onChange={(e) => setSleeveLengthInches(Number(e.target.value))}
                    className="w-full accent-[#C59B27] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#8C7A6B]">From shoulder tip down to wrist bone</span>
                </div>

                {/* Desired Garment Length */}
                <div className="p-3.5 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620]">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2]">
                      Desired Full Garment Length
                    </label>
                    <span className="text-xs font-mono font-bold text-[#C59B27]">{desiredLengthInches}"</span>
                  </div>
                  <input
                    type="range"
                    min="48"
                    max="64"
                    step="1"
                    value={desiredLengthInches}
                    onChange={(e) => setDesiredLengthInches(Number(e.target.value))}
                    className="w-full accent-[#C59B27] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#8C7A6B]">High shoulder point down to desired hem</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: MODEST SILHOUETTE, SLEEVE & NECKLINE */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <span className="text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-wider">
                  Step 3 of 5: Modest Silhouette & Cut
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold">
                  Sleeve Cuts, Necklines & Pockets
                </h3>
              </div>

              {/* Modest Fit Style */}
              <div className="space-y-2">
                <label className="block text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-wider">
                  Body Ease & Modest Drapery Preference
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setFitStyle('ultra_modest_loose')}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      fitStyle === 'ultra_modest_loose'
                        ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#241E19] ring-2 ring-[#C59B27]/40 shadow-sm'
                        : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#F0EAE0]/60 dark:bg-[#1A1613]'
                    }`}
                  >
                    <span className="block text-xs font-bold font-serif">Ultra Modest Flow</span>
                    <span className="text-[10px] text-[#8C7A6B]">+4" to 6" ease around chest & hip</span>
                  </button>

                  <button
                    onClick={() => setFitStyle('classic_regular')}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      fitStyle === 'classic_regular'
                        ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#241E19] ring-2 ring-[#C59B27]/40 shadow-sm'
                        : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#F0EAE0]/60 dark:bg-[#1A1613]'
                    }`}
                  >
                    <span className="block text-xs font-bold font-serif">Classic Modest</span>
                    <span className="text-[10px] text-[#8C7A6B]">+2.5" ease with natural drape</span>
                  </button>

                  <button
                    onClick={() => setFitStyle('tailored_structured')}
                    className={`p-3.5 rounded-2xl border text-center transition-all ${
                      fitStyle === 'tailored_structured'
                        ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#241E19] ring-2 ring-[#C59B27]/40 shadow-sm'
                        : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#F0EAE0]/60 dark:bg-[#1A1613]'
                    }`}
                  >
                    <span className="block text-xs font-bold font-serif">Tailored Structured</span>
                    <span className="text-[10px] text-[#8C7A6B]">Sculpted regal high-shoulder line</span>
                  </button>
                </div>
              </div>

              {/* Sleeve Style */}
              <div className="space-y-2">
                <label className="block text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-wider">
                  Sleeve Cut & Wrist Finish
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <button
                    onClick={() => setSleeveStyle('wide_kimono')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      sleeveStyle === 'wide_kimono'
                        ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#241E19] font-bold text-[#C59B27]'
                        : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#F0EAE0]/60 dark:bg-[#1A1613]'
                    }`}
                  >
                    Wide Kimono Flare
                  </button>
                  <button
                    onClick={() => setSleeveStyle('modest_wrist_buttons')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      sleeveStyle === 'modest_wrist_buttons'
                        ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#241E19] font-bold text-[#C59B27]'
                        : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#F0EAE0]/60 dark:bg-[#1A1613]'
                    }`}
                  >
                    Pearl Buttoned Cuff
                  </button>
                  <button
                    onClick={() => setSleeveStyle('elasticated_cuff')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      sleeveStyle === 'elasticated_cuff'
                        ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#241E19] font-bold text-[#C59B27]'
                        : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#F0EAE0]/60 dark:bg-[#1A1613]'
                    }`}
                  >
                    Smocked Elastic Cuff
                  </button>
                  <button
                    onClick={() => setSleeveStyle('lace_trim')}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      sleeveStyle === 'lace_trim'
                        ? 'border-[#C59B27] bg-[#FAF7F2] dark:bg-[#241E19] font-bold text-[#C59B27]'
                        : 'border-[#DDD3BC] dark:border-[#2E2620] bg-[#F0EAE0]/60 dark:bg-[#1A1613]'
                    }`}
                  >
                    Organza Scalloped
                  </button>
                </div>
              </div>

              {/* Functional Additions */}
              <div className="p-4 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620] space-y-3">
                <span className="text-xs font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] block">
                  Bespoke Functional Additions (Complimentary)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pocketPreference}
                      onChange={(e) => setPocketPreference(e.target.checked)}
                      className="accent-[#C59B27] w-4 h-4"
                    />
                    <span>Deep Inseam Side Pockets</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={nursingZipper}
                      onChange={(e) => setNursingZipper(e.target.checked)}
                      className="accent-[#C59B27] w-4 h-4"
                    />
                    <span>Concealed Nursing Zippers</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={matchingBelt}
                      onChange={(e) => setMatchingBelt(e.target.checked)}
                      className="accent-[#C59B27] w-4 h-4"
                    />
                    <span>Detachable Silk Sash Tie</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MONOGRAM & MASTER TAILOR NOTES */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <span className="text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-wider">
                  Step 4 of 5: Patron Personalization
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold">
                  Gold Monogram & Tailor Notes
                </h3>
              </div>

              {/* Patron Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-cinzel font-bold text-[#8C7A6B] mb-1">
                    Patron Full Name
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#F0EAE0] dark:bg-[#201A16] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-cinzel font-bold text-[#8C7A6B] mb-1">
                    Email Notification
                  </label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#F0EAE0] dark:bg-[#201A16] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-cinzel font-bold text-[#8C7A6B] mb-1">
                    WhatsApp Coordinates
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#F0EAE0] dark:bg-[#201A16] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl"
                  />
                </div>
              </div>

              {/* Gold Calligraphy Monogram */}
              <div className="p-4 bg-[#F0EAE0] dark:bg-[#201A16] rounded-2xl border border-[#DDD3BC] dark:border-[#2E2620] space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-cinzel font-bold text-[#1E1A17] dark:text-[#FAF7F2] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Embroidered Gold Monogram Initials (Optional)
                  </label>
                  <span className="text-[10px] text-[#8C7A6B]">Up to 3 Letters</span>
                </div>
                <input
                  type="text"
                  maxLength={5}
                  value={monogramInitials}
                  onChange={(e) => setMonogramInitials(e.target.value.toUpperCase())}
                  placeholder="e.g. E.V. or S.K."
                  className="w-full p-2.5 text-sm font-cinzel font-bold tracking-widest bg-white dark:bg-[#181411] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-[#C59B27]"
                />
                <span className="text-[10px] text-[#8C7A6B] block">
                  Hand-embroidered with metallic gold thread inside the neckline lining of your couture pieces.
                </span>
              </div>

              {/* Tailor Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-wider">
                  Special Tailoring Requests & Notes for Mumbai Master Cutters
                </label>
                <textarea
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Add 1 inch to sleeve for prayer coverage, widen bicep area, extra floor clearance for high heels..."
                  className="w-full p-3 text-xs bg-[#F0EAE0] dark:bg-[#201A16] border border-[#DDD3BC] dark:border-[#2E2620] rounded-xl text-[#1E1A17] dark:text-[#FAF7F2]"
                />
              </div>
            </div>
          )}

          {/* STEP 5: MASTER TAILOR BLUEPRINT CARD */}
          {currentStep === 5 && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center space-y-1">
                <span className="text-xs font-cinzel font-bold text-[#8C6B1B] dark:text-[#D4AF37] uppercase tracking-wider">
                  Bespoke Verification Complete
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold">
                  Maison AL-NOUREEN Master Tailor Blueprint
                </h3>
              </div>

              {/* Luxury Passport Card */}
              <div className="p-6 bg-[#181411] text-[#FAF7F2] rounded-3xl border-2 border-[#C59B27] shadow-2xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#C59B27]/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-[#C59B27]" />
                    <span className="font-cinzel text-sm font-bold text-[#E8D59E] tracking-widest uppercase">
                      Atelier Master Tailor Blueprint
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C59B27] bg-[#241E19] px-2.5 py-1 rounded-lg border border-[#C59B27]/40">
                    #{tailorCode}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-[#3B3026] pb-3">
                  <div>
                    <span className="text-[10px] text-[#8C7A6B] block">Patron:</span>
                    <span className="font-bold text-[#FAF7F2]">{clientName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C7A6B] block">Stature & Stance:</span>
                    <span className="font-bold text-[#FAF7F2]">
                      {heightUnit === 'ft_in' ? `${heightFeet}'${heightInches}"` : `${heightCm}cm`} ({footwear.replace('_', ' ')})
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C7A6B] block">Target Length:</span>
                    <span className="font-bold text-[#E8D59E]">{desiredLengthInches}"</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C7A6B] block">Sleeve Length:</span>
                    <span className="font-bold text-[#FAF7F2]">{sleeveLengthInches}"</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs border-b border-[#3B3026] pb-3">
                  <div>
                    <span className="text-[10px] text-[#8C7A6B] block">Bust:</span>
                    <span className="font-semibold">{bustInches}"</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C7A6B] block">Waist:</span>
                    <span className="font-semibold">{waistInches}"</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#8C7A6B] block">Hips:</span>
                    <span className="font-semibold">{hipInches}"</span>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#8C7A6B]">Modest Fit Preference:</span>
                    <span className="font-bold text-[#E8D59E]">{fitStyle.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C7A6B]">Sleeve & Wrist:</span>
                    <span>{sleeveStyle.replace(/_/g, ' ')}</span>
                  </div>
                  {monogramInitials && (
                    <div className="flex justify-between">
                      <span className="text-[#8C7A6B]">Gold Monogram:</span>
                      <span className="font-cinzel font-bold text-[#C59B27]">{monogramInitials}</span>
                    </div>
                  )}
                </div>

                {specialInstructions && (
                  <div className="p-3 bg-[#241E19] rounded-xl border border-[#3B3026] text-[11px] text-[#C5BAAC] italic">
                    "{specialInstructions}"
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={handleCopyCard}
                  className="py-3 px-4 bg-[#F0EAE0] dark:bg-[#241E19] hover:bg-[#E8DFC8] dark:hover:bg-[#342B23] border border-[#DDD3BC] dark:border-[#3B3026] rounded-xl text-xs font-cinzel font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  {copiedSummary ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-[#C59B27]" />}
                  <span>{copiedSummary ? 'Copied to Clipboard' : 'Copy Blueprint'}</span>
                </button>

                <button
                  onClick={handleCompleteAndSave}
                  className="flex-1 py-3 px-6 bg-[#C59B27] hover:bg-[#D4AF37] text-[#181411] rounded-xl font-cinzel font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save to Profile & Apply to Cart</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-6 py-4 border-t border-[#E8DFC8] dark:border-[#2E2620] bg-[#FAF7F2] dark:bg-[#181411] flex items-center justify-between">
          <button
            disabled={currentStep === 1}
            onClick={handleBack}
            className="px-4 py-2 rounded-xl border border-[#DDD3BC] dark:border-[#3B3026] text-xs font-cinzel font-bold disabled:opacity-30 flex items-center gap-1.5 text-[#1E1A17] dark:text-[#FAF7F2] hover:bg-[#F0EAE0] dark:hover:bg-[#201A16] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <span className="text-xs text-[#8C7A6B] font-mono font-bold">
            {currentStep} / 5
          </span>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-[#181411] dark:bg-[#C59B27] text-[#E8D59E] dark:text-[#181411] border border-[#C59B27] text-xs font-cinzel font-bold flex items-center gap-1.5 hover:opacity-90 transition-all shadow-sm"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCompleteAndSave}
              className="px-5 py-2 rounded-xl bg-[#C59B27] hover:bg-[#D4AF37] text-[#181411] text-xs font-cinzel font-bold tracking-wider uppercase transition-all shadow-sm flex items-center gap-1.5"
            >
              Done <Check className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
