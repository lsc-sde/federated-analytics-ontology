import { DefinitionLevel } from '../data/ontology';
import { atlasLayers, AtlasNode, matchesSearch, visibleChildren } from '../data/atlas';

interface TabularViewProps {
    definitionLevel: DefinitionLevel;
    searchQuery: string;
    selectedNode: AtlasNode | null;
    onNodeSelect: (node: AtlasNode) => void;
}

export default function TabularView({ definitionLevel, searchQuery, selectedNode, onNodeSelect }: TabularViewProps) {
    const layers = atlasLayers.map(layer => ({
        ...layer,
        nodes: layer.nodes.filter(node => matchesSearch(node, searchQuery)),
    }));

    return (
        <div className="h-full w-full bg-slate-100 overflow-auto p-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Glossary of Terms</h1>
            <p className="text-slate-500 mb-6">
                Why federation matters and what it involves. Select a term for resources and contacts.
            </p>
            {layers.filter(layer => layer.nodes.length > 0).map(layer => (
                <section key={layer.label} className="mb-8 bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <h2 className="bg-slate-800 text-white px-5 py-4 text-xl font-bold">{layer.label}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <caption className="sr-only">{layer.label} concepts with {definitionLevel} definitions</caption>
                            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                                <tr>
                                    <th scope="col" className="p-4 min-w-40">Term</th>
                                    <th scope="col" className="p-4 min-w-80">Definition ({definitionLevel === 'summary' ? 'Summary' : 'Detailed'})</th>
                                    <th scope="col" className="p-4 min-w-72">Example</th>
                                    <th scope="col" className="p-4 min-w-48">Related concepts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {layer.nodes.map(node => (
                                    <tr key={node.id} className={`border-t border-slate-100 align-top ${selectedNode?.id === node.id ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                                        <th scope="row" className="p-4">
                                            <button onClick={() => onNodeSelect(node)} className="text-blue-700 hover:underline text-left">
                                                {node.label}
                                            </button>
                                            <p className="text-xs font-normal text-slate-500 mt-2">
                                                {node.shared_definition.status === 'verified' ? 'Verified definition' : 'Draft - awaiting review'}
                                            </p>
                                        </th>
                                        <td className="p-4 leading-relaxed">
                                            {node.shared_definition[definitionLevel]}
                                            {!!node.related_terms?.length && (
                                                <dl className="mt-4 space-y-2">
                                                    {node.related_terms.map(term => (
                                                        <div key={term.term}>
                                                            <dt className="font-semibold">{term.term}</dt>
                                                            <dd>{term.definition}</dd>
                                                        </div>
                                                    ))}
                                                </dl>
                                            )}
                                        </td>
                                        <td className="p-4 leading-relaxed text-slate-600">{node.shared_definition.example}</td>
                                        <td className="p-4">
                                            <ul className="space-y-2">
                                                {visibleChildren(node).map(child => (
                                                    <li key={child.id}>
                                                        <button onClick={() => onNodeSelect(child)} className="text-blue-700 hover:underline text-left">
                                                            {child.label}
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            ))}
            {layers.every(layer => layer.nodes.length === 0) && (
                <div role="status" className="text-center p-12 border-2 border-dashed border-slate-300 rounded-xl">
                    <h2 className="font-semibold text-slate-600">No matching concepts found</h2>
                    <p className="text-slate-500 mt-2">Try a different search or clear the search field.</p>
                </div>
            )}
        </div>
    );
}
