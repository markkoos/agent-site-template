/** Renders one or more schema.org objects as JSON-LD. Null entries are skipped. */
export function JsonLd({ data }: { data: object | null | (object | null)[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!items.length) return null;
  return (
    <script
      type="application/ld+json"
      // Escape "<" so content can never break out of the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, "\\u003c") }}
    />
  );
}
