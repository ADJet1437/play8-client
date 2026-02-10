export interface StudioCard {
  id: string;
  title: string;
  description: string;
  category: 'training' | 'technique' | 'ball-machine';
  keywords: string[]; // For contextual matching
  content: {
    overview: string;
    steps?: string[];
    tips?: string[];
    duration?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  image?: string;
}

export const STUDIO_CARDS: StudioCard[] = [
  // Training Plans
  {
    id: 'beginner-fundamentals',
    title: 'Beginner Fundamentals',
    description: '4-week program to master tennis basics',
    category: 'training',
    keywords: ['beginner', 'start', 'learn', 'basics', 'fundamentals', 'new'],
    content: {
      overview: 'A comprehensive 4-week program designed for beginners to build a solid foundation in tennis.',
      duration: '4 weeks',
      difficulty: 'beginner',
      steps: [
        'Week 1: Grip and stance fundamentals',
        'Week 2: Forehand and backhand basics',
        'Week 3: Serve introduction and volleys',
        'Week 4: Putting it all together with rally practice',
      ],
      tips: [
        'Practice each skill for at least 30 minutes before moving on',
        'Focus on form over power',
        'Record yourself to review technique',
      ],
    },
  },
  {
    id: 'serve-improvement',
    title: 'Serve Improvement Program',
    description: '2-week intensive to boost your serve power and accuracy',
    category: 'training',
    keywords: ['serve', 'serving', 'power', 'ace', 'toss', 'speed'],
    content: {
      overview: 'Focused training to transform your serve into a weapon. Covers toss consistency, body rotation, and follow-through.',
      duration: '2 weeks',
      difficulty: 'intermediate',
      steps: [
        'Days 1-3: Toss consistency drills',
        'Days 4-6: Trophy position and shoulder rotation',
        'Days 7-9: Pronation and snap',
        'Days 10-14: Full serve integration with targets',
      ],
      tips: [
        'Use a ball machine set to feed slow balls for toss practice',
        'Film your serve from the side to check your trophy position',
        'Start at 70% power and gradually increase',
      ],
    },
  },
  {
    id: 'footwork-agility',
    title: 'Footwork & Agility',
    description: 'Improve court coverage and reaction time',
    category: 'training',
    keywords: ['footwork', 'movement', 'agility', 'speed', 'quick', 'court coverage', 'running'],
    content: {
      overview: 'Dynamic footwork training to help you reach more balls and recover faster between shots.',
      duration: '3 weeks',
      difficulty: 'intermediate',
      steps: [
        'Week 1: Split step timing and lateral movement',
        'Week 2: Approach shots and recovery steps',
        'Week 3: Full court movement patterns',
      ],
      tips: [
        'Always return to ready position after each shot',
        'Practice split step timing with ball machine feeds',
        'Use ladder drills for warm-up',
      ],
    },
  },
  {
    id: 'match-preparation',
    title: 'Match Day Preparation',
    description: 'Mental and physical prep for competitive play',
    category: 'training',
    keywords: ['match', 'competition', 'tournament', 'nervous', 'mental', 'prepare'],
    content: {
      overview: 'Complete preparation guide for match days including warm-up routines, mental preparation, and strategic planning.',
      duration: '1 day',
      difficulty: 'intermediate',
      steps: [
        'Pre-match: Light cardio and dynamic stretching',
        'Warm-up: Progressive hitting from mini-tennis to full court',
        'Mental: Visualization and breathing exercises',
        'During match: Point-by-point focus strategies',
      ],
      tips: [
        'Arrive at least 30 minutes early',
        'Have a consistent pre-serve routine',
        'Focus on your game plan, not the score',
      ],
    },
  },

  // Techniques
  {
    id: 'topspin-forehand',
    title: 'Topspin Forehand',
    description: 'Generate heavy topspin for consistent groundstrokes',
    category: 'technique',
    keywords: ['forehand', 'topspin', 'spin', 'groundstroke', 'drive'],
    content: {
      overview: 'Master the modern topspin forehand used by professional players. Learn the low-to-high swing path and proper wrist action.',
      difficulty: 'intermediate',
      steps: [
        'Start with a semi-western or western grip',
        'Drop the racket head below the ball',
        'Brush up and through the ball',
        'Follow through over your shoulder',
      ],
      tips: [
        'Think "windshield wiper" for the finish',
        'Keep your non-hitting arm up for balance',
        'Rotate your hips before your arm',
      ],
    },
  },
  {
    id: 'slice-backhand',
    title: 'Slice Backhand',
    description: 'Defensive and offensive slice techniques',
    category: 'technique',
    keywords: ['backhand', 'slice', 'underspin', 'defensive', 'approach'],
    content: {
      overview: 'The slice backhand is essential for defensive play, approach shots, and varying your game. Learn to hit both neutralizing and attacking slices.',
      difficulty: 'intermediate',
      steps: [
        'Use a continental grip',
        'High backswing with racket face slightly open',
        'Carve under and through the ball',
        'Extend toward your target on follow-through',
      ],
      tips: [
        'Keep the ball on your strings longer for control',
        'Vary the height and depth of your slice',
        'Use slice to approach the net',
      ],
    },
  },
  {
    id: 'kick-serve',
    title: 'Kick Serve',
    description: 'High-bouncing second serve that kicks away from opponents',
    category: 'technique',
    keywords: ['serve', 'kick', 'second serve', 'spin', 'topspin serve'],
    content: {
      overview: 'The kick serve provides safety and aggression on second serves. The heavy topspin creates a high, kicking bounce that is difficult to attack.',
      difficulty: 'advanced',
      steps: [
        'Toss slightly behind and to the left (for right-handers)',
        'Arch your back and bend your knees',
        'Brush up the back of the ball (7 to 1 on a clock face)',
        'Snap your wrist up and over',
      ],
      tips: [
        'Exaggerate the knee bend initially',
        'The toss location is crucial - practice it separately',
        'Start slow and focus on spin before adding power',
      ],
    },
  },

  // Ball Machine
  {
    id: 'ball-machine-basics',
    title: 'Ball Machine Basics',
    description: 'How to set up and use the ball machine effectively',
    category: 'ball-machine',
    keywords: ['ball machine', 'machine', 'setup', 'settings', 'how to'],
    content: {
      overview: 'Learn how to configure the ball machine for different drills. Understanding feed rate, oscillation, and spin settings.',
      difficulty: 'beginner',
      steps: [
        'Set feed rate to 4-5 seconds for beginners',
        'Start with no oscillation for consistency drills',
        'Adjust height for groundstrokes vs volleys',
        'Add light topspin to simulate real match balls',
      ],
      tips: [
        'Always check ball hopper is full before starting',
        'Position the machine at the baseline for groundstroke practice',
        'Move the machine closer for volley drills',
      ],
    },
  },
  {
    id: 'ball-machine-drills',
    title: 'Ball Machine Drills',
    description: 'Effective solo practice routines with the ball machine',
    category: 'ball-machine',
    keywords: ['drill', 'practice', 'solo', 'machine', 'routine', 'alone'],
    content: {
      overview: 'Structured drills to maximize your ball machine practice sessions. From simple repetition to complex movement patterns.',
      difficulty: 'intermediate',
      steps: [
        'Drill 1: 50 forehands crosscourt, focus on consistency',
        'Drill 2: Alternating forehand/backhand with oscillation',
        'Drill 3: Approach shot and split step practice',
        'Drill 4: Deep balls with recovery to center',
      ],
      tips: [
        'Set specific targets for each drill',
        'Track your success rate',
        'Take breaks every 15-20 minutes',
      ],
    },
  },
];

export const CATEGORY_LABELS: Record<StudioCard['category'], string> = {
  'training': 'Training Plans',
  'technique': 'Techniques',
  'ball-machine': 'Ball Machine',
};

export const CATEGORY_ICONS: Record<StudioCard['category'], string> = {
  'training': '📋',
  'technique': '🎾',
  'ball-machine': '🤖',
};
