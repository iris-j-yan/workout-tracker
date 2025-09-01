import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Minus, Save, X } from 'lucide-react';
import { Workout, Exercise } from '../App';

interface WorkoutLoggerProps {
  onSave: (workout: Omit<Workout, 'id'>) => void;
  onClose: () => void;
}

const workoutTypes = [
  { value: 'zone2', label: 'Zone 2 Training', color: 'bg-blue-500' },
  { value: 'core', label: 'Core Workout', color: 'bg-orange-500' },
  { value: 'arms', label: 'Arms Workout', color: 'bg-purple-500' },
  { value: 'legs', label: 'Legs Workout', color: 'bg-green-500' },
  { value: 'cardio', label: 'Cardio', color: 'bg-red-500' },
  { value: 'full-body', label: 'Full Body', color: 'bg-indigo-500' },
  { value: 'mobility', label: 'Mobility', color: 'bg-teal-500' },
  { value: 'recovery', label: 'Recovery', color: 'bg-gray-500' }
] as const;

export function WorkoutLogger({ onSave, onClose }: WorkoutLoggerProps) {
  const [workout, setWorkout] = useState<Omit<Workout, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    type: 'full-body',
    duration: 30,
    intensity: 3,
    exercises: [],
    notes: ''
  });

  const [newExercise, setNewExercise] = useState<Omit<Exercise, 'id'>>({
    name: '',
    sets: undefined,
    reps: undefined,
    weight: undefined,
    duration: undefined,
    distance: undefined
  });

  const addExercise = () => {
    if (!newExercise.name) return;
    
    const exercise: Exercise = {
      ...newExercise,
      id: Date.now().toString()
    };
    
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise]
    }));

    setNewExercise({
      name: '',
      sets: undefined,
      reps: undefined,
      weight: undefined,
      duration: undefined,
      distance: undefined
    });
  };

  const removeExercise = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(ex => ex.id !== exerciseId)
    }));
  };

  const handleSave = () => {
    if (workout.exercises.length === 0) return;
    onSave(workout);
  };

  const isCardioWorkout = workout.type === 'zone2' || workout.type === 'cardio';

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Log New Workout
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Workout Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={workout.date}
                onChange={(e) => setWorkout(prev =>({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={workout.duration}
                onChange={(e) => setWorkout(prev => ({ ...prev, duration: Number(e.target.value) }))}
              />
            </div>
          </div>

          {/* Workout Type */}
          <div className="space-y-2">
            <Label>Workout Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {workoutTypes.map(type => (
                <Button
                  key={type.value}
                  variant={workout.type === type.value ? "default" : "outline"}
                  className="justify-start gap-2"
                  onClick={() => setWorkout(prev => ({ ...prev, type: type.value as any }))}
                >
                  <div className={`w-3 h-3 rounded-full ${type.color}`} />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div className="space-y-2">
            <Label>Intensity Level</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(level => (
                <Button
                  key={level}
                  variant={workout.intensity === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setWorkout(prev => ({ ...prev, intensity: level as any }))}
                >
                  {level}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              1 = Very Easy, 3 = Moderate, 5 = Maximum Effort
            </p>
          </div>

          {/* Add Exercise */}
          <Card className="p-4">
            <h4 className="mb-4">Add Exercise</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exercise-name">Exercise Name</Label>
                  <Input
                    id="exercise-name"
                    placeholder="e.g., Push-ups, Squats, Running"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                {!isCardioWorkout && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="sets">Sets</Label>
                      <Input
                        id="sets"
                        type="number"
                        placeholder="3"
                        value={newExercise.sets || ''}
                        onChange={(e) => setNewExercise(prev => ({ 
                          ...prev, 
                          sets: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {!isCardioWorkout ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="reps">Reps</Label>
                      <Input
                        id="reps"
                        type="number"
                        placeholder="12"
                        value={newExercise.reps || ''}
                        onChange={(e) => setNewExercise(prev => ({ 
                          ...prev, 
                          reps: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="135"
                        value={newExercise.weight || ''}
                        onChange={(e) => setNewExercise(prev => ({ 
                          ...prev, 
                          weight: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (min)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="30"
                        value={newExercise.duration || ''}
                        onChange={(e) => setNewExercise(prev => ({ 
                          ...prev, 
                          duration: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="distance">Distance (miles)</Label>
                      <Input
                        id="distance"
                        type="number"
                        step="0.1"
                        placeholder="3.5"
                        value={newExercise.distance || ''}
                        onChange={(e) => setNewExercise(prev => ({ 
                          ...prev, 
                          distance: e.target.value ? Number(e.target.value) : undefined 
                        }))}
                      />
                    </div>
                  </>
                )}
              </div>

              <Button 
                onClick={addExercise} 
                disabled={!newExercise.name}
                className="w-full gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Exercise
              </Button>
            </div>
          </Card>

          {/* Exercise List */}
          {workout.exercises.length > 0 && (
            <div className="space-y-2">
              <Label>Exercises ({workout.exercises.length})</Label>
              <div className="space-y-2">
                {workout.exercises.map(exercise => (
                  <Card key={exercise.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium">{exercise.name}</h5>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {exercise.sets && <span>{exercise.sets} sets</span>}
                          {exercise.reps && <span>{exercise.reps} reps</span>}
                          {exercise.weight && <span>{exercise.weight} lbs</span>}
                          {exercise.duration && <span>{exercise.duration} min</span>}
                          {exercise.distance && <span>{exercise.distance} miles</span>}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeExercise(exercise.id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did the workout feel? Any observations..."
              value={workout.notes}
              onChange={(e) => setWorkout(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={workout.exercises.length === 0}
              className="flex-1 gap-2"
            >
              <Save className="h-4 w-4" />
              Save Workout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}