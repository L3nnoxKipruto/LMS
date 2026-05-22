import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { syncService } from '../services/api';

export function useSyncQueue() {
  return useQuery({
    queryKey: ['sync-queue'],
    queryFn: () => syncService.getSyncQueue(),
  });
}

export function useTriggerSync() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => syncService.triggerSync(),
    onSuccess: () => {
      // Invalidate the sync-queue queries to fetch fresh status
      queryClient.invalidateQueries({ queryKey: ['sync-queue'] });
    },
  });
}
