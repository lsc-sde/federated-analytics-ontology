import { useRef, useEffect } from 'react';
import { DefinitionLevel } from '../data/ontology';
import { AtlasNode, visibleChildren } from '../data/atlas';
import { resources } from '../data/resources';
import { BookOpen, Fingerprint, Search, X, ExternalLink } from 'lucide-react';

interface SidebarProps {
    definitionLevel: DefinitionLevel;
    setDefinitionLevel: (level: DefinitionLevel) => void;
    selectedNode: AtlasNode | null;
    setSelectedNode: (node: AtlasNode | null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    currentView: 'graph' | 'table';
    setCurrentView: (view: 'graph' | 'table') => void;
    onReset: () => void;
}

export default function Sidebar({
    definitionLevel, setDefinitionLevel, selectedNode, setSelectedNode,
    searchQuery, setSearchQuery, currentView, setCurrentView, onReset,
}: SidebarProps) {
    const detailsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedNode) {
            detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [selectedNode]);

    const relatedNodes = selectedNode ? visibleChildren(selectedNode) : [];

    return (
        <aside aria-label="Explore the ontology" className="w-[440px] shrink-0 h-full bg-slate-50 border-r border-slate-200 flex flex-col shadow-lg z-10 p-6 overflow-y-auto">
            <div className="mb-6 flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-blue-700 mb-2 flex items-center gap-2">
                        <Fingerprint className="w-8 h-8 shrink-0" />
                        Federation Atlas
                    </h1>
                    <p className="text-sm text-slate-500">Why federation matters and what it involves.</p>
                </div>
                <button onClick={onReset} className="px-3 py-1.5 text-sm rounded-lg border bg-white border-slate-300 text-slate-600">
                    Reset
                </button>
            </div>

            <div className="mb-6 relative">
                <label htmlFor="concept-search" className="sr-only">Search concepts and definitions</label>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    id="concept-search"
                    type="search"
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="Search concepts and definitions..."
                    className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="mb-6 p-1 bg-slate-100 rounded-lg flex gap-1" role="group" aria-label="View">
                {(['graph', 'table'] as const).map(view => (
                    <button
                        key={view}
                        onClick={() => setCurrentView(view)}
                        aria-pressed={currentView === view}
                        className={`flex-1 py-2 text-sm rounded-md ${currentView === view ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600'}`}
                    >
                        {view === 'graph' ? 'Graph View' : 'Tabular View'}
                    </button>
                ))}
            </div>

            <section ref={detailsRef} aria-labelledby="details-heading" className="mb-6">
                <h2 id="details-heading" className="text-base font-semibold flex items-center gap-2 text-slate-700 mb-4">
                    <BookOpen className="w-5 h-5" /> Details
                </h2>
                <div className="flex gap-1 bg-slate-100 rounded-lg p-1 mb-4" role="group" aria-label="Definition level">
                    {(['summary', 'detailed'] as const).map(level => (
                        <button
                            key={level}
                            onClick={() => setDefinitionLevel(level)}
                            aria-pressed={definitionLevel === level}
                            className={`flex-1 py-2 rounded-md text-sm font-medium ${definitionLevel === level ? 'bg-blue-100 text-blue-800 shadow-sm' : 'text-slate-600'}`}
                        >
                            {level === 'summary' ? 'Summary' : 'Detailed'}
                        </button>
                    ))}
                </div>

                {selectedNode ? (
                    <div className="flex flex-col gap-5">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedNode.label}</h3>
                            <p className="text-xs text-slate-500 mb-3">
                                {selectedNode.shared_definition.status === 'verified'
                                    ? 'Verified definition supplied by the project.'
                                    : 'Draft definition - awaiting review.'}
                            </p>
                            <p className="bg-white p-5 rounded-xl border border-slate-200 leading-relaxed text-slate-700">
                                {selectedNode.shared_definition[definitionLevel]}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-600 mb-2">Example</h4>
                            <p className="bg-blue-50 p-4 rounded-xl text-sm leading-relaxed text-slate-700">
                                {selectedNode.shared_definition.example}
                            </p>
                        </div>
                        {!!selectedNode.related_terms?.length && (
                            <div>
                                <h4 className="font-semibold text-slate-600 mb-2">Related terms</h4>
                                <dl className="text-sm space-y-2">
                                    {selectedNode.related_terms.map(term => (
                                        <div key={term.term}>
                                            <dt className="font-semibold">{term.term}</dt>
                                            <dd>{term.definition}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}
                        {relatedNodes.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-slate-600 mb-2">Related concepts</h4>
                                <ul className="space-y-2 text-sm">
                                    {relatedNodes.map(node => (
                                        <li key={node.id}>
                                            <button onClick={() => setSelectedNode(node)} className="text-blue-700 hover:underline text-left">
                                                {node.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {!!selectedNode.additional_resources?.length && (
                            <div>
                                <h4 className="font-semibold text-slate-600 mb-2">Resources for this concept</h4>
                                <ul className="space-y-3 text-sm">
                                    {selectedNode.additional_resources.map(resource => (
                                        <li key={resource.url}>
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                                                {resource.label} <ExternalLink className="inline w-3 h-3" />
                                            </a>
                                            {resource.note && <p className="text-slate-600 mt-1">{resource.note}</p>}
                                            {resource.doi && <p className="text-xs text-slate-500 mt-1">DOI: {resource.doi}</p>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <div>
                            <h4 className="font-semibold text-slate-600 mb-2">Contacts</h4>
                            <a href="#contact-tbc" className="text-sm text-blue-700 underline" aria-describedby="contact-placeholder-note">
                                Contact TBC
                            </a>
                            <p id="contact-placeholder-note" className="text-xs text-slate-500 mt-1">
                                Placeholder link - contact details have not yet been confirmed.
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="p-6 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500">
                        Select a concept in the graph or table to read its definition, resources and contacts.
                    </p>
                )}
            </section>

            {resources.length > 0 && (
                <details className="mb-6 border-t border-slate-200 pt-4">
                    <summary className="cursor-pointer font-semibold text-slate-700">Resources</summary>
                    <p className="text-xs text-slate-500 my-3">
                        General reading. Listing is not an endorsement, and linked works may use terms differently.
                    </p>
                    <ul className="space-y-4 text-sm">
                        {resources.map(resource => (
                            <li key={resource.id}>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                                    {resource.label} <ExternalLink className="inline w-3 h-3" />
                                </a>
                                {resource.publisher && <p className="text-xs text-slate-500 mt-1">{resource.publisher}</p>}
                                {resource.note && <p className="text-slate-600 mt-1">{resource.note}</p>}
                                {resource.doi && <p className="text-xs text-slate-500 mt-1">DOI: {resource.doi}</p>}
                            </li>
                        ))}
                    </ul>
                </details>
            )}
            <div className="logo-bar mt-auto">
                <img src="/logo-one-lsc.png" alt="One LSC - Data into Impact" />
                <img src="/logo-datashield.png" alt="DataSHIELD - Secure Bioscience Collaboration" />
                <img src="/logo-focus5.png" alt="FOCUS-5" />
                <img src="/logo-dare-uk.png" alt="DARE UK" />
            </div>
        </aside>
    );
}
