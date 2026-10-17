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
    a: "There's no single right answer. Twenty percent down avoids private mortgage insurance on conventional loans, but many buyers put down less or use other loan programs. A lender can show how different down payments change your payment and cash to close.",
  },
];

export default function MortgageCalculatorPage() {
  return (
    <div className="container-page py-12 md:py-16">
      <Breadcrumbs items={[{ name: "Mortgage calculator", path: "/tools/mortgage-calculator" }]} />
      <div className="mt-10 max-w-2xl">
        <div className="eyebrow">Tools</div>
        <h1 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">Mortgage calculator</h1>
        <p className="mt-4 text-muted-foreground">
          Adjust price, down payment and rate to see an estimated monthly payment. Ready to look?{" "}
          <Link href="/properties" className="underline underline-offset-4">
            Browse properties
          </Link>
          .
        </p>
      </div>
      <div className="mt-12">
        <MortgageCalculator />
      </div>
      <section className="mt-24 grid gap-12 border-t border-border/60 pt-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="eyebrow">Questions</div>
          <h2 className="mt-2 font-serif text-3xl">Mortgage FAQ</h2>
        </div>
        <div className="md:col-span-8">
          <FaqList faqs={faqs} />
        </div>
      </section>
    </div>
  );
}
