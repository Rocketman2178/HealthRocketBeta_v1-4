import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface LevelRecommendation {
  id: string;
  title: string;
  description: string;
  priority: number;
  category: string;
  scroll_target: string;
}

export function useLevelRecommendations(level: number) {
  const [recommendations, setRecommendations] = useState<LevelRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: rpcError } = await supabase
          .rpc('get_level_recommendations', {
            p_level: level
          });

        if (rpcError) throw rpcError;

        setRecommendations(data || []);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch recommendations'));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [level]);

  return { recommendations, loading, error };
}