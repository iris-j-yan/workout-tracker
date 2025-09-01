import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Target, Flame, Activity } from 'lucide-react';
import { Workout } from '../App';

interface ProgressAnalyticsProps {
  workouts: Workout[];
}

const workoutTypeColors = {
  zone2: '#3b82f6',
  core: '#f97316',
  arms: '#8b5cf6',
  legs: '#10b981',
  cardio: '#ef4444',
  'full-body': '#6366f1',
  mobility: '#14b8a6',
  recovery: '#6b7280'
};

const workoutTypeNames = {
  zone2: 'Zone 2',
  core: 'Core',
  arms: 'Arms',
  legs: 'Legs',
  cardio: 'Cardio',
  'full-body': 'Full Body',
  mobility: 'Mobility',
  recovery: 'Recovery'
};

export function ProgressAnalytics({ workouts }: ProgressAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState('overview');

  const filteredWorkouts = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    return workouts.filter(workout => new Date(workout.date) >= cutoffDate);
  }, [workouts, timeRange]);

  // Weekly workout frequency data
  const weeklyData = useMemo(() => {
    const weeks: { [key: string]: number } = {};
    
    filteredWorkouts.forEach(workout => {
      const date = new Date(workout.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      weeks[weekKey] = (weeks[weekKey] || 0) + 1;
    });

    return Object.entries(weeks)
      .map(([date, count]) => ({
        week: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        workouts: count
      }))
      .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())
      .slice(-8); // Last 8 weeks
  }, [filteredWorkouts]);

  // Workout type distribution
  const typeDistribution = useMemo(() => {
    const distribution: { [key: string]: number } = {};
    
    filteredWorkouts.forEach(workout => {
      distribution[workout.type] = (distribution[workout.type] || 0) + 1;
    });

    return Object.entries(distribution).map(([type, count]) => ({
      name: workoutTypeNames[type as keyof typeof workoutTypeNames],
      value: count,
      color: workoutTypeColors[type as keyof typeof workoutTypeColors]
    }));
  }, [filteredWorkouts]);

  // Duration over time
  const durationData = useMemo(() => {
    const grouped: { [key: string]: { total: number, count: number } } = {};
    
    filteredWorkouts.forEach(workout => {
      const date = new Date(workout.date);
      const key = timeRange === 'week' 
        ? date.toLocaleDateString('en-US', { weekday: 'short' })
        : timeRange === 'month'
        ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : date.toLocaleDateString('en-US', { month: 'short' });
      
      if (!grouped[key]) {
        grouped[key] = { total: 0, count: 0 };
      }
      grouped[key].total += workout.duration;
      grouped[key].count += 1;
    });

    return Object.entries(grouped)
      .map(([period, data]) => ({
        period,
        duration: data.total,
        avgDuration: Math.round(data.total / data.count)
      }))
      .slice(-10);
  }, [filteredWorkouts, timeRange]);

  // Intensity progression
  const intensityData = useMemo(() => {
    const grouped: { [key: string]: { total: number, count: number } } = {};
    
    filteredWorkouts.forEach(workout => {
      const date = new Date(workout.date);
      const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!grouped[key]) {
        grouped[key] = { total: 0, count: 0 };
      }
      grouped[key].total += workout.intensity;
      grouped[key].count += 1;
    });

    return Object.entries(grouped)
      .map(([date, data]) => ({
        date,
        avgIntensity: Number((data.total / data.count).toFixed(1))
      }))
      .slice(-14); // Last 14 data points
  }, [filteredWorkouts]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalWorkouts = filteredWorkouts.length;
    const totalDuration = filteredWorkouts.reduce((sum, w) => sum + w.duration, 0);
    const avgIntensity = totalWorkouts > 0 
      ? filteredWorkouts.reduce((sum, w) => sum + w.intensity, 0) / totalWorkouts 
      : 0;
    const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;

    return {
      totalWorkouts,
      totalDuration,
      avgIntensity: Number(avgIntensity.toFixed(1)),
      avgDuration: Math.round(avgDuration)
    };
  }, [filteredWorkouts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Progress Analytics</h2>
          <p className="text-muted-foreground">Track your fitness journey and improvements</p>
        </div>
        <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Workouts</p>
              <p className="font-medium">{stats.totalWorkouts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Duration</p>
              <p className="font-medium">{Math.round(stats.totalDuration / 60)}h {stats.totalDuration % 60}m</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Flame className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Intensity</p>
              <p className="font-medium">{stats.avgIntensity}/5</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Duration</p>
              <p className="font-medium">{stats.avgDuration} min</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
          <TabsTrigger value="types">Types</TabsTrigger>
          <TabsTrigger value="intensity">Intensity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Duration Trend */}
            <Card className="p-6">
              <div className="mb-4">
                <h3>Duration Trend</h3>
                <p className="text-sm text-muted-foreground">Total workout time over time</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={durationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`${value} min`, 'Duration']} />
                  <Area 
                    type="monotone" 
                    dataKey="duration" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Workout Types */}
            <Card className="p-6">
              <div className="mb-4">
                <h3>Workout Distribution</h3>
                <p className="text-sm text-muted-foreground">Breakdown by workout type</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="frequency">
          <Card className="p-6">
            <div className="mb-4">
              <h3>Workout Frequency</h3>
              <p className="text-sm text-muted-foreground">Number of workouts per week</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="workouts" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="types">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="mb-4">
                <h3>Workout Types</h3>
                <p className="text-sm text-muted-foreground">Distribution of workout types</p>
              </div>
              <div className="space-y-4">
                {typeDistribution.map(type => (
                  <div key={type.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: type.color }}
                      />
                      <span>{type.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{type.value}</span>
                      <span className="text-sm text-muted-foreground">
                        ({((type.value / stats.totalWorkouts) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-4">
                <h3>Type Distribution</h3>
                <p className="text-sm text-muted-foreground">Visual breakdown</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={typeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="intensity">
          <Card className="p-6">
            <div className="mb-4">
              <h3>Intensity Progression</h3>
              <p className="text-sm text-muted-foreground">Average intensity over time</p>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={intensityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 5]} />
                <Tooltip formatter={(value: any) => [`${value}/5`, 'Avg Intensity']} />
                <Line 
                  type="monotone" 
                  dataKey="avgIntensity" 
                  stroke="#ff7300" 
                  strokeWidth={2}
                  dot={{ fill: '#ff7300', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}