import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataTable } from '../components/UI/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import { Box, AlertCircle, CheckCircle2 } from 'lucide-react';
import { type Asset } from '../hooks/useAssets';

const API_URL = 'http://localhost:3000';

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

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/assets?q=${encodeURIComponent(query)}`);
        const result = await response.json();
        
        // Transform backend data
        const transformed = result.map((item: any) => ({
          ...item,
          status: item.details?.status || 'active',
        }));
        
        setData(transformed);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="search-page p-6">
      <div className="page-header mb-6">
        <h1 className="text-2xl font-bold text-gradient">Search Results</h1>
        <p className="text-muted">Results for "{query}"</p>
      </div>

      <div className="glass-panel p-6">
        {loading ? (
          <div className="text-center p-8">Searching...</div>
        ) : (
          <DataTable columns={columns} data={data} />
        )}
        {!loading && data.length === 0 && (
          <div className="text-center p-8 text-muted">No results found.</div>
        )}
      </div>
    </div>
  );
};
