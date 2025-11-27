import { AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';
import './ValidatorWidget.css';

interface Finding {
  id: string;
  severity: 'alert' | 'warn' | 'info';
  message: string;
  count: number;
}

const MOCK_FINDINGS: Finding[] = [
  { id: '1', severity: 'alert', message: 'Duplicate IPs detected in DC-East', count: 3 },
  { id: '2', severity: 'warn', message: 'Orphaned VMs found', count: 12 },
  { id: '3', severity: 'alert', message: 'Unreachable Network Devices', count: 2 },
  { id: '4', severity: 'info', message: 'New subnets discovered', count: 5 },
];

export function ValidatorWidget() {
  return (
    <div className="validator-widget glass-card">
      <div className="widget-header">
        <h3>Validator Status</h3>
        <span className="status-badge error">5 Critical</span>
      </div>
      
      <div className="findings-list">
        {MOCK_FINDINGS.map((finding) => (
          <div key={finding.id} className={`finding-item ${finding.severity}`}>
            <div className="finding-icon">
              {finding.severity === 'alert' && <AlertOctagon size={16} />}
              {finding.severity === 'warn' && <AlertTriangle size={16} />}
              {finding.severity === 'info' && <CheckCircle size={16} />}
            </div>
            <div className="finding-content">
              <span className="finding-message">{finding.message}</span>
            </div>
            <span className="finding-count">{finding.count}</span>
          </div>
        ))}
      </div>
      
      <div className="widget-footer">
        <button className="view-all-btn">View All Findings</button>
      </div>
    </div>
  );
}
