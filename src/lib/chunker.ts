interface ChunkOptions {
  maxChars?: number;
  overlap?: number;
}

export function chunkText(
  text: string,
  options: ChunkOptions = {}
): string[] {
  const { maxChars = 2000, overlap = 200 } = options;

  // Clean up the text
  const cleaned = text.replace(/\r\n/g, "\n").trim();
  if (!cleaned) return [];
  if (cleaned.length <= maxChars) return [cleaned];

  const chunks: string[] = [];
  let start = 0;

  while (start < cleaned.length) {
    let end = start + maxChars;

    if (end >= cleaned.length) {
      chunks.push(cleaned.slice(start).trim());
      break;
    }

    // Try to break at a paragraph boundary
    let breakPoint = cleaned.lastIndexOf("\n\n", end);
    if (breakPoint <= start) {
      // Try sentence boundary
      breakPoint = cleaned.lastIndexOf(". ", end);
      if (breakPoint <= start) {
        // Try any newline
        breakPoint = cleaned.lastIndexOf("\n", end);
        if (breakPoint <= start) {
          // Try any space
          breakPoint = cleaned.lastIndexOf(" ", end);
          if (breakPoint <= start) {
            // Force break at maxChars
            breakPoint = end;
          }
        }
      }
    }

    chunks.push(cleaned.slice(start, breakPoint + 1).trim());
    start = breakPoint + 1 - overlap;
    if (start < 0) start = 0;
  }

  return chunks.filter((c) => c.length > 0);
}
