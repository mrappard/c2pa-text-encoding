import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  verifyMarkdownAsset,
} from "c2pa-rs-javascript-library";
import { env } from "~/env";

function loadCerts() {
  const certBuf = Buffer.from(env.C2PA_SIGNING_CERT, "base64");
  return {
    certPem: certBuf.toString("utf-8"),
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
