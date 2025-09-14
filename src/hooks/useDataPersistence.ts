import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { dataManager } from '../services/DataPersistenceManager';
import { eventBus, createEvent } from '../services/EventBus';

export function useAutoSave() {
  const { state } = useApp();
  
  useEffect(() => {
    const saveData = async () => {
      try {
        // Save counters
        for (const counter of state.counters) {
          await dataManager.saveCounter(counter);
        }
        
        // Save user profile
        if (state.user) {
          await dataManager.saveUserProfile(state.user);
        }
        
        // Save analytics
        await dataManager.saveAnalytics(state.analytics);
        
        // Emit success event
        eventBus.emit(createEvent.dataSynced('auto-save', true));
        
        console.log('Data saved successfully');
      } catch (error) {
        console.error('Failed to save data:', error);
        eventBus.emit(createEvent.dataSynced('auto-save', false));
      }
    };
    
    // Save data every 30 seconds
    const interval = setInterval(saveData, 30000);
    
    return () => clearInterval(interval);
  }, [state.counters, state.user, state.analytics]);
}

export function useDataPersistence() {
  const { state, dispatch } = useApp();
  
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user profile
        const user = await dataManager.loadUserProfile();
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
        }
        
        // Load counters
        const counters = await dataManager.loadAllCounters();
        if (counters.length > 0) {
          counters.forEach(counter => {
            dispatch({ type: 'ADD_COUNTER', payload: counter });
          });
          
          // Set first counter as active if none is set
          if (!state.activeCounter && counters.length > 0) {
            dispatch({ type: 'SET_ACTIVE_COUNTER', payload: counters[0] });
          }
        }
        
        // Load analytics
        const analytics = await dataManager.loadAnalytics();
        if (analytics) {
          dispatch({ type: 'UPDATE_ANALYTICS', payload: analytics });
        }
        
        console.log('Data loaded successfully');
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    
    loadData();
  }, [dispatch]);
  
  return {
    exportData: async () => {
      try {
        return await dataManager.exportAllData();
      } catch (error) {
        console.error('Failed to export data:', error);
        throw error;
      }
    },
    
    importData: async (data: any) => {
      try {
        await dataManager.importData(data);
        
        // Reload the app state
        window.location.reload();
      } catch (error) {
        console.error('Failed to import data:', error);
        throw error;
      }
    }
  };
}
