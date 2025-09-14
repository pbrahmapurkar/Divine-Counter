import { useState } from 'react';
import { useApp, appActions } from '../context/AppContext';
import { useDataPersistence } from '../hooks/useDataPersistence';
import { useAnalytics } from '../hooks/useAnalytics';
import { eventBus, createEvent, EventTypes } from '../services/EventBus';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

export function TestingPanel() {
  const { state, dispatch } = useApp();
  const { exportData, importData } = useDataPersistence();
  const { generateInsights, getAnalytics, getInsights } = useAnalytics();
  const [testCounterName, setTestCounterName] = useState('Test Counter');
  const [testCount, setTestCount] = useState(0);

  const handleCreateTestCounter = () => {
    const testCounter = {
      id: `test-${Date.now()}`,
      name: testCounterName,
      color: '#FF6B35',
      cycleSize: 108,
      category: 'japa' as const,
      target: {
        daily: 1,
        weekly: 7,
        monthly: 30
      },
      statistics: {
        totalCount: 0,
        totalMaalas: 0,
        todayCount: 0,
        todayMaalas: 0,
        weeklyCount: 0,
        monthlyCount: 0,
        longestStreak: 0,
        currentStreak: 0,
        averageSessionTime: 0,
        completionRate: 0,
        consistencyScore: 0
      },
      settings: {
        hapticFeedback: false,
        soundEffects: true,
        autoIncrement: false,
        timeTracking: true,
        reminderEnabled: false,
        volumeButtonCounting: false
      },
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch(appActions.addCounter(testCounter));
    dispatch(appActions.setActiveCounter(testCounter));
  };

  const handleTestIncrement = () => {
    if (state.activeCounter) {
      dispatch(appActions.incrementCounter(state.activeCounter.id));
      setTestCount(prev => prev + 1);
      
      // Emit test event
      eventBus.emit(createEvent.countIncremented(
        state.activeCounter.id,
        testCount + 1,
        state.session.current?.id
      ));
    }
  };

  const handleTestMaalaCompletion = () => {
    if (state.activeCounter && state.session.current) {
      dispatch(appActions.completeMaala(
        state.activeCounter.id,
        state.session.current.id
      ));
      
      eventBus.emit(createEvent.maalaCompleted(
        state.activeCounter.id,
        state.session.current.id,
        1
      ));
    }
  };

  const handleTestNotification = async () => {
    console.log('Test Notification disabled: notifications removed');
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      console.log('Exported data:', data);
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'divine-counter-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleTestAnalytics = async () => {
    try {
      const insights = await generateInsights();
      console.log('Generated insights:', insights);
    } catch (error) {
      console.error('Analytics test failed:', error);
    }
  };

  const handleToggleHaptics = (checked: boolean) => {
    dispatch(appActions.updateUserPreferences({
      accessibility: { ...state.preferences.accessibility, hapticFeedback: checked }
    }));
  };

  const handleToggleSound = (checked: boolean) => {
    dispatch(appActions.updateUserPreferences({
      notifications: { ...state.preferences.notifications, soundEnabled: checked }
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🧪 Testing Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-counter-name">Test Counter Name</Label>
              <Input
                id="test-counter-name"
                value={testCounterName}
                onChange={(e) => setTestCounterName(e.target.value)}
                placeholder="Test Counter"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCreateTestCounter} className="w-full">
                Create Test Counter
              </Button>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleTestIncrement} variant="outline">
              Test Increment ({testCount})
            </Button>
            <Button onClick={handleTestMaalaCompletion} variant="outline">
              Test Maala Completion
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleTestNotification} variant="outline">
              Test Notification
            </Button>
            <Button onClick={handleTestAnalytics} variant="outline">
              Test Analytics
            </Button>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Settings Tests</Label>
            <div className="flex items-center justify-between">
              <span>Haptic Feedback</span>
              <Switch
                checked={state.preferences.accessibility.hapticFeedback}
                onCheckedChange={handleToggleHaptics}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Sound Effects</span>
              <Switch
                checked={state.preferences.notifications.soundEnabled}
                onCheckedChange={handleToggleSound}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Data Management</Label>
            <Button onClick={handleExportData} variant="outline" className="w-full">
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 State Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Badge variant="outline">Counters: {state.counters.length}</Badge>
            </div>
            <div>
              <Badge variant="outline">Active: {state.activeCounter?.name || 'None'}</Badge>
            </div>
            <div>
              <Badge variant="outline">User: {state.user?.name || 'None'}</Badge>
            </div>
            <div>
              <Badge variant="outline">Session: {state.session.isActive ? 'Active' : 'Inactive'}</Badge>
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <div>Current Count: {state.session.current?.countsCompleted || 0}</div>
            <div>Today's Count: {state.activeCounter?.statistics.todayCount || 0}</div>
            <div>Total Maalas: {state.activeCounter?.statistics.totalMaalas || 0}</div>
            <div>Current Streak: {state.activeCounter?.statistics.currentStreak || 0}</div>
          </div>

          <div className="text-xs text-muted-foreground">
            <div>Insights: {getInsights().length}</div>
            <div>Analytics Last Updated: {getAnalytics().lastUpdated}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📱 Event History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground max-h-32 overflow-y-auto">
            {eventBus.getEventHistory().slice(-10).map((event, index) => (
              <div key={index} className="flex justify-between py-1">
                <span>{event.type}</span>
                <span>{event.source}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
