"use client";

export default function WhatsAppButton() {
  const phoneNumber = "5516996609312";
  const message = encodeURIComponent("Hello, I need help with my shipment.");
  const url = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] rounded-full shadow-lg hover:bg-[#1ebe57] transition-colors duration-200 hover:scale-110"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="w-7 h-7 fill-white"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.907 15.907 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.314 22.594c-.39 1.1-1.932 2.014-3.164 2.28-.844.18-1.946.324-5.656-1.216-4.746-1.97-7.8-6.79-8.036-7.104-.228-.314-1.86-2.48-1.86-4.73s1.178-3.356 1.596-3.814c.39-.428.918-.536 1.226-.536.36 0 .584.004.838.016.272.012.636-.102.994.758.39.93 1.326 3.234 1.442 3.468.118.234.196.508.04.82-.156.314-.234.508-.468.782-.234.274-.492.612-.702.82-.234.234-.478.488-.206.958.274.468 1.216 2.006 2.612 3.25 1.794 1.6 3.306 2.094 3.774 2.328.468.234.742.196 1.016-.118.274-.314 1.178-1.374 1.492-1.844.314-.468.628-.39 1.06-.234.43.156 2.734 1.29 3.202 1.524.468.234.78.352.898.546.116.196.116 1.12-.274 2.22z" />
      </svg>
    </a>
  );
}
