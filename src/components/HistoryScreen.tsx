import { Check } from "lucide-react";
import { Header } from './Header';
import logo from 'figma:asset/b7d698c10ce4789169489d12ec0ea8183b3ce5e6.png';

interface HistoryEntry {
  date: string;
  count: number;
  goalAchieved: boolean;
  practiceId: string;
}

interface HistoryScreenProps {
  todayProgress: number;
  dailyGoal: number;
  streak: number;
  history: HistoryEntry[];
}

export function HistoryScreen({ todayProgress, dailyGoal, streak, history }: HistoryScreenProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Header
        title="History"
        subtitle="Your spiritual journey progress"
      />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4" style={{ paddingTop: '100px' }}>
        
        {/* Today's Progress */}
        <div className="bg-card rounded-lg p-4 mb-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Today: {todayProgress}/{dailyGoal} cycles</span>
              {todayProgress >= dailyGoal && (
                <Check size={16} className="text-green-500" />
              )}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Streak: {streak} days
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No history yet – start counting!</p>
            </div>
          ) : (
            history.map((entry, index) => (
              <div
                key={entry.date}
                className="flex items-center justify-between p-3 bg-card rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  {entry.goalAchieved && (
                    <Check size={16} className="text-green-500" />
                  )}
                  <span>{formatDate(entry.date)}</span>
                </div>
                <span className="text-muted-foreground">
                  {entry.count} cycle{entry.count !== 1 ? 's' : ''}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
