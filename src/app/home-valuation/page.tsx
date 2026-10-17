import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { ValuationForm } from "@/components/ValuationForm";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

const areas = site.serviceAreas.join(", ");

export const metadata = pageMetadata({
  title: "What's My Home Worth? Free Home Value Estimate",
  description: `Get a free instant home value estimate for ${areas}, plus a personal comparative market analysis from ${site.agent.name}.`,
  path: "/home-valuation",
});

const faqs = [
  {
    q: "How is my home's value estimated?",
    a: "The instant number comes from an automated valuation model that compares your home's public-record details with recent nearby sales. A comparative market analysis (CMA) goes further: a local agent hand-picks comparable sales and adjusts for condition, upgrades, lot and location.",
  },
  {
    q: "Is a home value estimate the same as an appraisal?",
    a: "No. An appraisal is a formal opinion of value by a licensed appraiser, usually ordered by a lender during a purchase or refinance. An online estimate or CMA is a pricing guide to help you decide whether and when to sell.",
  },
  {
    q: "What raises a home's value the most before selling?",
    a: "Usually the low-cost items: decluttering, fresh neutral paint, fixing obvious repairs, curb appeal and good lighting. Big remodels rarely return their full cost at sale. I can tell you which updates matter for buyers in your price range.",
  },
];

export default function ValuationPage() {
  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <Breadcrumbs items={[{ name: "Home value", path: "/home-valuation" }]} />
      <div className="detail-layout" style={{ marginTop: 0 }}>
        <div>
          <p className="eyebrow">Free home valuation</p>
          <h1>What&apos;s my home worth?</h1>
          <p className="muted" style={{ fontSize: "1.1rem" }}>
            Enter your address for an estimate based on recent sales near you, then get a personal pricing review from
            someone who actually walks these neighborhoods.
          </p>
          <ValuationForm />
          <p className="small muted" style={{ marginTop: 16 }}>
            Estimates are for informational purposes only and are not an appraisal. Your information is never sold —
            see our <a href="/privacy">privacy policy</a>.
          </p>
        </div>
        <aside>
          <div className="card card-body">
            <h2 style={{ fontSize: "1.2rem" }}>What you&apos;ll get</h2>
            <ul className="small">
              <li>An instant estimate and likely value range</li>
              <li>A personal comparative market analysis (CMA)</li>
              <li>Recent sales and active competition near you</li>
              <li>Advice on which prep work is worth it</li>
            </ul>
          </div>
        </aside>
      </div>

      <section className="narrow" style={{ marginTop: 64 }}>
        <h2>Home value questions</h2>
        <FaqList faqs={faqs} />
      </section>
    </div>
  );
}
