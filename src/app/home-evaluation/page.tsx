import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { JsonLd } from "@/components/JsonLd";
import { ValuationForm } from "@/components/ValuationForm";
import { AGENT_ID, pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

const areas = site.serviceAreas.join(", ");

export const metadata = pageMetadata({
  title: "Free Home Valuation — What's My Home Worth?",
  description: `Get a private, no-obligation valuation of your home in ${areas} from ${site.brand.siteName}. Agent-prepared, based on recent comparable sales. Response within one business day.`,
  path: "/home-evaluation",
});

const faqs = [
  {
    q: "How is my home's value estimated?",
    a: "We hand-pick recent comparable sales near your home and adjust for size, condition, upgrades, lot and location, then factor in current buyer demand. An instant automated estimate, when shown, is only a starting point for that review.",
  },
  {
    q: "Is a home valuation the same as an appraisal?",
    a: "No. An appraisal is a formal opinion of value by a licensed appraiser, usually ordered by a lender. An agent valuation (a comparative market analysis) is a pricing guide to help you decide whether and when to sell.",
  },
  {
    q: "What raises a home's value the most before selling?",
    a: "Usually the low-cost items: decluttering, fresh neutral paint, obvious repairs, landscaping and lighting. Large remodels rarely return their full cost at sale. We'll tell you which updates matter for buyers at your price point.",
  },
];

export default function HomeEvaluationPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <Breadcrumbs items={[{ name: "Home evaluation", path: "/home-evaluation" }]} />
      <div className="mt-10 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="eyebrow">Home evaluation</div>
          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">What is your home worth today?</h1>
          <p className="mt-6 text-muted-foreground">
            A private, agent-prepared valuation — not just an automated estimate. We look at recent comparables,
            current demand in your micro-market, and what buyers are actually paying.
          </p>
          <ul className="mt-8 space-y-3 text-sm">
            {[
              "Prepared by a licensed agent, not only an algorithm",
              "Includes recent comparable sales and pricing strategy",
              "Response within one business day",
              "Complimentary and confidential",
            ].map((v) => (
              <li key={v} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-7">
          <div className="rounded-md border border-border/60 bg-card p-6 md:p-8">
            <ValuationForm />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Estimates are for information only and are not an appraisal. Your information is never sold — see our{" "}
            <a href="/privacy" className="underline underline-offset-4">
              privacy policy
            </a>
            .
          </p>
        </div>
      </div>

      <section className="mt-24 grid gap-12 border-t border-border/60 pt-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="eyebrow">Questions</div>
          <h2 className="mt-2 font-serif text-3xl">Home value FAQ</h2>
        </div>
        <div className="md:col-span-8">
          <FaqList faqs={faqs} />
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Home valuation",
          provider: { "@id": AGENT_ID },
          areaServed: site.serviceAreas.map((name) => ({ "@type": "City", name })),
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
    </div>
  );
}
