import { Counter, CountSession, Insight, AnalyticsData } from '../types';

export interface UsagePattern {
  primaryUsageTime: 'morning' | 'afternoon' | 'evening' | 'night';
  averageSessionLength: number;
  preferredCounterTypes: string[];
  deviceType: 'mobile' | 'tablet' | 'desktop';
  accessibilityNeeds: string[];
}

export interface ConsistencyMetrics {
  dailyConsistency: number; // 0-100%
  weeklyConsistency: number; // 0-100%
  monthlyConsistency: number; // 0-100%
  streakReliability: number; // 0-100%
  overallScore: number; // 0-100%
}

export interface ProgressTrend {
  period: 'daily' | 'weekly' | 'monthly';
  data: Array<{
    date: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  averageGrowth: number;
  volatility: number;
}

export class AnalyticsEngine {
  private sessions: CountSession[] = [];
  private counters: Counter[] = [];

  constructor(sessions: CountSession[], counters: Counter[]) {
    this.sessions = sessions;
    this.counters = counters;
  }

  // Main insights generation
  generateInsights(): Insight[] {
    const insights: Insight[] = [];

    // Consistency analysis
    const consistencyInsight = this.analyzeConsistencyPatterns();
    if (consistencyInsight) insights.push(consistencyInsight);

    // Optimal practice times
    const timeInsight = this.identifyOptimalPracticeTimes();
    if (timeInsight) insights.push(timeInsight);

    // Progress trends
    const progressInsight = this.calculateProgressTrends();
    if (progressInsight) insights.push(progressInsight);

    // Practice improvements
    const improvementInsight = this.suggestPracticeImprovements();
    if (improvementInsight) insights.push(improvementInsight);

    // Burnout detection
    const burnoutInsight = this.detectBurnoutRisk();
    if (burnoutInsight) insights.push(burnoutInsight);

    // New practice recommendations
    const recommendationInsight = this.recommendNewPractices();
    if (recommendationInsight) insights.push(recommendationInsight);

    return insights;
  }

  // Consistency Analysis
  private analyzeConsistencyPatterns(): Insight | null {
    const consistency = this.calculateConsistencyMetrics();
    
    if (consistency.overallScore < 30) {
      return {
        type: 'consistency',
        title: 'Improve Practice Consistency',
        description: `Your consistency score is ${consistency.overallScore}%. Try practicing at the same time each day to build a stronger habit.`,
        score: consistency.overallScore,
        trend: consistency.overallScore > 20 ? 'up' : 'down',
        actionable: true,
        actionText: 'Set Daily Reminder',
        actionUrl: '/settings/reminders',
        createdAt: new Date().toISOString()
      };
    }

    if (consistency.overallScore > 80) {
      return {
        type: 'achievement',
        title: 'Excellent Consistency!',
        description: `Amazing! You've maintained ${consistency.overallScore}% consistency. Keep up the great work!`,
        score: consistency.overallScore,
        trend: 'up',
        actionable: false,
        createdAt: new Date().toISOString()
      };
    }

    return null;
  }

  private calculateConsistencyMetrics(): ConsistencyMetrics {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentSessions = this.sessions.filter(session => 
      new Date(session.createdAt) > thirtyDaysAgo
    );

    const dailyConsistency = this.calculateDailyConsistency(recentSessions, 30);
    const weeklyConsistency = this.calculateWeeklyConsistency(recentSessions, 4);
    const monthlyConsistency = this.calculateMonthlyConsistency(recentSessions);
    const streakReliability = this.calculateStreakReliability(recentSessions);

    const overallScore = Math.round(
      (dailyConsistency + weeklyConsistency + monthlyConsistency + streakReliability) / 4
    );

    return {
      dailyConsistency,
      weeklyConsistency,
      monthlyConsistency,
      streakReliability,
      overallScore
    };
  }

  private calculateDailyConsistency(sessions: CountSession[], days: number): number {
    const practiceDays = new Set<string>();
    
    sessions.forEach(session => {
      const date = new Date(session.createdAt).toDateString();
      practiceDays.add(date);
    });

    return Math.round((practiceDays.size / days) * 100);
  }

  private calculateWeeklyConsistency(sessions: CountSession[], weeks: number): number {
    const weeklyPractice = new Map<string, number>();
    
    sessions.forEach(session => {
      const weekStart = this.getWeekStart(new Date(session.createdAt));
      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyPractice.set(weekKey, (weeklyPractice.get(weekKey) || 0) + 1);
    });

    const activeWeeks = Array.from(weeklyPractice.values()).filter(days => days >= 3).length;
    return Math.round((activeWeeks / weeks) * 100);
  }

