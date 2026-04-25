/* ============================================================
   progress.js — localStorage Progress Tracker
   HGUGM Surgical Residency Course
   ============================================================ */

'use strict';

const STORAGE_KEY = 'surgres_progress';

const Progress = {

  /* ── Get / Init ──────────────────────────────────────────── */
  getProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : this._defaultProgress();
    } catch {
      return this._defaultProgress();
    }
  },

  _defaultProgress() {
    return {
      chapters_read: {},
      quiz_scores:   {},
      streak:        { current: 0, last_date: null },
      bookmarks:     [],
      total_time_min: 0
    };
  },

  _save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // localStorage unavailable — continue silently
    }
  },

  /* ── Track Chapter Open ──────────────────────────────────── */
  trackChapterOpen(chapterId) {
    const prog = this.getProgress();
    const today = new Date().toISOString().slice(0, 10);

    if (!prog.chapters_read[chapterId]) {
      prog.chapters_read[chapterId] = { sections_done: [], completed: false };
    }

    prog.chapters_read[chapterId].last_date = today;
    this._updateStreak(prog, today);
    this._save(prog);
  },

  /* ── Mark Section Read ───────────────────────────────────── */
  markSectionRead(chapterId, sectionIdx) {
    const prog = this.getProgress();
    const today = new Date().toISOString().slice(0, 10);

    if (!prog.chapters_read[chapterId]) {
      prog.chapters_read[chapterId] = { sections_done: [], completed: false };
    }

    const ch = prog.chapters_read[chapterId];
    if (!ch.sections_done.includes(sectionIdx)) {
      ch.sections_done = [...ch.sections_done, sectionIdx];
      prog.total_time_min = (prog.total_time_min || 0) + 5; // estimate 5 min per section
    }

    ch.last_date = today;
    this._updateStreak(prog, today);
    this._save(prog);
  },

  /* ── Mark Chapter Complete ───────────────────────────────── */
  markChapterComplete(chapterId) {
    const prog = this.getProgress();
    const today = new Date().toISOString().slice(0, 10);

    if (!prog.chapters_read[chapterId]) {
      prog.chapters_read[chapterId] = { sections_done: [], completed: false };
    }

    prog.chapters_read[chapterId].completed = true;
    prog.chapters_read[chapterId].date = today;
    this._save(prog);
  },

  /* ── Save Quiz Score ─────────────────────────────────────── */
  saveQuizScore(chapterId, score, total) {
    const prog = this.getProgress();
    const today = new Date().toISOString().slice(0, 10);
    const existing = prog.quiz_scores[chapterId];

    prog.quiz_scores[chapterId] = {
      score,
      total,
      attempts: ((existing && existing.attempts) || 0) + 1,
      date: today,
      best: existing ? Math.max(existing.best || 0, score) : score
    };

    this._save(prog);
  },

  /* ── Bookmarks ───────────────────────────────────────────── */
  addBookmark(sectionId) {
    const prog = this.getProgress();
    if (!prog.bookmarks.includes(sectionId)) {
      prog.bookmarks = [...prog.bookmarks, sectionId];
      this._save(prog);
    }
  },

  removeBookmark(sectionId) {
    const prog = this.getProgress();
    prog.bookmarks = prog.bookmarks.filter(b => b !== sectionId);
    this._save(prog);
  },

  isBookmarked(sectionId) {
    return this.getProgress().bookmarks.includes(sectionId);
  },

  /* ── Streak ──────────────────────────────────────────────── */
  _updateStreak(prog, today) {
    const streak = prog.streak || { current: 0, last_date: null };
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

    if (streak.last_date === today) return;

    if (streak.last_date === yesterday) {
      streak.current = (streak.current || 0) + 1;
    } else if (streak.last_date !== today) {
      streak.current = 1;
    }

    streak.last_date = today;
    prog.streak = streak;
  },

  getStreak() {
    return this.getProgress().streak || { current: 0 };
  },

  /* ── Reset ───────────────────────────────────────────────── */
  reset() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
