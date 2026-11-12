import layers from '../../data/atlas-layers.json';
import { ontologyData, OntologyNode, SharedDefinition } from './ontology';

export type AtlasNode = OntologyNode & { shared_definition: SharedDefinition };

export const atlasLayers = layers.map(layer => ({
    label: layer.label,
    nodes: layer.nodes.map(id => {
        const node = ontologyData[id];
        if (!node?.shared_definition) {
            throw new Error(`Atlas node "${id}" needs a shared definition.`);
        }
        return { ...node, shared_definition: node.shared_definition };
    }),
}));

export const atlasNodes: AtlasNode[] = atlasLayers.flatMap(layer => layer.nodes);
export function visibleChildren(node: OntologyNode): AtlasNode[] {
    return atlasNodes.filter(candidate => node.children?.includes(candidate.id));
}

export function matchesSearch(node: AtlasNode, search: string): boolean {
    const query = search.trim().toLowerCase();
    return [
        node.label,
        node.subtitle,
        node.shared_definition.summary,
        node.shared_definition.detailed,
        ...(node.related_terms ?? []).flatMap(term => [term.term, term.definition]),
    ].some(text => text?.toLowerCase().includes(query));
}
