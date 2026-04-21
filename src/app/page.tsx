import { paper1 } from "~/paper/paper1";
import { paper2 } from "~/paper/paper2";
import {  HydrateClient } from "~/trpc/server";
import { FinderOfText } from "./_components/finderOfText";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex  min-h-screen flex-col items-center justify-between">
        
       <div className="  w-full overflow-auto border bg-red-100 " style={{ whiteSpace: 'pre-line' }}>{paper1}</div>
       <div className=" w-full overflow-auto border bg-green-100 "  style={{ whiteSpace: 'pre-line' }}>{paper2}</div>
        < FinderOfText/>

      </main>
    </HydrateClient>
  );
}