  private calculateMonthlyConsistency(sessions: CountSession[]): number {
    const monthlyPractice = new Map<string, number>();
    
    sessions.forEach(session => {
      const monthKey = new Date(session.createdAt).toISOString().substring(0, 7);
      monthlyPractice.set(monthKey, (monthlyPractice.get(monthKey) || 0) + 1);
    });

    const activeMonths = Array.from(monthlyPractice.values()).filter(days => days >= 15).length;
    return Math.round((activeMonths / 3) * 100);
  }

  private calculateStreakReliability(sessions: CountSession[]): number {
    if (sessions.length < 7) return 0;

    const streaks: number[] = [];
    let currentStreak = 1;
    let lastDate: Date | null = null;

    sessions
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .forEach(session => {
        const sessionDate = new Date(session.createdAt);
        
        if (lastDate) {
          const daysDiff = Math.floor(
            (sessionDate.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000)
          );
          
          if (daysDiff === 1) {
            currentStreak++;
          } else if (daysDiff > 1) {
            streaks.push(currentStreak);
            currentStreak = 1;
          }
        }
        
        lastDate = sessionDate;
      });

    streaks.push(currentStreak);
    
    const averageStreak = streaks.reduce((sum, streak) => sum + streak, 0) / streaks.length;
    return Math.min(Math.round((averageStreak / 7) * 100), 100);
  }

  // Optimal Practice Times
  private identifyOptimalPracticeTimes(): Insight | null {
    const timePatterns = this.analyzeTimePatterns();
    
    if (timePatterns.mostActiveTime) {
      return {
        type: 'recommendation',
        title: 'Optimal Practice Time',
        description: `You're most consistent practicing at ${timePatterns.mostActiveTime}. Consider scheduling your sessions during this time.`,
        score: timePatterns.consistencyScore,
        trend: 'stable',
        actionable: true,
        actionText: 'Set Reminder',
        actionUrl: '/settings/reminders',
        createdAt: new Date().toISOString()
      };
    }

    return null;
  }

  private analyzeTimePatterns(): {
    mostActiveTime: string | null;
    consistencyScore: number;
    timeDistribution: Map<string, number>;
  } {
    const timeDistribution = new Map<string, number>();
    
    this.sessions.forEach(session => {
      const hour = new Date(session.createdAt).getHours();
      const timeSlot = this.getTimeSlot(hour);
      timeDistribution.set(timeSlot, (timeDistribution.get(timeSlot) || 0) + 1);
    });

    let mostActiveTime: string | null = null;
    let maxCount = 0;
    
    timeDistribution.forEach((count, timeSlot) => {
      if (count > maxCount) {
        maxCount = count;
        mostActiveTime = timeSlot;
      }
    });

    const totalSessions = this.sessions.length;
    const consistencyScore = totalSessions > 0 ? Math.round((maxCount / totalSessions) * 100) : 0;

    return {
      mostActiveTime,
      consistencyScore,
      timeDistribution
    };
  }

  private getTimeSlot(hour: number): string {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
  }

  // Progress Trends
  private calculateProgressTrends(): Insight | null {
    const weeklyTrend = this.calculateWeeklyProgressTrend();
    
    if (weeklyTrend.averageGrowth > 10) {
      return {
        type: 'progress',
        title: 'Great Progress!',
        description: `Your practice has grown ${weeklyTrend.averageGrowth}% this week. You're building momentum!`,
        score: Math.min(weeklyTrend.averageGrowth, 100),
        trend: 'up',
        actionable: false,
        createdAt: new Date().toISOString()
      };
    }

    if (weeklyTrend.averageGrowth < -10) {
      return {
        type: 'recommendation',
        title: 'Practice Needs Attention',
        description: `Your practice has decreased ${Math.abs(weeklyTrend.averageGrowth)}% this week. Consider adjusting your routine.`,
        score: Math.max(100 + weeklyTrend.averageGrowth, 0),
        trend: 'down',
        actionable: true,
        actionText: 'Review Goals',
        actionUrl: '/settings/goals',
        createdAt: new Date().toISOString()
      };
    }

    return null;
  }

  private calculateWeeklyProgressTrend(): ProgressTrend {
    const now = new Date();
    const fourWeeksAgo = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
    
    const recentSessions = this.sessions.filter(session => 
      new Date(session.createdAt) > fourWeeksAgo
    );

    const weeklyData = new Map<string, number>();
    
    recentSessions.forEach(session => {
      const weekStart = this.getWeekStart(new Date(session.createdAt));
      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + session.countsCompleted);
    });

