"use client";

import { useState, useMemo } from "react";
import { paper1 } from "~/paper/paper1";
import { paper2 } from "~/paper/paper2";
import { Reader } from "./_components/Reader";
import { Workspace } from "./_components/Workspace";
import { paper3 } from "~/paper/paper3";
import { paper4 } from "~/paper/paper4";
import { paper5 } from "~/paper/paper5";
import { paper6 } from "~/paper/paper6";
import { paper7 } from "~/paper/paper7";
import { paper8 } from "~/paper/paper8";
import { paper9 } from "~/paper/paper9";
import { paper10 } from "~/paper/paper10";

const PAPERS = [
  {
    id: "paper1",
    title: "Quantum-Scale Wing Pattern Variability and Thermodynamic Efficiency in Lepidoptera: A Multimodal Field Study",
    content: paper1,
  },
  {
    id: "paper2",
    title: "Electrostatic Communication and Collective Decision-Making in Honeybee Swarms",
    content: paper2,
  },
  {
    id:"paper3",
    title: "Acoustic Structuring and Information Encoding in Raindrop Impact Events on Natural Surfaces",
    content: paper3,
  },
  {
    id: "paper4",
    title: "Transient Memory Formation in Mycelial Networks: Evidence for Distributed Information Retention in Fungal Systems",
    content: paper4,
  },
  {
    id: "paper5",
    title: "Urban Traffic Lights as Emergent Synchronization Systems: Evidence for Phase Coupling Without Central Control",
    content: paper5,
  },
  {
    id: "paper6",
    title: "Microplastic-Induced Modulation of Photosynthetic Efficiency in Marine Phytoplankton: Implications for Oceanic Carbon Sequestration",
    content: paper6,
  },
  {
    id: "paper7",
    title: "Circadian Phase Drift in Isolated Human Populations: Evidence for Non-24-Hour Biological Rhythms",
    content: paper7,
  },
    {
    id: "paper8",
    title: "Latent Semantic Structures in Avian Vocalizations: Evidence for Hierarchical Syntax in Songbird Communication",
    content: paper8,
  },
  {
    id: "paper9",
    title: "Residual Thermal Signatures as a Side-Channel for User Input Reconstruction on Touchscreen Devices",
    content: paper9,
  },
    {
    id: "paper10",
    title: "Emergent Map Formation in Human Navigation Without Visual Input: Evidence for Latent Spatial Encoding",
    content: paper10,
  }
];

export default function Home() {
  const [selectedPaperId, setSelectedPaperId] = useState<string>(PAPERS[0]!.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"reader" | "workspace">("reader");

  const filteredPapers = useMemo(() => {
    return PAPERS.filter((paper) =>
      paper.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const selectedPaper = useMemo(() => {
    return PAPERS.find((p) => p.id === selectedPaperId) ?? PAPERS[0]!;
  }, [selectedPaperId]);

  return (
    <main className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600 mb-4">C2PA Text</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search papers..."
              className="w-full pl-3 pr-4 py-2 bg-gray-100 border-transparent rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
            Available Papers
          </h2>
          {filteredPapers.map((paper) => (
            <button
              key={paper.id}
              onClick={() => {
                setSelectedPaperId(paper.id);
                setActiveTab("reader");
              }}
              className={`w-full text-left px-3 py-3 rounded-lg transition-colors text-sm font-medium ${
                selectedPaperId === paper.id
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {paper.title}
            </button>
          ))}
          {filteredPapers.length === 0 && (
            <p className="text-sm text-gray-400 px-2 italic">No papers found</p>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col overflow-hidden">
        {/* Tab Header */}
        <header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("reader")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "reader"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reader
            </button>
            <button
              onClick={() => setActiveTab("workspace")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "workspace"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Workspace
            </button>
          </div>
          <div className="text-xs text-gray-400 font-mono">
            {activeTab === "reader" ? "MODE: READING" : "MODE: COMPOSING"}
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 relative overflow-hidden">
          {activeTab === "reader" ? (
            <Reader title={selectedPaper.title} content={selectedPaper.content} />
          ) : (
            <Workspace />
          )}
        </div>
      </section>
    </main>
  );
}
