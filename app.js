/**
 * The Confusion Button - Main Application Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize state subscriptions
  AppState.subscribe(handleStateChange);

  // Setup navigation tabs
  setupNavigation();

  // Setup keyboard shortcuts
  setupKeyboardShortcuts();

  // Initial renders
  renderAll();

  // Initialize Timeline Chart
  setTimeout(() => {
    TimelineChart.init(AppState.state.timeline, AppState.state.threshold);
  }, 100);
});

function handleStateChange(state, changedProp) {
  renderStudentView();
  renderTeacherDashboard();
  renderPortfolioView();
  updateViewVisibility();
}

function setupNavigation() {
  const tabs = document.querySelectorAll('[data-view-target]');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = tab.getAttribute('data-view-target');
      AppState.setView(targetView);
    });
  });

  // Sound mute button
  const soundToggle = document.getElementById('sound-toggle-btn');
  if (soundToggle) {
    soundToggle.addEventListener('click', () => {
      const muted = SoundEngine.toggleMute();
      soundToggle.innerHTML = muted 
        ? `<svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" stroke="currentColor"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg><span class="hidden md:inline text-xs font-medium text-slate-400">Audio Muted</span>`
        : `<svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg><span class="hidden md:inline text-xs font-medium text-slate-600">Audio On</span>`;
    });
  }
}

function updateViewVisibility() {
  const currentView = AppState.state.currentView;

  // Update navbar active tab styling
  document.querySelectorAll('[data-view-target]').forEach(tab => {
    const isTarget = tab.getAttribute('data-view-target') === currentView;
    if (isTarget) {
      tab.classList.remove('text-slate-600', 'hover:text-slate-900', 'bg-transparent');
      tab.classList.add('text-indigo-600', 'bg-indigo-50/90', 'font-semibold', 'border-indigo-600');
    } else {
      tab.classList.remove('text-indigo-600', 'bg-indigo-50/90', 'font-semibold', 'border-indigo-600');
      tab.classList.add('text-slate-600', 'hover:text-slate-900', 'bg-transparent');
    }
  });

  const studentSection = document.getElementById('view-student-standalone');
  const teacherSection = document.getElementById('view-teacher-standalone');
  const portfolioSection = document.getElementById('view-portfolio');
  const splitSection = document.getElementById('view-split-demo');

  if (studentSection) studentSection.classList.add('hidden');
  if (teacherSection) teacherSection.classList.add('hidden');
  if (portfolioSection) portfolioSection.classList.add('hidden');
  if (splitSection) splitSection.classList.add('hidden');

  if (currentView === 'student') {
    if (studentSection) studentSection.classList.remove('hidden');
  } else if (currentView === 'teacher') {
    if (teacherSection) teacherSection.classList.remove('hidden');
    setTimeout(() => TimelineChart.render(), 60);
  } else if (currentView === 'portfolio') {
    if (portfolioSection) portfolioSection.classList.remove('hidden');
  } else if (currentView === 'split') {
    if (splitSection) splitSection.classList.remove('hidden');
    setTimeout(() => TimelineChart.render(), 60);
  }
}

function renderAll() {
  renderStudentView();
  renderTeacherDashboard();
  renderPortfolioView();
  updateViewVisibility();
}

/**
 * 1. STUDENT INTERFACE VIEW RENDERING
 */
