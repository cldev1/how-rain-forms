export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface StageConfig {
  id: StageId;
  label: string;
  emoji: string;
  caption: string;
  skyTop: string;
  skyBottom: string;
  cloudColor: string;
  cloudDarkness: number;
  vapor: number;
  rainCount: number;
  rainSpeed: number;
  rainSize: number;
  showThermo: boolean;
  showCondensation: boolean;
  showLightning: boolean;
  dewMood: "happy" | "curious" | "cozy" | "excited";
  buttonBg: string;
}

export const STAGES: StageConfig[] = [
  {
    id: 1,
    label: "Clouds",
    emoji: "☁️",
    caption: "Warm water goes up and makes a soft cloud.",
    skyTop: "#A8D8FF",
    skyBottom: "#E8F4FF",
    cloudColor: "#FFFFFF",
    cloudDarkness: 0,
    vapor: 1,
    rainCount: 0,
    rainSpeed: 0,
    rainSize: 0.04,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "curious",
    buttonBg: "#B8E0FF",
  },
  {
    id: 2,
    label: "Warm & Cool",
    emoji: "🌡️",
    caption: "Warm wet air goes up. Up high it gets cooler.",
    skyTop: "#9ED0FF",
    skyBottom: "#FFF0D6",
    cloudColor: "#F5FBFF",
    cloudDarkness: 0.05,
    vapor: 0.7,
    rainCount: 0,
    rainSpeed: 0,
    rainSize: 0.04,
    showThermo: true,
    showCondensation: false,
    showLightning: false,
    dewMood: "curious",
    buttonBg: "#FFE0A0",
  },
  {
    id: 3,
    label: "Tiny Drops",
    emoji: "💧",
    caption: "Water sticks to tiny dust and makes little drops.",
    skyTop: "#98C8F5",
    skyBottom: "#E0F0FF",
    cloudColor: "#F0F7FF",
    cloudDarkness: 0.1,
    vapor: 0.2,
    rainCount: 0,
    rainSpeed: 0,
    rainSize: 0.04,
    showThermo: false,
    showCondensation: true,
    showLightning: false,
    dewMood: "happy",
    buttonBg: "#C5F0A8",
  },
  {
    id: 4,
    label: "Drizzle",
    emoji: "🌦️",
    caption: "Soft little drops start to fall.",
    skyTop: "#8EBEED",
    skyBottom: "#D8ECFF",
    cloudColor: "#E8F0F8",
    cloudDarkness: 0.15,
    vapor: 0,
    rainCount: 40,
    rainSpeed: 2.5,
    rainSize: 0.035,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "cozy",
    buttonBg: "#D4EFFF",
  },
  {
    id: 5,
    label: "Rain",
    emoji: "🌧️",
    caption: "Steady rain falls down to the ground.",
    skyTop: "#7BAFD9",
    skyBottom: "#C8E0F5",
    cloudColor: "#DDE6EF",
    cloudDarkness: 0.25,
    vapor: 0,
    rainCount: 120,
    rainSpeed: 5,
    rainSize: 0.05,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "cozy",
    buttonBg: "#A8D4F0",
  },
  {
    id: 6,
    label: "Lots of Rain",
    emoji: "💦",
    caption: "Big rain! Lots of drops.",
    skyTop: "#6A9CC8",
    skyBottom: "#B0D0E8",
    cloudColor: "#C8D4E0",
    cloudDarkness: 0.35,
    vapor: 0,
    rainCount: 220,
    rainSpeed: 8,
    rainSize: 0.065,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "excited",
    buttonBg: "#8EC0E0",
  },
  {
    id: 7,
    label: "Storm Fun",
    emoji: "⚡",
    caption: "Darker soft clouds, a friendly flash, and rain!",
    skyTop: "#6B8FB8",
    skyBottom: "#9BB8D4",
    cloudColor: "#A8B8C8",
    cloudDarkness: 0.45,
    vapor: 0,
    rainCount: 260,
    rainSpeed: 9,
    rainSize: 0.07,
    showThermo: false,
    showCondensation: false,
    showLightning: true,
    dewMood: "excited",
    buttonBg: "#FFB4C8",
  },
];

export function getStage(id: StageId): StageConfig {
  return STAGES[id - 1];
}
