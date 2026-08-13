export function splitBilingual(body: string): { ko: string; en: string } {
  const m = body.match(/<!--\s*ko\s*-->([\s\S]*?)<!--\s*en\s*-->([\s\S]*)/i);
  if (!m) throw new Error('body must contain <!-- ko --> and <!-- en --> markers');
  return { ko: m[1].trim(), en: m[2].trim() };
}
