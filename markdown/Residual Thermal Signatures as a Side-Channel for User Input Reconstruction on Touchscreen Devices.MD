**Title:**
**Residual Thermal Signatures as a Side-Channel for User Input Reconstruction on Touchscreen Devices**

**Authors:**
I. Petrov¹, A. Mehta², C. R. Wallace³
¹Department of Computer Security, ETH Zurich
²School of Engineering, University of Waterloo
³Applied Cryptography Group, University of Cambridge

---

### **Abstract**

Touchscreen devices retain transient thermal residues following user interaction. This study evaluates whether these residual heat patterns can be exploited as a side-channel to reconstruct user input. Using mid-wave infrared imaging and pattern recognition models, we demonstrate that input sequences (e.g., PINs and short passwords) can be inferred with up to 72% accuracy within 30 seconds of entry under controlled conditions. The effectiveness of the attack depends on environmental temperature, screen material, and input speed. These findings highlight a previously underexplored privacy risk and suggest mitigation strategies for secure interface design.

---

### **1. Introduction**

Side-channel attacks exploit unintended information leakage from physical systems. While prior research has examined acoustic, electromagnetic, and power-based channels, thermal emissions from touchscreen interactions remain less studied.

When a user touches a screen, heat transfer leaves a temporary thermal imprint. We investigate whether these imprints persist long enough—and with sufficient fidelity—to reconstruct input sequences.

---

### **2. Materials and Methods**

**2.1 Devices Tested**
Experiments were conducted on five commercially available smartphones with glass and polymer-based displays.

**2.2 Thermal Imaging**
A calibrated infrared camera captured thermal data immediately after user input, with frame rates up to 60 Hz.

**2.3 Input Scenarios**
Participants entered numeric PINs (4–6 digits) and alphanumeric passwords under varying conditions (speed, pressure, ambient temperature).

**2.4 Reconstruction Model**
A convolutional neural network (CNN) was trained to map thermal patterns to likely input sequences, incorporating temporal decay features.

---

### **3. Results**

**3.1 Persistence of Thermal Residue**
Thermal traces remained detectable for up to 45 seconds, with the strongest signal in the first 20 seconds.

**3.2 Input Reconstruction Accuracy**
The model achieved 72% accuracy for 4-digit PINs and 58% for 6-digit PINs under optimal conditions.

**3.3 Environmental Sensitivity**
Higher ambient temperatures reduced contrast, lowering reconstruction accuracy by up to 20%.

---

### **4. Discussion**

The results demonstrate that thermal residue constitutes a viable side-channel under certain conditions. Unlike traditional observation-based attacks, this method does not require direct visual access during input, only shortly afterward.

Mitigation strategies include randomized keypad layouts, haptic feedback to encourage broader touch patterns, and materials with faster thermal dissipation. These findings are relevant for high-security contexts such as banking and authentication systems.

---

### **5. Conclusion**

Residual heat from touchscreen interactions can be leveraged to infer user input, representing a novel security vulnerability. Addressing this risk requires both hardware and software-level interventions.

---

### **6. References**

* Genkin, D. et al. (2015). *Stealing keys via acoustic cryptanalysis.*
* Mowery, K. et al. (2012). *Power analysis attacks on mobile devices.*
* Petrov, I. (2024). *Thermal side-channels in consumer electronics.* Journal of Applied Security Research.

---

### **Appendix A: Thermal Decay Model**

[
T(t) = T_0 e^{-kt} + T_{ambient}
]

Where:

* ( T(t) ) = temperature at time ( t )
* ( T_0 ) = initial temperature increase
* ( k ) = decay constant
* ( T_{ambient} ) = ambient temperature

---

