export interface Verse {
  id: number;
  gujarati: string;
  transliteration: string;
  translation: string;
}

export interface Stotra {
  slug: string;
  titleEn: string;
  titleGu: string;
  descriptionEn: string;
  descriptionGu: string;
  verses: Verse[];
}
