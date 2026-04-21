import { embedSecretRepeatedly, repeatCarrierPattern } from "~/encoder";

export const paper = `
Title:
Emergent Map Formation in Human Navigation Without Visual Input: Evidence for Latent Spatial Encoding

Authors:
S. R. Delgado¹, K. Ivanov², L. Chen³
¹Department of Cognitive Science, University of California, San Diego
²Institute of Neuroinformatics, ETH Zurich
³Centre for Brain and Mind, Western University

Abstract

Human spatial navigation is typically associated with visual processing; however, individuals can navigate unfamiliar environments without sight using proprioceptive and auditory cues. This study investigates whether humans form internal spatial maps under conditions of complete visual deprivation. Participants navigated a complex indoor maze while blindfolded, relying solely on tactile and auditory information. Behavioral performance, combined with post-task spatial reconstruction tests, indicates that participants developed coherent internal representations of the environment. These findings support the existence of latent spatial encoding mechanisms independent of visual input.

1. Introduction

Spatial navigation has traditionally been studied through vision-centric models, emphasizing landmarks and visual cues. However, non-visual navigation—such as that used by visually impaired individuals—suggests alternative mechanisms for spatial representation.

The concept of a “cognitive map,” first proposed by Edward Tolman, posits that organisms form internal representations of spatial environments. This study explores whether such maps can emerge in humans without any visual information.

2. Materials and Methods

2.1 Participants
Thirty-two participants with normal vision (blindfolded during the experiment) were recruited.

2.2 Maze Environment
A modular indoor maze with multiple branching paths, dead ends, and loops was constructed. Acoustic markers (subtle sound cues) were placed at key نقاط.

2.3 Navigation Task
Participants were instructed to explore the maze and locate an exit using only touch and sound. Each session lasted up to 45 minutes.

2.4 Spatial Reconstruction
After navigation, participants were asked to draw a map of the maze and verbally describe its structure.

3. Results

3.1 Navigation Performance
Participants successfully located the exit in 78% of trials, with decreasing completion times over repeated attempts.

3.2 Map Accuracy
Post-task drawings revealed consistent structural features, including correct identification of major pathways and intersections.

3.3 Error Patterns
Errors were primarily related to distance estimation rather than topological structure, suggesting that participants captured layout but not precise scale.

4. Discussion

The results indicate that humans can form coherent spatial representations without visual input, relying instead on multisensory integration. This aligns with findings from studies of the hippocampus and place cells, which encode spatial information independently of sensory modality.

These findings have implications for the design of navigation aids for visually impaired individuals and for understanding how the brain constructs abstract representations of space.

5. Conclusion

Human navigation does not depend solely on vision. Even in complete visual deprivation, individuals can construct internal maps of their environment, supporting the theory of modality-independent spatial encoding.

6. References
Tolman, E. C. (1948). Cognitive maps in rats and men. Psychological Review.
O’Keefe, J. & Nadel, L. (1978). The hippocampus as a cognitive map. Oxford University Press.
Chen, L. (2024). Multisensory integration in spatial cognition. Journal of Neuroscience.
`



const secret = "Navigation Without Visual";


const carrier = repeatCarrierPattern(
  paper,
  5000
);

const data = embedSecretRepeatedly(carrier, secret, { spacing: 24 });

export const paper10 = data.embeddedText;