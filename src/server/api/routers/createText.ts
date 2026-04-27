import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { join } from "path";
import { readFileSync } from "fs";
import {
  signMarkdownAsset,
  verifyMarkdownAsset,
} from "c2pa-rs-javascript-library";

const SAMPLE_DIR = join(process.cwd(), "certs");

function makeManifest(title: string, authors?: string[]) {
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
          author: authors?.map((name) => ({ "@type": "Person", name })),
          name:title,
          publisher:{
            "@type": "Organization",
            name:"Example Publisher"
          }
        },
      },
    ],
  };
}



function loadCerts() {
  return {
    signcert: new Uint8Array(readFileSync(join(SAMPLE_DIR, "es256_certs.pem"))),
    pkey: new Uint8Array(readFileSync(join(SAMPLE_DIR, "es256_private.key"))),
    certPem: readFileSync(join(SAMPLE_DIR, "es256_certs.pem"), "utf-8"),
  };
}

export const createTextRouter = createTRPCRouter({
  createC2PAText: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        text: z.string().min(1),
        authors: z.string().array().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { signcert, pkey, certPem } = loadCerts();

      const result = await signMarkdownAsset(
        input.text,
        makeManifest(input.title, input.authors),
        signcert,
        pkey,
        "es256",
      );

      const outcome = await verifyMarkdownAsset(result.signedAsset, [certPem]);

      console.log(JSON.stringify(outcome, null, 2));

      // TURN THIS ARRAY BUFFER INTO A STRING AND LOG IT
      const signedAssetString = new TextDecoder().decode(result.signedAsset);

      return signedAssetString;
    }),
});
