export function removeMarkdownComments(markdown: string): string {
  return markdown
    // Remove HTML comments: <!-- comment -->
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove Markdown link-style comments: [//]: # (comment)
    .replace(/^\s*\[\/\/\]:\s*#\s*\(.*?\)\s*$/gm, '')
    // Remove empty lines left behind
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}