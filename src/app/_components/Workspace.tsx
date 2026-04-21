"use client";

import { useEffect, useMemo, useState } from "react";
import { recoverMultipleSecretsFromText, type RecoveredSecretMatch } from "~/encoder";

const STORAGE_KEY = "gemini-workspace-content";

export const Workspace = () => {
  const [content, setContent] = useState("");
  const [foundSecret, setFoundSecret] = useState<RecoveredSecretMatch[] | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContent(saved);
      const result = recoverMultipleSecretsFromText(saved);
      setFoundSecret(result.length > 0 ? result : null);
    }
  }, []);

  const foundTexts = useMemo(() => {
    if (!foundSecret) return [];

    // Find Unique Secrets
    return Array.from(new Set(foundSecret.map((secret) => secret.secret))).map(
      (uniqueSecret) => {
        if (uniqueSecret === "Quantum-Scale Wing")
          return "Quantum-Scale Wing Pattern Variability and Thermodynamic Efficiency in Lepidoptera: A Multimodal Field Study";
        if (uniqueSecret === "Honeybee Swarms")
          return "Electrostatic Signaling in Honeybee Swarms: A Novel Communication Modality for Collective Decision-Making";
        if (uniqueSecret === "Acoustic Structuring")
          return "Acoustic Structuring and Information Encoding in Raindrop Impact Events on Natural Surfaces";
        if (uniqueSecret === "Mycelial Networks")
          return "Transient Memory Formation in Mycelial Networks: Evidence for Distributed Information Retention in Fungal Systems";
        if (uniqueSecret === "Urban Traffic Lights")
          return "Urban Traffic Lights as Emergent Synchronization Systems: Evidence for Phase Coupling Without Central Control";



        if (uniqueSecret === "Microplastic-Induced Modulation"){
          return "Microplastic-Induced Modulation of Photosynthetic Efficiency in Marine Phytoplankton: Implications for Oceanic Carbon Sequestration";
        }
        if (uniqueSecret === "Circadian Phase Drift")
          return "Circadian Phase Drift in Isolated Human Populations: Evidence for Non-24-Hour Biological Rhythms";
        if (uniqueSecret === "Latent Semantic Structures")
          return "Latent Semantic Structures in Avian Vocalizations: Evidence for Hierarchical Syntax in Songbird Communication";
        if (uniqueSecret === "Residual Thermal Signatures")
          return "Residual Thermal Signatures as a Side-Channel for User Input Reconstruction on Touchscreen Devices";
        if (uniqueSecret === "Avian Vocalizations")
          return "Latent Semantic Structures in Avian Vocalizations: Evidence for Hierarchical Syntax in Songbird Communication";
        if (uniqueSecret === "Navigation Without Visual"){
          return "Emergent Map Formation in Human Navigation Without Visual Input: Evidence for Latent Spatial Encoding";
        }

        return uniqueSecret;
      }
    );
  }, [foundSecret]);

  const handleTextChange = (text: string) => {
    setContent(text);
    localStorage.setItem(STORAGE_KEY, text);
    const result = recoverMultipleSecretsFromText(text);
    setFoundSecret(result.length > 0 ? result : null);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 p-6 overflow-hidden">
      <div className="mb-4 flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-800">Workspace</h2>
        <p className="text-sm text-gray-500">
          Paste text here. Sources will be automatically detected and attributed.
        </p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col">
          <textarea
            placeholder="Start typing or paste text from papers..."
            className="flex-1 p-4 rounded-lg border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-gray-800 leading-relaxed"
            value={content}
            onChange={(e) => handleTextChange(e.target.value)}
          />
        </div>

        <div className="w-80 flex flex-col gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Detected Sources
            </h3>
            {foundTexts.length > 0 ? (
              <ul className="space-y-3">
                {foundTexts.map((source, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700 bg-blue-50 p-2 rounded border border-blue-100 italic"
                  >
                    &quot;{source}&quot;
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">
                No sources detected yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
