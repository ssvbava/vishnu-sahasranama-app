export interface Name {
  number: number;
  sanskrit: string;
  transliteration: string;
  meaning: string;
}

export interface Shloka {
  id: number;
  number: number;
  sanskrit: string;
  transliteration: string;
  names: Name[];
  audioUrl: string;
  startTime?: number; // Start time in seconds
  endTime?: number;   // End time in seconds
}

export interface Metadata {
  title: string;
  subtitle: string;
  source: string;
  totalShlokas: number;
  totalNames: number;
  description: string;
  audioSource?: string;
}

export interface ShlokaData {
  metadata: Metadata;
  shlokas: Shloka[];
}
