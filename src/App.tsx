import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { Network } from './pages/Network';
import { Ipam } from './pages/Ipam';
import { Settings } from './pages/Settings';
import { SearchPage } from './pages/SearchPage';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Inventory split */}
          <Route path="datacenters" element={<Inventory type="datacenters" title="Datacenters" subtitle="Manage physical infrastructure locations" />} />
          <Route path="servers" element={<Inventory type="servers" title="Servers" subtitle="Physical and virtual servers" />} />
          <Route path="vms" element={<Inventory type="vms" title="Virtual Machines" subtitle="Virtual compute instances" />} />
          
          {/* Renamed/New */}
          <Route path="network-devices" element={<Inventory type="network-devices" title="Network Devices" subtitle="Switches, Routers, and Firewalls" />} />
          <Route path="k8s" element={<Inventory type="k8s" title="Kubernetes Clusters" subtitle="Container orchestration clusters" />} />
          <Route path="databases" element={<Inventory type="databases" title="Databases" subtitle="Managed and self-hosted databases" />} />
          <Route path="brokers" element={<Inventory type="brokers" title="Message Brokers" subtitle="Kafka, RabbitMQ, etc." />} />
          
          <Route path="ipam/*" element={<Ipam />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="findings" element={<div className="p-8">Findings Page (Coming Soon)</div>} />
          <Route path="settings" element={<Settings />} />
          
          {/* Legacy route redirect or keep for compatibility */}
          <Route path="inventory" element={<Navigate to="/datacenters" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
