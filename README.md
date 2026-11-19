# 🔘 The Confusion Button — Classroom Feedback System

> **A human-centric Design Thinking solution bridging physical desk hardware and live instructional analytics.**

---

## 📖 Executive Abstract

> *"The 'Confusion Button' is an innovative classroom feedback system designed through a human-centric Design Thinking framework. Traditional lecture formats often suffer from a systemic student pain point: the hesitation to ask questions due to peer embarrassment. This software and hardware solution addresses this barrier by providing students with an entirely anonymous, real-time three-button interface (Got It, Unsure, Confused) to signal comprehension deficits. By continuous logging of responses into a centralized backend database, the system synthesizes data into a live 'Confusion Timeline' dashboard for instructors. This enables educators to dynamically pivot their instructional strategy during peaks of high confusion, reducing misplaced learning outcomes and significantly optimizing engagement without compromising student privacy."*

---

## 🎯 Primary Views & Architecture

### 1. 📱 Student Interface View
- **Distraction-Free Anonymity:** Fully private, requiring zero login credentials or tracking tokens.
- **Top Lecture Header:** Real-time synchronization displaying course code (`CS101`), topic (`Hexadecimal → Binary`), instructor (`Dr. Sarah Lin`), and active status badge.
- **3 Tactile Feedback Buttons:**
  - 🟢 **Got it** (Green) — High comprehension, pacing is optimal.
  - 🟡 **A little confused** (Yellow) — Hesitation or need for an example.
  - 🔴 **Completely confused** (Red) — Severe comprehension block, immediate pedagogical review requested.
- **Micro-Visual Confirmation:** Subtle, gentle pulse animation and acknowledgment toast confirming the anonymous response was logged.
- **Keyboard Shortcuts:** Quick toggles using `[1]`, `[2]`, `[3]`.

---

### 2. 📊 Live Teacher Dashboard View
- **Real-Time Counters:** Visual telemetry cards showing instantaneous counts:
  - `Got it: 22` | `Unsure: 8` | `Confused: 5` | `Comprehension Index: 78%`
- **High Confusion Alert Banner:** Prominent warning indicator triggering automatically when confusion surpasses the configured threshold (default `30%`):
  > `⚠️ HIGH CONFUSION: Topic: Hexadecimal → Binary`
  - Offers instant instructor intervention shortcuts: *2-Minute Whiteboard Pause*, *Solicit Anonymous Feedback*, or *Acknowledge/Dismiss*.
- **Confusion Timeline (Core Analytics Feature):**
  - Continuous multi-series line chart mapping student comprehension across lecture timestamps (`10:00`, `10:05`, `10:15`, `10:21`, `10:38`, `10:45`).
  - **Struggle Spike Markers:** Distinct annotated pins identifying exact timestamps where student struggle surged (e.g. `10:21 AM` on *Type Casting*).
  - Interactive hover tooltips displaying instantaneous counts, percentages, and pedagogical notes.
- **Post-Class Analytics Card:**
  - **Most Confusing Section:** *Type Casting*
  - **Peak Confusion Time:** *10:21 AM*
  - **Students Affected:** *63%*
  - Export Session Report (downloadable `.json` telemetry package).

---

### 3. 📖 Project Documentation & Portfolio View
- **The "Why" & "How":** Thorough explanation of classroom social anxiety and how passive continuous streaming removes psychological friction.
- **Prior Art Analysis:**
  - *Traditional Hand Raising:* High peer barrier, extrovert bias, non-continuous.
  - *Clickers / Quizzes (Kahoot, Mentimeter):* Discrete, halting, interruptive to natural spoken flow.
  - *Our Innovation:* Passive, aggregate, continuous time-series correlated directly to lecture minutes.
- **System Architecture:**
  - Visual 4-stage pipeline: *Student Input → Ingestion Gateway → Time-Series Aggregator → Live Dashboard*.
- **Interactive ESP32 Hardware Simulator:**
  - Interactive virtual breadboard allowing users to press physical tactile buttons on screen, trigger virtual LEDs, and watch the dashboard update live.
- **Tech Stack & Hardware BOM:**
  - Software: HTML5, CSS3, Tailwind CSS, Modern JavaScript (ES6+), SVG Chart Engine, Node.js / Python Flask, SQLite / Firebase.
  - Hardware: ESP32 Microcontroller, 3 momentary tactile buttons, 3 diffused LEDs, 220Ω & 10kΩ resistors, half-size breadboard.
- **Consolidated Team Roles (3-Member Grid):**
  1. *Software Engineer (Full-Stack):* Alex Rivera
  2. *Hardware Engineer:* Marcus Chen
  3. *Design Thinking & Research Lead:* Elena Rostova

---

## ⚡ Interactive Live Split Demo Mode

A unified dual-pane environment allowing instructors, evaluators, or students to view the **Student Mobile Phone** on the left and the **Teacher Dashboard** on the right side-by-side. Clicks on the student phone immediately animate the teacher dashboard counters, the audio synthesizer, and the SVG timeline chart.

---

## 🚀 Running the Project

1. Navigate to the project directory:
   ```powershell
   cd "C:\Users\Priyam Samanta\.gemini\antigravity\scratch\confusion-button"
   ```
2. Open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari).
   - Alternatively, start a lightweight HTTP server if desired.
3. No build tools, compilation, or package manager installation is required.

---

## 🛠️ ESP32 Firmware Source (`firmware/esp32_confusion_button.ino`)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>

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
}
```
