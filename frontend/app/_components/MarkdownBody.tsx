"use client";

import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export default function MarkdownBody({ body }: { body: string }) {
  // MarkdownをHTMLに変換し、XSS対策としてサニタイズする
  const html = DOMPurify.sanitize(marked.parse(body) as string);

  return (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
