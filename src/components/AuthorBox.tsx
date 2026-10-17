import Link from "next/link";
import { site } from "@/site.config";
import { SafeImg } from "./SafeImg";

/** E-E-A-T: every article shows who wrote it, their credentials, and how to verify them. */
export function AuthorBox() {
  const a = site.agent;
  return (
    <aside aria-label="About the author" className="my-12 flex items-center gap-5 rounded-md border border-border/60 bg-card p-6">
      <SafeImg
        src={a.headshot}
        fallback="/agent-placeholder.svg"
        alt={a.name}
        width={72}
        height={72}
        className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
      />
      <div>
        <div className="eyebrow">Written by</div>
        <p className="mt-1 font-serif text-lg">
          <Link href="/about" className="hover:underline">
            {a.name}
          </Link>
          , {a.jobTitle}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {a.yearsExperience}+ years representing homes in {site.serviceAreas.slice(0, 3).join(", ")}. {a.licenseLabel}
          {a.licenseNumber}
          {a.licenseVerifyUrl ? (
            <>
              {" "}
              ·{" "}
              <a href={a.licenseVerifyUrl} rel="noopener" target="_blank" className="underline underline-offset-4">
                verify license
              </a>
            </>
          ) : null}
        </p>
      </div>
    </aside>
  );
}
