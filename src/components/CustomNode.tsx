import { Handle, Position } from '@xyflow/react';
import { AtlasNode } from '../data/atlas';
import clsx from 'clsx';

export type GraphNodeData = AtlasNode & {
    [key: string]: unknown;
    dimmed: boolean;
    layer: number;
    nodeSize: number;
    isSelected?: boolean;
    onSelect?: () => void;
};

export default function CustomNode({ data }: { data: GraphNodeData }) {
    return (
        <div
            role="button"
            tabIndex={0}
            aria-label={data.label}
            aria-pressed={data.isSelected ?? false}
            onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    data.onSelect?.();
                }
            }}
            className={clsx(
                'custom-node-circle',
                data.layer === 0 ? 'node-center' : 'node-definition',
                data.dimmed && 'opacity-30 grayscale',
                data.isSelected && 'node-selected'
            )}
            style={{ width: data.nodeSize, height: data.nodeSize }}
            title={data.shared_definition.summary}
        >
            <Handle type="target" position={Position.Top} id="center-target" className="!opacity-0 !w-1 !h-1" style={{ top: '50%', left: '50%' }} />
            <Handle type="source" position={Position.Bottom} id="center-source" className="!opacity-0 !w-1 !h-1" style={{ top: '50%', left: '50%' }} />
            <span className="text-xs uppercase tracking-wider mb-2">{data.layer === 0 ? 'Why' : 'What'}</span>
            <strong className="node-title" style={{ fontSize: 16 }}>{data.label}</strong>
        </div>
    );
}
