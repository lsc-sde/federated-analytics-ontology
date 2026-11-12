import { useState } from 'react';
import Sidebar from './components/Sidebar';
import GraphViewer from './components/GraphViewer';
import TabularView from './components/TabularView';
import { DefinitionLevel } from './data/ontology';
import { AtlasNode } from './data/atlas';
import { ReactFlowProvider } from '@xyflow/react';

function App() {
  const [definitionLevel, setDefinitionLevel] = useState<DefinitionLevel>('summary');
  const [selectedNode, setSelectedNode] = useState<AtlasNode | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'graph' | 'table'>('graph');

  return (
    <div className="flex flex-col h-screen w-full bg-white text-slate-800 overflow-hidden font-sans selection:bg-primary/30">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          definitionLevel={definitionLevel}
          setDefinitionLevel={setDefinitionLevel}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onReset={() => {
            setDefinitionLevel('summary');
            setSelectedNode(null);
            setSearchQuery('');
            setResetKey(key => key + 1);
          }}
        />
        <main className="flex-1 relative flex flex-col overflow-hidden">
          {/* Drafting Watermark */}
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-[0.03]">
            <span className="text-slate-900 text-[10rem] md:text-[20rem] font-black tracking-widest -rotate-45 select-none uppercase">
              Drafting
            </span>
          </div>

          <div className="flex-1 relative z-10 w-full h-full">
            {currentView === 'graph' ? (
              <ReactFlowProvider>
                <GraphViewer
                  key={resetKey}
                  onNodeSelect={setSelectedNode}
                  searchQuery={searchQuery}
                  selectedNode={selectedNode}
                />
              </ReactFlowProvider>
            ) : (
              <TabularView
                definitionLevel={definitionLevel}
                searchQuery={searchQuery}
                selectedNode={selectedNode}
                onNodeSelect={setSelectedNode}
              />
            )}
          </div>
        </main>
      </div>

      {/* Contribute link, copyright and licensing */}
      <footer className="bg-slate-50 border-t border-slate-200 text-slate-400 px-4 py-1.5 text-center text-[11px] z-40 shrink-0 flex flex-wrap items-center justify-center gap-x-1">
        <span className="text-slate-400">
          Review status is shown per concept. This prototype is not authoritative.
        </span>
        <span className="mx-2 text-slate-300">·</span>
        <a
          href="https://github.com/lsc-sde/federated-analytics-ontology/blob/main/CONTRIBUTING.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-blue-600 hover:underline"
        >
          Suggest a change
        </a>
        <span className="mx-2 text-slate-300">·</span>
        <span className="text-slate-400">
          © 2026 Lancashire Teaching Hospitals NHS Foundation Trust
        </span>
        <span className="mx-2 text-slate-300">·</span>
        <a
          href="https://github.com/lsc-sde/federated-analytics-ontology/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-blue-600 hover:underline"
        >
          Code: Apache-2.0
        </a>
        <span className="mx-2 text-slate-300">·</span>
        <a
          href="https://github.com/lsc-sde/federated-analytics-ontology/blob/main/data/LICENSE-DATA.txt"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-blue-600 hover:underline"
        >
          Content: CC BY 4.0
        </a>
      </footer>
    </div>
  );
}

export default App;
