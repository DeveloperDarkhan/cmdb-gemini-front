import React from 'react';
import { DataTable } from '../components/UI/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Box, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAssets, type Asset } from '../hooks/useAssets';
import './Inventory.css';

interface InventoryProps {
  type?: string;
  title: string;
  subtitle: string;
}

const columns: ColumnDef<Asset>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <div className="asset-name-cell">
        <div className="asset-icon-box">
           <Box size={18} className="text-primary" />
        </div>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'region',
    header: 'Region',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = (row.original.status || 'active') as string;
      return (
        <span className={`status-pill status-${status}`}>
          {status === 'active' && <CheckCircle2 size={12} />}
          {status === 'warning' && <AlertCircle size={12} />}
          {status === 'error' && <AlertCircle size={12} />}
          {status.toUpperCase()}
        </span>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.tags.map((tag) => (
          <span key={tag} className="tag-pill">
            {tag}
          </span>
        ))}
      </div>
    ),
  },
];

export const Inventory: React.FC<InventoryProps> = ({ type, title, subtitle }) => {
  const { data, loading, error } = useAssets(type);

  if (loading) return <div className="p-8 text-center text-muted">Loading {title}...</div>;
  if (error) return <div className="p-8 text-center text-red-400">Error loading data: {error}</div>;

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gradient">{title}</h1>
        <p className="text-muted">{subtitle}</p>
      </div>

      <div className="glass-panel p-6">
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
};
