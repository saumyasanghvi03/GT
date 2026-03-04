import { navkarMantra } from "./navkar-mantra";
import { uvasaggaharam } from "./uvasaggaharam";

export interface SearchItem {
  id: string;
  title: string;
  titleGu: string;
  type: "stotra" | "stop" | "step" | "vidhi";
  href: string;
  snippet: string;
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  // Stotras
  items.push({
    id: "navkar",
    title: "Navkar Mantra",
    titleGu: "નવકાર મંત્ર",
    type: "stotra",
    href: "/navkar-mantra",
    snippet: "Namo Arihantanam - The supreme Jain prayer",
  });

  items.push({
    id: "uvasaggaharam",
    title: "Uvasaggaharam Stotra",
    titleGu: "ઉવસગ્ગહરં સ્તોત્ર",
    type: "stotra",
    href: "/uvasaggaharam-stotra",
    snippet: "Uvasagharam Parshwanath - Remover of obstacles",
  });

  items.push({
    id: "bhaktamar",
    title: "Bhaktamar Stotra",
    titleGu: "ભક્તામર સ્તોત્ર",
    type: "stotra",
    href: "/bhaktamar-stotra",
    snippet: "Bhaktamara Adinath Rishabhdev Manatunga - 44 verses",
  });

  // Add individual verses for deeper search
  for (const verse of navkarMantra.verses) {
    items.push({
      id: `navkar-${verse.id}`,
      title: `Navkar Mantra - Line ${verse.id}`,
      titleGu: `નવકાર મંત્ર - પંક્તિ ${verse.id}`,
      type: "stotra",
      href: "/navkar-mantra",
      snippet: verse.transliteration,
    });
  }

  for (const verse of uvasaggaharam.verses) {
    items.push({
      id: `uvasaggaharam-${verse.id}`,
      title: `Uvasaggaharam - Stanza ${verse.id}`,
      titleGu: `ઉવસગ્ગહરં - ગાથા ${verse.id}`,
      type: "stotra",
      href: "/uvasaggaharam-stotra",
      snippet: verse.transliteration.slice(0, 80),
    });
  }

  // Yatra stops
  const yatraStopNames = [
    "Ram Pol Gate",
    "Devaki's 6 Sons Deri",
    "Ulkajal Point",
    "Ajitnath Shantinath Shrines",
    "Chandan Chillan Talavadi",
    "Siddhshila",
    "Bhadva Hill Dungar",
  ];
  for (let i = 0; i < yatraStopNames.length; i++) {
    items.push({
      id: `yatra-${i + 1}`,
      title: `Chha Gaav Yatra - ${yatraStopNames[i]}`,
      titleGu: `છ ગાઉ યાત્રા - પડાવ ${i + 1}`,
      type: "stop",
      href: "/shatrunjay-yatra",
      snippet: `Stop ${i + 1} of the 12-mile Shatrunjay pilgrimage`,
    });
  }

  // Chaityavandan and Chaitri Punam
  items.push({
    id: "chaityavandan",
    title: "Chaityavandan Vidhi",
    titleGu: "ચૈત્યવંદન વિધિ",
    type: "step",
    href: "/chaityavandan",
    snippet: "Chaitya Vandan 16 step temple worship ritual",
  });

  items.push({
    id: "chaitri-punam",
    title: "Chaitri Punam Vidhi",
    titleGu: "ચૈત્રી પૂનમ વિધિ",
    type: "vidhi",
    href: "/chaitri-punam-vidhi",
    snippet: "Chaitri Purnima five Devvandan sequences",
  });

  return items;
}
