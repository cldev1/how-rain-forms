export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DewMood = "curious" | "thinking" | "happy" | "cozy" | "splashy" | "excited" | "sparkly";

export interface StageConfig {
  id: StageId;
  label: string;
  caption: string;
  skyTop: string;
  skyBottom: string;
  cloudColor: string;
  cloudDarkness: number;
  sunIntensity: number;
  vapor: number;
  mist: number;
  rainCount: number;
  rainSpeed: number;
  rainSize: number;
  showThermo: boolean;
  showCondensation: boolean;
  showLightning: boolean;
  dewMood: DewMood;
  buttonBg: string;
  buttonAccent: string;
  icon: StageIconId;
}

export type StageIconId =
  | "cloud"
  | "thermo"
  | "drops"
  | "drizzle"
  | "rain"
  | "heavy"
  | "storm";

export const STAGES: StageConfig[] = [
  {
    id: 1,
    label: "Clouds",
    caption: "Warm water goes up and makes a soft cloud.",
    skyTop: "#9ED4FF",
    skyBottom: "#F2F9FF",
    cloudColor: "#FFFFFF",
    cloudDarkness: 0,
    sunIntensity: 1,
    vapor: 1,
    mist: 0.15,
    rainCount: 0,
    rainSpeed: 0,
    rainSize: 0.04,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "curious",
    buttonBg: "#C8EBFF",
    buttonAccent: "#5BA8E0",
    icon: "cloud",
  },
  {
    id: 2,
    label: "Warm & Cool",
    caption: "Warm wet air goes up. Up high it gets cooler.",
    skyTop: "#8EC8FF",
    skyBottom: "#FFF3DE",
    cloudColor: "#F7FBFF",
    cloudDarkness: 0.05,
    sunIntensity: 1.1,
    vapor: 0.75,
    mist: 0.1,
    rainCount: 0,
    rainSpeed: 0,
    rainSize: 0.04,
    showThermo: true,
    showCondensation: false,
    showLightning: false,
    dewMood: "thinking",
    buttonBg: "#FFE6B0",
    buttonAccent: "#E0A040",
    icon: "thermo",
  },
  {
    id: 3,
    label: "Tiny Drops",
    caption: "Water sticks to tiny dust and makes little drops.",
    skyTop: "#8BBFEF",
    skyBottom: "#E8F4FF",
    cloudColor: "#F2F8FF",
    cloudDarkness: 0.1,
    sunIntensity: 0.85,
    vapor: 0.25,
    mist: 0.35,
    rainCount: 0,
    rainSpeed: 0,
    rainSize: 0.04,
    showThermo: false,
    showCondensation: true,
    showLightning: false,
    dewMood: "happy",
    buttonBg: "#D4F5B8",
    buttonAccent: "#6BB04A",
    icon: "drops",
  },
  {
    id: 4,
    label: "Drizzle",
    caption: "Soft little drops start to fall.",
    skyTop: "#7EB4E6",
    skyBottom: "#DCEEFF",
    cloudColor: "#EAF1F8",
    cloudDarkness: 0.18,
    sunIntensity: 0.55,
    vapor: 0,
    mist: 0.4,
    rainCount: 45,
    rainSpeed: 2.2,
    rainSize: 0.032,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "cozy",
    buttonBg: "#D6EEFF",
    buttonAccent: "#5A9BC8",
    icon: "drizzle",
  },
  {
    id: 5,
    label: "Rain",
    caption: "Steady rain falls down to the ground.",
    skyTop: "#6FA5D4",
    skyBottom: "#C5DFF2",
    cloudColor: "#DCE5EF",
    cloudDarkness: 0.28,
    sunIntensity: 0.35,
    vapor: 0,
    mist: 0.5,
    rainCount: 130,
    rainSpeed: 5,
    rainSize: 0.048,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "splashy",
    buttonBg: "#A8D4F0",
    buttonAccent: "#3E7EAE",
    icon: "rain",
  },
  {
    id: 6,
    label: "Lots of Rain",
    caption: "Big rain! Lots of drops.",
    skyTop: "#5E92C0",
    skyBottom: "#A8C8E0",
    cloudColor: "#C5D2DE",
    cloudDarkness: 0.38,
    sunIntensity: 0.2,
    vapor: 0,
    mist: 0.65,
    rainCount: 230,
    rainSpeed: 8,
    rainSize: 0.062,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "excited",
    buttonBg: "#8EC0E0",
    buttonAccent: "#2F6A98",
    icon: "heavy",
  },
  {
    id: 7,
    label: "Storm Fun",
    caption: "Darker soft clouds, a friendly flash, and rain!",
    skyTop: "#5F84AE",
    skyBottom: "#92B0CC",
    cloudColor: "#A8B8C8",
    cloudDarkness: 0.48,
    sunIntensity: 0.1,
    vapor: 0,
    mist: 0.7,
    rainCount: 270,
    rainSpeed: 9,
    rainSize: 0.068,
    showThermo: false,
    showCondensation: false,
    showLightning: true,
    dewMood: "sparkly",
    buttonBg: "#FFC0D4",
    buttonAccent: "#E06090",
    icon: "storm",
  },
];

export function getStage(id: StageId): StageConfig {
  return STAGES[id - 1];
}
