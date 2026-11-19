/**
 * The Confusion Button - Initial Data & Constants
 */

// Available Subject Presets for rapid switching
const PRESET_SUBJECTS = [
  {
    courseCode: "CS101",
    courseName: "Number System & Computer Architecture",
    instructor: "Dr. Sarah Lin",
    room: "Lecture Hall B & Hybrid Stream",
    currentTopic: "Hexadecimal → Binary Conversion",
    topicList: [
      { id: 1, name: "Binary & Positional Weights", startTime: "10:00 AM" },
      { id: 2, name: "Hexadecimal Basics (Base-16)", startTime: "10:12 AM" },
      { id: 3, name: "Hexadecimal → Binary Conversion", startTime: "10:25 AM", active: true },
      { id: 4, name: "Type Casting & Memory Allocation", startTime: "10:45 AM" },
      { id: 5, name: "Two's Complement Representation", startTime: "11:05 AM" }
    ]
  },
  {
    courseCode: "MATH201",
    courseName: "Discrete Mathematics & Graph Theory",
    instructor: "Prof. Alan Reyes",
    room: "Auditorium 3",
    currentTopic: "Eulerian Paths & Hamiltonian Cycles",
    topicList: [
      { id: 1, name: "Graph Terminology & Vertices", startTime: "10:00 AM" },
      { id: 2, name: "Adjacency Matrix Representation", startTime: "10:15 AM" },
      { id: 3, name: "Eulerian Paths & Hamiltonian Cycles", startTime: "10:30 AM", active: true },
      { id: 4, name: "Planar Graphs & Euler's Formula", startTime: "10:50 AM" },
      { id: 5, name: "Graph Coloring Theorem", startTime: "11:10 AM" }
    ]
  },
  {
    courseCode: "PHY102",
    courseName: "Electromagnetism & Wave Physics",
    instructor: "Dr. Elena Rostova",
    room: "Science Complex 104",
    currentTopic: "Faraday's Law & Magnetic Induction",
    topicList: [
      { id: 1, name: "Magnetic Flux & Right Hand Rule", startTime: "10:00 AM" },
      { id: 2, name: "Faraday's Law & Magnetic Induction", startTime: "10:20 AM", active: true },
      { id: 3, name: "Lenz's Law & Eddy Currents", startTime: "10:40 AM" },
      { id: 4, name: "Maxwell's Equations Introduction", startTime: "11:05 AM" }
    ]
  },
  {
    courseCode: "DSA204",
    courseName: "Data Structures & Algorithms",
    instructor: "Prof. Kenneth Wu",
    room: "Lab 402 & Online",
    currentTopic: "Red-Black Tree Balancing & Rotations",
    topicList: [
      { id: 1, name: "Binary Search Trees Review", startTime: "10:00 AM" },
      { id: 2, name: "AVL Trees & Single Rotations", startTime: "10:15 AM" },
      { id: 3, name: "Red-Black Tree Balancing & Rotations", startTime: "10:35 AM", active: true },
      { id: 4, name: "B-Trees & Multiway Search", startTime: "11:00 AM" }
    ]
  },
  {
    courseCode: "CHEM101",
    courseName: "General Chemistry & Thermodynamics",
    instructor: "Dr. Maya Patel",
    room: "Chemistry Hall 1",
    currentTopic: "Gibbs Free Energy & Spontaneity",
    topicList: [
      { id: 1, name: "First Law of Thermodynamics", startTime: "10:00 AM" },
      { id: 2, name: "Enthalpy & Calorimetry", startTime: "10:18 AM" },
      { id: 3, name: "Gibbs Free Energy & Spontaneity", startTime: "10:35 AM", active: true },
      { id: 4, name: "Chemical Equilibrium Constant K", startTime: "11:00 AM" }
    ]
  }
];

