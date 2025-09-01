import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Flame, Clock, Target } from 'lucide-react';
import { Workout } from '../App';

interface WeeklyViewProps {
  workouts: Workout[];
}

const workoutTypeColors = {
  zone2: 'bg-blue-100 text-blue-800 border-blue-200',
  core: 'bg-orange-100 text-orange-800 border-orange-200',
  arms: 'bg-purple-100 text-purple-800 border-purple-200',
  legs: 'bg-green-100 text-green-800 border-green-200',
  cardio: 'bg-red-100 text-red-800 border-red-200',
  'full-body': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  mobility: 'bg-teal-100 text-teal-800 border-teal-200',
  recovery: 'bg-gray-100 text-gray-800 border-gray-200'
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

export function WeeklyView({ workouts }: WeeklyViewProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const getWorkoutsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return workouts.filter(workout => workout.date === dateStr);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const weekDays = getWeekDays(currentWeek);
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  // Calculate week stats
  const weekWorkouts = workouts.filter(workout => {
    const workoutDate = new Date(workout.date);
    return workoutDate >= weekStart && workoutDate <= weekEnd;
  });

  const totalDuration = weekWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
  const avgIntensity = weekWorkouts.length > 0 
    ? weekWorkouts.reduce((sum, workout) => sum + workout.intensity, 0) / weekWorkouts.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigateWeek('prev')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-center">
            <h2>
              {weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
              {weekEnd.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </h2>
          </div>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigateWeek('next')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Week Stats */}
        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span>{weekWorkouts.length} workouts</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{totalDuration}min</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4 text-muted-foreground" />
            <span>{avgIntensity.toFixed(1)} avg intensity</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-4">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}

        {/* Day Cards */}
        {weekDays.map(day => {
          const dayWorkouts = getWorkoutsForDate(day);
          const isCurrentDay = isToday(day);
          
          return (
            <Card 
              key={day.toISOString()} 
              className={`p-4 min-h-[160px] transition-all hover:shadow-md ${
                isCurrentDay ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex flex-col h-full">
                <div className={`text-sm mb-3 ${isCurrentDay ? 'font-medium' : 'text-muted-foreground'}`}>
                  {day.getDate()}
                </div>
                
                <div className="flex-1 space-y-2">
                  {dayWorkouts.map(workout => (
                    <div 
                      key={workout.id}
                      className="group cursor-pointer"
                    >
                      <Badge 
                        variant="secondary" 
                        className={`w-full justify-start text-xs py-1 ${workoutTypeColors[workout.type]} ${
                          workout.isTemplate ? 'border-dashed' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {workout.templateName || workoutTypeNames[workout.type]}
                            {workout.isTemplate && (
                              <span className="ml-1 text-xs opacity-60">📋</span>
                            )}
                          </span>
                          <span>{workout.duration}min</span>
                        </div>
                      </Badge>
                      
                      {/* Exercise count for templates */}
                      {workout.isTemplate && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {workout.exercises.length} exercises
                        </div>
                      )}
                      
                      {/* Intensity indicator */}
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 w-2 rounded-full ${
                              i < workout.intensity ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {dayWorkouts.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-8">
                      Rest day
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="font-medium">{weekWorkouts.length} Workouts</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Time</p>
              <p className="font-medium">{totalDuration} mins</p>
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
              <p className="font-medium">{avgIntensity.toFixed(1)}/5</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Most Trained</p>
              <p className="font-medium">
                {weekWorkouts.length > 0 
                  ? workoutTypeNames[weekWorkouts.reduce((a, b) => 
                      weekWorkouts.filter(w => w.type === a.type).length > 
                      weekWorkouts.filter(w => w.type === b.type).length ? a : b
                    ).type]
                  : 'None'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}