function renderStudentView() {
  const s = AppState.state;
  const lecture = s.lecture;

  const containers = [
    document.getElementById('student-interface-content'),
    document.getElementById('split-student-interface-content')
  ];

  containers.forEach(container => {
    if (!container) return;

    const activeChoice = s.studentFeedback;
    const cooldown = s.feedbackCooldown;

    container.innerHTML = `
      <div class="flex flex-col h-full justify-between">
        <!-- Top Header: Active Lecture Info -->
        <header class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-slate-800">
          <div class="flex items-center justify-between gap-3 mb-2">
            <div class="inline-flex items-center gap-2 px-2.5 py-0.8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-400 live-beacon"></span>
              LIVE LECTURE IN PROGRESS
            </div>
            <div class="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              <span>100% Anonymous</span>
            </div>
          </div>

          <h1 class="text-xl font-bold tracking-tight text-white mb-1">
            ${lecture.courseCode} – ${lecture.courseName}
          </h1>

          <div class="space-y-1 text-xs text-slate-300">
            <div class="flex items-center gap-1.5">
              <span class="text-slate-400 font-medium">Topic:</span>
              <span class="text-indigo-200 font-semibold bg-indigo-950/70 px-2 py-0.5 rounded border border-indigo-800/60">${s.activeTopic}</span>
            </div>
            <div class="flex items-center justify-between text-slate-400 pt-1 text-[11px]">
              <span>Instructor: <strong class="text-slate-200">${lecture.instructor}</strong></span>
              <span>Room: <strong class="text-slate-200">${lecture.room}</strong></span>
            </div>
          </div>
        </header>

        <!-- Anonymous Privacy Reassurance Pill -->
        <div class="my-3 py-2 px-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center">
          <p class="text-xs text-indigo-950 flex items-center justify-center gap-1.5">
            <svg class="w-4 h-4 text-indigo-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span>No login required. Your feedback is aggregated anonymously in real time.</span>
          </p>
        </div>

        <!-- Success Toast State (Subtle visual feedback when student clicks) -->
        <div id="student-feedback-toast" class="transition-all duration-300 ${cooldown ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2 pointer-events-none'}">
          <div class="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-md">
            <svg class="w-4 h-4 text-emerald-200 shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            <span>Feedback recorded anonymously! Teacher dashboard updated.</span>
          </div>
        </div>

        <!-- Core Feature: 3 Prominent Feedback Buttons -->
        <div class="space-y-4 my-auto py-2">
          <!-- Button 1: Got It (Green) -->
          <button type="button"
                  onclick="AppState.recordFeedback('green', 'web')"
                  class="w-full relative group p-5 rounded-2xl text-left border-2 transition-all duration-200 transform active:scale-[0.98] ripple flex items-center justify-between ${activeChoice === 'green' ? 'bg-emerald-600 border-emerald-700 text-white shadow-lg ring-4 ring-emerald-200/60' : 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-300 text-emerald-950 shadow-sm'}">
            <div class="flex items-center gap-4">
              <div class="w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${activeChoice === 'green' ? 'bg-white text-emerald-700 shadow-inner' : 'bg-emerald-600 text-white shadow-md'}">
                🟢
              </div>
              <div>
                <div class="text-lg font-bold flex items-center gap-2">
                  <span>Got it</span>
                  <span class="text-xs px-2 py-0.5 rounded-full ${activeChoice === 'green' ? 'bg-emerald-500 text-white' : 'bg-emerald-200 text-emerald-800'} font-semibold">Pacing good</span>
                </div>
                <p class="text-xs ${activeChoice === 'green' ? 'text-emerald-100' : 'text-emerald-700'}">I understand this concept completely. Ready to proceed.</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <span class="text-xs font-mono px-2 py-1 rounded bg-black/10 font-bold">Key [1]</span>
            </div>
          </button>

          <!-- Button 2: A Little Confused (Yellow) -->
          <button type="button"
                  onclick="AppState.recordFeedback('yellow', 'web')"
                  class="w-full relative group p-5 rounded-2xl text-left border-2 transition-all duration-200 transform active:scale-[0.98] ripple flex items-center justify-between ${activeChoice === 'yellow' ? 'bg-amber-500 border-amber-600 text-white shadow-lg ring-4 ring-amber-200/60' : 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-300 text-amber-950 shadow-sm'}">
            <div class="flex items-center gap-4">
              <div class="w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${activeChoice === 'yellow' ? 'bg-white text-amber-600 shadow-inner' : 'bg-amber-500 text-white shadow-md'}">
                🟡
              </div>
              <div>
                <div class="text-lg font-bold flex items-center gap-2">
                  <span>A little confused</span>
                  <span class="text-xs px-2 py-0.5 rounded-full ${activeChoice === 'yellow' ? 'bg-amber-400 text-white' : 'bg-amber-200 text-amber-900'} font-semibold">Unsure</span>
                </div>
                <p class="text-xs ${activeChoice === 'yellow' ? 'text-amber-100' : 'text-amber-800'}">Following along, but could use a brief example or clarification.</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <span class="text-xs font-mono px-2 py-1 rounded bg-black/10 font-bold">Key [2]</span>
            </div>
          </button>

          <!-- Button 3: Completely Confused (Red) -->
          <button type="button"
                  onclick="AppState.recordFeedback('red', 'web')"
                  class="w-full relative group p-5 rounded-2xl text-left border-2 transition-all duration-200 transform active:scale-[0.98] ripple flex items-center justify-between ${activeChoice === 'red' ? 'bg-rose-600 border-rose-700 text-white shadow-lg ring-4 ring-rose-200/60' : 'bg-rose-50/80 hover:bg-rose-100/80 border-rose-300 text-rose-950 shadow-sm'}">
            <div class="flex items-center gap-4">
              <div class="w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0 ${activeChoice === 'red' ? 'bg-white text-rose-700 shadow-inner' : 'bg-rose-600 text-white shadow-md'}">
                🔴
              </div>
              <div>
                <div class="text-lg font-bold flex items-center gap-2">
                  <span>Completely confused</span>
                  <span class="text-xs px-2 py-0.5 rounded-full ${activeChoice === 'red' ? 'bg-rose-500 text-white' : 'bg-rose-200 text-rose-900'} font-semibold">Stuck</span>
                </div>
                <p class="text-xs ${activeChoice === 'red' ? 'text-rose-100' : 'text-rose-800'}">Lost on the logic. Please slow down and re-explain.</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <span class="text-xs font-mono px-2 py-1 rounded bg-black/10 font-bold">Key [3]</span>
            </div>
          </button>
        </div>

        <!-- Optional 1-Click Friction Tags -->
        <div class="mt-4 pt-3 border-t border-slate-200">
          <div class="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider flex items-center justify-between">
            <span>Quick Friction Tags (Optional):</span>
            <span class="text-slate-400 font-normal">Tap to signal reason</span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button onclick="recordFrictionTag(this, 'Pacing too fast')" class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 border border-slate-200 transition-colors">⚡ Pacing too fast</button>
            <button onclick="recordFrictionTag(this, 'Need code example')" class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 border border-slate-200 transition-colors">💻 Need code example</button>
            <button onclick="recordFrictionTag(this, 'Math step unclear')" class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 border border-slate-200 transition-colors">🔢 Math step unclear</button>
            <button onclick="recordFrictionTag(this, 'Slide changed too fast')" class="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 border border-slate-200 transition-colors">⏱️ Slide changed too fast</button>
          </div>
        </div>

        <!-- Bottom Session Meta -->
        <footer class="mt-4 text-center text-slate-400 text-[11px]">
          Session Token: <code class="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">anon-${Math.abs(lecture.courseCode.length * 37 + 109)}</code> · Clicks can be changed anytime
        </footer>
      </div>
    `;
  });
}

function recordFrictionTag(btn, tag) {
  btn.classList.add('bg-indigo-600', 'text-white', 'border-indigo-700');
  setTimeout(() => {
    btn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-700');
  }, 1200);
  SoundEngine.clickYellow();
}

/**
 * 2. TEACHER DASHBOARD VIEW RENDERING
 */
