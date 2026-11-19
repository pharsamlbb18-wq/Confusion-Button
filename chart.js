/**
 * The Confusion Button - Interactive Timeline Chart Engine (SVG / Canvas)
 * Renders multi-series feedback against lecture timeline, struggle spike markers, and live updates.
 */

const TimelineChart = (function() {
  let chartData = [];
  let threshold = 30;
  let tooltipEl = null;

  function init(initialData, confusionThreshold = 30) {
    if (initialData) chartData = [...initialData];
    if (confusionThreshold !== undefined) threshold = confusionThreshold;

    if (!document.getElementById('chart-tooltip')) {
      tooltipEl = document.createElement('div');
      tooltipEl.id = 'chart-tooltip';
      tooltipEl.className = 'fixed hidden z-50 pointer-events-none bg-slate-900/95 text-white text-xs rounded-xl p-3.5 shadow-2xl border border-slate-700/80 backdrop-blur-md transition-opacity duration-150 min-w-[210px]';
      document.body.appendChild(tooltipEl);
    } else {
      tooltipEl = document.getElementById('chart-tooltip');
    }

    window.addEventListener('resize', () => render());
    render();
  }

  function updateData(newData, newThreshold) {
    if (newData) chartData = [...newData];
    if (newThreshold !== undefined) threshold = newThreshold;
    render();
  }

  function addDataPoint(point) {
    chartData.push(point);
    if (chartData.length > 20) chartData.shift();
    render();
  }

  function render() {
    const containers = document.querySelectorAll('.timeline-chart-target');
    if (!containers || containers.length === 0) return;

    containers.forEach(container => {
      // If parent is hidden, width might be 0, skip or use clientWidth fallback
      const width = container.clientWidth || 760;
      const height = Math.max(340, container.clientHeight || 340);
      const padding = { top: 50, right: 35, bottom: 65, left: 55 };
      const chartW = width - padding.left - padding.right;
      const chartH = height - padding.top - padding.bottom;

      if (chartData.length < 2) {
        container.innerHTML = '<div class="flex items-center justify-center h-full text-slate-400 text-sm">Gathering timeline telemetry...</div>';
        return;
      }

      const maxStudents = 35;
      const n = chartData.length;

      const getX = (index) => padding.left + (index / (n - 1)) * chartW;
      const getY = (val) => padding.top + chartH - (Math.min(val, maxStudents) / maxStudents) * chartH;

      let pathGreen = `M ${getX(0)} ${getY(chartData[0].gotIt)}`;
      let areaGreen = `M ${getX(0)} ${padding.top + chartH} L ${getX(0)} ${getY(chartData[0].gotIt)}`;

      let pathYellow = `M ${getX(0)} ${getY(chartData[0].unsure)}`;
      let pathRed = `M ${getX(0)} ${getY(chartData[0].confused)}`;
      let areaRed = `M ${getX(0)} ${padding.top + chartH} L ${getX(0)} ${getY(chartData[0].confused)}`;

      for (let i = 1; i < n; i++) {
        const prevX = getX(i - 1);
        const prevYGreen = getY(chartData[i - 1].gotIt);
        const currX = getX(i);
        const currYGreen = getY(chartData[i].gotIt);
        const cpX1 = prevX + (currX - prevX) / 2;
        
        pathGreen += ` C ${cpX1} ${prevYGreen}, ${cpX1} ${currYGreen}, ${currX} ${currYGreen}`;
        areaGreen += ` C ${cpX1} ${prevYGreen}, ${cpX1} ${currYGreen}, ${currX} ${currYGreen}`;

        const prevYYellow = getY(chartData[i - 1].unsure);
        const currYYellow = getY(chartData[i].unsure);
        pathYellow += ` C ${cpX1} ${prevYYellow}, ${cpX1} ${currYYellow}, ${currX} ${currYYellow}`;

        const prevYRed = getY(chartData[i - 1].confused);
        const currYRed = getY(chartData[i].confused);
        pathRed += ` C ${cpX1} ${prevYRed}, ${cpX1} ${currYRed}, ${currX} ${currYRed}`;
        areaRed += ` C ${cpX1} ${prevYRed}, ${cpX1} ${currYRed}, ${currX} ${currYRed}`;
      }

      areaGreen += ` L ${getX(n - 1)} ${padding.top + chartH} Z`;
      areaRed += ` L ${getX(n - 1)} ${padding.top + chartH} Z`;

      const thresholdCount = Math.round((threshold / 100) * maxStudents);
      const thresholdY = getY(thresholdCount);

      // Gridlines
      let gridLinesSvg = '';
      [0, 10, 20, 30, 35].forEach(val => {
        const y = getY(val);
        gridLinesSvg += `
          <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="3,3" stroke-width="1" />
          <text x="${padding.left - 12}" y="${y + 4}" font-size="11" fill="#94a3b8" text-anchor="end" font-weight="500">${val}</text>
        `;
      });

      // Ticks on X-axis
      let xTicksSvg = '';
      chartData.forEach((d, i) => {
        if (width < 600 && i % 2 !== 0 && !d.isSpike) return;
        const x = getX(i);
        xTicksSvg += `
          <line x1="${x}" y1="${padding.top + chartH}" x2="${x}" y2="${padding.top + chartH + 6}" stroke="#cbd5e1" stroke-width="1.5" />
          <text x="${x}" y="${padding.top + chartH + 20}" font-size="10.5" fill="#64748b" text-anchor="middle" font-family="sans-serif">${d.time}</text>
        `;
      });

      // Spike markers
      let spikeMarkersSvg = '';
      chartData.forEach((d, i) => {
        const x = getX(i);
        const yRed = getY(d.confused);

        if (d.isSpike) {
          spikeMarkersSvg += `
            <line x1="${x}" y1="${padding.top}" x2="${x}" y2="${padding.top + chartH}" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3" />
            <circle cx="${x}" cy="${yRed}" r="12" fill="#ef4444" fill-opacity="0.25" class="animate-ping" />
            <circle cx="${x}" cy="${yRed}" r="7" fill="#ef4444" stroke="#ffffff" stroke-width="2.5" />
            
            <g transform="translate(${x}, ${Math.max(padding.top - 10, yRed - 42)})" class="cursor-pointer" onclick="TimelineChart.showSpikeDetail(${i})">
              <rect x="-85" y="-12" width="170" height="26" rx="6" fill="#dc2626" filter="drop-shadow(0 3px 6px rgba(220,38,38,0.35))" />
              <polygon points="0,17 -6,14 6,14" fill="#dc2626" />
              <text x="0" y="5" font-size="10" font-weight="700" fill="#ffffff" text-anchor="middle" font-family="system-ui, sans-serif">
                ⚠️ SPIKE: ${d.time} (${Math.round((d.confused/maxStudents)*100)}% Confused)
              </text>
            </g>
          `;
        } else {
          spikeMarkersSvg += `
            <circle cx="${x}" cy="${yRed}" r="4" fill="#ef4444" stroke="#ffffff" stroke-width="1.5" />
            <circle cx="${x}" cy="${getY(d.gotIt)}" r="3" fill="#10b981" stroke="#ffffff" stroke-width="1" />
          `;
        }
      });

      // Interactive Hover Zones
      let hoverZonesSvg = '';
      chartData.forEach((d, i) => {
        const x = getX(i);
        const w = chartW / (n - 1 || 1);
        hoverZonesSvg += `
          <rect x="${x - w / 2}" y="${padding.top}" width="${w}" height="${chartH}" fill="transparent" 
                class="cursor-pointer"
                onmouseenter="TimelineChart.handleHover(event, ${i})"
                onmousemove="TimelineChart.handleMove(event)"
                onmouseleave="TimelineChart.handleLeave()" />
        `;
      });

      container.innerHTML = `
        <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" class="overflow-visible select-none">
          <defs>
            <linearGradient id="gradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.32" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0.02" />
            </linearGradient>
            <linearGradient id="gradRed" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#ef4444" stop-opacity="0.35" />
              <stop offset="100%" stop-color="#ef4444" stop-opacity="0.02" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.2"/>
            </filter>
          </defs>

          ${gridLinesSvg}

          <!-- Alert Threshold Line -->
          <g>
            <line x1="${padding.left}" y1="${thresholdY}" x2="${width - padding.right}" y2="${thresholdY}" 
                  stroke="#f97316" stroke-width="1.5" stroke-dasharray="6,4" />
            <text x="${width - padding.right}" y="${thresholdY - 6}" font-size="10" font-weight="600" fill="#ea580c" text-anchor="end">
              Threshold Alert (${threshold}% = ${thresholdCount} students)
            </text>
          </g>

          <path d="${areaGreen}" fill="url(#gradGreen)" />
          <path d="${areaRed}" fill="url(#gradRed)" />

          <path d="${pathGreen}" fill="none" stroke="#10b981" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round" />
          <path d="${pathYellow}" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-dasharray="4,2" stroke-linecap="round" stroke-linejoin="round" />
          <path d="${pathRed}" fill="none" stroke="#ef4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#shadow)" />

          ${spikeMarkersSvg}

          <line x1="${padding.left}" y1="${padding.top + chartH}" x2="${width - padding.right}" y2="${padding.top + chartH}" stroke="#94a3b8" stroke-width="1.5" />
          ${xTicksSvg}

          <text x="${padding.left}" y="${padding.top - 16}" font-size="11" font-weight="600" fill="#64748b">Student Count</text>
          <text x="${width / 2}" y="${height - 12}" font-size="11.5" font-weight="600" fill="#64748b" text-anchor="middle">Lecture Timeline Progression (Time of Day)</text>

          ${hoverZonesSvg}
        </svg>
      `;
    });
  }

  function handleHover(evt, index) {
    if (!tooltipEl || !chartData[index]) return;
    const d = chartData[index];
    const total = d.gotIt + d.unsure + d.confused || 1;
    const confusedPct = Math.round((d.confused / total) * 100);
    const unsurePct = Math.round((d.unsure / total) * 100);
    const gotItPct = Math.round((d.gotIt / total) * 100);

    const spikeBadge = d.isSpike 
      ? `<div class="mb-2 px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold text-[10px] inline-flex items-center gap-1 border border-red-500/40">
           <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span> Struggle Spike Initiated
         </div>`
      : '';

    tooltipEl.innerHTML = `
      ${spikeBadge}
      <div class="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-700/60 font-medium">
        <span class="text-slate-200 font-bold">${d.time}</span>
        <span class="text-slate-400 text-[11px]">${d.topic}</span>
      </div>
      <div class="space-y-1.5 text-[11.5px]">
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Got It:
          </span>
          <span class="font-bold text-white">${d.gotIt} <span class="text-slate-400 font-normal">(${gotItPct}%)</span></span>
        </div>
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1.5 text-amber-400 font-medium">
            <span class="w-2 h-2 rounded-full bg-amber-500"></span> A Little Confused:
          </span>
          <span class="font-bold text-white">${d.unsure} <span class="text-slate-400 font-normal">(${unsurePct}%)</span></span>
        </div>
        <div class="flex items-center justify-between">
          <span class="flex items-center gap-1.5 text-rose-400 font-medium">
            <span class="w-2 h-2 rounded-full bg-rose-500"></span> Completely Confused:
          </span>
          <span class="font-bold text-white">${d.confused} <span class="text-rose-300 font-bold">(${confusedPct}%)</span></span>
        </div>
      </div>
      ${d.note ? `<div class="mt-2.5 pt-1.5 border-t border-slate-800 text-[10px] text-slate-300 italic">💡 ${d.note}</div>` : ''}
    `;

    tooltipEl.classList.remove('hidden');
    handleMove(evt);
  }

  function handleMove(evt) {
    if (!tooltipEl) return;
    const x = evt.clientX + 16;
    const y = evt.clientY - 40;
    tooltipEl.style.left = `${Math.min(x, window.innerWidth - 240)}px`;
    tooltipEl.style.top = `${Math.max(20, y)}px`;
  }

  function handleLeave() {
    if (tooltipEl) tooltipEl.classList.add('hidden');
  }

  function showSpikeDetail(index) {
    const d = chartData[index];
    if (!d) return;
    alert(`🔍 STRUGGLE SPIKE DEEP-DIVE\n\nTimestamp: ${d.time}\nTopic: ${d.topic}\nCompletely Confused: ${d.confused} students (${Math.round((d.confused/35)*100)}%)\n\nPedagogical Context:\n${d.note}\n\nRecommended Instructor Action:\nPause lecture, solicit an anonymous poll, and re-illustrate the concept with a concrete code visual.`);
  }

  return {
    init,
    render,
    updateData,
    addDataPoint,
    handleHover,
    handleMove,
    handleLeave,
    showSpikeDetail
  };
})();
