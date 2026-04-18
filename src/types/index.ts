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
}

export interface Metadata {
  title: string;
  subtitle: string;
  source: string;
  totalShlokas: number;
  totalNames: number;
  description: string;
}

export interface ShlokaData {
  metadata: Metadata;
  shlokas: Shloka[];
}
