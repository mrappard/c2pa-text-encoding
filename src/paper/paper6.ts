import { embedSecretRepeatedly, repeatCarrierPattern } from "~/encoder";

export const paper = `
Title:
Microplastic-Induced Modulation of Photosynthetic Efficiency in Marine Phytoplankton

Authors:
H. L. García¹, P. Svensson², R. Okeke³
¹Department of Ocean Sciences, University of Barcelona
²Nordic Institute for Marine Research, Stockholm
³Centre for Environmental Biotechnology, Lagos

Abstract

Microplastics are increasingly prevalent in marine environments, yet their impact on primary producers remains insufficiently understood. This study examines how microplastic particles influence photosynthetic efficiency in marine phytoplankton. Through controlled laboratory experiments involving Thalassiosira pseudonana and Prochlorococcus marinus, we observed that microplastic exposure alters light absorption dynamics and reduces photosynthetic output by up to 15% under high particle concentrations. These findings suggest that microplastics may have cascading effects on marine food webs and global carbon cycling.

1. Introduction

Phytoplankton contribute nearly half of global primary production and play a crucial role in carbon sequestration. Meanwhile, microplastics—defined as plastic particles smaller than 5 mm—have become ubiquitous in oceanic systems.

While research has focused on ingestion by larger organisms, the interaction between microplastics and microscopic photosynthetic organisms remains largely unexplored. This study investigates whether microplastics interfere with light capture and photosynthetic processes in phytoplankton.

2. Materials and Methods

2.1 Organisms and Culture Conditions
Cultures of Thalassiosira pseudonana (diatom) and Prochlorococcus marinus (cyanobacterium) were maintained under controlled light and temperature conditions.

2.2 Microplastic Exposure
Polystyrene microbeads (1–10 µm) were introduced at varying concentrations (10³–10⁶ particles/mL).

2.3 Photosynthetic Measurement
Chlorophyll fluorescence assays were used to measure photosystem II efficiency (Fv/Fm ratio).

2.4 Optical Analysis
Spectrophotometry assessed changes in light absorption and scattering within the culture medium.

3. Results

3.1 Reduced Photosynthetic Efficiency
Exposure to high concentrations of microplastics resulted in a significant decrease in Fv/Fm ratios, indicating impaired photosynthetic performance.

3.2 Light Scattering Effects
Microplastics increased light scattering, reducing the amount of usable light reaching phytoplankton cells.

3.3 Species-Specific Sensitivity
Prochlorococcus marinus exhibited greater sensitivity to microplastic exposure compared to Thalassiosira pseudonana, with efficiency reductions up to 15%.

4. Discussion

The results suggest that microplastics indirectly affect photosynthesis by altering the optical properties of the surrounding environment. This interference may reduce primary productivity in regions with high microplastic concentrations.

Given the foundational role of phytoplankton in marine ecosystems, even modest reductions in photosynthetic efficiency could have significant ecological and climatic implications.

5. Conclusion

Microplastics represent not only a physical pollutant but also a functional disruptor of marine photosynthesis. Their impact on phytoplankton highlights the need for further research into the broader ecological consequences of plastic pollution.

6. References
Cózar, A. et al. (2014). Plastic debris in the open ocean. Proceedings of the National Academy of Sciences.
Moore, C. J. (2008). Synthetic polymers in the marine environment. Environmental Research.
`



const secret = "Microplastic-Induced Modulation";


const carrier = repeatCarrierPattern(
  paper,
  5000
);

const data = embedSecretRepeatedly(carrier, secret, { spacing: 24 });

export const paper6 = data.embeddedText;