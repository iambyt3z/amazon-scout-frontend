import { useState, useEffect, useCallback, useRef } from 'react';
import { health } from '@/lib/api';

interface HealthCheckState {
  isHealthy: boolean | null;
  isLoading: boolean;
  error: string | null;
  lastChecked: Date | null;
}

export const useHealthCheck = (autoCheck: boolean = true) => {
  const [state, setState] = useState<HealthCheckState>({
    isHealthy: null,
    isLoading: false,
    error: null,
    lastChecked: null,
  });
  
  const hasChecked = useRef(false);

  const performHealthCheck = useCallback(async () => {
    // Prevent multiple simultaneous health checks
    if (state.isLoading) {
      return false;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await health();
      setState({
        isHealthy: true,
        isLoading: false,
        error: null,
        lastChecked: new Date(),
      });
      console.log('✅ Backend health check successful:', response);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState({
        isHealthy: false,
        isLoading: false,
        error: errorMessage,
        lastChecked: new Date(),
      });
      console.error('❌ Backend health check failed:', errorMessage);
      return false;
    }
  }, [state.isLoading]);

  useEffect(() => {
    if (autoCheck && !hasChecked.current) {
      hasChecked.current = true;
      performHealthCheck();
    }
  }, [autoCheck, performHealthCheck]);

  return {
    ...state,
    performHealthCheck,
  };
};
