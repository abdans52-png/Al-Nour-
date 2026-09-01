import React from 'react';

export const WhatsAppWidget: React.FC = () => {
  const whatsappUrl = `https://wa.me/919326294187?text=${encodeURIComponent(
    'Hello AL-NOUREEN, I would like to inquire about your collection.'
  )}`;

  return (
    <aside
      id="static-whatsapp-button-container"
      aria-label="WhatsApp Support"
      className="fixed bottom-6 right-6 z-50 pointer-events-auto"
    >
      <a
        id="static-whatsapp-link"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us directly on WhatsApp at +91 93262 94187"
        className="group relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_28px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-108 active:scale-95 border-2 border-white focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Subtle pulsating beacon behind button */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping -z-10 group-hover:opacity-0"
          style={{ animationDuration: '2.5s' }}
        />

        {/* Authentic SVG WhatsApp Logo Only - No Text / Spelling */}
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <path d="M16 2.5C8.544 2.5 2.5 8.544 2.5 16c0 2.656.766 5.138 2.088 7.234L3 30.5l7.466-1.556A13.435 13.435 0 0 0 16 29.5c7.456 0 13.5-6.044 13.5-13.5S23.456 2.5 16 2.5zm0 24.625c-2.316 0-4.484-.662-6.322-1.809l-.453-.281-4.434.925.938-4.322-.294-.469A11.136 11.136 0 0 1 4.875 16c0-6.134 4.991-11.125 11.125-11.125S27.125 9.866 27.125 16 22.134 27.125 16 27.125zm6.541-8.319c-.359-.181-2.128-1.05-2.459-1.169-.328-.122-.569-.181-.809.181-.241.359-.928 1.169-1.138 1.412-.209.241-.422.272-.781.091-.359-.181-1.516-.559-2.888-1.781-1.069-.953-1.791-2.131-2-2.494-.209-.359-.022-.553.159-.731.163-.163.359-.422.541-.634.181-.209.241-.359.359-.597.122-.241.063-.45-.031-.634-.094-.181-.809-1.95-1.109-2.672-.294-.7-.591-.606-.809-.619-.209-.009-.45-.009-.691-.009-.241 0-.634.091-.966.45-.328.359-1.259 1.231-1.259 3.003 0 1.772 1.291 3.484 1.472 3.725.181.241 2.541 3.881 6.156 5.441.859.372 1.531.594 2.053.759.866.275 1.653.238 2.275.144.694-.103 2.128-.869 2.428-1.709.3-.841.3-1.562.209-1.709-.088-.15-.328-.241-.688-.422z" />
        </svg>
      </a>
    </aside>
  );
};
