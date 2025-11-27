import { IpamTree } from '../components/UI/IpamTree';
import './Ipam.css';

export function Ipam() {
  return (
    <div className="ipam-page">
      <div className="page-header">
        <h1>IPAM</h1>
        <p className="subtitle">Visualize and manage VRFs, Subnets, and IP Addresses</p>
      </div>
      
      <div className="ipam-content">
        <IpamTree />
      </div>
    </div>
  );
}
