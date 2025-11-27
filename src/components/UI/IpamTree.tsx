import { useState } from 'react';
import { ChevronRight, ChevronDown, Network, Share2, Circle } from 'lucide-react';
import './IpamTree.css';

interface IpamNode {
  id: string;
  label: string;
  type: 'vrf' | 'subnet' | 'ip';
  details?: string;
  status?: 'active' | 'reserved' | 'free';
  children?: IpamNode[];
}

const MOCK_IPAM_DATA: IpamNode[] = [
  {
    id: 'vrf-1',
    label: 'VRF-Default',
    type: 'vrf',
    details: 'Global Routing',
    children: [
      {
        id: 'sub-1',
        label: '10.0.1.0/24',
        type: 'subnet',
        details: 'DC-East Management',
        children: [
          { id: 'ip-1', label: '10.0.1.1', type: 'ip', details: 'Gateway', status: 'active' },
          { id: 'ip-2', label: '10.0.1.2', type: 'ip', details: 'DNS Primary', status: 'active' },
          { id: 'ip-3', label: '10.0.1.3', type: 'ip', details: 'Reserved', status: 'reserved' },
          { id: 'ip-4', label: '10.0.1.4', type: 'ip', details: 'Free', status: 'free' },
        ]
      },
      {
        id: 'sub-2',
        label: '10.0.2.0/24',
        type: 'subnet',
        details: 'DC-East App Prod',
        children: [
          { id: 'ip-5', label: '10.0.2.10', type: 'ip', details: 'App-Server-01', status: 'active' },
          { id: 'ip-6', label: '10.0.2.11', type: 'ip', details: 'App-Server-02', status: 'active' },
        ]
      }
    ]
  },
  {
    id: 'vrf-2',
    label: 'VRF-Secure',
    type: 'vrf',
    details: 'PCI-DSS Zone',
    children: [
      {
        id: 'sub-3',
        label: '172.16.0.0/24',
        type: 'subnet',
        details: 'Secure DB',
        children: []
      }
    ]
  }
];

const NodeIcon = ({ type, status }: { type: string, status?: string }) => {
  if (type === 'vrf') return <Network size={16} className="node-icon vrf" />;
  if (type === 'subnet') return <Share2 size={16} className="node-icon subnet" />;
  return <Circle size={10} className={`node-icon ip ${status}`} />;
};

const TreeNode = ({ node, level = 0 }: { node: IpamNode, level?: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="tree-node" style={{ paddingLeft: level === 0 ? 0 : 24 }}>
      <div 
        className={`node-content ${node.type} ${isOpen ? 'open' : ''}`}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <div className="node-toggle">
          {hasChildren ? (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : <span className="spacer" />}
        </div>
        
        <NodeIcon type={node.type} status={node.status} />
        
        <div className="node-info">
          <span className="node-label">{node.label}</span>
          {node.details && <span className="node-details">{node.details}</span>}
        </div>
        
        {node.type === 'subnet' && (
          <div className="subnet-usage">
            <div className="usage-bar">
              <div className="usage-fill" style={{ width: '45%' }} />
            </div>
            <span className="usage-text">45%</span>
          </div>
        )}
      </div>

      {isOpen && hasChildren && (
        <div className="node-children">
          {node.children!.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export function IpamTree() {
  return (
    <div className="ipam-tree-container glass-card">
      <div className="tree-header">
        <h3>IP Address Management</h3>
        <div className="tree-legend">
          <span className="legend-item"><span className="dot active"></span>Allocated</span>
          <span className="legend-item"><span className="dot reserved"></span>Reserved</span>
          <span className="legend-item"><span className="dot free"></span>Free</span>
        </div>
      </div>
      <div className="tree-body">
        {MOCK_IPAM_DATA.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
}
