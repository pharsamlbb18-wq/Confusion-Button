/**
 * The Confusion Button - Reactive State Store
 */

const AppState = (function() {
  const listeners = [];

  function getInitialLecture() {
    try {
      const saved = localStorage.getItem('confusion_button_active_course');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_LECTURE_DATA, ...parsed };
      }
    } catch (e) {
      // ignore
    }
    return { ...INITIAL_LECTURE_DATA };
  }

  const initialLecture = getInitialLecture();

  const state = {
    currentView: 'split', // 'student' | 'teacher' | 'portfolio' | 'split'
    lecture: initialLecture,
    activeTopic: initialLecture.currentTopic || (initialLecture.topicList && initialLecture.topicList[0]?.name) || "General Overview",
    counts: { ...INITIAL_LECTURE_DATA.initialFeedback },
    totalStudents: INITIAL_LECTURE_DATA.activeStudents,
    threshold: INITIAL_LECTURE_DATA.thresholdPercentage,
    timeline: [...INITIAL_LECTURE_DATA.timelineHistory],
    studentFeedback: null, // Current anonymous user's active choice: 'green' | 'yellow' | 'red'
    feedbackCooldown: false,
    alertDismissed: false,
    alertDismissedTopic: null,
    simulationActive: false,
    simulationTimer: null,
    totalClicksSession: INITIAL_LECTURE_DATA.postClassSummary.totalClicksRecorded,
    hardwareESP32State: {
      connected: true,
      wifiRssi: -58, // dBm
      lastPing: "Just now",
      greenLed: false,
      yellowLed: false,
      redLed: false
    }
  };

  function subscribe(fn) {
    listeners.push(fn);
  }

  function notify(changedProp) {
    listeners.forEach(fn => fn(state, changedProp));
  }

  function isHighConfusion() {
    const total = state.counts.gotIt + state.counts.unsure + state.counts.confused || 1;
    const confusionPercent = Math.round((state.counts.confused / total) * 100);
    return confusionPercent >= state.threshold;
  }

  function getConfusionPercent() {
    const total = state.counts.gotIt + state.counts.unsure + state.counts.confused || 1;
    return Math.round((state.counts.confused / total) * 100);
  }

  function recordFeedback(type, origin = 'web') {
    // type: 'green' | 'yellow' | 'red'
    const prevCounts = { ...state.counts };

    // If user previously selected another option, decrement old option
    if (origin === 'web' && state.studentFeedback) {
      if (state.studentFeedback === 'green') state.counts.gotIt = Math.max(0, state.counts.gotIt - 1);
      if (state.studentFeedback === 'yellow') state.counts.unsure = Math.max(0, state.counts.unsure - 1);
      if (state.studentFeedback === 'red') state.counts.confused = Math.max(0, state.counts.confused - 1);
    }

    if (type === 'green') {
      state.counts.gotIt++;
      SoundEngine.clickGreen();
    } else if (type === 'yellow') {
      state.counts.unsure++;
      SoundEngine.clickYellow();
    } else if (type === 'red') {
      state.counts.confused++;
      SoundEngine.clickRed();
    }

    state.totalClicksSession++;

    if (origin === 'web') {
      state.studentFeedback = type;
      state.feedbackCooldown = true;
      setTimeout(() => {
        state.feedbackCooldown = false;
        notify('cooldown');
      }, 1800);
    }

    // Flash hardware LED simulation if originated from ESP32
    if (origin === 'esp32') {
      state.hardwareESP32State.greenLed = type === 'green';
      state.hardwareESP32State.yellowLed = type === 'yellow';
      state.hardwareESP32State.redLed = type === 'red';
      setTimeout(() => {
        state.hardwareESP32State.greenLed = false;
        state.hardwareESP32State.yellowLed = false;
        state.hardwareESP32State.redLed = false;
        notify('hardware');
      }, 900);
    }

    // Check if high confusion threshold crossed
    const wasHigh = (Math.round((prevCounts.confused / (prevCounts.gotIt + prevCounts.unsure + prevCounts.confused || 1)) * 100)) >= state.threshold;
    const isNowHigh = isHighConfusion();

    if (isNowHigh && !wasHigh) {
      state.alertDismissed = false; // re-arm alert
      SoundEngine.alertWarning();
    }

    // Log to timeline dynamically
    syncTimelineStream();

    notify('feedback');
  }

  function syncTimelineStream() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const total = state.counts.gotIt + state.counts.unsure + state.counts.confused || 1;
    const confusionPct = Math.round((state.counts.confused / total) * 100);

    const latestPoint = state.timeline[state.timeline.length - 1];
    
    // If last point was within 10 seconds, update it; otherwise add new stream node
    const isSpike = isHighConfusion();
    
    const newPoint = {
      time: timeStr,
      minutes: state.timeline.length * 5,
      topic: state.activeTopic,
      gotIt: state.counts.gotIt,
      unsure: state.counts.unsure,
      confused: state.counts.confused,
      confusionPercent: confusionPct,
      isSpike: isSpike,
      spikeLabel: isSpike ? `⚠️ High Confusion (${confusionPct}%)` : null,
      note: isSpike ? `High confusion spike on "${state.activeTopic}"` : `Comprehension steady`
    };

    // Update last point or push if distinct
    if (latestPoint && latestPoint.time === timeStr) {
      state.timeline[state.timeline.length - 1] = newPoint;
    } else {
      state.timeline.push(newPoint);
      if (state.timeline.length > 15) {
        state.timeline.shift();
      }
    }

    TimelineChart.updateData(state.timeline, state.threshold);
  }

  function setTopic(topicName) {
    state.activeTopic = topicName;
    state.alertDismissed = false;
    notify('topic');
  }

  function setThreshold(val) {
    state.threshold = Number(val);
    TimelineChart.updateData(state.timeline, state.threshold);
    notify('threshold');
  }

  function dismissAlert() {
    state.alertDismissed = true;
    state.alertDismissedTopic = state.activeTopic;
    notify('alert');
  }

  function resetSession() {
    state.counts = { ...INITIAL_LECTURE_DATA.initialFeedback };
    state.studentFeedback = null;
    state.alertDismissed = false;
    state.timeline = [...INITIAL_LECTURE_DATA.timelineHistory];
    TimelineChart.updateData(state.timeline, state.threshold);
    notify('reset');
  }

  function triggerSuddenConfusionSpike() {
    // Demo tool for instructors / evaluators
    state.counts.gotIt = 8;
    state.counts.unsure = 9;
    state.counts.confused = 18; // 18 / 35 = 51.4%
    state.alertDismissed = false;
    SoundEngine.alertWarning();
    syncTimelineStream();
    notify('feedback');
  }

  function toggleSimulation() {
    state.simulationActive = !state.simulationActive;
    if (state.simulationActive) {
      state.simulationTimer = setInterval(() => {
        // Randomly simulate students changing state
        const choices = ['green', 'green', 'green', 'yellow', 'red'];
        const randomChoice = choices[Math.floor(Math.random() * choices.length)];
        
        // Random slight adjustment
        if (randomChoice === 'green' && state.counts.gotIt < 30) {
          state.counts.gotIt++;
          if (state.counts.confused > 2) state.counts.confused--;
        } else if (randomChoice === 'yellow' && state.counts.unsure < 15) {
          state.counts.unsure++;
          if (state.counts.gotIt > 10) state.counts.gotIt--;
        } else if (randomChoice === 'red' && state.counts.confused < 20) {
          state.counts.confused++;
          if (state.counts.gotIt > 12) state.counts.gotIt--;
        }
        syncTimelineStream();
        notify('feedback');
      }, 4000);
    } else {
      if (state.simulationTimer) clearInterval(state.simulationTimer);
      state.simulationTimer = null;
    }
    notify('simulation');
  }

  function setView(view) {
    state.currentView = view;
    notify('view');
  }

  function switchPresetCourse(courseCode) {
    if (typeof PRESET_SUBJECTS !== 'undefined') {
      const found = PRESET_SUBJECTS.find(c => c.courseCode === courseCode);
      if (found) {
        setCourse(found);
      }
    }
  }

  function setCourse(newCourse) {
    state.lecture = {
      ...state.lecture,
      ...newCourse
    };
    if (newCourse.currentTopic) {
      state.activeTopic = newCourse.currentTopic;
    } else if (newCourse.topicList && newCourse.topicList.length > 0) {
      state.activeTopic = newCourse.topicList[0].name;
    }
    state.alertDismissed = false;

    // Reset student feedback and initialize realistic live baseline for this class
    state.studentFeedback = null;
    state.counts = { gotIt: 20, unsure: 6, confused: 3 };

    try {
      localStorage.setItem('confusion_button_active_course', JSON.stringify(state.lecture));
    } catch (e) {}

    // Add a marker in timeline for subject switch
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.timeline.push({
      time: timeStr,
      minutes: state.timeline.length * 5,
      topic: state.activeTopic,
      gotIt: state.counts.gotIt,
      unsure: state.counts.unsure,
      confused: state.counts.confused,
      confusionPercent: 10,
      isSpike: false,
      note: `Class switched to ${state.lecture.courseCode}: ${state.lecture.courseName}`
    });
    if (state.timeline.length > 15) state.timeline.shift();
    if (typeof TimelineChart !== 'undefined') {
      TimelineChart.updateData(state.timeline, state.threshold);
    }

    notify('course');
  }

  function resetCourseToDefault() {
    try {
      localStorage.removeItem('confusion_button_active_course');
    } catch (e) {}
    setCourse(INITIAL_LECTURE_DATA);
  }

  return {
    state,
    subscribe,
    isHighConfusion,
    getConfusionPercent,
    recordFeedback,
    setTopic,
    setCourse,
    switchPresetCourse,
    resetCourseToDefault,
    setThreshold,
    dismissAlert,
    resetSession,
    triggerSuddenConfusionSpike,
    toggleSimulation,
    setView
  };
})();