const INITIAL_LECTURE_DATA = {
  courseCode: "MATH201",
  courseName: "Discrete Mathematics & Graph Theory",
  instructor: "Prof. Alan Reyes",
  room: "Auditorium 3 & Hybrid Stream",
  sessionDate: "October 29, 2026",
  sessionTime: "10:00 AM - 11:30 AM",
  activeStudents: 35,
  currentTopic: "Eulerian Paths & Hamiltonian Cycles",
  topicList: [
    { id: 1, name: "Graph Terminology & Vertices", startTime: "10:00 AM" },
    { id: 2, name: "Adjacency Matrix Representation", startTime: "10:15 AM" },
    { id: 3, name: "Eulerian Paths & Hamiltonian Cycles", startTime: "10:30 AM", active: true },
    { id: 4, name: "Planar Graphs & Euler's Formula", startTime: "10:50 AM" },
    { id: 5, name: "Graph Coloring Theorem", startTime: "11:10 AM" }
  ],
  initialFeedback: {
    gotIt: 22,
    unsure: 8,
    confused: 5
  },
  thresholdPercentage: 30, // Trigger high confusion banner if confused >= 30%
  // Core Post-Class Analytics requirement
  postClassSummary: {
    mostConfusingSection: "Eulerian Paths & Hamiltonian Cycles",
    peakConfusionTime: "10:35 AM",
    studentsAffectedPercent: 63,
    avgComprehensionScore: 71.4,
    totalClicksRecorded: 184,
    highConfusionIncidents: 2,
    suggestedPedagogy: "Allocate 10 minutes next session to review Eulerian vs Hamiltonian degree conditions."
  },
  // Timeline Historical Log Data (mapping student feedback against lecture timeline)
  timelineHistory: [
    {
      time: "10:00 AM",
      minutes: 0,
      topic: "Lecture Welcome & Binary Overview",
      gotIt: 33,
      unsure: 2,
      confused: 0,
      confusionPercent: 0,
      isSpike: false,
      note: "Class begins smoothly with review of powers of two"
    },
    {
      time: "10:05 AM",
      minutes: 5,
      topic: "Binary Representation Basics",
      gotIt: 31,
      unsure: 3,
      confused: 1,
      confusionPercent: 2.8,
      isSpike: false,
      note: "High comprehension of base-2 fundamentals"
    },
    {
      time: "10:10 AM",
      minutes: 10,
      topic: "Hexadecimal Base-16 Symbols (0-F)",
      gotIt: 28,
      unsure: 5,
      confused: 2,
      confusionPercent: 5.7,
      isSpike: false,
      note: "Explaining letters A through F"
    },
    {
      time: "10:15 AM",
      minutes: 15,
      topic: "Nibble Mapping (4 Bits = 1 Hex)",
      gotIt: 24,
      unsure: 8,
      confused: 3,
      confusionPercent: 8.5,
      isSpike: false,
      note: "Grouping binary bits into 4-bit nibbles"
    },
    {
      time: "10:21 AM",
      minutes: 21,
      topic: "Type Casting",
      gotIt: 7,
      unsure: 6,
      confused: 22,
      confusionPercent: 62.9,
      isSpike: true,
      spikeLabel: "🚨 Peak Confusion Spike (63% Confused)",
      note: "Major friction point: Casting signed byte to unsigned int with sign extension!"
    },
    {
      time: "10:25 AM",
      minutes: 25,
      topic: "Instructor Clarification on Sign Bit",
      gotIt: 19,
      unsure: 11,
      confused: 5,
      confusionPercent: 14.3,
      isSpike: false,
      note: "Teacher pivoted explanation using whiteboard example"
    },
    {
      time: "10:30 AM",
      minutes: 30,
      topic: "Hexadecimal → Binary Direct Table",
      gotIt: 25,
      unsure: 7,
      confused: 3,
      confusionPercent: 8.6,
      isSpike: false,
      note: "Table lookup method practice"
    },
    {
      time: "10:38 AM",
      minutes: 38,
      topic: "Hexadecimal → Binary Multi-Byte Conversion",
      gotIt: 15,
      unsure: 9,
      confused: 11,
      confusionPercent: 31.4,
      isSpike: true,
      spikeLabel: "⚠️ High Confusion Trigger (31%)",
      note: "Students struggled with padding leading zeroes in 0x4F to binary"
    },
    {
      time: "10:45 AM",
      minutes: 45,
      topic: "Hexadecimal → Binary Interactive Examples",
      gotIt: 22,
      unsure: 8,
      confused: 5,
      confusionPercent: 14.3,
      isSpike: false,
      note: "Current live lecture timestamp"
    }
  ],
  // Team roles specification
  teamRoles: [
    {
      role: "Member 1 – Software Engineer (Full-Stack)",
      name: "Alex Rivera",
      avatar: "💻",
      accent: "blue",
      responsibilities: [
        "Responsible for building the responsive UI Student interface with zero friction and guaranteed anonymity.",
        "Setting up the backend server pipelines (REST endpoints and WebSockets for low-latency feedback transmission).",
        "Managing database logs and time-series aggregation buckets (SQLite / Firebase).",
        "Rendering the live analytics charts and high confusion warning indicators on the teacher dashboard."
      ],
      skills: ["HTML5 / CSS / Tailwind CSS", "JavaScript (ES6+) / WebSockets", "Node.js & Python Flask APIs", "Time-Series Data Modeling"]
    },
    {
      role: "Member 2 – Hardware Engineer",
      name: "Marcus Chen",
      avatar: "⚡",
      accent: "emerald",
      responsibilities: [
        "Responsible for building the physical prototype with tactile push buttons.",
        "Wiring the 3 push buttons and status LEDs on the breadboard with pull-down debouncing.",
        "Flashing the ESP32 microcontroller with optimized C++ / Arduino firmware.",
        "Setting up Wi-Fi communication (HTTP POST / MQTT) to send physical clicks seamlessly to the web application."
      ],
      skills: ["ESP32 Microcontroller", "Circuit Prototyping & Soldering", "Embedded C++ / Arduino IDE", "Wi-Fi & MQTT IoT Protocols"]
    },
    {
      role: "Member 3 – Design Thinking & Research Lead",
      name: "Elena Rostova",
      avatar: "🎯",
      accent: "purple",
      responsibilities: [
        "Responsible for conducting initial user empathy research and student interviews.",
        "Building surveys regarding classroom hesitation, social anxiety, and peer embarrassment.",
        "Synthesizing problem statements and defining the human-centric design criteria.",
        "Managing the Prior Art competitive analysis, running system usability testing, and structuring project presentations."
      ],
      skills: ["Empathy Mapping & User Personas", "Classroom Field Testing", "Quantitative & Qualitative Surveying", "Competitive Prior Art Matrix"]
    }
  ],
  // Prior Art Comparison Data
  priorArt: [
    {
      solution: "Traditional Hand Raising",
      mechanism: "Public verbal question or raised hand",
      nature: "Spontaneous, manual",
      anonymity: "❌ Zero anonymity (High social peer fear)",
      lectureDisruption: "High (Halts lecture pacing abruptly)",
      dataContinuity: "❌ None (No historic time-series data)",
      barrierToEntry: "Extremely high psychological barrier; students remain silent"
    },
    {
      solution: "Clicker Systems & Live Quizzes (iClickers, Kahoot, Mentimeter)",
      mechanism: "Episodic multiple choice quiz slides",
      nature: "Discrete & interruptive",
      anonymity: "⚠️ Partial (often leaderboard or account tied)",
      lectureDisruption: "High (Forces lecture to freeze for question slide)",
      dataContinuity: "❌ Point-in-time only (does not track continuous flow)",
      barrierToEntry: "Requires app installation, login PINs, and instructor pauses"
    },
    {
      solution: "The Confusion Button (Our Innovation)",
      mechanism: "Dual physical desk buttons (ESP32) + 1-tap mobile web",
      nature: "Continuous, passive stream",
      anonymity: "✅ 100% Cryptographically Anonymous & Untracked",
      lectureDisruption: "Zero (Passive background comprehension monitoring)",
      dataContinuity: "✅ Continuous Confusion Timeline correlated by minute",
      barrierToEntry: "Zero friction: 1-click tap or physical button push at student desk"
    }
  ],
  // Tech Stack & Hardware Specs
  techStack: {
    software: [
      { name: "Frontend Client", tech: "HTML5, CSS3, Tailwind CSS, Vanilla Modern JS (ES6+)", desc: "Lightweight, responsive, zero-build dependency requirement, mobile-optimized." },
      { name: "Interactive Visualizations", tech: "SVG Responsive Canvas & Chart Engine", desc: "Dynamic rendering of real-time multi-series timeline, struggle spike badges, and counters." },
      { name: "Backend Architecture", tech: "Python/Flask or Node.js REST & WebSockets", desc: "High-throughput asynchronous ingest of feedback events from both IoT devices and browsers." },
      { name: "Database & Storage", tech: "SQLite / Firebase Realtime Database", desc: "Time-series logging of anonymized timestamped comprehension states." }
    ],
    hardware: [
      { component: "ESP32 Microcontroller", spec: "32-bit Xtensa Dual-Core, 240MHz, 802.11 b/g/n Wi-Fi + BLE", role: "Handles button debounce, sends non-blocking HTTP POST requests to backend." },
      { component: "3 Physical Push Buttons", spec: "Momentary Tactile / Arcade Sanwa style (Green, Yellow, Red)", role: "Ergonomic physical buttons positioned at each student desk for tactile feedback." },
      { component: "3 Diffused LEDs", spec: "5mm Low-draw LEDs (Green, Amber, Red) + 220Ω Resistors", role: "Provides immediate local physical confirmation pulse when button is registered." },
      { component: "Breadboard & Wiring", spec: "Half-size 400-point Breadboard + Premium Dupont Jumper Wires", role: "Reliable prototype circuit connecting GPIO pins 18, 19, 21." },
      { component: "Debounce Resistors", spec: "10kΩ Pull-down resistors (or internal ESP32 INPUT_PULLUP)", role: "Prevents false floating signals during physical button presses." }
    ]
  }
};
