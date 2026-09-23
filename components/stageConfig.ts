export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type DewMood =
  | "curious"
  | "thinking"
  | "happy"
  | "cozy"
  | "splashy"
  | "excited"
  | "sparkly";

export interface StageConfig {
  id: StageId;
  label: string;
  /** Compact path label (avoids truncation) */
  shortLabel: string;
  /** Ultra-short kid line shown on the hero card */
  kidLine: string;
  /**
   * Parent reads aloud: the *reason* this step happens (cause → effect).
   * Always visible on phone — pedagogy, not a weather dashboard.
   */
  whyLine: string;
  /** Longer parent caption (optional under why) */
  caption: string;
  /** Kid-simple warmth word: warm / cooler / cold */
  tempLabel: "warm" | "cooler" | "cold";
  /** Optional °C for parent (labeled next to tempLabel) */
  tempC: number;
  /** 0–1 wet-air fill; UI shows as 1–5 drops */
  humidityLevel: number;
  /** Humidity kid phrase */
  humidityLabel: string;
  /** 0–1 thermometer fill for 3D thermo / HUD meter */
  warmthLevel: number;
  skyTop: string;
  skyBottom: string;
  /** Page chrome / hero accent */
  moodBg: string;
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

/**
 * Skies and rain use CATEGORY jumps (not subtle lerps) so stages read
 * differently on a ~390px phone. Rain grammar:
 * none → mist → sparse slow → steady → heavy → storm
 *
 * Pedagogy: every stage has whyLine + warmth/humidity that match the story
 * (warm ground + rising vapor early → cooler + fuller mid → heavy when raining).
 */
export const STAGES: StageConfig[] = [
  {
    id: 1,
    label: "Clouds",
    shortLabel: "Clouds",
    kidLine: "Water goes up!",
    whyLine:
      "Warm water leaves the puddle and floats up as tiny invisible drops.",
    caption: "Warm water goes up and makes a soft cloud.",
    tempLabel: "warm",
    tempC: 28,
    humidityLevel: 0.3,
    humidityLabel: "air filling",
    warmthLevel: 0.9,
    skyTop: "#6EC8FF",
    skyBottom: "#FFF6D8",
    moodBg: "linear-gradient(165deg, #9ED8FF 0%, #FFF6D8 55%, #DFF5D4 100%)",
    cloudColor: "#FFFFFF",
    cloudDarkness: 0,
    sunIntensity: 1.15,
    vapor: 1,
    mist: 0.05,
    rainCount: 0,
    rainSpeed: 0,
    rainSize: 0.03,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "curious",
    buttonBg: "#C8EBFF",
    buttonAccent: "#3A9AD4",
    icon: "cloud",
  },
  {
    id: 2,
    label: "Warm & Cool",
    shortLabel: "Warm",
    kidLine: "Up high it cools.",
    whyLine: "High up the air is colder, so the tiny drops slow down.",
    caption: "Warm wet air goes up. Up high it gets cooler.",
    tempLabel: "cooler",
    tempC: 10,
    humidityLevel: 0.5,
    humidityLabel: "air filling",
    warmthLevel: 0.45,
    skyTop: "#FF8A30",
    skyBottom: "#78B8FF",
    moodBg: "linear-gradient(165deg, #FFB060 0%, #FFE8C0 40%, #90C8FF 100%)",
    cloudColor: "#FFF8F0",
    cloudDarkness: 0.04,
    sunIntensity: 1.25,
    vapor: 0.85,
    mist: 0.08,
    rainCount: 0,
    rainSpeed: 0,
    rainSize: 0.03,
    showThermo: true,
    showCondensation: false,
    showLightning: false,
    dewMood: "curious",
    buttonBg: "#FFE0A0",
    buttonAccent: "#E08820",
    icon: "thermo",
  },
  {
    id: 3,
    label: "Tiny Drops",
    shortLabel: "Drops",
    kidLine: "Little drops form.",
    whyLine: "Cold air squeezes the drops together into a soft cloud.",
    caption: "Water sticks to tiny dust and makes little drops.",
    tempLabel: "cold",
    tempC: 5,
    humidityLevel: 0.7,
    humidityLabel: "cloud soft",
    warmthLevel: 0.22,
    skyTop: "#B8A0E8",
    skyBottom: "#E8F0FF",
    moodBg: "linear-gradient(165deg, #D0C0F0 0%, #E8F0FF 50%, #D8F0E0 100%)",
    cloudColor: "#F4F0FF",
    cloudDarkness: 0.12,
    sunIntensity: 0.55,
    vapor: 0.2,
    mist: 0.7,
    rainCount: 0,
    rainSpeed: 0,
    rainSize: 0.03,
    showThermo: false,
    showCondensation: true,
    showLightning: false,
    dewMood: "happy",
    buttonBg: "#E0D0FF",
    buttonAccent: "#7A5CBC",
    icon: "drops",
  },
  {
    id: 4,
    label: "Drizzle",
    shortLabel: "Drizzle",
    kidLine: "Soft drops fall.",
    whyLine: "The cloud gets a little heavy, so soft drops fall.",
    caption: "Soft little drops start to fall.",
    tempLabel: "cold",
    tempC: 5,
    humidityLevel: 0.8,
    humidityLabel: "cloud heavy",
    warmthLevel: 0.18,
    skyTop: "#9AB8D0",
    skyBottom: "#D8E8F4",
    moodBg: "linear-gradient(165deg, #B0C8DC 0%, #D8E8F4 55%, #C8DCC8 100%)",
    cloudColor: "#E8EEF4",
    cloudDarkness: 0.22,
    sunIntensity: 0.35,
    vapor: 0,
    mist: 0.35,
    rainCount: 68,
    rainSpeed: 0.95,
    rainSize: 0.085,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "cozy",
    buttonBg: "#D0E4F4",
    buttonAccent: "#5A8CB0",
    icon: "drizzle",
  },
  {
    id: 5,
    label: "Rain",
    shortLabel: "Rain",
    kidLine: "Steady rain!",
    whyLine: "The cloud is too heavy, so water falls down as rain.",
    caption: "Steady rain falls down to the ground.",
    tempLabel: "cold",
    tempC: 4,
    humidityLevel: 0.92,
    humidityLabel: "cloud full",
    warmthLevel: 0.14,
    skyTop: "#4A88C0",
    skyBottom: "#A0C4E0",
    moodBg: "linear-gradient(165deg, #6AA0D0 0%, #A8C8E4 55%, #90C090 100%)",
    cloudColor: "#D0DCE8",
    cloudDarkness: 0.34,
    sunIntensity: 0.18,
    vapor: 0,
    mist: 0.45,
    rainCount: 110,
    rainSpeed: 5.2,
    rainSize: 0.052,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "splashy",
    buttonBg: "#90C4E8",
    buttonAccent: "#2E6E9E",
    icon: "rain",
  },
  {
    id: 6,
    label: "Lots of Rain",
    shortLabel: "Lots",
    kidLine: "Big rain!",
    whyLine: "Even more water piles up, so lots of rain falls fast.",
    caption: "Big rain! Lots of drops.",
    tempLabel: "cold",
    tempC: 4,
    humidityLevel: 1,
    humidityLabel: "cloud full",
    warmthLevel: 0.12,
    skyTop: "#3A5A78",
    skyBottom: "#6A8AA8",
    moodBg: "linear-gradient(165deg, #4A6A88 0%, #7A9AB4 55%, #6A9A78 100%)",
    cloudColor: "#A8B8C8",
    cloudDarkness: 0.48,
    sunIntensity: 0.08,
    vapor: 0,
    mist: 0.6,
    rainCount: 240,
    rainSpeed: 9,
    rainSize: 0.072,
    showThermo: false,
    showCondensation: false,
    showLightning: false,
    dewMood: "excited",
    buttonBg: "#7AA8C8",
    buttonAccent: "#1E4A6E",
    icon: "heavy",
  },
  {
    id: 7,
    label: "Storm Fun",
    shortLabel: "Storm",
    kidLine: "Flash! Boom!",
    whyLine: "The heavy cloud rumbles and flashes while rain pours down.",
    caption: "Darker soft clouds, a friendly flash, and rain!",
    tempLabel: "cold",
    tempC: 3,
    humidityLevel: 1,
    humidityLabel: "cloud full",
    warmthLevel: 0.1,
    skyTop: "#3A3A68",
    skyBottom: "#6A5A88",
    moodBg: "linear-gradient(165deg, #4A4A78 0%, #7A6A98 45%, #FFB0D0 100%)",
    cloudColor: "#8890A8",
    cloudDarkness: 0.58,
    sunIntensity: 0.04,
    vapor: 0,
    mist: 0.55,
    rainCount: 320,
    rainSpeed: 12,
    rainSize: 0.09,
    showThermo: false,
    showCondensation: false,
    showLightning: true,
    dewMood: "sparkly",
    buttonBg: "#FFB8D0",
    buttonAccent: "#D04078",
    icon: "storm",
  },
];

export function getStage(id: StageId): StageConfig {
  return STAGES[id - 1];
}

/** Map 0–1 humidity to 1–5 filled drops for the kid UI */
export function humidityDrops(level: number): number {
  return Math.max(1, Math.min(5, Math.round(level * 5)));
}
