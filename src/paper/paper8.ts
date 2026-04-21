import { embedSecretRepeatedly, repeatCarrierPattern } from "~/encoder";

export const paper = `
Title:
Latent Semantic Structures in Avian Vocalizations: Evidence for Hierarchical Syntax in Songbird Communication

Authors:
D. E. Hoffman¹, R. Kaur², M. Silva³
¹Department of Cognitive Biology, University of Chicago
²Centre for Linguistic Evolution, University of Toronto
³Institute for Bioacoustics, University of São Paulo

Abstract

Birdsong has traditionally been characterized as a sequence of learned vocal patterns used for mating and territorial signaling. However, the extent to which these vocalizations exhibit structured, language-like properties remains contested. This study applies computational linguistic models to analyze song patterns in Zonotrichia leucophrys (white-crowned sparrow), revealing evidence of hierarchical organization and non-random sequencing. Using probabilistic grammar inference and neural embedding techniques, we identify latent syntactic structures that improve predictive modeling of song sequences by 27% over baseline Markov models. These findings suggest that avian vocalizations may possess a deeper structural complexity than previously recognized.

1. Introduction

The study of animal communication has long sought parallels with human language. While many species demonstrate complex signaling, few exhibit features such as recursion or hierarchical organization, which are hallmarks of human linguistic systems.

Birdsong, particularly in species like Zonotrichia leucophrys, offers a promising domain for investigating these properties. Prior research has shown that birds learn and refine their songs socially, but the structural rules governing these sequences remain unclear.

2. Materials and Methods

2.1 Data Collection
Field recordings of white-crowned sparrows were collected across multiple regions in California and British Columbia over two breeding seasons.

2.2 Signal Processing
Audio data were segmented into syllables using spectrogram analysis. Each syllable was encoded as a feature vector based on frequency, duration, and harmonic structure.

2.3 Modeling Approaches
We compared three models:

First-order Markov chains
Probabilistic context-free grammars (PCFGs)
Transformer-based sequence models

2.4 Evaluation Metrics
Model performance was evaluated using perplexity and sequence prediction accuracy.

3. Results

3.1 Improved Predictive Modeling
Transformer-based models incorporating hierarchical structure reduced perplexity by 27% compared to Markov models.

3.2 Evidence of Hierarchical Patterns
Certain syllable groupings consistently formed nested structures, suggesting rule-based organization rather than simple linear chaining.

3.3 Regional Variation
Distinct dialects were observed between populations, but underlying structural patterns remained consistent across locations.

4. Discussion

The presence of hierarchical organization in birdsong challenges the assumption that such complexity is unique to human language. While birdsong does not exhibit full linguistic recursion, the identified structures indicate a level of syntactic organization that may represent an evolutionary precursor to language.

These findings also highlight the utility of modern machine learning techniques in uncovering latent patterns in biological data.

5. Conclusion

Birdsong in Zonotrichia leucophrys exhibits structured, hierarchical patterns that enhance predictive modeling and suggest a form of proto-syntax. This expands our understanding of animal communication and its relationship to human language evolution.

6. References
Marler, P. (2004). Bird calls: their potential for behavioral neurobiology. Annals of the New York Academy of Sciences.
Gentner, T. Q. et al. (2006). Recursive syntactic pattern learning by songbirds. Nature.
Silva, M. (2024). Machine learning in bioacoustics. Journal of Computational Biology.
`



const secret = "Avian Vocalizations";


const carrier = repeatCarrierPattern(
  paper,
  5000
);

const data = embedSecretRepeatedly(carrier, secret, { spacing: 24 });

export const paper8 = data.embeddedText;