function renderTeacherDashboard() {
  const s = AppState.state;
  const counts = s.counts;
  const total = counts.gotIt + counts.unsure + counts.confused || 1;
  const gotItPct = Math.round((counts.gotIt / total) * 100);
  const unsurePct = Math.round((counts.unsure / total) * 100);
  const confusedPct = Math.round((counts.confused / total) * 100);

  const isHigh = AppState.isHighConfusion();
  const alertDismissed = s.alertDismissed && s.alertDismissedTopic === s.activeTopic;

  const dashboardContainers = [
    document.getElementById('teacher-dashboard-content'),
    document.getElementById('split-teacher-dashboard-content')
  ];

  dashboardContainers.forEach(container => {
    if (!container) return;

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Live Teacher Dashboard Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                <span class="w-2 h-2 rounded-full bg-emerald-600 live-beacon"></span>
                ACTIVE CLASSROOM STREAM
              </span>
              <span class="text-xs text-slate-500 font-medium">Session ID: #${s.lecture?.courseCode || 'CS101'}-L08</span>
            </div>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight mt-1">Live Classroom Comprehension Dashboard</h2>
            <p class="text-xs text-slate-500">Real-time aggregate telemetry from student mobile apps & ESP32 desk hardware buttons.</p>
          </div>

          <!-- Quick Controls for Teacher -->
          <div class="flex flex-wrap items-center gap-2">
            <!-- Subject Switcher Dropdown -->
            <div class="relative inline-block">
              <select onchange="if(this.value==='CUSTOM_EDIT'){openEditClassModal(); this.value='';} else if(this.value){AppState.switchPresetCourse(this.value);}" 
                      class="text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-900 py-2 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm cursor-pointer hover:bg-indigo-100/80 transition"
                      title="Switch subject / class">
                <option value="" disabled>📚 Class: ${s.lecture?.courseCode || 'CS101'}</option>
                ${(typeof PRESET_SUBJECTS !== 'undefined' ? PRESET_SUBJECTS : []).map(c => `
                  <option value="${c.courseCode}" ${c.courseCode === s.lecture?.courseCode ? 'selected' : ''}>
                    ${c.courseCode}: ${c.courseName.length > 22 ? c.courseName.slice(0, 22) + '...' : c.courseName}
                  </option>
                `).join('')}
                <option value="CUSTOM_EDIT">✏️ Edit / Custom Subject...</option>
              </select>
            </div>

            <!-- Topic Switcher Dropdown -->
            <div class="relative inline-block">
              <select onchange="AppState.setTopic(this.value)" 
                      class="text-xs font-semibold bg-white border border-slate-300 text-slate-700 py-2 px-3 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none shadow-sm">
                ${(s.lecture?.topicList || []).map(t => `
                  <option value="${t.name}" ${t.name === s.activeTopic ? 'selected' : ''}>
                    ${t.startTime || ''} - ${t.name}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Edit Class Button -->
            <button onclick="openEditClassModal()" 
                    title="Customize class code, subject name, instructor and topics"
                    class="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              <span>Edit Class</span>
            </button>

            <!-- Sudden Spike Demo trigger -->
            <button onclick="AppState.triggerSuddenConfusionSpike()" 
                    title="Simulate sudden confusion spike to test alert banner"
                    class="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5">
              <span>⚡ Trigger Confusion Wave</span>
            </button>

            <!-- Reset -->
            <button onclick="AppState.resetSession()" 
                    title="Reset counters"
                    class="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl border border-slate-200 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </button>
          </div>
        </div>

        <!-- HIGH CONFUSION ALERT BANNER (Prominent warning indicator) -->
        ${isHigh && !alertDismissed ? `
          <div class="p-4 rounded-2xl bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 text-white shadow-xl border-2 border-rose-400 shake-warning">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 text-xl font-bold">
                  ⚠️
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded-full bg-white text-rose-700 font-extrabold text-[11px] uppercase tracking-wider">
                      Critical Threshold Exceeded
                    </span>
                    <span class="text-xs font-medium text-rose-100">${confusedPct}% of class signaled confusion</span>
                  </div>
                  <h3 class="text-lg font-black tracking-tight mt-0.5">
                    HIGH CONFUSION: Topic: ${s.activeTopic}
                  </h3>
                  <p class="text-xs text-rose-100 mt-0.5">
                    Multiple students registered severe comprehension struggle in the last 60 seconds. A pedagogical pivot is advised.
                  </p>
                </div>
              </div>

              <!-- Actionable buttons for the teacher -->
              <div class="flex items-center gap-2 shrink-0">
                <button onclick="alert('⏸️ Lecture Pause Logged: Suggesting a 2-minute whiteboard recap or question gathering.');"
                        class="px-3 py-2 rounded-xl bg-white text-rose-700 font-bold text-xs hover:bg-rose-50 shadow transition">
                  ⏸️ 2-Min Review Pause
                </button>
                <button onclick="AppState.dismissAlert()" 
                        class="px-3 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-semibold transition">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- REAL-TIME COUNTERS (Visual cards showing current student status) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Got It -->
          <div class="p-5 rounded-2xl bg-white border border-emerald-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div class="absolute -right-2 -bottom-2 text-6xl opacity-10 select-none">🟢</div>
            <div class="flex items-center justify-between text-xs font-semibold text-emerald-700 mb-1">
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Got It (Clear)
              </span>
              <span class="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-mono">${gotItPct}%</span>
            </div>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-4xl font-black text-slate-900 tracking-tight">${counts.gotIt}</span>
              <span class="text-xs text-slate-500">/ ${total} active</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: ${gotItPct}%"></div>
            </div>
          </div>

          <!-- Card 2: A Little Confused -->
          <div class="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div class="absolute -right-2 -bottom-2 text-6xl opacity-10 select-none">🟡</div>
            <div class="flex items-center justify-between text-xs font-semibold text-amber-700 mb-1">
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Unsure (A Little)
              </span>
              <span class="text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-mono">${unsurePct}%</span>
            </div>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-4xl font-black text-slate-900 tracking-tight">${counts.unsure}</span>
              <span class="text-xs text-slate-500">/ ${total} active</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div class="bg-amber-500 h-2 rounded-full transition-all duration-500" style="width: ${unsurePct}%"></div>
            </div>
          </div>

          <!-- Card 3: Completely Confused -->
          <div class="p-5 rounded-2xl bg-white border ${isHigh ? 'border-rose-400 ring-2 ring-rose-200' : 'border-rose-200/80'} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div class="absolute -right-2 -bottom-2 text-6xl opacity-10 select-none">🔴</div>
            <div class="flex items-center justify-between text-xs font-semibold text-rose-700 mb-1">
              <span class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Confused (Stuck)
              </span>
              <span class="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-mono font-bold">${confusedPct}%</span>
            </div>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-4xl font-black ${isHigh ? 'text-rose-600' : 'text-slate-900'} tracking-tight">${counts.confused}</span>
              <span class="text-xs text-slate-500">/ ${total} active</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
              <div class="bg-rose-500 h-2 rounded-full transition-all duration-500" style="width: ${confusedPct}%"></div>
            </div>
          </div>

          <!-- Card 4: Comprehension Health Index -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-sm relative overflow-hidden">
            <div class="flex items-center justify-between text-xs font-semibold text-indigo-200 mb-1">
              <span>Comprehension Index</span>
              <span class="px-2 py-0.5 rounded bg-indigo-800 text-indigo-200 font-mono text-[10px]">Real-Time</span>
            </div>
            <div class="flex items-baseline gap-2 mt-2">
              <span class="text-4xl font-black text-white tracking-tight">${Math.max(0, 100 - confusedPct - Math.round(unsurePct / 2))}%</span>
              <span class="text-xs text-indigo-300">Class Health</span>
            </div>
            <div class="text-[11px] text-indigo-200 mt-3 flex items-center justify-between">
              <span>Alert Threshold: <strong>${s.threshold}%</strong></span>
              <span class="text-indigo-300">ESP32: <strong class="text-emerald-400">Online</strong></span>
            </div>
          </div>
        </div>

        <!-- CONFUSION TIMELINE (Core Analytics Feature) -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-bold text-slate-900">Confusion Timeline (Core Analytics)</h3>
                <span class="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">Continuous Stream</span>
              </div>
              <p class="text-xs text-slate-500">Mapping student feedback fluctuations against lecture timestamps with marked struggle spikes.</p>
            </div>

            <!-- Legend & Threshold adjuster -->
            <div class="flex flex-wrap items-center gap-4 text-xs">
              <div class="flex items-center gap-3">
                <span class="flex items-center gap-1.5 font-medium text-emerald-700"><span class="w-3 h-1 bg-emerald-500 rounded"></span> Got It</span>
                <span class="flex items-center gap-1.5 font-medium text-amber-700"><span class="w-3 h-1 bg-amber-500 rounded"></span> A Little Confused</span>
                <span class="flex items-center gap-1.5 font-medium text-rose-700"><span class="w-3 h-1.5 bg-rose-500 rounded"></span> Completely Confused</span>
              </div>
              
              <div class="flex items-center gap-2 pl-3 border-l border-slate-200">
                <label class="text-slate-600 font-medium text-[11px]">Alert Threshold:</label>
                <input type="range" min="15" max="50" value="${s.threshold}" 
                       oninput="AppState.setThreshold(this.value)"
                       class="w-20 accent-indigo-600 h-1.5 cursor-pointer" />
                <span class="font-mono font-bold text-slate-800 text-[11px]">${s.threshold}%</span>
              </div>
            </div>
          </div>

          <!-- SVG Chart Target Area (class timeline-chart-target) -->
          <div class="timeline-chart-target w-full h-80 relative bg-slate-50/50 rounded-xl border border-slate-100 overflow-hidden">
            <!-- Rendered by js/chart.js -->
          </div>

          <div class="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Spike pins indicate points where confusion exceeded classroom threshold. Click on pins for deep-dive.</span>
            </div>
            <span class="font-mono text-[11px]">Hover over graph points for exact timestamp breakdown</span>
          </div>
        </div>

        <!-- POST-CLASS ANALYTICS CARD & RECAP -->
        <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 rounded-2xl shadow-lg border border-slate-700">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-700/80 mb-5">
            <div>
              <div class="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">
                <span>📋 Executive Session Recap</span>
              </div>
              <h3 class="text-xl font-black tracking-tight text-white">Post-Class Understanding Analytics</h3>
            </div>
            <button onclick="exportSessionReport()" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              <span>Export Session Report</span>
            </button>
          </div>

          <!-- Specified Metrics Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <!-- Metric 1: Most Confusing Section -->
            <div class="bg-slate-800/80 border border-slate-700 p-4 rounded-xl backdrop-blur-sm">
              <div class="text-xs text-slate-400 font-medium mb-1">Most Confusing Section</div>
              <div class="text-2xl font-black text-rose-400 flex items-center gap-2">
                <span>Type Casting</span>
              </div>
              <p class="text-xs text-slate-300 mt-2">Sign extension and byte-to-integer conversion generated highest hesitation volume.</p>
            </div>

            <!-- Metric 2: Peak Confusion Time -->
            <div class="bg-slate-800/80 border border-slate-700 p-4 rounded-xl backdrop-blur-sm">
              <div class="text-xs text-slate-400 font-medium mb-1">Peak Confusion Time</div>
              <div class="text-2xl font-black text-amber-400 flex items-center gap-2">
                <span>10:21 AM</span>
              </div>
              <p class="text-xs text-slate-300 mt-2">Occurred 21 minutes into lecture during memory sign-bit explanation.</p>
            </div>

            <!-- Metric 3: Students Affected -->
            <div class="bg-slate-800/80 border border-slate-700 p-4 rounded-xl backdrop-blur-sm">
              <div class="text-xs text-slate-400 font-medium mb-1">Students Affected</div>
              <div class="text-2xl font-black text-indigo-300 flex items-center gap-2">
                <span>63%</span>
              </div>
              <p class="text-xs text-slate-300 mt-2">22 out of 35 active students simultaneously triggered the confusion signal.</p>
            </div>
          </div>

          <!-- Pedagogical Action Plan Suggestion -->
          <div class="mt-5 p-4 rounded-xl bg-indigo-950/60 border border-indigo-800/60 flex items-start gap-3 text-xs">
            <span class="text-lg">💡</span>
            <div>
              <strong class="text-indigo-200">Recommended Action Plan for Next Lecture:</strong>
              <p class="text-slate-300 mt-0.5">${INITIAL_LECTURE_DATA.postClassSummary.suggestedPedagogy}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * 3. PROJECT DOCUMENTATION & PORTFOLIO VIEW RENDERING
 */
function renderPortfolioView() {
  const container = document.getElementById('portfolio-content');
  if (!container) return;

  const roles = INITIAL_LECTURE_DATA.teamRoles;
  const priorArt = INITIAL_LECTURE_DATA.priorArt;
  const tech = INITIAL_LECTURE_DATA.techStack;

  container.innerHTML = `
    <div class="space-y-12 max-w-5xl mx-auto py-4">
      <!-- Section 1: Header & Abstract -->
      <section class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div class="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2">
          <span>Design Thinking Capstone</span>
          <span>•</span>
          <span>HCI & IoT Engineering</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
          Project Portfolio: The Confusion Button
        </h1>
        <p class="text-base text-slate-600 mb-6 font-medium leading-relaxed">
          A continuous, friction-free passive classroom feedback ecosystem bridging physical desk hardware and real-time instructional analytics.
        </p>

        <!-- Abstract Section (~150 words as specified) -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-slate-50 to-indigo-50/50 border-l-4 border-indigo-600 shadow-inner">
          <div class="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span>Executive Abstract</span>
          </div>
          <p class="text-sm md:text-[15px] text-slate-800 leading-relaxed font-serif italic">
            "The 'Confusion Button' is an innovative classroom feedback system designed through a human-centric Design Thinking framework. Traditional lecture formats often suffer from a systemic student pain point: the hesitation to ask questions due to peer embarrassment. This software and hardware solution addresses this barrier by providing students with an entirely anonymous, real-time three-button interface (Got It, Unsure, Confused) to signal comprehension deficits. By continuous logging of responses into a centralized backend database, the system synthesizes data into a live 'Confusion Timeline' dashboard for instructors. This enables educators to dynamically pivot their instructional strategy during peaks of high confusion, reducing misplaced learning outcomes and significantly optimizing engagement without compromising student privacy."
          </p>
        </div>
      </section>

      <!-- Section 2: Introduction & Functionality (The "Why" and "How") -->
      <section class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Introduction & Functionality</h2>
          <p class="text-sm text-slate-600 mt-1">Understanding the systemic pedagogical problem and our human-centric engineering approach.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-5 rounded-2xl bg-rose-50/60 border border-rose-100">
            <div class="text-lg font-bold text-rose-900 mb-2 flex items-center gap-2">
              <span>🛑 The "Why" (The Friction Barrier)</span>
            </div>
            <p class="text-xs text-rose-950 leading-relaxed">
              In higher education and secondary STEM classrooms, over <strong>70% of students admit to withholding questions</strong> when confused. The underlying root cause is not lack of curiosity, but <em>fear of negative social evaluation</em> (peer judgment). Traditional lectures continue forward under the false assumption that silence indicates universal comprehension. By the time midterm exams reveal systemic failure, the remediation window has passed.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <div class="text-lg font-bold text-emerald-900 mb-2 flex items-center gap-2">
              <span>🚀 The "How" (Passive Continuous Stream)</span>
            </div>
            <p class="text-xs text-emerald-950 leading-relaxed">
              The Confusion Button provides a zero-friction dual interface: either a <strong>physical 3-button desk module (ESP32)</strong> or a <strong>single-tap anonymous web page</strong>. Students signal their state in micro-seconds without raising a hand or interrupting the spoken lecture. Responses are aggregated in 5-second time windows and plotted into an interactive <em>Confusion Timeline</em>, empowering teachers to pivot their lecture in real-time.
            </p>
          </div>
        </div>

        <!-- 5 Stages of Design Thinking Framework Diagram -->
        <div class="pt-4">
          <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">Human-Centric Design Thinking Framework</h3>
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3">
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div class="text-xl mb-1">❤️</div>
              <div class="text-xs font-bold text-slate-900">1. Empathize</div>
              <div class="text-[10px] text-slate-500 mt-1">Surveyed 120 students on question anxiety & silence.</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div class="text-xl mb-1">🎯</div>
              <div class="text-xs font-bold text-slate-900">2. Define</div>
              <div class="text-[10px] text-slate-500 mt-1">Targeted anonymity & zero interruption as core requirements.</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div class="text-xl mb-1">💡</div>
              <div class="text-xs font-bold text-slate-900">3. Ideate</div>
              <div class="text-[10px] text-slate-500 mt-1">Conceived 3-state continuous timeline rather than quizzes.</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div class="text-xl mb-1">🛠️</div>
              <div class="text-xs font-bold text-slate-900">4. Prototype</div>
              <div class="text-[10px] text-slate-500 mt-1">Wired ESP32 Wi-Fi hardware + Tailwind client dashboard.</div>
            </div>
            <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div class="text-xl mb-1">🧪</div>
              <div class="text-xs font-bold text-slate-900">5. Test</div>
              <div class="text-[10px] text-slate-500 mt-1">Classroom simulation detected Type Casting spike in 12s.</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 3: Prior Art Section (Existing Solutions Analysis) -->
      <section class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Prior Art Analysis: Why Our Solution is Unique</h2>
          <p class="text-sm text-slate-600 mt-1">Structured competitive comparison justifying the technological gap addressed by the Confusion Button.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-slate-900 text-sm">1. Traditional Hand Raising</h3>
              <span class="text-xs px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">Flawed</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">
              <strong>High psychological barrier;</strong> students face peer embarrassment and remain silent. Questions asked reflect extroverts rather than true class median comprehension.
            </p>
            <div class="text-[11px] text-slate-500 border-t border-slate-200 pt-2 font-mono">
              Continuity: None | Friction: Severe
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-slate-900 text-sm">2. Clickers & Quizzes</h3>
              <span class="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">Discrete</span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed mb-3">
              Tools like <em>iClickers, Kahoot, and Mentimeter</em> are <strong>discrete, episodic evaluation tools</strong>. They force the lecture to halt for a quiz rather than tracking the continuous, natural flow of comprehension.
            </p>
            <div class="text-[11px] text-slate-500 border-t border-slate-200 pt-2 font-mono">
              Continuity: Fragmented | Friction: Moderate
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-indigo-50/80 border-2 border-indigo-500/80">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-bold text-indigo-950 text-sm">3. Our Innovation</h3>
              <span class="text-xs px-2 py-0.5 rounded bg-indigo-600 text-white font-bold">Breakthrough</span>
            </div>
            <p class="text-xs text-indigo-900 leading-relaxed mb-3">
              Unlike prior art, our solution <strong>combines real-time physical and digital inputs with a continuous Confusion Timeline</strong>. It acts as a passive, aggregate, and completely friction-free passive stream, mapping exact friction points directly to specific minutes of the lecture.
            </p>
            <div class="text-[11px] text-indigo-700 border-t border-indigo-200 pt-2 font-mono font-bold">
              Continuity: Continuous | Friction: Zero
            </div>
          </div>
        </div>

        <!-- Prior Art Matrix Table -->
        <div class="overflow-x-auto rounded-xl border border-slate-200">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th class="p-3">Methodology</th>
                <th class="p-3">Student Anonymity</th>
                <th class="p-3">Lecture Interruption</th>
                <th class="p-3">Timeline Correlation</th>
                <th class="p-3">Physical Desk Input</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-semibold text-slate-900">Traditional Hand Raising</td>
                <td class="p-3 text-rose-600 font-bold">❌ 0% (Public & Judged)</td>
                <td class="p-3 text-rose-600">High (Halts spoken stream)</td>
                <td class="p-3 text-slate-500">❌ None</td>
                <td class="p-3 text-slate-500">❌ None</td>
              </tr>
              <tr class="hover:bg-slate-50">
                <td class="p-3 font-semibold text-slate-900">Kahoot / iClickers</td>
                <td class="p-3 text-amber-600 font-semibold">⚠️ Semi-anonymous (Scoreboards)</td>
                <td class="p-3 text-amber-600">High (Lecture must freeze)</td>
                <td class="p-3 text-slate-500">❌ Discrete snapshots only</td>
                <td class="p-3 text-slate-500">Proprietary bulky remote</td>
              </tr>
              <tr class="bg-indigo-50/60 font-medium">
                <td class="p-3 font-bold text-indigo-900 flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-indigo-600"></span> The Confusion Button
                </td>
                <td class="p-3 text-emerald-600 font-bold">✅ 100% Cryptographic Anonymity</td>
                <td class="p-3 text-emerald-600 font-bold">✅ Zero (Completely Passive)</td>
                <td class="p-3 text-emerald-600 font-bold">✅ Continuous Timeline Stream</td>
                <td class="p-3 text-emerald-600 font-bold">✅ Tactile ESP32 Push Button</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Section 4: System Architecture & Diagrams (Flow & Hardware) -->
      <section class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">System Architecture & Technical Diagrams</h2>
          <p class="text-sm text-slate-600 mt-1">End-to-end data pipeline from physical/digital student input to real-time teacher analytics.</p>
        </div>

        <!-- Architecture Flow Diagram Block -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span>🔄 System Flow Diagram (Student Click → Database Log → Dashboard Render)</span>
            </h3>
            <span class="text-xs text-indigo-600 font-semibold">Sub-100ms Latency Pipeline</span>
          </div>

          <div class="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-inner">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
              <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-center diagram-node">
                <div class="w-10 h-10 mx-auto rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mb-2">1</div>
                <div class="text-xs font-bold text-white">Student Input</div>
                <div class="text-[11px] text-slate-400 mt-1">ESP32 Desk Button or Responsive Web Client</div>
                <div class="mt-2 text-[9px] px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-mono">Payload: {state: 'red'}</div>
              </div>

              <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-center diagram-node">
                <div class="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-2">2</div>
                <div class="text-xs font-bold text-white">Ingestion Gateway</div>
                <div class="text-[11px] text-slate-400 mt-1">REST API / WebSockets (HTTPS & WSS)</div>
                <div class="mt-2 text-[9px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono">Anon Hash & Debounce</div>
              </div>

              <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-center diagram-node">
                <div class="w-10 h-10 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-2">3</div>
                <div class="text-xs font-bold text-white">Time-Series Aggregator</div>
                <div class="text-[11px] text-slate-400 mt-1">SQLite / Firebase Real-Time DB Engine</div>
                <div class="mt-2 text-[9px] px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-mono">5-Sec Rolling Buckets</div>
              </div>

              <div class="p-4 rounded-xl bg-slate-800/90 border border-slate-700 text-center diagram-node">
                <div class="w-10 h-10 mx-auto rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold mb-2">4</div>
                <div class="text-xs font-bold text-white">Dashboard Render</div>
                <div class="text-[11px] text-slate-400 mt-1">Live Confusion Timeline & Alert Dispatcher</div>
                <div class="mt-2 text-[9px] px-2 py-0.5 rounded bg-rose-900/60 text-rose-300 font-mono">SVG Chart & Audio Beep</div>
              </div>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Student anonymity preserved by omitting device MAC/IP from log schema.</span>
              <span class="font-mono text-emerald-400">WebSocket Ping: 18ms</span>
            </div>
          </div>
        </div>

        <!-- Hardware & Block Diagram with INTERACTIVE ESP32 SIMULATOR -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span>⚡ Interactive ESP32 Hardware Circuit Simulator</span>
            </h3>
            <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Interactive Test Bench
            </span>
          </div>

          <div class="p-6 rounded-3xl bg-slate-100 border border-slate-300 shadow-inner">
            <p class="text-xs text-slate-600 mb-4">
              Click the physical buttons on this virtual breadboard to simulate physical desk hardware pushing signals over Wi-Fi directly to the teacher's dashboard:
            </p>

            <div class="breadboard-grid p-6 rounded-2xl border-2 border-slate-300 shadow-md bg-white max-w-2xl mx-auto">
              <div class="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-8 rounded bg-slate-800 text-white font-mono text-[10px] flex items-center justify-center font-bold shadow">
                    ESP32
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900">ESP32-WROOM-32D Microcontroller</div>
                    <div class="text-[10px] text-slate-500 font-mono">Pinout: GPIO18 (Green), GPIO19 (Yellow), GPIO21 (Red)</div>
                  </div>
                </div>
                <div class="text-right">
                  <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Wi-Fi Connected: -58dBm</span>
                </div>
              </div>

              <!-- 3 Physical Tactile Buttons on Breadboard -->
              <div class="grid grid-cols-3 gap-6 text-center my-4">
                <div class="flex flex-col items-center">
                  <div id="hw-led-green" class="w-4 h-4 rounded-full bg-slate-300 mb-2 border border-slate-400 transition-colors duration-200"></div>
                  <button type="button" 
                          onclick="simulateESP32Press('green')" 
                          class="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-90 border-4 border-emerald-700 shadow-lg text-white font-bold flex items-center justify-center text-xl cursor-pointer transition transform">
                    🟢
                  </button>
                  <span class="text-xs font-bold text-slate-700 mt-2">GPIO 18</span>
                  <span class="text-[10px] text-slate-500">Got It</span>
                </div>

                <div class="flex flex-col items-center">
                  <div id="hw-led-yellow" class="w-4 h-4 rounded-full bg-slate-300 mb-2 border border-slate-400 transition-colors duration-200"></div>
                  <button type="button" 
                          onclick="simulateESP32Press('yellow')" 
                          class="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-500 active:scale-90 border-4 border-amber-600 shadow-lg text-white font-bold flex items-center justify-center text-xl cursor-pointer transition transform">
                    🟡
                  </button>
                  <span class="text-xs font-bold text-slate-700 mt-2">GPIO 19</span>
                  <span class="text-[10px] text-slate-500">Unsure</span>
                </div>

                <div class="flex flex-col items-center">
                  <div id="hw-led-red" class="w-4 h-4 rounded-full bg-slate-300 mb-2 border border-slate-400 transition-colors duration-200"></div>
                  <button type="button" 
                          onclick="simulateESP32Press('red')" 
                          class="w-16 h-16 rounded-full bg-rose-500 hover:bg-rose-600 active:scale-90 border-4 border-rose-700 shadow-lg text-white font-bold flex items-center justify-center text-xl cursor-pointer transition transform">
                    🔴
                  </button>
                  <span class="text-xs font-bold text-slate-700 mt-2">GPIO 21</span>
                  <span class="text-[10px] text-slate-500">Confused</span>
                </div>
              </div>

              <div class="mt-4 pt-3 border-t border-slate-200 text-center text-[11px] text-slate-500 font-mono">
                Hardware Circuit: Internal Pull-Up Resistors Enabled • Hardware Software Debounce: 50ms
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Section 5: Tech Stack & Hardware Specifications -->
      <section class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Tech Stack & Hardware Specifications</h2>
          <p class="text-sm text-slate-600 mt-1">Exhaustive Bill of Materials (BOM) and software framework architecture.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>💻 Software Stack</span>
            </h3>
            <ul class="space-y-3">
              ${tech.software.map(s => `
                <li class="text-xs pb-2 border-b border-slate-200 last:border-0">
                  <div class="font-bold text-slate-800">${s.name}: <span class="text-indigo-600 font-mono font-medium">${s.tech}</span></div>
                  <div class="text-slate-500 text-[11px] mt-0.5">${s.desc}</div>
                </li>
              `).join('')}
            </ul>
          </div>

          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>🔌 Hardware Bill of Materials (BOM)</span>
            </h3>
            <ul class="space-y-3">
              ${tech.hardware.map(h => `
                <li class="text-xs pb-2 border-b border-slate-200 last:border-0">
                  <div class="font-bold text-slate-800">${h.component} <span class="text-slate-500 font-normal font-mono text-[10px]">(${h.spec})</span></div>
                  <div class="text-slate-500 text-[11px] mt-0.5">${h.role}</div>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <div class="rounded-2xl bg-slate-900 text-slate-200 p-5 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
          <div class="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
            <span>firmware/esp32_confusion_button.ino</span>
            <button onclick="navigator.clipboard.writeText(document.getElementById('firmware-code-block').innerText); alert('ESP32 Firmware code copied to clipboard!');" 
                    class="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white font-sans text-[10px]">
              Copy Code
            </button>
          </div>
          <pre id="firmware-code-block" class="text-[11px] leading-relaxed"><code>#include &lt;WiFi.h&gt;
#include &lt;HTTPClient.h&gt;

const char* ssid = "University-IoT-Guest";
const char* password = "ClassroomSecurePass";
const char* serverUrl = "https://api.confusionbutton.edu/api/feedback";

#define PIN_GREEN  18
#define PIN_YELLOW 19
#define PIN_RED    21

void setup() {
  Serial.begin(115200);
  pinMode(PIN_GREEN, INPUT_PULLUP);
  pinMode(PIN_YELLOW, INPUT_PULLUP);
  pinMode(PIN_RED, INPUT_PULLUP);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) { delay(250); Serial.print("."); }
}

void sendFeedback(const char* state) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
    String payload = "{\"state\":\"" + String(state) + "\",\"origin\":\"esp32\"}";
    http.POST(payload);
    http.end();
  }
}

void loop() {
  if (digitalRead(PIN_GREEN) == LOW)  { sendFeedback("green");  delay(300); }
  if (digitalRead(PIN_YELLOW) == LOW) { sendFeedback("yellow"); delay(300); }
  if (digitalRead(PIN_RED) == LOW)    { sendFeedback("red");    delay(300); }
}</code></pre>
        </div>
      </section>

      <!-- Section 6: Team Roles Component (3-Member Grid) -->
      <section class="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">Consolidated Team Roles & Structure</h2>
          <p class="text-sm text-slate-600 mt-1">Cross-functional responsibilities uniting Software Engineering, IoT Hardware, and Design Thinking Research.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${roles.map(r => `
            <div class="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div>
                <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4 shadow-inner">
                  ${r.avatar}
                </div>
                <h3 class="text-base font-extrabold text-slate-900 tracking-tight">${r.role}</h3>
                <div class="text-xs font-semibold text-indigo-600 mt-0.5">${r.name}</div>
                
                <div class="mt-4 pt-3 border-t border-slate-100">
                  <div class="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">Core Responsibilities:</div>
                  <ul class="space-y-2 text-xs text-slate-600">
                    ${r.responsibilities.map(resp => `
                      <li class="flex items-start gap-2">
                        <span class="text-indigo-600 font-bold shrink-0">•</span>
                        <span>${resp}</span>
                      </li>
                    `).join('')}
                  </ul>
                </div>
              </div>

              <div class="mt-5 pt-3 border-t border-slate-100">
                <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Key Competencies:</div>
                <div class="flex flex-wrap gap-1">
                  ${r.skills.map(sk => `
                    <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">${sk}</span>
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}

/**
 * Hardware ESP32 Button Simulator function
 */
function simulateESP32Press(type) {
  AppState.recordFeedback(type, 'esp32');
  
  const ledId = `hw-led-${type}`;
  const led = document.getElementById(ledId);
  if (led) {
    const activeColor = type === 'green' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : type === 'yellow' ? 'bg-amber-400 shadow-lg shadow-amber-400/50' : 'bg-rose-500 shadow-lg shadow-rose-500/50';
    led.className = `w-4 h-4 rounded-full ${activeColor} mb-2 border border-white transition-all`;
    setTimeout(() => {
      led.className = `w-4 h-4 rounded-full bg-slate-300 mb-2 border border-slate-400 transition-colors duration-200`;
    }, 700);
  }
}

/**
 * Keyboard Shortcuts
 */
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

    if (e.key === '1') {
      AppState.recordFeedback('green', 'web');
    } else if (e.key === '2') {
      AppState.recordFeedback('yellow', 'web');
    } else if (e.key === '3') {
      AppState.recordFeedback('red', 'web');
    } else if (e.key.toLowerCase() === 'm') {
      const btn = document.getElementById('sound-toggle-btn');
      if (btn) btn.click();
    } else if (e.key.toLowerCase() === 'd') {
      AppState.setView('split');
    }
  });
}

/**
 * Export Session Report
 */
function exportSessionReport() {
  const s = AppState.state;
  const report = {
    title: "Confusion Button Session Analytics Report",
    course: s.lecture.courseCode + " - " + s.lecture.courseName,
    date: s.lecture.sessionDate,
    instructor: s.lecture.instructor,
    summary: {
      mostConfusingSection: s.lecture.postClassSummary.mostConfusingSection,
      peakConfusionTime: s.lecture.postClassSummary.peakConfusionTime,
      studentsAffectedPercent: s.lecture.postClassSummary.studentsAffectedPercent,
      totalFeedbackEvents: s.totalClicksSession,
      currentCounts: s.counts
    },
    timelineData: s.timeline
  };

  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `confusion-button-${s.lecture.courseCode}-analytics.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Interactive Subject / Class Customizer Modal
 */
function openEditClassModal() {
  let modal = document.getElementById('edit-class-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'edit-class-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-opacity';
    document.body.appendChild(modal);
  }

  const s = AppState.state;
  const lecture = s.lecture || INITIAL_LECTURE_DATA;
  const topicListStr = (lecture.topicList || []).map(t => t.name).join('\n');

  modal.innerHTML = `
    <div class="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 sm:p-7 overflow-hidden">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            📚
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">Switch / Customize Class</h3>
            <p class="text-xs text-slate-500">Update subject name, course code, and syllabus topics</p>
          </div>
        </div>
        <button onclick="closeEditClassModal()" class="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-xl font-bold">&times;</button>
      </div>

      <div class="mt-4 space-y-4 text-xs">
        <!-- Quick Preset Buttons -->
        <div>
          <label class="block font-bold text-slate-700 mb-1.5">⚡ Quick Subject Presets</label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            ${(typeof PRESET_SUBJECTS !== 'undefined' ? PRESET_SUBJECTS : []).map(p => `
              <button type="button" 
                      onclick="populateClassModalFromPreset('${p.courseCode}')"
                      class="px-2.5 py-1.5 rounded-lg border text-left font-medium transition ${p.courseCode === lecture.courseCode ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 hover:bg-indigo-50/50 text-slate-700'}">
                <div class="font-bold text-[11px]">${p.courseCode}</div>
                <div class="truncate text-[10px] text-slate-500">${p.courseName}</div>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Course Code</label>
            <input type="text" id="modal-course-code" value="${lecture.courseCode || 'CS101'}" placeholder="e.g. MATH201, PHY102"
                   class="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase font-bold text-indigo-900">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Instructor Name</label>
            <input type="text" id="modal-instructor" value="${lecture.instructor || 'Dr. Sarah Lin'}" placeholder="e.g. Prof. Alan Reyes"
                   class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none">
          </div>
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1">Course / Subject Name</label>
          <input type="text" id="modal-course-name" value="${lecture.courseName || ''}" placeholder="e.g. Linear Algebra & Vector Spaces"
                 class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Classroom / Location</label>
            <input type="text" id="modal-room" value="${lecture.room || 'Lecture Hall B'}" placeholder="e.g. Room 301 / Zoom"
                   class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none">
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1">Current Active Topic</label>
            <input type="text" id="modal-active-topic" value="${s.activeTopic || ''}" placeholder="e.g. Eigenvalues & Eigenvectors"
                   class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-indigo-950 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block font-bold text-slate-700">Lecture Topics (One per line)</label>
            <span class="text-[10px] text-slate-400">Available in teacher dropdown</span>
          </div>
          <textarea id="modal-topics" rows="3" placeholder="Topic 1&#10;Topic 2&#10;Topic 3"
                    class="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono leading-relaxed">${topicListStr}</textarea>
        </div>
      </div>

      <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
        <button type="button" onclick="resetClassToDefault()" 
                class="text-xs text-slate-400 hover:text-rose-600 transition underline underline-offset-2">
          Reset to CS101 Default
        </button>
        <div class="flex items-center gap-2 w-full sm:w-auto">
          <button type="button" onclick="closeEditClassModal()" 
                  class="flex-1 sm:flex-initial px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-xs transition">
            Cancel
          </button>
          <button type="button" onclick="saveCustomClassDetails()" 
                  class="flex-1 sm:flex-initial px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md shadow-indigo-600/30 transition flex items-center justify-center gap-1.5">
            <span>Apply & Save Subject</span>
          </button>
        </div>
      </div>
    </div>
  `;
  modal.classList.remove('hidden');
}

function closeEditClassModal() {
  const modal = document.getElementById('edit-class-modal');
  if (modal) modal.classList.add('hidden');
}

function populateClassModalFromPreset(code) {
  if (typeof PRESET_SUBJECTS === 'undefined') return;
  const p = PRESET_SUBJECTS.find(x => x.courseCode === code);
  if (!p) return;
  const codeEl = document.getElementById('modal-course-code');
  const nameEl = document.getElementById('modal-course-name');
  const instEl = document.getElementById('modal-instructor');
  const roomEl = document.getElementById('modal-room');
  const topicEl = document.getElementById('modal-active-topic');
  const topicsListEl = document.getElementById('modal-topics');

  if (codeEl) codeEl.value = p.courseCode;
  if (nameEl) nameEl.value = p.courseName;
  if (instEl) instEl.value = p.instructor;
  if (roomEl) roomEl.value = p.room;
  if (topicEl) topicEl.value = p.currentTopic;
  if (topicsListEl) topicsListEl.value = p.topicList.map(t => t.name).join('\n');
}

function saveCustomClassDetails() {
  const codeEl = document.getElementById('modal-course-code');
  const nameEl = document.getElementById('modal-course-name');
  const instEl = document.getElementById('modal-instructor');
  const roomEl = document.getElementById('modal-room');
  const topicEl = document.getElementById('modal-active-topic');
  const topicsListEl = document.getElementById('modal-topics');

  const courseCode = (codeEl?.value || 'CS101').trim();
  const courseName = (nameEl?.value || 'Class Subject').trim();
  const instructor = (instEl?.value || 'Instructor').trim();
  const room = (roomEl?.value || 'Main Hall').trim();
  const currentTopic = (topicEl?.value || 'General Discussion').trim();
  
  const rawTopics = (topicsListEl?.value || '').split('\n').map(t => t.trim()).filter(Boolean);
  const topicList = rawTopics.length > 0
    ? rawTopics.map((name, idx) => ({ id: idx + 1, name, startTime: `Topic ${idx + 1}` }))
    : [{ id: 1, name: currentTopic, startTime: '10:00 AM' }];

  AppState.setCourse({
    courseCode,
    courseName,
    instructor,
    room,
    currentTopic,
    topicList
  });

  closeEditClassModal();
}

function resetClassToDefault() {
  AppState.resetCourseToDefault();
  closeEditClassModal();
}
