export interface RitualStep {
  id: number;
  actionEn: string;
  actionGu: string;
  recitationEn: string;
  recitationGu: string;
  genderSpecific?: boolean;
}

export interface DevvandanSequence {
  id: number;
  nameEn: string;
  nameGu: string;
  descriptionEn: string;
  descriptionGu: string;
}

export interface BhavaYatraStation {
  id: number;
  nameEn: string;
  nameGu: string;
  focusEn: string;
  focusGu: string;
  verseEn?: string;
  verseGu?: string;
  actionsEn?: string[];
  actionsGu?: string[];
}

export interface NavpadDay {
  day: number;
  entityEn: string;
  entityGu: string;
  focusEn: string;
  focusGu: string;
  isToday?: boolean;
}

export interface PujaSubstance {
  id: number;
  nameEn: string;
  nameGu: string;
  meaningEn: string;
  meaningGu: string;
}

export interface ShatrunjayaName {
  nameEn: string;
  nameGu: string;
  meaningEn: string;
  meaningGu: string;
}
