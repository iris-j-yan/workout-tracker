# 🏋️ Workout Tracker

A beautiful, responsive workout tracking app built with React, TypeScript, and Tailwind CSS. Track your fitness journey with weekly planning, progress analytics, and comprehensive workout logging.

## ✨ Features

- **📅 Weekly Calendar View** - Visual overview of your workout schedule
- **📝 Smart Workout Logger** - Easy exercise tracking with sets, reps, weights, and notes
- **📊 Progress Analytics** - Charts and insights showing your fitness progression
- **🔍 Workout History** - Searchable and filterable workout database
- **📱 PWA Ready** - Install on your phone like a native app
- **📋 Weekly Training Plans** - Pre-built comprehensive workout templates
- **🎯 Exercise Categories** - Organized by warm-up, strength, core, cardio, mobility, recovery
- **🏃‍♂️ Multiple Workout Types** - Zone 2, Core, Arms, Legs, Cardio, Full Body, Mobility, Recovery

## 🚀 Quick Start

### Option 1: Use the Live App
Visit the deployed app: **[Your App URL will be here after deployment]**

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/yourusername/workout-tracker.git
cd workout-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📱 Mobile Installation

This app is a Progressive Web App (PWA) that can be installed on your phone:

1. **Open the app** in Chrome or Safari on your phone
2. **Look for the install prompt** or tap the browser menu
3. **Select "Add to Home Screen"** or "Install App"
4. **The app will appear** on your home screen like a native app

### Features when installed:
- ✅ Works offline
- ✅ Opens without browser UI
- ✅ Fast loading with caching
- ✅ Native app feel

## 🏋️‍♀️ Built-in Weekly Training Plan

The app includes a comprehensive 7-day training plan featuring:

### **Monday** - Lower Body + Core (55 min)
- PT warm-up with calf raises and balance work
- Strength: Deadlifts, squats, lunges
- Core: TRX exercises and hanging movements

### **Tuesday** - Upper Back/Shoulders + Core (55 min)
- Shoulder mobility and external rotation
- Strength: Lat pulls, military press, bench press
- Core: TRX pikes and side planks

### **Wednesday** - Zone 2 + Core (50-55 min)
- 35 minutes of aerobic base building
- Anti-rotation core work

### **Thursday** - Lower Body Plyo + Core (55 min)
- Plyometric movements and jumping
- Explosive strength training
- Advanced core finishers

### **Friday** - Upper Posterior Chain + Core (55 min)
- Pulling movements and rear delt work
- Functional strength patterns
- Anti-rotation core stability

### **Saturday** - Long Zone 2 + Mobility (60 min)
- Extended aerobic session
- Thoracic spine mobility
- Movement quality focus

### **Sunday** - Active Recovery (40 min)
- Gentle movement and yoga
- Mobility and restoration work

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **PWA**: Service Worker + Web App Manifest

## 📊 Analytics & Tracking

Track your progress with comprehensive analytics:
- **Workout frequency** over time
- **Workout type distribution** 
- **Duration trends** and averages
- **Intensity progression** tracking
- **Weekly/monthly/yearly** views

## 🔧 Development

### Project Structure
```
├── App.tsx                 # Main application component
├── components/
│   ├── WeeklyView.tsx      # Calendar and weekly overview
│   ├── WorkoutLogger.tsx   # Exercise logging interface
│   ├── ProgressAnalytics.tsx # Charts and statistics
│   ├── WorkoutHistory.tsx  # Historical workout browser
│   └── ui/                 # Shadcn UI components
├── styles/
│   └── globals.css         # Tailwind CSS and custom styles
├── public/
│   ├── manifest.json       # PWA manifest
│   └── sw.js              # Service worker
└── index.html             # Entry point with PWA meta tags
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎯 Usage Tips

1. **Load the weekly plan** using the "Load Weekly Plan" button to populate your calendar with the comprehensive training program
2. **Log workouts** as you complete them to track progress over time
3. **Use the analytics** to identify patterns and ensure balanced training
4. **Review workout history** to see improvements and plan future sessions
5. **Install as PWA** for the best mobile experience

## 🤝 Contributing

This is a personal fitness tracking app, but feel free to fork and customize for your own needs!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Start tracking your fitness journey today!** 💪