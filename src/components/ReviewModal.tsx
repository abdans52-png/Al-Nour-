import React, { useState } from 'react';
import { X, Star, Upload, Sparkles, Check } from 'lucide-react';
import { ProductReview } from '../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  onSubmitReview: (review: Partial<ProductReview>) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productName,
  onSubmitReview
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [fitRating, setFitRating] = useState<'Runs Small' | 'True to Size' | 'Runs Large'>('True to Size');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !comment || !title) return;

    onSubmitReview({
      id: `rev-user-${Date.now()}`,
      author,
      location: location || 'Verified Patron',
      rating,
      date: 'Today',
      title,
      comment,
      verifiedPurchase: true,
      fitRating,
      productName,
      helpfulCount: 1
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] w-full max-w-lg rounded-2xl border border-[#C59B27]/40 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#181411] text-[#FAF7F2] p-4 flex items-center justify-between border-b border-[#C59B27]/30">
          <div>
            <h3 className="font-cinzel text-base font-bold text-[#E8D59E] tracking-wider">
              Share Your Experience
            </h3>
            <p className="text-[11px] text-[#A69788] truncate max-w-xs">{productName}</p>
          </div>
          <button onClick={onClose} className="text-[#A69788] hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3 bg-[#FAF7F2]">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#181411] border border-[#C59B27] flex items-center justify-center text-[#E8D59E]">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="font-cinzel text-lg font-bold text-[#1E1A17]">Thank You, Noble Patron</h4>
            <p className="text-xs text-[#6E6053]">
              Your verified review has been submitted to the AL-NOUREEN Atelier curation team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            {/* Rating Stars */}
            <div>
              <label className="block text-[11px] font-sans-ui font-semibold text-[#1E1A17] uppercase tracking-wider mb-1.5">
                Overall Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={`review-modal-star-${star}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-[#C59B27] focus:outline-hidden transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'fill-[#C59B27] text-[#C59B27]'
                          : 'text-[#DDD3BC]'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-cinzel text-xs font-semibold text-[#8C6B1B]">
                  {rating === 5 ? 'Exceptional Luxury' : rating === 4 ? 'Very Good' : 'Satisfactory'}
                </span>
              </div>
            </div>

            {/* Fit Evaluation */}
            <div>
              <label className="block text-[11px] font-sans-ui font-semibold text-[#1E1A17] uppercase tracking-wider mb-1.5">
                Modest Sizing Fit
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Runs Small', 'True to Size', 'Runs Large'] as const).map((fit, fIdx) => (
                  <button
                    type="button"
                    key={`review-modal-fit-${fit}-${fIdx}`}
                    onClick={() => setFitRating(fit)}
                    className={`py-2 px-2 text-center rounded-lg border text-xs transition-colors ${
                      fitRating === fit
                        ? 'bg-[#181411] text-[#E8D59E] border-[#C59B27] font-semibold'
                        : 'bg-white border-[#DDD3BC] text-[#5E5043] hover:bg-[#F2ECE0]'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Author Name & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-sans-ui font-semibold text-[#1E1A17] mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Maryam Al-Sabah"
                  className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-sans-ui font-semibold text-[#1E1A17] mb-1">
                  City / Country
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. London, UK"
                  className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>
            </div>

            {/* Headline */}
            <div>
              <label className="block text-[11px] font-sans-ui font-semibold text-[#1E1A17] mb-1">
                Review Headline *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Magnificent silk drape and exquisite embroidery"
                className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
              />
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-[11px] font-sans-ui font-semibold text-[#1E1A17] mb-1">
                Your Review *
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts on fabric quality, modest fit, craftsmanship, and occasion wear styling..."
                className="w-full px-3 py-2 bg-white border border-[#DDD3BC] rounded-lg focus:outline-hidden focus:border-[#C59B27]"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-sans-ui text-[#6E6053] hover:text-[#181411]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#181411] text-[#E8D59E] hover:bg-[#2B231D] border border-[#C59B27] rounded-xl font-cinzel font-semibold text-xs tracking-wider transition-colors shadow-sm"
              >
                Publish Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
