/* ============================================================
   quiz.js — Consolidation Questions (Tutor Mode)
   HGUGM Surgical Residency Course
   ============================================================ */

'use strict';

const Quiz = {

  /* ── Init ────────────────────────────────────────────────── */
  initChapterQuiz(chapter) {
    const mount = document.getElementById('quizMount');
    if (!mount) return;

    const questions = chapter.consolidation && chapter.consolidation.questions;
    if (!questions || !questions.length) {
      mount.innerHTML = `<p class="text-muted" style="text-align:center; padding:20px 0;">No questions available for this chapter yet.</p>`;
      return;
    }

    this._chapter = chapter;
    this._questions = questions;
    this._currentIdx = 0;
    this._results = [];

    this.renderQuestion(mount, 0);
  },

  /* ── Render Question ─────────────────────────────────────── */
  renderQuestion(mount, idx) {
    const q = this._questions[idx];
    const total = this._questions.length;

    const dots = this._questions.map((_, i) => {
      let cls = 'quiz-dot';
      if (i < this._results.length) {
        cls += this._results[i] ? ' correct' : ' wrong';
      } else if (i === idx) {
        cls += ' current';
      }
      return `<div class="${cls}"></div>`;
    }).join('');

    const optionsHtml = Object.entries(q.options || {}).map(([key, val]) =>
      `<button class="option-btn" data-key="${key}" onclick="Quiz.selectAnswer('${key}', this)">
        <span class="option-letter">${key}</span>
        <span>${val}</span>
      </button>`
    ).join('');

    mount.innerHTML = `
      <div class="quiz-container" id="quizContainer">
        <div class="quiz-header">
          <span style="font-size:0.82rem; color:var(--muted); font-weight:600;">Question ${idx + 1} of ${total}</span>
          <div class="quiz-progress-dots">${dots}</div>
        </div>

        <div class="question-stem">${q.stem}</div>

        <div class="options-list" id="optionsList">
          ${optionsHtml}
        </div>

        <div class="explanation-panel" id="explanationPanel">
          <div class="explanation-section">
            <div class="explanation-label">✅ Correct Answer: ${q.correct}</div>
            <div class="explanation-text">${q.explanation ? this._parseInline(q.explanation.correct || '') : ''}</div>
          </div>

          ${this._renderWrongExplanations(q)}

          ${q.explanation && q.explanation.guideline ? `
            <div class="explanation-section">
              <div class="explanation-label">📋 Guideline Reference</div>
              <div class="explanation-text">${q.explanation.guideline}</div>
            </div>` : ''}

          ${q.explanation && q.explanation.trial ? `
            <div class="explanation-section">
              <div class="explanation-label">🔬 Landmark Trial</div>
              <div class="explanation-text">${q.explanation.trial}</div>
            </div>` : ''}

          ${q.explanation && q.explanation.pearl ? `
            <div class="explanation-section">
              <div class="explanation-label">🔑 Clinical Pearl</div>
              <div class="explanation-text">${q.explanation.pearl}</div>
            </div>` : ''}

          <div style="margin-top:20px; text-align:right;">
            ${idx < this._questions.length - 1
              ? `<button class="btn btn-primary" onclick="Quiz.nextQuestion()">Next Question →</button>`
              : `<button class="btn btn-teal" onclick="Quiz.showSummary()">See Results</button>`}
          </div>
        </div>
      </div>
    `;
  },

  /* ── Select Answer ───────────────────────────────────────── */
  selectAnswer(key, btn) {
    const q = this._questions[this._currentIdx];
    const correct = q.correct;
    const isCorrect = key === correct;

    document.querySelectorAll('.option-btn').forEach(b => {
      b.disabled = true;
      if (b.dataset.key === correct) b.classList.add('correct');
      else if (b.dataset.key === key && !isCorrect) b.classList.add('wrong');
    });

    this._results.push(isCorrect);

    const panel = document.getElementById('explanationPanel');
    if (panel) {
      panel.classList.add('visible');
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  /* ── Next Question ───────────────────────────────────────── */
  nextQuestion() {
    this._currentIdx++;
    const mount = document.getElementById('quizMount');
    if (mount) this.renderQuestion(mount, this._currentIdx);
  },

  /* ── Show Summary ────────────────────────────────────────── */
  showSummary() {
    const score = this._results.filter(Boolean).length;
    const total = this._questions.length;
    const pct = Math.round((score / total) * 100);
    const chapterId = this._chapter.id;

    Progress.saveQuizScore(chapterId, score, total);

    const medal = pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📖';
    const msg = pct >= 80
      ? 'Excellent! You have a strong grasp of this material.'
      : pct >= 60
        ? 'Good effort. Review the explanations for any questions you missed.'
        : 'Consider re-reading the chapter before retrying the quiz.';

    const dots = this._results.map(r =>
      `<div class="quiz-dot ${r ? 'correct' : 'wrong'}"></div>`
    ).join('');

    const mount = document.getElementById('quizMount');
    mount.innerHTML = `
      <div class="quiz-container">
        <div style="text-align:center; padding:32px 20px;">
          <div style="font-size:4rem; margin-bottom:16px;">${medal}</div>
          <h3 style="font-size:1.5rem; color:var(--navy); margin-bottom:8px;">${score} / ${total} Correct</h3>
          <p class="text-muted" style="margin-bottom:20px;">${msg}</p>
          <div class="quiz-progress-dots" style="justify-content:center; margin-bottom:24px;">${dots}</div>
          <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="Quiz.retryQuiz()">Retry Quiz</button>
            <a href="#/curriculum" class="btn btn-primary">Back to Curriculum</a>
          </div>
        </div>
      </div>
    `;
  },

  /* ── Retry ───────────────────────────────────────────────── */
  retryQuiz() {
    this._currentIdx = 0;
    this._results = [];
    const mount = document.getElementById('quizMount');
    if (mount) this.renderQuestion(mount, 0);
  },

  /* ── Wrong Explanations ──────────────────────────────────── */
  _renderWrongExplanations(q) {
    const wrongExp = q.explanation && q.explanation.wrong;
    if (!wrongExp || typeof wrongExp !== 'object') return '';

    const items = Object.entries(wrongExp)
      .filter(([key]) => key !== q.correct)
      .map(([key, text]) =>
        `<div style="margin-bottom:8px;">
          <strong style="color:var(--error);">Option ${key}:</strong>
          <span class="explanation-text"> ${text}</span>
        </div>`
      ).join('');

    return items ? `
      <div class="explanation-section">
        <div class="explanation-label">❌ Why Other Options Are Incorrect</div>
        ${items}
      </div>` : '';
  },

  /* ── Inline Parse ────────────────────────────────────────── */
  _parseInline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');
  }
};
