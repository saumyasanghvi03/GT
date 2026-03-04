import { Verse } from "@/types/stotra";

interface VerseCardProps {
  verse: Verse;
  label?: string;
}

export function VerseCard({ verse, label }: VerseCardProps) {
  return (
    <article className="rounded-2xl border border-saffron-100 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 space-y-4">
      {label && (
        <div className="text-xs font-medium text-saffron-600 dark:text-temple-gold uppercase tracking-wide">
          {label} {verse.id}
        </div>
      )}
      <p className="text-xl leading-loose text-stone-900 dark:text-stone-100 whitespace-pre-line">
        {verse.gujarati}
      </p>
      <p className="text-sm italic text-stone-500 dark:text-stone-400 leading-relaxed whitespace-pre-line">
        {verse.transliteration}
      </p>
      <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
        {verse.translation}
      </p>
    </article>
  );
}
