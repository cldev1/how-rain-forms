"use client";

import { StageIconId } from "./stageConfig";

const common = {
  width: 40,
  height: 40,
  viewBox: "0 0 48 48",
  fill: "none",
  "aria-hidden": true as const,
};

export function StageIcon({ id }: { id: StageIconId }) {
  switch (id) {
    case "cloud":
      return (
        <svg {...common}>
          <circle cx="36" cy="14" r="8" fill="#FFE566" />
          <path
            d="M14 34c-5 0-9-3.5-9-8s4-8 9-8c1.2-4.5 5.5-8 10.5-8 5.8 0 10.5 4.2 11 9.6 3.8.4 6.5 3.4 6.5 7.2 0 4-3.4 7.2-7.5 7.2H14z"
            fill="#FFFFFF"
            stroke="#B8D4F0"
            strokeWidth="1.5"
          />
        </svg>
      );
    case "thermo":
      return (
        <svg {...common}>
          <rect x="20" y="6" width="8" height="26" rx="4" fill="#FFF8F0" stroke="#E8C8A0" strokeWidth="1.5" />
          <circle cx="24" cy="36" r="7" fill="#FF8A6A" />
          <rect x="22.5" y="14" width="3" height="16" rx="1.5" fill="#FF8A6A" />
          <path d="M10 32l4-6 3 3 6-8" stroke="#7BC67E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "drops":
      return (
        <svg {...common}>
          <ellipse cx="24" cy="22" rx="14" ry="10" fill="#E8F4FF" stroke="#B8D4F0" strokeWidth="1.5" />
          <path d="M16 18c0-3 2.5-7 4-9 1.5 2 4 6 4 9a4 4 0 11-8 0z" fill="#7EC8FF" />
          <path d="M26 22c0-2.5 2-6 3.2-7.5 1.2 1.5 3.3 5 3.3 7.5a3.25 3.25 0 11-6.5 0z" fill="#A8DCFF" />
          <circle cx="20" cy="14" r="1.5" fill="#FFD070" opacity="0.9" />
          <circle cx="30" cy="16" r="1.2" fill="#FFD070" opacity="0.8" />
        </svg>
      );
    case "drizzle":
      return (
        <svg {...common}>
          <path
            d="M12 20c-4 0-7-2.8-7-6.2S8 7.5 12 7.5c1-3.6 4.4-6.3 8.4-6.3 4.6 0 8.4 3.4 8.8 7.7 3 .3 5.3 2.7 5.3 5.7 0 3.2-2.7 5.8-6 5.8H12z"
            fill="#F0F6FC"
            stroke="#B0C8E0"
            strokeWidth="1.4"
          />
          <path d="M16 28v6M22 27v7M28 28v6M34 27v5" stroke="#8EC8F0" strokeWidth="2.2" strokeLinecap="round" opacity="0.75" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path
            d="M10 18c-4.2 0-7.5-3-7.5-6.6S5.8 4.8 10 4.8c1.1-3.8 4.8-6.6 9-6.6 5 0 9 3.6 9.5 8.2 3.2.4 5.7 2.9 5.7 6.1 0 3.4-2.9 6.2-6.5 6.2H10z"
            fill="#D8E4F0"
            stroke="#9AB0C8"
            strokeWidth="1.4"
          />
          <path d="M14 26v10M20 24v12M26 26v10M32 24v11M38 27v8" stroke="#6EB0E0" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case "heavy":
      return (
        <svg {...common}>
          <path
            d="M9 17c-4.5 0-8-3.2-8-7S4.5 3 9 3c1.2-4 5.2-7 9.8-7 5.4 0 9.8 3.8 10.3 8.8C32.5 5.2 36 8 36 11.8c0 3.7-3.1 6.7-7 6.7H9z"
            fill="#C0D0E0"
            stroke="#8898A8"
            strokeWidth="1.4"
          />
          <path d="M12 24v14M18 22v16M24 24v14M30 22v15M36 25v12" stroke="#4A90C8" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="16" cy="40" r="2" fill="#7EC8FF" opacity="0.7" />
          <circle cx="28" cy="41" r="2.4" fill="#7EC8FF" opacity="0.7" />
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path
            d="M8 18c-4.2 0-7.5-3-7.5-6.6S3.8 4.8 8 4.8c1.1-3.8 4.8-6.6 9-6.6 5 0 9 3.6 9.5 8.2 3.2.4 5.7 2.9 5.7 6.1 0 3.4-2.9 6.2-6.5 6.2H8z"
            fill="#A8B8C8"
            stroke="#708090"
            strokeWidth="1.4"
          />
          <path d="M26 20l-8 10h6l-3 12 12-14h-7l6-8z" fill="#FFE566" stroke="#F0C040" strokeWidth="1" strokeLinejoin="round" />
          <path d="M12 28v8M18 30v6" stroke="#6EB0E0" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
        </svg>
      );
    default:
      return null;
  }
}
