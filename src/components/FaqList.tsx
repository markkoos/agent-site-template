import type { Faq } from "@/lib/content";
import { faqSchema } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

/**
 * Visible Q&A + FAQPage schema. Questions phrased the way people ask them,
 * answered in the first sentence — the format answer engines extract.
 */
export function FaqList({ faqs, withSchema = true }: { faqs: Faq[]; withSchema?: boolean }) {
  if (!faqs.length) return null;
  return (
    <div className="divide-y divide-border/60 border-y border-border/60">
      {faqs.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
            <h3 className="font-serif text-xl leading-snug">{f.q}</h3>
            <span aria-hidden="true" className="mt-1 text-accent transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{f.a}</p>
        </details>
      ))}
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
    </div>
  );
}
