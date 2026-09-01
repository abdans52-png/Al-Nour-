import React, { useState } from 'react';
import { ProductReview, ScreenType } from '../types';
import { REVIEWS } from '../data/reviews';
import { Star, CheckCircle, Sparkles, MessageSquarePlus, ThumbsUp, Filter } from 'lucide-react';
import { ReviewModal } from '../components/ReviewModal';

interface ReviewsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ReviewsScreen: React.FC<ReviewsScreenProps> = ({ onNavigate }) => {
  const [reviewsList, setReviewsList] = useState<ProductReview[]>(REVIEWS);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  const averageRating = (
    reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length
  ).toFixed(1);

  const filteredReviews = reviewsList.filter((r) =>
    selectedRatingFilter === 'all' ? true : r.rating === selectedRatingFilter
  );

  const handleAddReview = (newRev: Partial<ProductReview>) => {
    setReviewsList((prev) => [newRev as ProductReview, ...prev]);
  };

  return (
    <div id="screen-customer-reviews" className="w-full bg-[#FAF7F2] text-[#1E1A17] pb-16">
      {/* Hero Banner */}
      <div className="bg-[#181411] text-[#FAF7F2] py-14 px-4 sm:px-6 text-center border-b border-[#C59B27]/40">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#28221D] border border-[#C59B27]/40 rounded-full text-[11px] font-sans-ui text-[#E8D59E] uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" /> Verified Patron Testimonials
          </span>
          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wide text-white">
            Client Voices & Atelier Reviews
          </h1>
          <p className="text-xs sm:text-sm text-[#C5BAAC] font-sans-ui max-w-xl mx-auto">
            Discover honest feedback from patrons across Dubai, London, Toronto, Lahore, and New York enjoying AL-NOUREEN modest couture.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        {/* Rating Breakdown & Write Review CTA */}
        <div className="bg-[#F7F2E8] p-6 sm:p-8 rounded-3xl border border-[#DDD3BC] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          {/* Average Score */}
          <div className="flex items-center gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-[#181411] border border-[#C59B27] flex flex-col items-center justify-center text-[#E8D59E] shadow-sm">
              <span className="font-cinzel text-2xl font-bold">{averageRating}</span>
              <span className="text-[10px] text-[#A69788] uppercase">out of 5</span>
            </div>
            <div>
              <div className="flex items-center gap-1 text-[#C59B27] mb-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={`summary-star-${i}`} className="w-4 h-4 fill-[#C59B27]" />
                ))}
              </div>
              <h3 className="font-cinzel text-base font-bold text-[#1E1A17]">
                98% Exceptional Satisfaction
              </h3>
              <p className="text-xs text-[#6E6053] font-sans-ui">
                Based on over 340+ verified global customer orders
              </p>
            </div>
          </div>

          {/* Write a Review Button */}
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="w-full sm:w-auto px-6 py-3 bg-[#181411] hover:bg-[#2B231D] text-[#E8D59E] border border-[#C59B27] rounded-xl font-cinzel font-semibold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <MessageSquarePlus className="w-4 h-4" />
            Write a Patron Review
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between border-b border-[#DDD3BC] pb-3">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-cinzel font-semibold text-[#8C6B1B] mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['all', 5, 4, 3] as const).map((r, rIdx) => (
              <button
                key={`rev-screen-filter-${r}-${rIdx}`}
                onClick={() => setSelectedRatingFilter(r)}
                className={`px-3 py-1 text-xs rounded-full transition-colors font-sans-ui ${
                  selectedRatingFilter === r
                    ? 'bg-[#181411] text-[#E8D59E] font-semibold'
                    : 'bg-[#F0EAE0] text-[#54463A] hover:bg-[#E2D8C7]'
                }`}
              >
                {r === 'all' ? 'All Reviews' : `${r} Stars ★`}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#7A6B5D] font-sans-ui hidden sm:inline">
            Showing {filteredReviews.length} reviews
          </span>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map((rev, revIdx) => (
            <div
              key={`rev-card-${rev.id}-${rev.author}-${revIdx}`}
              className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#E0D5BE] shadow-xs flex flex-col justify-between space-y-4 hover:border-[#C59B27]/60 transition-all"
            >
              <div className="space-y-2.5">
                {/* Header: Stars + Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C59B27]">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={`rev-${rev.id}-star-${i}`} className="w-4 h-4 fill-[#C59B27]" />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#8C7A6B] font-sans-ui">{rev.date}</span>
                </div>

                {/* Title */}
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#1E1A17]">
                  {rev.title}
                </h4>

                {/* Comment */}
                <p className="text-xs sm:text-sm font-sans-ui text-[#4A3E34] leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {/* Footer Meta */}
              <div className="pt-3 border-t border-[#E8DFC8] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {rev.userImage ? (
                    <img
                      src={rev.userImage}
                      alt={rev.author}
                      className="w-8 h-8 rounded-full object-cover border border-[#C59B27]/40"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#181411] text-[#E8D59E] flex items-center justify-center font-cinzel font-bold text-xs">
                      {rev.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#1E1A17] flex items-center gap-1">
                      {rev.author}
                      {rev.verifiedPurchase && (
                        <CheckCircle className="w-3.5 h-3.5 text-[#0A7B54]" title="Verified Purchase" />
                      )}
                    </p>
                    <p className="text-[10px] text-[#8C7A6B]">{rev.location || 'Verified Buyer'}</p>
                  </div>
                </div>

                {rev.productName && (
                  <div className="text-right max-w-[150px]">
                    <span className="text-[9.5px] uppercase text-[#8C6B1B] font-semibold block truncate">
                      {rev.productName}
                    </span>
                    {rev.fitRating && (
                      <span className="text-[9px] text-[#7A6B5D] bg-[#F0EAE0] px-1.5 py-0.5 rounded-sm">
                        Fit: {rev.fitRating}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReviewModal
        isOpen={isWriteModalOpen}
        onClose={() => setIsWriteModalOpen(false)}
        productName="AL-NOUREEN Haute Couture Experience"
        onSubmitReview={handleAddReview}
      />
    </div>
  );
};
