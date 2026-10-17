import { pageMetadata } from "@/lib/seo";
import { site } from "@/site.config";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${site.brand.siteName} collects and uses information submitted through this website.`,
  path: "/privacy",
});

// TEMPLATE TEXT — have the client (or their broker/attorney) review before launch.
// Some states (e.g. California) have specific consumer-privacy disclosure rules.
export default function PrivacyPage() {
  return (
    <article className="container-page py-16">
      <div className="prose-editorial mx-auto max-w-3xl">
        <div className="eyebrow">Legal</div>
        <h1 className="mt-2 font-serif text-4xl">Privacy policy</h1>
        <p>
          This site is operated by {site.brand.siteName} ({site.brokerage.name}). When you submit a form, we collect the
          information you provide (such as name, email, phone, property address and message) to respond to your request
          and provide real estate services.
        </p>
        <h2>How information is used</h2>
        <ul>
          <li>To reply to your inquiry, schedule viewings, or prepare a home valuation.</li>
          <li>To send information you requested. You can opt out of follow-up at any time.</li>
          <li>Property addresses entered for valuations may be sent to a third-party data provider to generate an estimate.</li>
        </ul>
        <p>We do not sell your personal information.</p>
        <h2>Contact</h2>
        <p>
          Questions or deletion requests: <a href={`mailto:${site.agent.email}`}>{site.agent.email}</a>.
        </p>
      </div>
    </article>
  );
}
