# Interactive Test Builder

Build interactive math tests with student profiles, adaptive logic, and multiple output formats.

## When to Use

- User wants a math test or quiz with interactive features
- User wants differentiated assessments for different student levels
- User wants an adaptive test that adjusts difficulty based on answers
- User wants output as HTML, Google Form, printable, or answer key

## Workflow

1. **Ask**: topic, grade level, student profile(s), number of questions, output format
2. **Generate**: test with appropriate structure, difficulty, and interactive features
3. **Export**: deliver in requested format with all interactive elements working

## Student Profiles

| Profile | Difficulty | Scaffolding | Hints | Time |
|---------|-----------|-------------|-------|------|
| Beginner | Basic | Full steps | Available | +50% |
| Intermediate | Standard | Minimal | Limited | Standard |
| Advanced | Complex | None | Expert only | -25% |
| Visual Learner | Adapts | Diagrams, graphs | Visual cues | Standard |
| Struggling | Remediation | Extra practice | Frequent | +75% |
| Gifted | Enrichment | Open-ended | None | -25% |

## Test Structure

### Warm-Up (2-3 easy questions)
Build confidence, activate prior knowledge, aligned to profile level.

### Core (topic-aligned questions at profile level)
Main assessment content. 5-10 questions testing key concepts.

### Challenge (1-2 harder questions for differentiation)
Push advanced students; optional/scaffolded for others.

### Exit Ticket (quick check of key concept)
1 question, 1 minute, formative assessment.

