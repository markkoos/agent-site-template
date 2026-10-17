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
    <div className="faq">
      {faqs.map((f) => (
        <details key={f.q}>
          <summary>
            <h3 style={{ display: "inline", fontSize: "1rem", fontFamily: "inherit" }}>{f.q}</h3>
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
    </div>
  );
}
