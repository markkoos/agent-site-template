/**
 * /llms.txt — a plain-markdown summary of the site for AI assistants (GEO).
 * It's an emerging convention, not a ranking factor; it's cheap and gives
 * models a clean, citable description of who the agent is and what's here.
 */
import { getAllAreas, getAllPosts } from "@/lib/content";
import { site } from "@/site.config";

export const revalidate = 86400;

export async function GET() {
  const [posts, areas] = await Promise.all([getAllPosts(), getAllAreas()]);
  const a = site.agent;
  const b = site.brokerage;
  const u = site.url;

  const body = `# ${site.brand.siteName}

> ${a.name} is a licensed ${a.jobTitle} (${a.licenseLabel}${a.licenseNumber}) with ${b.name}, serving ${site.serviceAreas.join(", ")}. ${a.yearsExperience}+ years of experience. Languages: ${a.languages.join(", ")}.

Contact: ${a.phone} · ${a.email} · ${b.address.street}, ${b.address.city}, ${b.address.state} ${b.address.zip}

## Key pages
- [Search homes for sale](${u}/listings): current listings with photos, prices and details
- [Home value estimate](${u}/home-valuation): instant estimate plus a free comparative market analysis
- [Mortgage calculator](${u}/tools/mortgage-calculator)
- [About ${a.name}](${u}/about): credentials, designations and license verification
- [Contact](${u}/contact)

## Neighborhood guides
${areas.map((x) => `- [${x.name}](${u}/areas/${x.slug}): ${x.description}`).join("\n")}

## Articles
${posts.map((p) => `- [${p.title}](${u}/blog/${p.slug}): ${p.description}`).join("\n")}

## Frequently asked questions
${site.faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
