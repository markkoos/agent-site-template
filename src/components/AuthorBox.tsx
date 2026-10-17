import Link from "next/link";
import { site } from "@/site.config";

/** E-E-A-T: every article shows who wrote it, their credentials, and how to verify them. */
export function AuthorBox() {
  const a = site.agent;
  return (
    <aside className="author-box" aria-label="About the author">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={a.headshot} alt={a.name} width={72} height={72} />
      <div>
        <p style={{ margin: 0, fontWeight: 700 }}>
          Written by <Link href="/about">{a.name}</Link>, {a.jobTitle}
        </p>
        <p className="small muted" style={{ margin: "4px 0 0" }}>
          {a.yearsExperience}+ years helping clients in {site.serviceAreas.slice(0, 3).join(", ")}. {a.licenseLabel}
          {a.licenseNumber}
          {a.licenseVerifyUrl ? (
            <>
              {" "}
              (<a href={a.licenseVerifyUrl} rel="noopener" target="_blank">verify license</a>)
            </>
          ) : null}
          .
        </p>
      </div>
    </aside>
  );
}
