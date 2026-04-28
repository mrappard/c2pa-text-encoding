import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { signMarkdownAsset } from "c2pa-rs-javascript-library";
import type { ReaderAsset } from "~/store/readerStore";
import { env } from "~/env";
import readerLibrary from "~/store/readerLibrary.json";

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
  const certBuf = Buffer.from(env.C2PA_SIGNING_CERT, "base64");
  const keyBuf = Buffer.from(env.C2PA_SIGNING_KEY, "base64");
  return {
    signcert: new Uint8Array(certBuf),
    pkey: new Uint8Array(keyBuf),
    certPem: certBuf.toString("utf-8"),
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

      const signedAssetString = new TextDecoder().decode(result.signedAsset);

      return signedAssetString;
    }),

  populateC2PAText: publicProcedure
    .mutation(() => {
      return readerLibrary as  unknown as ReaderAsset[];
    }),
});
