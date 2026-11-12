import { useState } from 'react';
import {
    ReactFlow,
    useNodesState,
    Node,
    Edge,
    Background,
    Controls,
    BackgroundVariant,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Lock, Unlock } from 'lucide-react';
import { atlasLayers, AtlasNode, matchesSearch } from '../data/atlas';
import CustomNode, { GraphNodeData } from './CustomNode';
import PerimeterEdge from './PerimeterEdge';

interface GraphViewerProps {
    onNodeSelect: (node: AtlasNode | null) => void;
    searchQuery: string;
    selectedNode: AtlasNode | null;
}

type AtlasGraphNode = Node<GraphNodeData, 'custom'>;
const nodeTypes = { custom: CustomNode };
const edgeTypes = { perimeter: PerimeterEdge };

const initialNodes: AtlasGraphNode[] = atlasLayers.flatMap((layer, layerIndex) =>
    layer.nodes.map((node, index) => {
        const size = layerIndex === 0 ? 200 : 170;
        const angle = (index / layer.nodes.length) * Math.PI * 2 - Math.PI / 2;
        const radius = layerIndex === 0 ? 0 : 470;
        return {
            id: node.id,
            type: 'custom',
            position: {
                x: radius * Math.cos(angle) - size / 2,
                y: radius * Math.sin(angle) - size / 2,
            },
            data: { ...node, layer: layerIndex, nodeSize: size, dimmed: false },
        };
    })
);

const initialEdges: Edge[] = initialNodes.flatMap(source =>
    initialNodes.filter(target => source.data.children?.includes(target.id)).map(target => ({
        id: `${source.id}->${target.id}`,
        source: source.id,
        target: target.id,
        sourceHandle: 'center-source',
        targetHandle: 'center-target',
        type: 'perimeter',
        style: {
            stroke: '#10b981',
            strokeWidth: 2,
            strokeDasharray: source.data.layer === 0 ? undefined : '6,4',
        },
        data: {
            sourceRadius: source.data.nodeSize / 2,
            targetRadius: target.data.nodeSize / 2,
        },
    }))
);

export default function GraphViewer({ onNodeSelect, searchQuery, selectedNode }: GraphViewerProps) {
    const [isDraggable, setIsDraggable] = useState(false);
    const [activeLayer, setActiveLayer] = useState<number | null>(null);
    const [nodes, , onNodesChange] = useNodesState<AtlasGraphNode>(initialNodes);
    const connectedIds = new Set<string>();
    if (selectedNode) {
        connectedIds.add(selectedNode.id);
        initialEdges.forEach(edge => {
            if (edge.source === selectedNode.id) connectedIds.add(edge.target);
            if (edge.target === selectedNode.id) connectedIds.add(edge.source);
        });
    }

    const displayedNodes = nodes.map(node => ({
        ...node,
        data: {
            ...node.data,
            onSelect: () => onNodeSelect(node.data),
            isSelected: node.id === selectedNode?.id,
            dimmed: !matchesSearch(node.data, searchQuery)
                || (activeLayer !== null && node.data.layer !== activeLayer)
                || (selectedNode !== null && !connectedIds.has(node.id)),
        },
    }));
    const matchingIds = new Set(displayedNodes.filter(node => !node.data.dimmed).map(node => node.id));
    const edges = initialEdges.map(edge => ({
        ...edge,
        style: {
            ...edge.style,
            opacity: matchingIds.has(edge.source) && matchingIds.has(edge.target) ? 1 : 0.1,
        },
    }));

    return (
        <div className="w-full h-full relative bg-white">
            <ReactFlow<AtlasGraphNode>
                nodes={displayedNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onNodeClick={(_, node) => onNodeSelect(node.data)}
                onPaneClick={() => {
                    setActiveLayer(null);
                    onNodeSelect(null);
                }}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                nodesDraggable={isDraggable}
                nodesConnectable={false}
                nodesFocusable={false}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
                maxZoom={2.5}
                panOnScroll
                panOnScrollSpeed={0.8}
                zoomOnScroll={false}
                zoomOnPinch
                zoomOnDoubleClick={false}
                panOnDrag
                selectionOnDrag={false}
                preventScrolling
            >
                <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#e2e8f0" />
                <Controls showInteractive={false} className="bg-white border-slate-200 fill-slate-500 shadow-md" />
                <Panel position="top-center">
                    <div className="layer-buttons">
                        {atlasLayers.map((layer, index) => (
                            <button
                                key={layer.label}
                                onClick={() => setActiveLayer(current => current === index ? null : index)}
                                aria-pressed={activeLayer === index}
                                className={`layer-btn ${activeLayer === index ? 'layer-btn-active' : ''}`}
                                style={activeLayer === index ? {
                                    borderColor: '#10b981',
                                    backgroundColor: '#ecfdf5',
                                    color: '#047857',
                                } : undefined}
                            >
                                {layer.label}
                            </button>
                        ))}
                    </div>
                </Panel>
                <Panel position="top-right">
                    <button
                        onClick={() => setIsDraggable(current => !current)}
                        className="lock-toggle-btn"
                        aria-pressed={isDraggable}
                        aria-label={isDraggable ? 'Lock node positions' : 'Unlock node positions'}
                    >
                        {isDraggable
                            ? <><Unlock className="w-4 h-4" /> Unlocked</>
                            : <><Lock className="w-4 h-4" /> Locked</>}
                    </button>
                </Panel>
            </ReactFlow>
            {searchQuery.trim() && !nodes.some(node => matchesSearch(node.data, searchQuery)) && (
                <div role="status" className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white border border-slate-200 rounded-xl p-4 shadow">
                    No matching concepts found.
                </div>
            )}
        </div>
    );
}
