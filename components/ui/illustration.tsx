import fs from "node:fs";
import path from "node:path";

// Renders an inline SVG from public/illustrations/<id>.svg (put there by apply-theme.py /
// add-illustration.py, with the dominant accent already rewritten to var(--accent)), so the
// art always matches the theme without opening an editor.
//
// The id is matched against an allowlist before it reaches the filesystem: path.join
// alone would let "../" or an absolute path escape public/illustrations, and whatever it
// returned would be injected as HTML below. Unknown ids get the fallback instead.
const SAFE_ID = /^[a-z0-9][a-z0-9_-]*$/i;

export function Illustration({ id, className = "" }: { id: string; className?: string }) {
  let markup: string;
  if (!SAFE_ID.test(id)) {
    markup = FALLBACK_SVG;
  } else {
    const file = path.join(process.cwd(), "public", "illustrations", `${id}.svg`);
    try {
      markup = fs.readFileSync(file, "utf-8").replace(/<\?xml[^>]*\?>\s*/, "");
    } catch {
      markup = FALLBACK_SVG;
    }
  }
  return (
    <span
      className={`inline-block text-[var(--accent)] ${className}`}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

const FALLBACK_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
  '<circle cx="100" cy="100" r="90" fill="currentColor" opacity="0.15"/>' +
  '<circle cx="100" cy="100" r="50" fill="currentColor" opacity="0.35"/>' +
  "</svg>";
