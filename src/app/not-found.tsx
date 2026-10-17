import Link from "next/link";

export default function NotFound() {
  return (
    <div className="narrow" style={{ padding: "96px 0", textAlign: "center" }}>
      <p className="eyebrow">404</p>
      <h1>That page isn&apos;t here</h1>
      <p className="muted">The home may have sold or the link may be out of date.</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
        <Link className="btn" href="/listings">
          Search homes
        </Link>
        <Link className="btn btn-ghost" href="/">
          Home
        </Link>
      </div>
    </div>
  );
}
