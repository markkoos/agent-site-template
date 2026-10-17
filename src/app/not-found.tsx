import Link from "next/link";
import { btn } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="eyebrow">404</div>
        <h1 className="mt-3 font-serif text-4xl">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you&apos;re looking for has moved, or the home is no longer available.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/properties" className={btn.primary}>
            Browse properties
          </Link>
          <Link href="/" className={btn.outline}>
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