    const data = Array.from(weeklyData.entries())
      .map(([date, value]) => ({
        date,
        value,
        trend: 'stable' as const
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate trend for each week
    for (let i = 1; i < data.length; i++) {
      const prevValue = data[i - 1].value;
      const currentValue = data[i].value;
      
      if (currentValue > prevValue * 1.1) {
        data[i].trend = 'up';
      } else if (currentValue < prevValue * 0.9) {
        data[i].trend = 'down';
      }
    }

    const values = data.map(d => d.value);
    const averageGrowth = values.length > 1 
      ? ((values[values.length - 1] - values[0]) / values[0]) * 100
      : 0;

    const volatility = this.calculateVolatility(values);

    return {
      period: 'weekly',
      data,
      averageGrowth: Math.round(averageGrowth),
      volatility: Math.round(volatility)
    };
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  // Practice Improvements
  private suggestPracticeImprovements(): Insight | null {
    const improvements = this.identifyImprovementAreas();
    
    if (improvements.length > 0) {
      const improvement = improvements[0];
      return {
        type: 'recommendation',
        title: improvement.title,
        description: improvement.description,
        score: improvement.score,
        trend: 'stable',
        actionable: true,
        actionText: improvement.actionText,
        actionUrl: improvement.actionUrl,
        createdAt: new Date().toISOString()
      };
    }

    return null;
  }

  private identifyImprovementAreas(): Array<{
    title: string;
    description: string;
    score: number;
    actionText: string;
    actionUrl: string;
  }> {
    const improvements = [];
    
    // Check session length
    const avgSessionLength = this.calculateAverageSessionLength();
    if (avgSessionLength < 5) {
      improvements.push({
        title: 'Extend Practice Sessions',
        description: 'Your sessions average 5 minutes. Try extending to 10-15 minutes for deeper practice.',
        score: 60,
        actionText: 'Set Timer Goal',
        actionUrl: '/settings/timer'
      });
    }

    // Check focus score
    const avgFocusScore = this.calculateAverageFocusScore();
    if (avgFocusScore < 6) {
      improvements.push({
        title: 'Improve Focus',
        description: 'Your focus score is below 6. Try practicing in a quieter environment.',
        score: avgFocusScore * 10,
        actionText: 'Find Quiet Space',
        actionUrl: '/settings/environment'
      });
    }

    // Check interruption rate
    const interruptionRate = this.calculateInterruptionRate();
    if (interruptionRate > 0.3) {
      improvements.push({
        title: 'Reduce Interruptions',
        description: `${Math.round(interruptionRate * 100)}% of sessions have interruptions. Try turning off notifications.`,
        score: Math.round((1 - interruptionRate) * 100),
        actionText: 'Enable Do Not Disturb',
        actionUrl: '/settings/notifications'
      });
    }

    return improvements;
  }

  private calculateAverageSessionLength(): number {
    if (this.sessions.length === 0) return 0;
    
    const totalDuration = this.sessions.reduce((sum, session) => sum + session.duration, 0);
    return Math.round(totalDuration / this.sessions.length / (1000 * 60)); // Convert to minutes
  }

  private calculateAverageFocusScore(): number {
    if (this.sessions.length === 0) return 0;
    
    const totalFocus = this.sessions.reduce((sum, session) => sum + session.focusScore, 0);
    return totalFocus / this.sessions.length;
  }

  private calculateInterruptionRate(): number {
    if (this.sessions.length === 0) return 0;
    
    const interruptedSessions = this.sessions.filter(session => session.interruptions > 0).length;
    return interruptedSessions / this.sessions.length;
  }

  // Burnout Detection
  private detectBurnoutRisk(): Insight | null {
    const burnoutRisk = this.calculateBurnoutRisk();
    
    if (burnoutRisk > 70) {
      return {
        type: 'recommendation',
        title: 'Consider Taking a Break',
        description: 'Your practice intensity is very high. Consider taking a lighter day to prevent burnout.',
        score: burnoutRisk,
        trend: 'down',
        actionable: true,
        actionText: 'Plan Rest Day',
        actionUrl: '/settings/schedule',
        createdAt: new Date().toISOString()
      };
    }

    return null;
  }

  private calculateBurnoutRisk(): number {
    const recentSessions = this.sessions.slice(-14); // Last 14 sessions
    if (recentSessions.length < 7) return 0;

    let riskScore = 0;
    
    // High frequency practice
    const practiceDays = new Set(recentSessions.map(s => 
      new Date(s.createdAt).toDateString()
    )).size;
    
    if (practiceDays > 12) riskScore += 30;
    
    // Long sessions
    const avgSessionLength = this.calculateAverageSessionLength();
    if (avgSessionLength > 30) riskScore += 25;
    
    // High intensity
    const avgCountsPerSession = recentSessions.reduce((sum, s) => sum + s.countsCompleted, 0) / recentSessions.length;
    if (avgCountsPerSession > 200) riskScore += 25;
    
    // Declining mood
    const recentMoods = recentSessions
      .filter(s => s.mood)
      .map(s => s.mood!)
      .slice(-7);
    
    if (recentMoods.length >= 3) {
      const negativeMoods = recentMoods.filter(m => m === 'distracted').length;
      if (negativeMoods > recentMoods.length / 2) riskScore += 20;
    }

    return Math.min(riskScore, 100);
  }

  // New Practice Recommendations
  private recommendNewPractices(): Insight | null {
    const recommendations = this.generatePracticeRecommendations();
    
    if (recommendations.length > 0) {
      const recommendation = recommendations[0];
      return {
        type: 'recommendation',
        title: recommendation.title,
        description: recommendation.description,
        score: recommendation.score,
        trend: 'stable',
        actionable: true,
        actionText: recommendation.actionText,
        actionUrl: recommendation.actionUrl,
        createdAt: new Date().toISOString()
      };
    }

    return null;
  }

  private generatePracticeRecommendations(): Array<{
    title: string;
    description: string;
    score: number;
    actionText: string;
    actionUrl: string;
  }> {
    const recommendations = [];
    
    // Check if user only has one counter type
    const counterTypes = new Set(this.counters.map(c => c.category));
    
    if (counterTypes.size === 1) {
      const currentType = Array.from(counterTypes)[0];
      
      if (currentType === 'japa') {
        recommendations.push({
          title: 'Try Pranayama Practice',
          description: 'You\'ve mastered japa counting. Consider adding pranayama breathing exercises.',
          score: 80,
          actionText: 'Add Pranayama',
          actionUrl: '/counters/create?type=pranayama'
        });
      } else if (currentType === 'pranayama') {
        recommendations.push({
          title: 'Explore Japa Counting',
          description: 'Add mantra repetition counting to complement your breathing practice.',
          score: 80,
          actionText: 'Add Japa Counter',
          actionUrl: '/counters/create?type=japa'
        });
      }
    }

    // Check for meditation practice
    if (!counterTypes.has('meditation')) {
      recommendations.push({
        title: 'Add Meditation Timer',
        description: 'Track your meditation sessions with a dedicated timer counter.',
        score: 70,
        actionText: 'Create Meditation Timer',
        actionUrl: '/counters/create?type=meditation'
      });
    }

    return recommendations;
  }

  // Utility Methods
  private getWeekStart(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  }

  // Generate comprehensive analytics
  generateAnalytics(): AnalyticsData {
    const insights = this.generateInsights();
    const consistency = this.calculateConsistencyMetrics();
    const timePatterns = this.analyzeTimePatterns();
    
    return {
      totalPracticeTime: this.sessions.reduce((sum, s) => sum + s.duration, 0),
      totalSessions: this.sessions.length,
      averageSessionLength: this.calculateAverageSessionLength(),
      mostActiveDay: this.getMostActiveDay(),
      mostActiveTime: timePatterns.mostActiveTime || '',
      consistencyTrend: this.getConsistencyTrend(),
      insights,
      lastUpdated: new Date().toISOString()
    };
  }

  private getMostActiveDay(): string {
    const dayCounts = new Map<string, number>();
    
    this.sessions.forEach(session => {
      const day = new Date(session.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
    });

    let mostActiveDay = '';
    let maxCount = 0;
    
    dayCounts.forEach((count, day) => {
      if (count > maxCount) {
        maxCount = count;
        mostActiveDay = day;
      }
    });

    return mostActiveDay;
  }

  private getConsistencyTrend(): number[] {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentSessions = this.sessions.filter(session => 
      new Date(session.createdAt) > thirtyDaysAgo
    );

    const dailyCounts = new Map<string, number>();
    
    recentSessions.forEach(session => {
      const date = new Date(session.createdAt).toISOString().split('T')[0];
      dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
    });

    const trend: number[] = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateKey = date.toISOString().split('T')[0];
      trend.unshift(dailyCounts.get(dateKey) || 0);
    }

    return trend;
  }
}
