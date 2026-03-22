"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (
          options: { pageLanguage: string; autoDisplay: boolean },
          elementId: string
        ) => void;
      };
    };
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Prevent double init
    if (window.googleTranslateElementInit) return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Hide Google Translate branding & frame */
        .goog-te-banner-frame,
        .skiptranslate > iframe,
        #goog-gt-tt,
        .goog-te-balloon-frame {
          display: none !important;
        }
        body {
          top: 0 !important;
        }

        /* Style the select dropdown */
        #google_translate_element .goog-te-gadget {
          font-size: 0;
          margin: 0;
        }
        #google_translate_element .goog-te-gadget > span {
          display: none;
        }
        #google_translate_element .goog-te-gadget .goog-te-combo {
          font-size: 11px;
          font-family: inherit;
          padding: 2px 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: #d1d5db;
          outline: none;
          cursor: pointer;
          -webkit-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239ca3af'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 6px center;
          padding-right: 20px;
          max-width: 120px;
        }
        #google_translate_element .goog-te-gadget .goog-te-combo:hover {
          border-color: rgba(255, 255, 255, 0.4);
          background-color: rgba(255, 255, 255, 0.15);
        }
        #google_translate_element .goog-te-gadget .goog-te-combo option {
          background: #1f2937;
          color: #d1d5db;
        }
      `}</style>
      <div className="flex items-center gap-1.5">
        <svg
          className="w-3.5 h-3.5 text-gray-300 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"
          />
        </svg>
        <div id="google_translate_element" />
      </div>
    </>
  );
}
