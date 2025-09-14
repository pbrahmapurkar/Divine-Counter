import { useEffect } from 'react';
import { useApp, appActions } from '../context/AppContext';
import { AnalyticsEngine } from '../services/AnalyticsEngine';
import { dataManager } from '../services/DataPersistenceManager';
import { eventBus, createEvent } from '../services/EventBus';

export function useAnalytics() {
  const { state, dispatch } = useApp();
  
  useEffect(() => {
    const generateInsights = async () => {
      try {
        // Load sessions from persistence
        const sessions = await dataManager.loadSessions();
        
        if (sessions.length === 0) return;
        
        // Create analytics engine
        const analyticsEngine = new AnalyticsEngine(sessions, state.counters);
        
        // Generate insights
        const insights = analyticsEngine.generateInsights();
        const analytics = analyticsEngine.generateAnalytics();
        
        // Update state with new insights
        insights.forEach(insight => {
          dispatch(appActions.addInsight(insight));
        });
        
        // Update analytics
        dispatch(appActions.updateAnalytics(analytics));
        
        // Emit analytics updated event
        eventBus.emit(createEvent.analyticsUpdated(analytics));
        
      } catch (error) {
        console.error('Failed to generate analytics:', error);
      }
    };
    
    // Generate insights every hour
    generateInsights();
    const interval = setInterval(generateInsights, 3600000);
    
    return () => clearInterval(interval);
  }, [state.counters, dispatch]);
  
  return {
    generateInsights: async () => {
      try {
        const sessions = await dataManager.loadSessions();
        const analyticsEngine = new AnalyticsEngine(sessions, state.counters);
        return analyticsEngine.generateInsights();
      } catch (error) {
        console.error('Failed to generate insights:', error);
        return [];
      }
    },
    
    getAnalytics: () => state.analytics,
    
    getInsights: () => state.analytics.insights
  };
}
