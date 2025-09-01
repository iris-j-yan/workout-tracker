import React, { useState, useEffect } from 'react';
import { WeeklyView } from './components/WeeklyView';
import { WorkoutLogger } from './components/WorkoutLogger';
import { ProgressAnalytics } from './components/ProgressAnalytics';
import { WorkoutHistory } from './components/WorkoutHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card } from './components/ui/card';
import { Button } from './components/ui/button';
import { Plus, BarChart3, Calendar, History, Copy, Download } from 'lucide-react';

export interface Workout {
  id: string;
  date: string;
  type: 'zone2' | 'core' | 'arms' | 'legs' | 'cardio' | 'full-body' | 'mobility' | 'recovery';
  duration: number; // in minutes
  intensity: 1 | 2 | 3 | 4 | 5;
  exercises: Exercise[];
  notes?: string;
  isTemplate?: boolean;
  templateName?: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // for cardio exercises or hold times
  distance?: number; // for running/cycling
  notes?: string; // for exercise-specific notes like progressions
  category?: 'warm-up' | 'strength' | 'core' | 'cardio' | 'mobility' | 'recovery';
}

// Helper function to get the start of the current week (Sunday)
const getWeekStart = (date: Date = new Date()) => {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

// Helper function to format date for workout
const formatWorkoutDate = (dayOffset: number) => {
  const weekStart = getWeekStart();
  const workoutDate = new Date(weekStart);
  workoutDate.setDate(weekStart.getDate() + dayOffset);
  return workoutDate.toISOString().split('T')[0];
};

// Weekly Training Plan Generator
const generateWeeklyTrainingPlan = (): Workout[] => {
  const plan: Workout[] = [
    // Monday – Lower Body + Core (55 min)
    {
      id: 'template-monday',
      date: formatWorkoutDate(1), // Monday
      type: 'legs',
      duration: 55,
      intensity: 4,
      isTemplate: true,
      templateName: 'Lower Body + Core',
      exercises: [
        // PT Warm-up (10 min)
        { id: 'mon-1', name: 'SL Heel Drop Calf Raise', sets: 3, reps: 12, category: 'warm-up' },
        { id: 'mon-2', name: 'SL Balance Tip Toe Hold', sets: 6, duration: 10, notes: '10 sec each leg', category: 'warm-up' },
        { id: 'mon-3', name: 'Lunge with Elevated Heel', sets: 4, duration: 20, notes: '20 sec hold', category: 'warm-up' },
        
        // Strength (25 min)
        { id: 'mon-4', name: 'Banded Split DL', sets: 4, reps: 8, weight: 35, category: 'strength' },
        { id: 'mon-5', name: 'Deadlift', sets: 5, reps: 8, weight: 50, notes: 'Progress weekly', category: 'strength' },
        { id: 'mon-6', name: 'Front Rack Squat', sets: 6, reps: 8, weight: 30, category: 'strength' },
        { id: 'mon-7', name: 'Standing Lunge Step Backs', sets: 4, reps: 12, weight: 15, notes: '15 lb DB', category: 'strength' },
        
        // Core (15 min)
        { id: 'mon-8', name: 'TRX Leg Lifts', sets: 3, reps: 10, notes: 'Heels in straps, extend legs from bridge', category: 'core' },
        { id: 'mon-9', name: 'Hanging Side-to-Side Raises', sets: 3, reps: 10, notes: 'Lift legs toward right, then left', category: 'core' },
        { id: 'mon-10', name: 'Reverse Crunch on Bench', sets: 3, reps: 12, category: 'core' }
      ],
      notes: 'Lower body focus with core integration. Progress deadlift weight weekly.'
    },
    
    // Tuesday – Upper Back/Shoulders + Core (55 min)
    {
      id: 'template-tuesday',
      date: formatWorkoutDate(2), // Tuesday
      type: 'arms',
      duration: 55,
      intensity: 4,
      isTemplate: true,
      templateName: 'Upper Back/Shoulders + Core',
      exercises: [
        // PT Warm-up (8-10 min)
        { id: 'tue-1', name: 'Hip Hinge + External Rotation Press', sets: 5, reps: 8, category: 'warm-up' },
        { id: 'tue-2', name: 'Cable ER 90/90', sets: 4, reps: 8, weight: 5, category: 'warm-up' },
        
        // Strength (25 min)
        { id: 'tue-3', name: 'Lat Pull', sets: 4, reps: 8, weight: 30, category: 'strength' },
        { id: 'tue-4', name: 'OVP on Wall Military Press', sets: 4, reps: 8, weight: 10, category: 'strength' },
        { id: 'tue-5', name: 'Banded Batwing V1', sets: 1, reps: 10, category: 'strength' },
        { id: 'tue-6', name: 'Banded Batwing V2', sets: 1, reps: 7, category: 'strength' },
        { id: 'tue-7', name: 'Floor Bench Press', sets: 4, reps: 8, weight: 10, category: 'strength' },
        
        // Core (15 min)
        { id: 'tue-8', name: 'TRX Pikes', sets: 3, reps: 12, notes: 'Hips to inverted "V"', category: 'core' },
        { id: 'tue-9', name: 'TRX Oblique Knee Tucks', sets: 3, reps: 10, notes: 'Knees to opposite elbow, each side', category: 'core' },
        { id: 'tue-10', name: 'Side Plank Hip Dips', sets: 3, reps: 8, notes: 'Each side', category: 'core' }
      ],
      notes: 'Upper body strength with posterior chain focus and core stability.'
    },
    
    // Wednesday – Zone 2 + Core (50–55 min)
    {
      id: 'template-wednesday',
      date: formatWorkoutDate(3), // Wednesday
      type: 'zone2',
      duration: 55,
      intensity: 2,
      isTemplate: true,
      templateName: 'Zone 2 + Core',
      exercises: [
        // Zone 2 Cardio (35 min)
        { id: 'wed-1', name: 'Zone 2 Cardio', duration: 35, notes: 'Jog, bike, or row at HR 65-75% max (nasal breathing)', category: 'cardio' },
        
        // Core Block (15-20 min)
        { id: 'wed-2', name: 'TRX Atomic Push-Ups', sets: 3, reps: 10, notes: 'Push-up + knee tuck', category: 'core' },
        { id: 'wed-3', name: 'TRX Side Plank with Reach-Through', sets: 3, reps: 8, notes: 'Thread top arm under, extend back up, each side', category: 'core' },
        { id: 'wed-4', name: 'Banded Pallof Press', sets: 3, reps: 10, notes: 'Anti-rotation, each side', category: 'core' }
      ],
      notes: 'Aerobic base building with core stability. Focus on nasal breathing during cardio.'
    },
    
    // Thursday – Lower Body Plyo + Core (55 min)
    {
      id: 'template-thursday',
      date: formatWorkoutDate(4), // Thursday
      type: 'legs',
      duration: 55,
      intensity: 4,
      isTemplate: true,
      templateName: 'Lower Body Plyo + Core',
      exercises: [
        // PT Warm-up (10 min)
        { id: 'thu-1', name: 'Tip Toe Carry', sets: 2, duration: 30, weight: 15, notes: '10-15 lbs, 30 sec', category: 'warm-up' },
        { id: 'thu-2', name: 'Supported DL Calf Raise', sets: 2, reps: 12, category: 'warm-up' },
        { id: 'thu-3', name: 'SL Calf Raise', sets: 2, reps: 12, category: 'warm-up' },
        
        // Strength (25 min)
        { id: 'thu-4', name: 'Lateral Lunge Jump', sets: 4, reps: 12, weight: 15, notes: '15 lb DB', category: 'strength' },
        { id: 'thu-5', name: 'Banded Split DL', sets: 4, reps: 8, weight: 35, category: 'strength' },
        { id: 'thu-6', name: 'Curtsy/Skater Lunge', sets: 3, reps: 12, notes: 'Each leg', category: 'strength' },
        { id: 'thu-7', name: 'Glute Bridge March', sets: 3, reps: 12, category: 'strength' },
        
        // Core (15 min)
        { id: 'thu-8', name: 'Ab Rollouts', sets: 3, reps: 10, notes: 'Wheel/barbell, slow out + back', category: 'core' },
        { id: 'thu-9', name: 'Hanging Leg Lifts', sets: 3, reps: 10, notes: 'To 90°, controlled', category: 'core' },
        { id: 'thu-10', name: 'Flutter Kicks', sets: 3, duration: 20, notes: 'Hover, 20 sec', category: 'core' }
      ],
      notes: 'Plyometric lower body training with explosive movements and core finisher.'
    },
    
    // Friday – Upper Posterior Chain + Core (55 min)
    {
      id: 'template-friday',
      date: formatWorkoutDate(5), // Friday
      type: 'arms',
      duration: 55,
      intensity: 4,
      isTemplate: true,
      templateName: 'Upper Posterior Chain + Core',
      exercises: [
        // PT Warm-up (8-10 min)
        { id: 'fri-1', name: 'OVP on Wall Military Press', sets: 4, reps: 8, weight: 10, category: 'warm-up' },
        { id: 'fri-2', name: 'Banded Batwing V2', sets: 3, reps: 7, category: 'warm-up' },
        
        // Strength (25 min)
        { id: 'fri-3', name: 'DB or Barbell Row', sets: 4, reps: 8, category: 'strength' },
        { id: 'fri-4', name: 'Reverse Fly', sets: 3, reps: 15, category: 'strength' },
        { id: 'fri-5', name: 'Arnold Press', sets: 3, reps: 10, notes: 'Light/moderate weight', category: 'strength' },
        { id: 'fri-6', name: 'Farmer Carry', sets: 3, duration: 30, notes: '30 sec', category: 'strength' },
        
        // Core (15 min)
        { id: 'fri-7', name: 'Hanging Knee-to-Elbow', sets: 3, reps: 10, notes: 'Slow, avoid swinging', category: 'core' },
        { id: 'fri-8', name: 'Weighted Russian Twist', sets: 3, reps: 12, notes: 'Hold DB/plate, rotate torso, each side', category: 'core' },
        { id: 'fri-9', name: 'Plank Shoulder Taps', sets: 3, duration: 30, notes: 'Keep hips steady, 30 sec', category: 'core' }
      ],
      notes: 'Posterior chain focus with pulling movements and anti-rotation core work.'
    },
    
    // Saturday – Long Zone 2 + Mobility (60 min)
    {
      id: 'template-saturday',
      date: formatWorkoutDate(6), // Saturday
      type: 'zone2',
      duration: 60,
      intensity: 2,
      isTemplate: true,
      templateName: 'Long Zone 2 + Mobility',
      exercises: [
        // Zone 2 Endurance (45-50 min)
        { id: 'sat-1', name: 'Zone 2 Endurance', duration: 50, notes: 'Steady jog, bike, or hike (HR 65-70% max, sustainable pace)', category: 'cardio' },
        
        // Mobility / PT Recovery (10-15 min)
        { id: 'sat-2', name: 'Nelson Kneeling on Wall T-Spine Rotation', sets: 2, reps: 6, notes: 'Each side', category: 'mobility' },
        { id: 'sat-3', name: 'Seated Nelson Rotation with Leans', sets: 2, reps: 6, category: 'mobility' },
        { id: 'sat-4', name: '90/90 Reaching with Breathwork', sets: 2, duration: 30, notes: '30 sec each position', category: 'mobility' }
      ],
      notes: 'Longer aerobic session with mobility work for recovery and movement quality.'
    },
    
    // Sunday – Active Recovery (40 min)
    {
      id: 'template-sunday',
      date: formatWorkoutDate(0), // Sunday
      type: 'recovery',
      duration: 40,
      intensity: 1,
      isTemplate: true,
      templateName: 'Active Recovery',
      exercises: [
        { id: 'sun-1', name: 'Gentle Yoga or Walk', duration: 30, notes: 'Light movement for recovery', category: 'recovery' },
        { id: 'sun-2', name: 'Rolling to Glute Med on Wall', duration: 5, notes: 'Hip flexion/extension, controlled', category: 'mobility' },
        { id: 'sun-3', name: 'DLR Mid-Back Extension Reps', duration: 5, notes: 'Focus on thoracic extension', category: 'mobility' }
      ],
      notes: 'Active recovery with gentle movement and mobility work.'
    }
  ];
  
  return plan;
};

export default function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setShowInstallButton(false);
        }
        setDeferredPrompt(null);
      });
    }
  };

  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: '1',
      date: '2025-01-20',
      type: 'arms',
      duration: 45,
      intensity: 4,
      exercises: [
        { id: '1', name: 'Bicep Curls', sets: 3, reps: 12, weight: 25 },
        { id: '2', name: 'Push-ups', sets: 3, reps: 15 },
        { id: '3', name: 'Tricep Dips', sets: 3, reps: 10 }
      ],
      notes: 'Great session, felt strong'
    },
    {
      id: '2',
      date: '2025-01-18',
      type: 'zone2',
      duration: 60,
      intensity: 2,
      exercises: [
        { id: '4', name: 'Easy Run', duration: 60, distance: 8 }
      ],
      notes: 'Perfect heart rate zone'
    },
    {
      id: '3',
      date: '2025-01-16',
      type: 'legs',
      duration: 50,
      intensity: 5,
      exercises: [
        { id: '5', name: 'Squats', sets: 4, reps: 12, weight: 135 },
        { id: '6', name: 'Deadlifts', sets: 3, reps: 8, weight: 185 },
        { id: '7', name: 'Lunges', sets: 3, reps: 10 }
      ]
    },
    // Include the weekly training plan
    ...generateWeeklyTrainingPlan()
  ]);

  const [activeTab, setActiveTab] = useState('weekly');
  const [showLogger, setShowLogger] = useState(false);

  const addWorkout = (workout: Omit<Workout, 'id'>) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString()
    };
    setWorkouts(prev => [newWorkout, ...prev]);
    setShowLogger(false);
  };

  const loadWeeklyPlan = () => {
    const weeklyPlan = generateWeeklyTrainingPlan();
    setWorkouts(prev => {
      // Remove any existing templates for this week
      const filtered = prev.filter(w => !w.isTemplate || !weeklyPlan.some(p => p.date === w.date));
      return [...weeklyPlan, ...filtered];
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* PWA Install Banner */}
        {showInstallButton && (
          <Card className="mb-4 p-4 bg-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <h3>Install Workout Tracker</h3>
                <p className="text-sm opacity-90">
                  Add to your home screen for quick access
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowInstallButton(false)}
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Later
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInstallClick}
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 gap-2"
                >
                  <Download className="h-4 w-4" />
                  Install
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="mb-2">Workout Tracker</h1>
            <p className="text-muted-foreground">
              Track your fitness journey and see your progress
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              onClick={loadWeeklyPlan}
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              size="sm"
            >
              <Copy className="h-4 w-4" />
              <span className="hidden sm:inline">Load Weekly Plan</span>
              <span className="sm:hidden">Load Plan</span>
            </Button>
            <Button 
              onClick={() => setShowLogger(true)}
              className="gap-2 w-full sm:w-auto"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Log Workout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="weekly" className="gap-1 sm:gap-2 flex-col sm:flex-row py-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Weekly</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1 sm:gap-2 flex-col sm:flex-row py-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1 sm:gap-2 flex-col sm:flex-row py-2">
              <History className="h-4 w-4" />
              <span className="text-xs sm:text-sm">History</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-1 sm:gap-2 flex-col sm:flex-row py-2">
              <span className="text-xs sm:text-sm">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <WeeklyView workouts={workouts} />
          </TabsContent>

          <TabsContent value="analytics">
            <ProgressAnalytics workouts={workouts} />
          </TabsContent>

          <TabsContent value="history">
            <WorkoutHistory workouts={workouts} />
          </TabsContent>

          <TabsContent value="profile">
            <Card className="p-6">
              <h3 className="mb-4">Profile & Settings</h3>
              <p className="text-muted-foreground">
                Profile settings and preferences coming soon...
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Workout Logger Modal */}
        {showLogger && (
          <WorkoutLogger
            onSave={addWorkout}
            onClose={() => setShowLogger(false)}
          />
        )}
      </div>
    </div>
  );
}