## Interactive HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Interactive Test</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f8fafc; color: #1e293b; padding: 1em; }
  .container { max-width: 800px; margin: 0 auto; }
  .header { text-align: center; padding: 1.5em; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; border-radius: 12px; margin-bottom: 1.5em; }
  .header h1 { font-size: 1.5em; margin-bottom: 0.3em; }
  .header .meta { opacity: 0.9; font-size: 0.9em; }
  .progress-bar { height: 6px; background: #e2e8f0; border-radius: 3px; margin: 1em 0; overflow: hidden; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, #2563eb, #7c3aed); transition: width 0.4s ease; border-radius: 3px; }
  .question-card { background: white; border-radius: 12px; padding: 1.5em; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 1em; display: none; }
  .question-card.active { display: block; }
  .question-number { color: #2563eb; font-weight: 600; font-size: 0.85em; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5em; }
  .question-text { font-size: 1.15em; line-height: 1.6; margin-bottom: 1em; }
  .options { display: flex; flex-direction: column; gap: 0.5em; }
  .option { display: flex; align-items: center; padding: 0.75em 1em; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
  .option:hover { border-color: #93c5fd; background: #f0f9ff; }
  .option.selected { border-color: #2563eb; background: #eff6ff; }
  .option.correct { border-color: #16a34a; background: #f0fdf4; }
  .option.incorrect { border-color: #dc2626; background: #fef2f2; }
  .option input[type="radio"] { margin-right: 0.75em; }
  .feedback { padding: 0.75em 1em; border-radius: 8px; margin-top: 0.75em; display: none; }
  .feedback.correct { background: #f0fdf4; border: 1px solid #86efac; color: #166534; display: block; }
  .feedback.incorrect { background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; display: block; }
  .feedback.hint { background: #fefce8; border: 1px solid #fde047; color: #854d0e; display: block; }
  .btn { padding: 0.6em 1.5em; border: none; border-radius: 8px; font-size: 1em; cursor: pointer; transition: all 0.2s; font-weight: 600; }
  .btn-primary { background: #2563eb; color: white; }
  .btn-primary:hover { background: #1d4ed8; }
  .btn-secondary { background: #e2e8f0; color: #475569; }
  .btn-secondary:hover { background: #cbd5e1; }
  .btn-success { background: #16a34a; color: white; }
  .btn-hint { background: #fefce8; color: #854d0e; border: 1px solid #fde047; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .nav-buttons { display: flex; justify-content: space-between; margin-top: 1em; gap: 0.5em; flex-wrap: wrap; }
  .fill-blank { padding: 0.5em; border: 2px solid #cbd5e1; border-radius: 6px; font-size: 1.1em; width: 120px; text-align: center; outline: none; }
  .fill-blank:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .fill-blank.correct { border-color: #16a34a; background: #f0fdf4; }
  .fill-blank.incorrect { border-color: #dc2626; background: #fef2f2; }
  .step-reveal { margin: 0.5em 0; padding: 0.5em 1em; border-left: 3px solid #2563eb; background: #f8fafc; display: none; }
  .step-reveal.visible { display: block; }
  .score-summary { background: white; border-radius: 12px; padding: 2em; box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; display: none; }
  .score-summary.active { display: block; }
  .score-circle { width: 120px; height: 120px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 1em auto; font-size: 2em; font-weight: 700; }
  .score-high { background: #f0fdf4; color: #16a34a; border: 4px solid #16a34a; }
  .score-medium { background: #fefce8; color: #eab308; border: 4px solid #eab308; }
  .score-low { background: #fef2f2; color: #dc2626; border: 4px solid #dc2626; }
  .strength-tag { display: inline-block; padding: 0.25em 0.75em; border-radius: 20px; font-size: 0.85em; margin: 0.2em; }
  .strength { background: #dcfce7; color: #166534; }
  .weakness { background: #fee2e2; color: #991b1b; }
  .diagram { max-width: 100%; margin: 1em 0; text-align: center; }
  .diagram svg { max-width: 100%; height: auto; }
  @media (prefers-color-scheme: dark) {
    body { background: #0f172a; color: #e2e8f0; }
    .question-card { background: #1e293b; }
    .option { border-color: #334155; }
    .option:hover { border-color: #3b82f6; background: #1e3a5f; }
    .option.selected { border-color: #3b82f6; background: #1e3a5f; }
    .option.correct { border-color: #22c55e; background: #052e16; }
    .option.incorrect { border-color: #ef4444; background: #450a0a; }
    .feedback.correct { background: #052e16; border-color: #22c55e; color: #86efac; }
    .feedback.incorrect { background: #450a0a; border-color: #ef4444; color: #fca5a5; }
    .feedback.hint { background: #422006; border-color: #eab308; color: #fde047; }
    .btn-secondary { background: #334155; color: #cbd5e1; }
    .score-summary { background: #1e293b; }
    .step-reveal { background: #1e293b; }
    .strength { background: #052e16; color: #86efac; }
    .weakness { background: #450a0a; color: #fca5a5; }
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1 id="testTitle">Test Title</h1>
    <p class="meta"><span id="studentName">Student</span> &bull; <span id="topicLabel">Topic</span> &bull; <span id="profileLabel">Profile</span></p>
  </div>

  <div class="progress-bar">
    <div class="progress-fill" id="progressFill" style="width: 0%"></div>
  </div>

  <div id="questionsContainer"></div>

  <div class="nav-buttons" id="navButtons">
    <button class="btn btn-secondary" id="prevBtn" onclick="prevQuestion()" disabled>← Previous</button>
    <button class="btn btn-hint" id="hintBtn" onclick="showHint()">💡 Hint</button>
    <button class="btn btn-primary" id="nextBtn" onclick="nextQuestion()">Next →</button>
    <button class="btn btn-success" id="submitBtn" onclick="submitTest()" style="display:none">Submit</button>
  </div>

  <div class="score-summary" id="scoreSummary">
    <h2>Test Complete!</h2>
    <div class="score-circle" id="scoreCircle">0%</div>
    <p id="scoreMessage"></p>
    <h3 style="margin-top:1em">Strengths</h3>
    <div id="strengthsList"></div>
    <h3 style="margin-top:1em">Needs Review</h3>
    <div id="weaknessesList"></div>
    <button class="btn btn-primary" onclick="restartTest()" style="margin-top:1em">Restart Test</button>
  </div>
</div>

<script>
const testData = {
  title: "TEST TITLE",
  topic: "TOPIC",
  profile: "PROFILE",
  questions: [
    {
      id: 1,
      type: "mcq",
      section: "warmup",
      text: "Question text with $x^2 + 3x + 2 = 0$?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 0,
      hint: "Think about...",
      explanation: "Because...",
      concept: "Concept name"
    },
    {
      id: 2,
      type: "fill",
      text: "Solve $2x + 5 = 13$: x = ___",
      correct: "4",
      hint: "Subtract 5 then divide by 2",
      explanation: "2x + 5 = 13 → 2x = 8 → x = 4",
      concept: "Linear equations"
    },
    {
      id: 3,
      type: "order",
      text: "Arrange the steps to solve $3x - 7 = 14$:",
      steps: ["Add 7 to both sides", "Divide by 3", "Simplify to get x = 7"],
      correctOrder: [0, 1, 2],
      hint: "Undo subtraction first, then multiplication",
      concept: "Equation solving steps"
    },
    {
      id: 4,
      type: "mcq",
      section: "challenge",
      text: "Challenge question?",
      options: ["A", "B", "C", "D"],
      correct: 2,
      hint: "Consider the edge case...",
      explanation: "Advanced reasoning...",
      concept: "Advanced concept"
    }
  ]
};

let currentQuestion = 0;
let answers = {};
let hintsShown = {};
let score = 0;
let totalQuestions = testData.questions.length;

function init() {
  document.getElementById('testTitle').textContent = testData.title;
  document.getElementById('topicLabel').textContent = testData.topic;
  document.getElementById('profileLabel').textContent = testData.profile;

  const container = document.getElementById('questionsContainer');
  testData.questions.forEach((q, i) => {
    const card = document.createElement('div');
    card.className = 'question-card' + (i === 0 ? ' active' : '');
    card.id = 'q' + i;

    let sectionLabel = '';
    if (q.section === 'warmup') sectionLabel = '<span style="color:#eab308">Warm-Up</span>';
    else if (q.section === 'challenge') sectionLabel = '<span style="color:#7c3aed">Challenge</span>';

    let html = `<div class="question-number">Question ${i + 1} of ${totalQuestions} ${sectionLabel ? '• ' + sectionLabel : ''}</div>`;
    html += `<div class="question-text">${q.text}</div>`;

    if (q.type === 'mcq') {
      html += '<div class="options">';
      q.options.forEach((opt, oi) => {
        html += `<label class="option" id="opt${i}_${oi}" onclick="selectMCQ(${i}, ${oi})">
          <input type="radio" name="q${i}" value="${oi}"> ${opt}
        </label>`;
      });
      html += '</div>';
    } else if (q.type === 'fill') {
      html += `<input type="text" class="fill-blank" id="fill${i}" onchange="checkFill(${i})" placeholder="Type answer..." autocomplete="off">`;
    } else if (q.type === 'order') {
      html += '<div class="options" id="orderContainer${i}">';
      q.steps.forEach((step, si) => {
        html += `<div class="option" id="order${i}_${si}" draggable="true" onclick="moveOrder(${i}, ${si})">
          <span style="cursor:grab;margin-right:0.5em">⠿</span> ${step}
        </div>`;
      });
      html += '</div>';
      html += '<p style="font-size:0.85em;color:#6b7280;margin-top:0.5em">Click items to move them to correct order</p>';
    }

    html += `<div class="feedback hint" id="hint${i}" data-hint="${q.hint || ''}"></div>`;
    html += `<div class="feedback" id="feedback${i}"></div>`;

    card.innerHTML = html;
    container.appendChild(card);
  });

  updateProgress();
  updateButtons();
}

function selectMCQ(qi, oi) {
  const q = testData.questions[qi];
  document.querySelectorAll(`#q${qi} .option`).forEach(el => el.classList.remove('selected'));
  document.getElementById(`opt${qi}_${oi}`).classList.add('selected');
  document.querySelector(`#q${qi} input[name="q${qi}"]`).checked = true;
  answers[qi] = oi;
  checkAnswer(qi);
}

function checkFill(qi) {
  const input = document.getElementById('fill' + qi);
  const q = testData.questions[qi];
  const val = input.value.trim();
  answers[qi] = val;
  if (val.toLowerCase() === q.correct.toLowerCase()) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    showFeedback(qi, true, q.explanation);
  } else if (val.length >= 1) {
    input.classList.add('incorrect');
    input.classList.remove('correct');
    showFeedback(qi, false, 'Try again. ' + (q.hint ? 'Hint: ' + q.hint : ''));
  }
}

function checkAnswer(qi) {
  const q = testData.questions[qi];
  let correct = false;
  if (q.type === 'mcq') {
    correct = answers[qi] === q.correct;
  }
  if (correct) {
    showFeedback(qi, true, q.explanation);
  }
}

function showFeedback(qi, isCorrect, msg) {
  const fb = document.getElementById('feedback' + qi);
  fb.textContent = msg || '';
  fb.className = 'feedback ' + (isCorrect ? 'correct' : 'incorrect');
  fb.style.display = 'block';
}

function showHint() {
  const q = testData.questions[currentQuestion];
  const hintDiv = document.getElementById('hint' + currentQuestion);
  if (q.hint) {
    hintDiv.textContent = '💡 ' + q.hint;
    hintDiv.style.display = 'block';
    hintsShown[currentQuestion] = true;
  }
}

function moveOrder(qi, si) {
  const container = document.getElementById('orderContainer' + qi);
  const items = container.querySelectorAll('.option');
  if (items.length < 2) return;
  const currentOrder = Array.from(items).map(el => el.id);
  const idx = currentOrder.indexOf('order' + qi + '_' + si);
  if (idx < items.length - 1) {
    items[idx + 1].after(items[idx]);
  } else {
    items[0].before(items[items.length - 1]);
  }
  const newOrder = Array.from(container.querySelectorAll('.option')).map(el => parseInt(el.id.split('_')[1]));
  answers[qi] = newOrder;
  checkOrder(qi, newOrder);
}

function checkOrder(qi, order) {
  const q = testData.questions[qi];
  const correct = order.every((val, idx) => val === q.correctOrder[idx]);
  if (correct) {
    showFeedback(qi, true, 'Correct order! ' + q.explanation);
  }
}

function nextQuestion() {
  if (currentQuestion < totalQuestions - 1) {
    document.getElementById('q' + currentQuestion).classList.remove('active');
    currentQuestion++;
    document.getElementById('q' + currentQuestion).classList.add('active');
    updateProgress();
    updateButtons();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    document.getElementById('q' + currentQuestion).classList.remove('active');
    currentQuestion--;
    document.getElementById('q' + currentQuestion).classList.add('active');
    updateProgress();
    updateButtons();
  }
}

function updateProgress() {
  const pct = ((currentQuestion + 1) / totalQuestions) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
}

function updateButtons() {
  document.getElementById('prevBtn').disabled = currentQuestion === 0;
  const isLast = currentQuestion === totalQuestions - 1;
  document.getElementById('nextBtn').style.display = isLast ? 'none' : 'inline-block';
  document.getElementById('submitBtn').style.display = isLast ? 'inline-block' : 'none';
}

function submitTest() {
  let correctCount = 0;
  let concepts = {};

  testData.questions.forEach((q, i) => {
    if (!concepts[q.concept]) concepts[q.concept] = { correct: 0, total: 0 };
    concepts[q.concept].total++;

    if (q.type === 'mcq' && answers[i] === q.correct) {
      correctCount++;
      concepts[q.concept].correct++;
    } else if (q.type === 'fill' && answers[i] && answers[i].toLowerCase() === q.correct.toLowerCase()) {
      correctCount++;
      concepts[q.concept].correct++;
    } else if (q.type === 'order' && answers[i]) {
      const correct = answers[i].every((val, idx) => val === q.correctOrder[idx]);
      if (correct) {
        correctCount++;
        concepts[q.concept].correct++;
      }
    }
  });

  score = Math.round((correctCount / totalQuestions) * 100);

  document.getElementById('questionsContainer').style.display = 'none';
  document.getElementById('navButtons').style.display = 'none';
  document.getElementById('progress-bar').style.display = 'none';
  const summary = document.getElementById('scoreSummary');
  summary.classList.add('active');

  const circle = document.getElementById('scoreCircle');
  circle.textContent = score + '%';
  circle.className = 'score-circle ' + (score >= 80 ? 'score-high' : score >= 50 ? 'score-medium' : 'score-low');

  document.getElementById('scoreMessage').textContent =
    score >= 80 ? 'Excellent work! You have a strong understanding.' :
    score >= 50 ? 'Good effort! Review the areas below and try again.' :
    'Keep practicing! Focus on the topics marked for review.';

  const strengths = document.getElementById('strengthsList');
  const weaknesses = document.getElementById('weaknessesList');
  strengths.innerHTML = '';
  weaknesses.innerHTML = '';

  Object.entries(concepts).forEach(([concept, data]) => {
    const pct = data.correct / data.total;
    const tag = document.createElement('span');
    tag.className = 'strength-tag ' + (pct >= 0.7 ? 'strength' : 'weakness');
    tag.textContent = concept + ' (' + data.correct + '/' + data.total + ')';
    if (pct >= 0.7) strengths.appendChild(tag);
    else weaknesses.appendChild(tag);
  });
}

function restartTest() {
  currentQuestion = 0;
  answers = {};
  hintsShown = {};
  score = 0;
  document.getElementById('questionsContainer').style.display = 'block';
  document.getElementById('navButtons').style.display = 'flex';
  document.getElementById('progress-bar').style.display = 'block';
  document.getElementById('scoreSummary').classList.remove('active');
  document.querySelectorAll('.question-card').forEach((el, i) => {
    el.classList.toggle('active', i === 0);
  });
  document.querySelectorAll('.feedback').forEach(el => { el.style.display = 'none'; });
  document.querySelectorAll('.fill-blank').forEach(el => { el.value = ''; el.className = 'fill-blank'; });
  document.querySelectorAll('.option').forEach(el => el.classList.remove('selected', 'correct', 'incorrect'));
  updateProgress();
  updateButtons();
}

init();
</script>
</body>
</html>
```

## Adaptive Logic

### Difficulty Adjustment Rules

```
Next difficulty = f(current_difficulty, is_correct, streak)

Streak ≥ 3 correct → increase difficulty by 1 level
Streak ≤ 2 incorrect in row → decrease difficulty by 1 level
First question → start at profile's default level
```

### Concept Tracking

```javascript
const conceptTracker = {
  concepts: {},
  recordAnswer(concept, correct) {
    if (!this.concepts[concept]) {
      this.concepts[concept] = { attempts: 0, correct: 0, streak: 0 };
    }
    this.concepts[concept].attempts++;
    if (correct) {
      this.concepts[concept].correct++;
      this.concepts[concept].streak++;
    } else {
      this.concepts[concept].streak = 0;
    }
  },
  needsReview(concept) {
    const c = this.concepts[concept];
    return c && (c.correct / c.attempts) < 0.6;
  },
  getNextQuestion(availableQuestions) {
    // Prioritize concepts needing review
    const review = availableQuestions.filter(q => this.needsReview(q.concept));
    if (review.length > 0 && Math.random() < 0.6) {
      return review[Math.floor(Math.random() * review.length)];
    }
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }
};
```

## Output Formats

### Interactive HTML
Self-contained single HTML file. Open in any browser. All features work offline.

### Google Form Structure
Provide a mapping from test questions to Google Form structure:

```
Section 1: Warm-Up (3 questions)
  Q1: Multiple choice [Point value: 1]
  Q2: Multiple choice [Point value: 1]
  Q3: Short answer [Point value: 1]

Section 2: Core (5 questions)
  Q4-Q8: Mixed types [Point values: 2 each]

Section 3: Challenge (2 questions)
  Q9-Q10: Multiple choice [Point values: 3 each]

Answer Key:
  Q1: A | Q2: C | Q3: 42 | Q4: B | Q5: D | ...
```

### Printable Version
Clean layout without interactive elements. Use LaTeX exam class or a printer-friendly HTML with `@media print` styles.

### Answer Key
Complete solutions with explanations. Include grading rubric.

## Profile-Specific Generation Examples

**Beginner profile**: "Solve $x + 3 = 7$" with visual number line.
**Advanced profile**: "Prove that the sum of two even integers is even."
**Visual learner**: Include graph of $y = mx + b$ with draggable sliders.
**Struggling**: "What is $2 + 3$?" with counters/arrays diagram. Extra practice on same concept.
**Gifted**: "Find all integer solutions to $x^2 + y^2 = 25$. Generalize your approach."

## User Prompt Examples

- "Create an interactive algebra test for intermediate students"
- "Build a beginner-level geometry quiz with hints and diagrams"
- "Make an adaptive calculus test that adjusts difficulty"
- "Generate a printable test with answer key on quadratic functions"
- "Create a Google Form structure for a statistics quiz"
- "Build a visual-learner test on graphing linear equations"
