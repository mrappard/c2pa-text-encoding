"use client";

import { useMemo, useState } from "react";
import { recoverMultipleSecretsFromText,  type RecoveredSecretMatch } from "~/encoder";

export const FinderOfText = () => {


    const [foundSecret, setFoundSecret] = useState<RecoveredSecretMatch[] | null>(null)


    const foundTexts = useMemo(() => {


        if (!foundSecret) return [];
        
        
        //Find Unique Secrets
        return Array.from(
        new Set(foundSecret.map(secret => secret.secret))).map(uniqueSecret => {

            if (uniqueSecret === "Quantum-Scale Wing") return "Quantum-Scale Wing Pattern Variability and Thermodynamic Efficiency in Lepidoptera: A Multimodal Field Study"
            if (uniqueSecret === "Honeybee Swarms") return "Electrostatic Signaling in Honeybee Swarms: A Novel Communication Modality for Collective Decision-Making"
;

        })


    
    }, [foundSecret])

    


     return <div className="w-full"> 
     {foundTexts.map && (
       <div>
        <div>This document contains text from the following sources:</div>
         {foundTexts.map((secret, index) => (
           <div key={index}>
             <p>{secret}</p>
           </div>
         ))}
       </div>
     )}
     <textarea defaultValue={"Paste Text Here"} className=" min-h-screen max-h-screen w-full bg-gray-100 " onChange={(e) => {


        const result = recoverMultipleSecretsFromText(e.target.value)
       setFoundSecret(result.length > 0 ? result : null);

     }}/>
   </div>;
}