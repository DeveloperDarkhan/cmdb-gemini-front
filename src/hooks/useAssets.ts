import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

export interface Asset {
  id: string;
  name: string;
  type: string;
  region: string;
  tags: string[];
  details: any;
  status: 'active' | 'warning' | 'error'; // Mapped from details or logic
}

export function useAssets(type?: string) {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const endpoint = type ? `${API_URL}/assets/${type}` : `${API_URL}/assets`;
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error('Failed to fetch assets');
        const result = await response.json();
        
        // Transform backend data to frontend model if needed
        const transformed = result.map((item: any) => ({
          ...item,
          status: item.details?.status || 'active', // Default status
        }));

        setData(transformed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [type]);

  return { data, loading, error };
}
