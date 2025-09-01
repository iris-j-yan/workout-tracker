import React, { useState, useMemo } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, Calendar, Clock, Flame, Target, ChevronDown, ChevronUp } from 'lucide-react';
import { Workout } from '../App';

interface WorkoutHistoryProps {
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

export function WorkoutHistory({ workouts }: WorkoutHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'intensity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedWorkouts, setExpandedWorkouts] = useState<Set<string>>(new Set());

  const filteredAndSortedWorkouts = useMemo(() => {
    let filtered = workouts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(workout => 
        workout.exercises.some(exercise => 
          exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        workout.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workoutTypeNames[workout.type].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(workout => workout.type === typeFilter);
    }

    // Sort workouts
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        case 'intensity':
          comparison = a.intensity - b.intensity;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [workouts, searchTerm, typeFilter, sortBy, sortOrder]);

  const toggleWorkoutExpanded = (workoutId: string) => {
    const newExpanded = new Set(expandedWorkouts);
    if (newExpanded.has(workoutId)) {
      newExpanded.delete(workoutId);
    } else {
      newExpanded.add(workoutId);
    }
    setExpandedWorkouts(newExpanded);
  };

  const toggleSort = (field: 'date' | 'duration' | 'intensity') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2>Workout History</h2>
        <p className="text-muted-foreground">Review your past workouts and track improvements</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts, exercises, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="zone2">Zone 2</SelectItem>
            <SelectItem value="core">Core</SelectItem>
            <SelectItem value="arms">Arms</SelectItem>
            <SelectItem value="legs">Legs</SelectItem>
            <SelectItem value="cardio">Cardio</SelectItem>
            <SelectItem value="full-body">Full Body</SelectItem>
            <SelectItem value="mobility">Mobility</SelectItem>
            <SelectItem value="recovery">Recovery</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2">
        <span className="text-sm text-muted-foreground self-center">Sort by:</span>
        <Button
          variant={sortBy === 'date' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleSort('date')}
          className="gap-1"
        >
          <Calendar className="h-3 w-3" />
          Date
          {sortBy === 'date' && (
            sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant={sortBy === 'duration' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleSort('duration')}
          className="gap-1"
        >
          <Clock className="h-3 w-3" />
          Duration
          {sortBy === 'duration' && (
            sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
          )}
        </Button>
        <Button
          variant={sortBy === 'intensity' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleSort('intensity')}
          className="gap-1"
        >
          <Flame className="h-3 w-3" />
          Intensity
          {sortBy === 'intensity' && (
            sortOrder === 'desc' ? <ChevronDown className="h-3 w-3" /> : <ChevronUp className="h-3 w-3" />
          )}
        </Button>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedWorkouts.length} of {workouts.length} workouts
      </div>

      {/* Workout List */}
      <div className="space-y-4">
        {filteredAndSortedWorkouts.length === 0 ? (
          <Card className="p-8 text-center">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="mb-2">No workouts found</h3>
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start logging workouts to see them here'
              }
            </p>
          </Card>
        ) : (
          filteredAndSortedWorkouts.map(workout => {
            const isExpanded = expandedWorkouts.has(workout.id);
            
            return (
              <Card key={workout.id} className="overflow-hidden">
                <div 
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleWorkoutExpanded(workout.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground min-w-[80px]">
                        {formatDate(workout.date)}
                      </div>
                      
                      <Badge className={`${workoutTypeColors[workout.type]} ${workout.isTemplate ? 'border-dashed' : ''}`}>
                        {workout.templateName || workoutTypeNames[workout.type]}
                        {workout.isTemplate && (
                          <span className="ml-1 text-xs">📋</span>
                        )}
                      </Badge>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {workout.duration}min
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {workout.intensity}/5
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          {workout.exercises.length} exercises
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {workout.notes && (
                        <div className="text-xs text-muted-foreground italic max-w-[200px] truncate">
                          "{workout.notes}"
                        </div>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="border-t bg-muted/20 p-4">
                    <h4 className="mb-3">Exercises</h4>
                    <div className="grid gap-3">
                      {workout.exercises.map(exercise => (
                        <div key={exercise.id} className="flex items-center justify-between bg-background rounded-lg p-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{exercise.name}</div>
                              {exercise.category && (
                                <Badge variant="outline" className="text-xs">
                                  {exercise.category}
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {exercise.sets && `${exercise.sets} sets`}
                              {exercise.sets && exercise.reps && ` × `}
                              {exercise.reps && `${exercise.reps} reps`}
                              {exercise.weight && ` @ ${exercise.weight} lbs`}
                              {exercise.duration && `${exercise.duration} minutes`}
                              {exercise.distance && ` - ${exercise.distance} miles`}
                            </div>
                            {exercise.notes && (
                              <div className="text-xs text-muted-foreground italic mt-1">
                                {exercise.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {workout.notes && (
                      <div className="mt-4 pt-3 border-t">
                        <h5 className="text-sm font-medium mb-2">Notes</h5>
                        <p className="text-sm text-muted-foreground">{workout.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}