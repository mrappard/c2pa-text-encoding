import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { join } from "path";
import { readFileSync } from "fs";
import {
  verifyMarkdownAsset,
} from "c2pa-rs-javascript-library";

const SAMPLE_DIR = join(process.cwd(), "certs");


function loadCerts() {
  return {
    signcert: new Uint8Array(readFileSync(join(SAMPLE_DIR, "es256_certs.pem"))),
    pkey: new Uint8Array(readFileSync(join(SAMPLE_DIR, "es256_private.key"))),
    certPem: readFileSync(join(SAMPLE_DIR, "es256_certs.pem"), "utf-8"),
  };
}

export const verifyTextRouter = createTRPCRouter({
  verifyC2PAText: publicProcedure
    .input(
      z.object({
        markdown: z.string().min(1),
      }),
    )
    .mutation(async ({ input }) => {
      const {  certPem } = loadCerts();
      const outcome = await verifyMarkdownAsset(input.markdown, [certPem]);
      return outcome;
    }),
});
