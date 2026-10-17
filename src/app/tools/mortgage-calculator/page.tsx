import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { FaqList } from "@/components/FaqList";
import { MortgageCalculator } from "@/components/MortgageCalculator";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Mortgage Calculator: Estimate Your Monthly Payment",
  description:
    "Estimate a monthly mortgage payment including principal, interest, property tax, insurance and HOA dues. Free calculator with adjustable down payment and rate.",
  path: "/tools/mortgage-calculator",
});

const faqs = [
  {
    q: "What does a monthly mortgage payment include?",
    a: "Most payments combine principal and interest on the loan, plus property tax and homeowners insurance (often collected through escrow). Condos and some neighborhoods add HOA dues, and loans with less than 20% down usually add mortgage insurance.",
  },
  {
    q: "How much should I put down on a house?",
    a: "There's no single right answer. Twenty percent down avoids private mortgage insurance on conventional loans, but many buyers put down 3–10% or use FHA or VA programs. A lender can show how different down payments change your payment and cash needed to close.",
  },
];

export default function MortgageCalculatorPage() {
  return (
    <div className="container" style={{ paddingBottom: 72 }}>
      <Breadcrumbs items={[{ name: "Mortgage calculator", path: "/tools/mortgage-calculator" }]} />
      <div className="page-head" style={{ paddingTop: 8 }}>
        <h1>Mortgage calculator</h1>
        <p>
          Adjust price, down payment and rate to see an estimated monthly payment. Ready to shop?{" "}
          <Link href="/listings">Search homes</Link>.
        </p>
      </div>
      <MortgageCalculator />
      <section className="narrow" style={{ marginTop: 64 }}>
        <h2>Mortgage questions</h2>
        <FaqList faqs={faqs} />
      </section>
    </div>
  );
}
