/**
 * Reads every .MD / .markdown file from /markdown, signs it with C2PA,
 * verifies it, and writes a ReaderAsset JSON array to
 * src/store/readerLibrary.json.
 *
 * Usage:
 *   node scripts/populateLibrary.mjs
 *
 * If your Node version is older than 22, add the flag:
 *   node --experimental-wasm-modules scripts/populateLibrary.mjs
 */

import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join, basename } from "path";
import { fileURLToPath } from "url";
import {
  signMarkdownAsset,
  verifyMarkdownAsset,
} from "c2pa-rs-javascript-library";

// ── paths ────────────────────────────────────────────────────────────────────

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const MARKDOWN_DIR = join(ROOT, "markdown");
const CERTS_DIR = join(ROOT, "certs");
const OUTPUT_FILE = join(ROOT, "src", "store", "readerLibrary.json");

// ── certs ────────────────────────────────────────────────────────────────────

const signcert = new Uint8Array(
  readFileSync(join(CERTS_DIR, "es256_certs.pem")),
);
const pkey = new Uint8Array(
  readFileSync(join(CERTS_DIR, "es256_private.key")),
);
const certPem = readFileSync(join(CERTS_DIR, "es256_certs.pem"), "utf-8");

// ── author parser ─────────────────────────────────────────────────────────────

const SUPERSCRIPTS = /[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g;

function parseAuthors(text) {
  const lines = text.split("\n");
  const idx = lines.findIndex((l) => l.trim() === "**Authors:**");
  if (idx === -1) return [];
  const nameLine = lines[idx + 1] ?? "";
  return nameLine
    .split(",")
    .map((name) => name.replace(SUPERSCRIPTS, "").trim())
    .filter(Boolean);
}

// ── manifest builder (mirrors createText.ts) ─────────────────────────────────

function makeManifest(title, authors) {
  return {
    claim_generator_info: [{ name: "test_generator" }],
    title,
    assertions: [
      {
        label: "c2pa.actions",
        data: { actions: [{ action: "c2pa.created" }] },
      },
      {
        label: "stds.schema-org.CreativeWork",
        data: {
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: title,
          author: authors.map((name) => ({ "@type": "Person", name })),
          publisher: {
            "@type": "Organization",
            name: "Example Publisher",
          },
        },
      },
    ],
  };
}

// ── Map → plain object replacer (wasm-bindgen may return Map instances) ───────

function jsonReplacer(_key, value) {
  if (value instanceof Map) return Object.fromEntries(value);
  return value;
}

// ── main ─────────────────────────────────────────────────────────────────────

const files = readdirSync(MARKDOWN_DIR).filter((f) =>
  /\.(md|markdown)$/i.test(f),
);

if (files.length === 0) {
  console.error("No .MD / .markdown files found in", MARKDOWN_DIR);
  process.exit(1);
}

const assets = [];

for (const file of files) {
  const title = basename(file).replace(/\.(md|markdown)$/i, "");
  const rawText = readFileSync(join(MARKDOWN_DIR, file), "utf-8");
  const authors = parseAuthors(rawText);

  console.log(`[${assets.length + 1}/${files.length}] ${title}`);
  console.log(`  authors: ${authors.join(", ")}`);

  const signResult = await signMarkdownAsset(
    rawText,
    makeManifest(title, authors),
    signcert,
    pkey,
    "es256",
  );
  const signedMarkdown = new TextDecoder().decode(signResult.signedAsset);

  const outcome = await verifyMarkdownAsset(signedMarkdown, [certPem]);

  const id =
    outcome.manifestStore?.activeManifest ??
    outcome.manifests?.[0]?.id ??
    file;

  assets.push({ id, title, manifest: outcome, markdown: signedMarkdown });
}

writeFileSync(OUTPUT_FILE, JSON.stringify(assets, jsonReplacer, 2), "utf-8");
console.log(`\nWrote ${assets.length} asset(s) → ${OUTPUT_FILE}`);
