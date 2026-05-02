/* ============================================================
   app.js — SPA Router & View Orchestration
   HGUGM Surgical Residency Course
   ============================================================ */

'use strict';

/* ── Curriculum Manifest ────────────────────────────────────── */
const CURRICULUM = [
  {
    block: 'A', blockName: 'Surgical Oncology', icon: '🔴',
    chapters: [
      { id: 'A1', title: 'Principles of Surgical Oncology', level: 'PGY1-2', readingTime: 40 },
      { id: 'A2', title: 'Colorectal Cancer', level: 'PGY2-3', readingTime: 45 },
      { id: 'A3', title: 'Gastric Cancer', level: 'PGY2-3', readingTime: 38 },
      { id: 'A4', title: 'Hepatopancreatic-Biliary Surgery', level: 'PGY3-4', readingTime: 50 },
      { id: 'A5', title: 'Breast Surgery & Melanoma', level: 'PGY2-3', readingTime: 95 },
      { id: 'A6', title: 'Sarcoma & Peritoneal Oncology', level: 'PGY3-4', readingTime: 42 },
      { id: 'A7', title: 'Endocrine Surgery & NETs', level: 'PGY2-4', readingTime: 110 },
    ]
  },
  {
    block: 'B', blockName: 'General Surgery — Emergencies & Wall', icon: '🔵',
    chapters: [
      { id: 'B1', title: 'Emergency Surgery', level: 'PGY1-2', readingTime: 45 },
      { id: 'B2', title: 'Hernia Surgery', level: 'PGY1-2', readingTime: 30 },
      { id: 'B3', title: 'Bariatric & Metabolic Surgery', level: 'PGY2-3', readingTime: 38 },
    ]
  },
  {
    block: 'D', blockName: 'Benign Digestive Surgery', icon: '🟠',
    chapters: [
      { id: 'D1', title: 'Biliary Surgery — Cholecystitis & Choledocholithiasis', level: 'PGY1-2', readingTime: 40 },
      { id: 'D2', title: 'Acute Diverticulitis & Colonic Benign Disease', level: 'PGY1-2', readingTime: 35 },
      { id: 'D3', title: 'Inflammatory Bowel Disease — Crohn\'s & Ulcerative Colitis', level: 'PGY2-3', readingTime: 45 },
      { id: 'D4', title: 'Proctology — Haemorrhoids, Fissures, Fistulae & Pilonidal', level: 'PGY1-2', readingTime: 35 },
      { id: 'D5', title: 'Pelvic Floor & Functional Colorectal Disorders', level: 'PGY2-3', readingTime: 35 },
      { id: 'D6', title: 'Oesophageal & Benign Gastric Disease', level: 'PGY2-3', readingTime: 40 },
      { id: 'D7', title: 'Small Bowel, Mesentery & Nutritional Access', level: 'PGY1-2', readingTime: 30 },
    ]
  },
  {
    block: 'E', blockName: 'Transplantation & Vascular', icon: '🟣',
    chapters: [
      { id: 'E1', title: 'Liver Transplantation', level: 'PGY4-5', readingTime: 45 },
      { id: 'E2', title: 'Renal & Multivisceral Transplantation', level: 'PGY4-5', readingTime: 35 },
      { id: 'E3', title: 'Vascular Surgery for General Surgeons', level: 'PGY2-3', readingTime: 40 },
    ]
  },
  {
    block: 'F', blockName: 'Trauma, Infections & Thoracic', icon: '⚫',
    chapters: [
      { id: 'F1', title: 'Abdominal & Thoracic Trauma', level: 'PGY1-3', readingTime: 45 },
      { id: 'F2', title: 'Surgical Infections, Sepsis & Necrotising Fasciitis', level: 'PGY1-2', readingTime: 35 },
      { id: 'F3', title: 'Thoracic Surgery for General Surgeons', level: 'PGY2-3', readingTime: 35 },
      { id: 'F4', title: 'Paediatric Surgery for General Surgeons', level: 'PGY2-3', readingTime: 35 },
    ]
  },
  {
    block: 'G', blockName: 'Perioperative & Minimally Invasive', icon: '🩵',
    chapters: [
      { id: 'G1', title: 'Perioperative Care, Anaesthesia & ERAS', level: 'PGY1-2', readingTime: 38 },
      { id: 'G2', title: 'Surgical Nutrition & Metabolism', level: 'PGY1-2', readingTime: 30 },
      { id: 'G3', title: 'Minimally Invasive Surgery — Laparoscopy & Robotics', level: 'PGY1-3', readingTime: 38 },
    ]
  },
  {
    block: 'C', blockName: 'Academic Surgery', icon: '🟢',
    chapters: [
      { id: 'C1', title: 'Hypothesis Generation & Research Question', level: 'PGY1+', readingTime: 28 },
      { id: 'C2', title: 'Study Design', level: 'PGY1+', readingTime: 35 },
      { id: 'C3', title: 'Biostatistics for Surgeons', level: 'PGY2+', readingTime: 40 },
      { id: 'C4', title: 'Clinical Databases & Registry Research', level: 'PGY2+', readingTime: 30 },
      { id: 'C5', title: 'Scientific Writing', level: 'PGY1+', readingTime: 35 },
      { id: 'C6', title: 'Peer Review & Journal Process', level: 'PGY2+', readingTime: 25 },
      { id: 'C7', title: 'Systematic Review & Meta-Analysis', level: 'PGY3+', readingTime: 42 },
      { id: 'C8', title: 'Critical Appraisal', level: 'PGY2+', readingTime: 30 },
    ]
  }
];

/* ── Chapter total for progress ─────────────────────────────── */
const ALL_CHAPTERS = CURRICULUM.flatMap(b => b.chapters);

/* ── Chapter filename map (shared) ─────────────────────────── */
const CHAPTER_FILES = {
  A1: 'a1_oncology_principles', A2: 'a2_colorectal', A3: 'a3_gastric',
  A4: 'a4_hpb', A5: 'a5_breast', A6: 'a6_sarcoma_peritoneal', A7: 'a7_endocrine',
  B1: 'b1_emergency_surgery', B2: 'b2_hernia', B3: 'b3_bariatric',
  D1: 'd1_biliary', D2: 'd2_diverticulitis', D3: 'd3_ibd',
  D4: 'd4_proctology', D5: 'd5_pelvic_floor', D6: 'd6_oesophageal_benign', D7: 'd7_small_bowel',
  E1: 'e1_liver_transplant', E2: 'e2_renal_transplant', E3: 'e3_vascular',
  F1: 'f1_trauma', F2: 'f2_infections', F3: 'f3_thoracic', F4: 'f4_paediatric',
  G1: 'g1_perioperative', G2: 'g2_nutrition', G3: 'g3_mis',
  C1: 'c1_hypothesis', C2: 'c2_study_design', C3: 'c3_biostatistics',
  C4: 'c4_databases', C5: 'c5_scientific_writing', C6: 'c6_peer_review',
  C7: 'c7_systematic_review', C8: 'c8_critical_appraisal',
};

/* ── i18n shortcut — safe fallback if i18n not loaded ──────── */
function t(key, vars = {}) {
  if (typeof I18N !== 'undefined' && I18N.t) return I18N.t(key, vars);
  // Minimal English fallbacks for the most common keys
  const fallbacks = {
    'home.continue_reading': 'Continue Reading', 'home.get_started': 'Get Started',
    'home.browse_chapters': 'Browse all chapters', 'home.todays_pearl': "Today's Pearl",
    'home.curriculum_blocks': 'Curriculum Blocks', 'home.overall_progress': 'Your overall progress — {{pct}}% complete',
    'home.sections_read': '{{done}} of {{total}} sections read', 'home.due_review': '{{n}} question{{s}} due for review',
    'home.review_now': 'Review now →', 'home.recent_quiz': 'Recent Quiz Activity',
    'progress.title': 'My Progress', 'progress.chapters_complete': 'Chapters Complete',
    'progress.sections_read': 'Sections Read', 'progress.quiz_avg': 'Quiz Avg Score',
    'progress.day_streak': 'Day Streak', 'progress.overall': 'Overall course completion',
    'progress.reset': 'Reset Progress', 'progress.reset_confirm': 'Reset all progress? This cannot be undone.',
    'search.title': 'Search', 'search.subtitle': 'Search chapter titles, sections, and clinical pearls',
    'search.placeholder': 'Search topics, trials, procedures…',
    'search.start_hint': 'Search across all chapter content, clinical pearls, and landmark trials',
    'common.back_curriculum': '← Back to Curriculum', 'common.loading': 'Loading…',
    'common.chapter_preparing': 'This chapter content is being prepared. Check back soon.',
    'common.browse_other': 'Browse Other Chapters',
    'review.title': 'Review Session', 'review.caught_up': 'All caught up!',
    'review.caught_up_msg': 'No review questions due. Keep reading to build your review queue.',
    'review.back_home': 'Back to Home', 'review.exit': '← Exit',
    'review.of': '{{n}} of {{total}}', 'review.next': 'Next →',
    'review.see_results': 'See Results', 'review.correct_answer': '✅ Correct',
    'review.wrong_answer': '❌ Incorrect', 'review.why_correct': 'Why this is correct:',
    'review.done_title': 'Review Complete!', 'review.done_score': '{{correct}} of {{total}} correct',
    'review.study_chapters': 'Study chapters', 'review.back_home2': '← Back to Home',
  };
  let str = fallbacks[key] || key;
  Object.entries(vars).forEach(([k, v]) => { str = str.replaceAll(`{{${k}}}`, v); });
  return str;
}

/* ── Router ─────────────────────────────────────────────────── */
const Router = {
  currentRoute: null,

  init() {
    window.addEventListener('hashchange', () => this.resolve());
    this.resolve();
  },

  resolve() {
    const hash = window.location.hash.replace('#', '') || '/';
    const parts = hash.split('/').filter(Boolean);
    const route = parts[0] || '';
    const param = parts[1] || '';
    const sectionTarget = parts[2]; // deep link: #/chapter/A1/3

    this.currentRoute = route;
    this.updateNav(route);
    document.getElementById('readingProgressBar').style.display = 'none';

    if (route === 'chapter' && param) {
      renderChapterView(param.toUpperCase(), sectionTarget);
      document.title = `Loading… | HGUGM Surgical Course`;
    } else if (route === 'curriculum') {
      renderCurriculumView();
      document.title = 'Curriculum | HGUGM Surgical Course';
    } else if (route === 'search') {
      renderSearchView();
      document.title = 'Search | HGUGM Surgical Course';
    } else if (route === 'progress') {
      renderProgressView();
      document.title = 'My Progress | HGUGM Surgical Course';
    } else if (route === 'about') {
      renderAboutView();
      document.title = 'About | HGUGM Surgical Course';
    } else if (route === 'abbreviations') {
      renderAbbreviationsView();
      document.title = 'Abbreviations | HGUGM Surgical Course';
    } else if (route === 'review') {
      renderReviewView();
      document.title = 'Review Session | HGUGM Surgical Course';
    } else {
      renderHomeView();
      document.title = 'HGUGM Surgical Residency Course';
    }

    window.scrollTo(0, 0);
  },

  updateNav(route) {
    const navRoute = route === 'chapter' ? 'curriculum' : (route || 'home');
    document.querySelectorAll('[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === navRoute);
    });
    requestAnimationFrame(() => TabIndicator.update());
  }
};

/* ── Mount Helper ───────────────────────────────────────────── */
function mountView(html) {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="view-animate">${html}</div>`;
}

/* ── HOME VIEW ──────────────────────────────────────────────── */
function renderHomeView() {
  const progress = Progress.getProgress();
  const totalSections = getTotalSections();
  const doneSections = Object.values(progress.chapters_read || {})
    .reduce((sum, ch) => sum + (ch.sections_done || []).length, 0);
  const pct = totalSections > 0 ? Math.round((doneSections / totalSections) * 100) : 0;

  const lastRead = getLastRead(progress);
  const continueHref = lastRead
    ? `#/chapter/${lastRead.id}${lastRead.nextSectionIdx > 0 ? '/' + lastRead.nextSectionIdx : ''}`
    : '#/curriculum';
  const continueCard = lastRead
    ? `<a href="${continueHref}" class="continue-card">
        <div>
          <div class="continue-label">${t('home.continue_reading')}</div>
          <div class="continue-title">${lastRead.id} · ${lastRead.title}</div>
          <div class="continue-progress">Section ${lastRead.nextSectionIdx + 1} of chapter</div>
        </div>
        <div class="continue-arrow">→</div>
      </a>`
    : `<a href="#/curriculum" class="continue-card">
        <div>
          <div class="continue-label">${t('home.get_started')}</div>
          <div class="continue-title">${t('home.browse_chapters')}</div>
          <div class="continue-progress">${ALL_CHAPTERS.length} chapters · ${totalSections} sections</div>
        </div>
        <div class="continue-arrow">→</div>
      </a>`;

  const blocksHtml = CURRICULUM.map(block => {
    const chapterItems = block.chapters.map(ch =>
      `<a href="#/chapter/${ch.id}" class="home-chapter-link">
        <span class="home-chapter-id">${ch.id}</span>
        <span class="home-chapter-title">${ch.title}</span>
        <span class="home-chapter-time">${ch.readingTime}m</span>
      </a>`
    ).join('');
    return `
      <div class="home-block-card" id="hblock-${block.block}">
        <div class="home-block-header" onclick="toggleHomeBlock('${block.block}')">
          <span class="block-icon">${block.icon}</span>
          <span class="block-name">${block.blockName}</span>
          <span class="block-chapters">${block.chapters.length} ch</span>
          <span class="block-expand-arrow">›</span>
        </div>
        <div class="home-block-chapters" id="hblock-list-${block.block}">
          ${chapterItems}
        </div>
      </div>`;
  }).join('');

  // Spaced repetition: due reviews banner
  const dueCount = Progress.getDueCount ? Progress.getDueCount() : 0;
  const dueHtml  = dueCount > 0
    ? `<a href="#/review" class="due-reviews-banner">
        <span class="due-reviews-icon">🔁</span>
        <span><strong>${dueCount}</strong> ${t('home.due_review', { n: dueCount, s: dueCount > 1 ? 's' : '' })}</span>
        <span class="due-reviews-arrow">${t('home.review_now')}</span>
      </a>`
    : '';

  const pearl = Knowledge.getRandomPearl();
  const pearlHtml = pearl
    ? `<div class="pearl-widget">
        <div class="pearl-tag">🔑 ${t('home.todays_pearl')}</div>
        <div class="pearl-text">${pearl.text}</div>
        <div class="pearl-source">← ${pearl.source}</div>
      </div>`
    : '';

  const streakHtml = (progress.streak && progress.streak.current > 0)
    ? `<div style="text-align:right; font-size:0.85rem; color:var(--gold);">🔥 ${progress.streak.current}-day streak</div>`
    : '';

  mountView(`
    <div class="hero-section">
      <div class="hero-title">HGUGM Surgical Residency Course</div>
      <div class="hero-subtitle">Dr. Pablo Lozano Lominchar, MD, PhD, EBPSM</div>
      <div class="hero-institution">Surgical Oncology | HGUGM · Complutense University of Madrid</div>
    </div>

    <div class="container" style="padding-top:24px; padding-bottom:40px;">
      ${continueCard}
      ${dueHtml}

      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
        <h2 style="font-size:1rem; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.06em;">${t('home.curriculum_blocks')}</h2>
        ${streakHtml}
      </div>

      <div class="home-blocks-list">${blocksHtml}</div>

      ${pearlHtml}

      <div class="progress-overview">
        <div class="progress-label">${t('home.overall_progress', { pct })}</div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="progress-count">${t('home.sections_read', { done: doneSections, total: totalSections })}</div>
      </div>

      ${renderRecentActivity(progress)}
    </div>

    ${renderFooter()}
  `);
}

function getLastRead(progress) {
  const chapters = progress.chapters_read || {};
  let latest = null;
  let latestDate = null;
  for (const [id, data] of Object.entries(chapters)) {
    if (data.last_date && (!latestDate || data.last_date > latestDate)) {
      latestDate = data.last_date;
      const chapterInfo = ALL_CHAPTERS.find(c => c.id === id);
      if (chapterInfo) {
        const doneCount = (data.sections_done || []).length;
        latest = {
          id,
          title: chapterInfo.title,
          nextSectionIdx: doneCount
        };
      }
    }
  }
  return latest;
}

function toggleHomeBlock(block) {
  const card = document.getElementById(`hblock-${block}`);
  card?.classList.toggle('expanded');
}

function getTotalSections() {
  return 245; // sum of all sections across 35 chapters
}

function renderRecentActivity(progress) {
  const scores = progress.quiz_scores || {};
  const entries = Object.entries(scores).slice(0, 3);
  if (!entries.length) return '';

  const items = entries.map(([id, data]) => {
    const ch = ALL_CHAPTERS.find(c => c.id === id);
    return `<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--border); font-size:0.88rem;">
      <span>${ch ? ch.title : id}</span>
      <span style="color:var(--teal); font-weight:600;">${data.score}/${data.total} quiz</span>
    </div>`;
  }).join('');

  return `<div style="margin-top:20px;">
    <h3 style="font-size:0.8rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); margin-bottom:10px;">Recent Quiz Activity</h3>
    ${items}
  </div>`;
}

/* ── CURRICULUM VIEW ────────────────────────────────────────── */
let _activeBlockFilter = null;

function filterBlock(block) {
  _activeBlockFilter = block;
}

function renderCurriculumView() {
  const progress = Progress.getProgress();

  const blocksHtml = CURRICULUM.map(block => {
    const chaptersHtml = block.chapters.map(ch => {
      const chProg = (progress.chapters_read || {})[ch.id];
      const completed = chProg && chProg.completed;
      const sectDone = chProg ? (chProg.sections_done || []).length : 0;
      const quizData = (progress.quiz_scores || {})[ch.id];
      const quizBadge = quizData
        ? `<span style="font-size:0.75rem; color:var(--teal);">Quiz: ${quizData.score}/${quizData.total}</span>`
        : '';

      return `<a href="#/chapter/${ch.id}" class="chapter-list-item">
        <div class="chapter-id-badge">${ch.id}</div>
        <div class="chapter-list-info">
          <div class="chapter-list-title">${ch.title}</div>
          <div class="chapter-list-meta">${ch.level} · ${ch.readingTime} min read${sectDone > 0 ? ` · ${sectDone} sections read` : ''}</div>
          ${quizBadge}
        </div>
        <div class="chapter-list-status">${completed ? '✅' : (sectDone > 0 ? '📖' : '○')}</div>
      </a>`;
    }).join('');

    return `<div class="curriculum-block">
      <div class="curriculum-block-header">
        <span class="curriculum-block-icon">${block.icon}</span>
        <span class="curriculum-block-title">Block ${block.block}: ${block.blockName}</span>
        <span class="curriculum-block-count">${block.chapters.length} chapters</span>
      </div>
      ${chaptersHtml}
    </div>`;
  }).join('');

  mountView(`
    <div class="container" style="padding-top:32px; padding-bottom:40px;">
      <div class="page-header">
        <h1 style="font-size:1.8rem; color:var(--navy);">Curriculum</h1>
        <p class="text-muted" style="margin-top:6px;">35 chapters across 7 blocks — full general surgery residency curriculum</p>
      </div>
      ${blocksHtml}
    </div>
    ${renderFooter()}
  `);
}

/* ── CHAPTER VIEW ───────────────────────────────────────────── */
async function renderChapterView(chapterId, sectionTarget) {
  mountView(`
    <div class="reader-layout">
      <aside class="reader-toc" aria-hidden="true">
        <div class="toc-title"><span class="skeleton skeleton-badge"></span></div>
        <div style="padding:8px 20px; display:flex; flex-direction:column; gap:10px;">
          ${Array(6).fill('<span class="skeleton skeleton-text"></span>').join('')}
        </div>
      </aside>
      <div class="reader-main">
        <div class="reading-container">
          <div class="skeleton-chapter-header">
            <span class="skeleton skeleton-badge" style="width:100px; margin-bottom:12px;"></span>
            <span class="skeleton skeleton-title"></span>
            <span class="skeleton skeleton-text w-3/4"></span>
            <span class="skeleton skeleton-text w-1/2" style="margin-top:8px;"></span>
          </div>
          ${Array(4).fill('<span class="skeleton skeleton-card"></span>').join('')}
        </div>
      </div>
    </div>
  `);

  try {
    const filename = CHAPTER_FILES[chapterId.toUpperCase()];
    if (!filename) throw new Error(`Unknown chapter: ${chapterId}`);
    const res = await fetch(`content/chapters/${filename}.json`);
    if (!res.ok) throw new Error(`Chapter ${chapterId} not found`);
    const chapter = await res.json();

    document.title = `${chapter.title} | HGUGM Surgical Course`;
    document.getElementById('readingProgressBar').style.display = 'block';

    const html = Reader.renderChapter(chapter);
    mountView(html);

    Reader.initScrollTracking(chapter);
    Reader.buildTOC(chapter);
    Quiz.initChapterQuiz(chapter);
    Progress.trackChapterOpen(chapterId);

    if (sectionTarget !== undefined) {
      const idx = parseInt(sectionTarget);
      if (!isNaN(idx)) {
        setTimeout(() => {
          const el = document.getElementById(`section-${idx}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    }

  } catch (err) {
    const chInfo = ALL_CHAPTERS.find(c => c.id === chapterId);
    mountView(`
      <div class="container" style="padding-top:40px;">
        <a href="#/curriculum" class="btn btn-ghost" style="margin-bottom:20px;">${t('common.back_curriculum')}</a>
        <div class="card">
          <div class="card-body">
            <div style="text-align:center; padding:40px 20px;">
              <div style="font-size:3rem; margin-bottom:16px;">📖</div>
              <h2 style="color:var(--navy); margin-bottom:8px;">${chInfo ? chInfo.title : chapterId}</h2>
              <p class="text-muted">${t('common.chapter_preparing')}</p>
              <div style="margin-top:24px;">
                <a href="#/curriculum" class="btn btn-primary">${t('common.browse_other')}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);
  }
}

/* ── SEARCH VIEW ────────────────────────────────────────────── */
function renderSearchView() {
  mountView(`
    <div class="container" style="padding-top:32px; padding-bottom:40px;">
      <div class="page-header">
        <h1 style="font-size:1.8rem; color:var(--navy);">${t('search.title')}</h1>
        <p class="text-muted" style="margin-top:6px;">${t('search.subtitle')}</p>
      </div>

      <div class="search-input-wrapper">
        <input type="search" class="search-input" id="searchInput"
          placeholder="${t('search.placeholder')}"
          autocomplete="off" autocorrect="off" spellcheck="false"
          aria-label="Search course content" />
        <span class="search-icon" aria-hidden="true">🔍</span>
      </div>

      <div id="searchResults">
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>${t('search.start_typing') || 'Start typing to search'}</h3>
          <p>${t('search.start_hint')}</p>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `);

  SearchEngine.initView();
}

/* ── PROGRESS VIEW ──────────────────────────────────────────── */
function renderProgressView() {
  const progress = Progress.getProgress();
  const chRead = progress.chapters_read || {};
  const quizScores = progress.quiz_scores || {};
  const streak = progress.streak || { current: 0 };
  const totalTime = progress.total_time_min || 0;

  const completedCount = Object.values(chRead).filter(c => c.completed).length;
  const totalSections = getTotalSections();
  const doneSections = Object.values(chRead).reduce((s, c) => s + (c.sections_done || []).length, 0);
  const quizAvg = Object.values(quizScores).length > 0
    ? Math.round(Object.values(quizScores).reduce((s, q) => s + (q.score / q.total * 100), 0) / Object.values(quizScores).length)
    : 0;

  const chaptersDetailHtml = ALL_CHAPTERS.map(ch => {
    const d = chRead[ch.id];
    const q = quizScores[ch.id];
    const sectDone = d ? (d.sections_done || []).length : 0;
    const pct = Math.round(sectDone / 7 * 100); // avg 7 sections per chapter

    return `<div style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; font-size:0.88rem;">
        <span style="font-weight:600;">${ch.id} · ${ch.title}</span>
        <div style="display:flex; gap:12px; align-items:center; flex-shrink:0; margin-left:12px;">
          ${q ? `<span style="color:var(--teal); font-size:0.8rem;">Quiz: ${q.score}/${q.total}</span>` : ''}
          <span style="color:var(--muted); font-size:0.8rem;">${sectDone} sections</span>
          ${d && d.completed ? '<span class="completion-badge">✓ Done</span>' : ''}
        </div>
      </div>
      <div class="progress-bar-track" style="height:6px;">
        <div class="progress-bar-fill" style="width:${Math.min(pct,100)}%"></div>
      </div>
    </div>`;
  }).join('');

  mountView(`
    <div class="container" style="padding-top:32px; padding-bottom:40px;">
      <div class="page-header">
        <h1 style="font-size:1.8rem; color:var(--navy);">${t('progress.title')}</h1>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${completedCount}</div>
          <div class="stat-label">${t('progress.chapters_complete')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${doneSections}</div>
          <div class="stat-label">${t('progress.sections_read')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${quizAvg > 0 ? quizAvg + '%' : '—'}</div>
          <div class="stat-label">${t('progress.quiz_avg')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${streak.current > 0 ? streak.current + '🔥' : '0'}</div>
          <div class="stat-label">${t('progress.day_streak')}</div>
        </div>
      </div>

      <div class="progress-overview" style="margin-bottom:28px;">
        <div class="progress-label">${t('progress.overall')}</div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${Math.round(doneSections/totalSections*100)}%"></div>
        </div>
        <div class="progress-count">${doneSections} of ${totalSections} sections · ${totalTime} min total study time</div>
      </div>

      <h2 style="font-size:1rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); margin-bottom:16px;">Chapter-by-Chapter</h2>
      ${chaptersDetailHtml}

      <div style="margin-top:32px; text-align:center;">
        <button class="btn btn-ghost btn-sm" onclick="if(confirm(t('progress.reset_confirm'))){Progress.reset(); Router.resolve();}">
          ${t('progress.reset')}
        </button>
      </div>
    </div>
    ${renderFooter()}
  `);
}

/* ── ABOUT VIEW ─────────────────────────────────────────────── */
function renderAboutView() {
  mountView(`
    <div class="container" style="padding-top:32px; padding-bottom:40px; max-width:780px;">
      <div class="about-hero">
        <div class="about-name">Dr. Pablo Lozano Lominchar</div>
        <div class="about-degrees">MD, PhD, EBPSM (European Board of Peritoneal Surface Malignancy)</div>
        <div class="about-institution">Consultant Surgeon – Surgical Oncology<br>Hospital General Universitario Gregorio Marañón (HGUGM)<br>Associate Professor, Complutense University of Madrid</div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-body">
          <h2 style="font-size:1.1rem; color:var(--navy); margin-bottom:12px;">About This Course</h2>
          <div class="reading-text">
            <p>This platform is the digital equivalent of having Schwartz, Skandalakis, Chassin, and Shackelford open simultaneously — structured for modern surgical residents at HGUGM.</p>
            <p>Content is written at postgraduate medical level, referencing specific guideline versions (NCCN 2025–2026, ESMO 2024, WSES 2025, EASL 2024, EHS 2023) and landmark trials by name and year.</p>
            <p>The learning architecture respects the fundamental order of surgical education: <strong>Theory → Synthesis → Application → Consolidation</strong>. You come here to study, not to be tested. Questions exist only to reinforce reading.</p>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-body">
          <h2 style="font-size:1.1rem; color:var(--navy); margin-bottom:12px;">Curriculum</h2>
          <div style="display:flex; flex-direction:column; gap:10px; font-size:0.9rem;">
            <div><strong>Block A — Surgical Oncology</strong> (6 chapters): Oncology principles, colorectal, gastric, HPB, breast, sarcoma & peritoneal</div>
            <div><strong>Block B — General Surgery</strong> (4 chapters): Emergency, hernia, bariatric, endocrine</div>
            <div><strong>Block C — Academic Surgery</strong> (8 chapters): Research methodology, biostatistics, scientific writing, critical appraisal</div>
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div class="card-body">
          <h2 style="font-size:1.1rem; color:var(--navy); margin-bottom:12px;">Technical Notes</h2>
          <div class="reading-text" style="font-size:0.9rem;">
            <p>This platform runs 100% from GitHub Pages — no server, no login, no cost. It works offline after first load (PWA). All progress is stored locally in your browser.</p>
            <p>Guidelines: NCCN 2025–2026 · ESMO 2024 · WSES 2025 · EASL 2024 · EHS 2023 · JGCA 5th Edition · AJCC 8th Edition</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body">
          <h2 style="font-size:1.1rem; color:var(--navy); margin-bottom:12px;">Contact & Attribution</h2>
          <div style="font-size:0.9rem; line-height:1.8; color:var(--muted);">
            <div>📧 lozanon57@hotmail.com</div>
            <div>🔬 ORCID: 0000-0002-5413-8449</div>
            <div>🏥 Hospital General Universitario Gregorio Marañón, Madrid</div>
            <div style="margin-top:12px; font-size:0.82rem;">For educational use within HGUGM Surgical Residency Programme. Content updated to NCCN 2025–2026 · ESMO 2024 · WSES 2025 · EASL 2024.</div>
            <div style="margin-top:8px; font-size:0.82rem;">License: CC BY-NC 4.0</div>
          </div>
        </div>
      </div>
    </div>
    ${renderFooter()}
  `);
}

/* ── ABBREVIATIONS VIEW ─────────────────────────────────────── */
function renderAbbreviationsView() {
  if (typeof ABBREVIATIONS === 'undefined') {
    mountView(`<div class="container" style="padding-top:40px;"><p class="text-muted">Abbreviations dictionary not loaded.</p></div>`);
    return;
  }

  const entries = Object.entries(ABBREVIATIONS).sort(([a], [b]) => a.localeCompare(b));

  const listHtml = entries.map(([abbr, def]) =>
    `<div class="abbr-entry" data-abbr="${abbr.toLowerCase()}">
      <span class="abbr-term">${abbr}</span>
      <span class="abbr-def">${def}</span>
    </div>`
  ).join('');

  mountView(`
    <div class="container" style="padding-top:32px; padding-bottom:40px; max-width:860px;">
      <div class="page-header">
        <a href="#/" class="btn btn-ghost btn-sm" style="margin-bottom:16px;">← Back</a>
        <h1 style="font-size:1.8rem; color:var(--navy);">📖 Abbreviations Glossary</h1>
        <p class="text-muted" style="margin-top:6px;">${entries.length} abbreviations — hover or tap any highlighted term in chapters to see its definition</p>
      </div>

      <div class="abbr-search-wrap">
        <input type="search" class="search-input" id="abbrSearch"
          placeholder="Filter abbreviations…"
          oninput="filterAbbreviations(this.value)"
          autocomplete="off" />
        <span class="search-icon" aria-hidden="true">🔍</span>
      </div>

      <div class="abbr-list" id="abbrList">
        ${listHtml}
      </div>
    </div>
    ${renderFooter()}
  `);
}

function filterAbbreviations(query) {
  const q = (query || '').toLowerCase().trim();
  document.querySelectorAll('.abbr-entry').forEach(el => {
    const term = el.dataset.abbr || '';
    const def  = el.querySelector('.abbr-def')?.textContent.toLowerCase() || '';
    el.style.display = (!q || term.includes(q) || def.includes(q)) ? '' : 'none';
  });
  // Show empty state if none visible
  const visible = document.querySelectorAll('.abbr-entry:not([style*="none"])').length;
  let noResults = document.getElementById('abbrNoResults');
  if (!visible) {
    if (!noResults) {
      noResults = document.createElement('p');
      noResults.id = 'abbrNoResults';
      noResults.className = 'text-muted';
      noResults.style.padding = '20px 0';
      noResults.style.textAlign = 'center';
      document.getElementById('abbrList').appendChild(noResults);
    }
    noResults.textContent = `No abbreviations match "${query}"`;
  } else if (noResults) {
    noResults.remove();
  }
}

/* ── REVIEW SESSION (Spaced Repetition) ─────────────────────── */

let _reviewState = null;

function _shuffleReviewOptions(question) {
  const entries = Object.entries(question.options || {});
  for (let i = entries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [entries[i], entries[j]] = [entries[j], entries[i]];
  }
  const newKeys = ['A', 'B', 'C', 'D'];
  const keyMap = {};
  const shuffledOptions = {};
  entries.forEach(([oldKey, text], idx) => {
    const nk = newKeys[idx];
    keyMap[oldKey] = nk;
    shuffledOptions[nk] = text;
  });
  const newCorrect = keyMap[question.correct] || question.correct;
  const oldWrong = (question.explanation && question.explanation.wrong) || {};
  const newWrong = {};
  Object.entries(oldWrong).forEach(([k, v]) => {
    const mapped = keyMap[k];
    if (mapped) newWrong[mapped] = v;
  });
  return { ...question, options: shuffledOptions, correct: newCorrect,
           explanation: { ...question.explanation, wrong: newWrong } };
}

async function renderReviewView() {
  const due = Progress.getDueReviews ? Progress.getDueReviews() : [];

  if (!due.length) {
    mountView(`
      <div class="container" style="padding-top:80px; text-align:center; max-width:520px;">
        <div style="font-size:3.5rem; margin-bottom:16px;">🎉</div>
        <h2 style="color:var(--navy); margin-bottom:8px;">${t('review.caught_up')}</h2>
        <p class="text-muted" style="margin-bottom:24px;">${t('review.caught_up_msg')}</p>
        <a href="#/" class="btn btn-primary">${t('review.back_home')}</a>
      </div>
    `);
    return;
  }

  mountView(`<div class="flex-center" style="min-height:60vh;"><div class="spinner"></div></div>`);

  // Group due questions by chapter ID (parsed from questionId prefix e.g. "A1-Q5" → "A1")
  const byChapter = {};
  for (const review of due) {
    const chId = review.id.replace(/-Q\d+$/, '');
    if (!byChapter[chId]) byChapter[chId] = [];
    byChapter[chId].push(review);
  }

  // Fetch chapters in parallel
  const questionData = [];
  await Promise.all(Object.entries(byChapter).map(async ([chId, reviews]) => {
    const filename = CHAPTER_FILES[chId.toUpperCase()];
    if (!filename) return;
    try {
      const res = await fetch(`content/chapters/${filename}.json`);
      if (!res.ok) return;
      const chapter = await res.json();
      const chQuestions = chapter.consolidation?.questions || [];
      for (const review of reviews) {
        const question = chQuestions.find(q => q.id === review.id);
        if (question) {
          questionData.push({
            ...review,
            question,
            chapterId: chId,
            chapterTitle: chapter.title,
            block: chapter.block_name || ''
          });
        }
      }
    } catch { /* skip unfetchable chapters */ }
  }));

  if (!questionData.length) {
    mountView(`
      <div class="container" style="padding-top:60px; text-align:center;">
        <p class="text-muted">Review questions could not be loaded. Please try again.</p>
        <a href="#/" class="btn btn-primary" style="margin-top:16px;">${t('review.back_home')}</a>
      </div>
    `);
    return;
  }

  // Shuffle question order for variety
  for (let i = questionData.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionData[i], questionData[j]] = [questionData[j], questionData[i]];
  }

  _reviewState = {
    items: questionData,
    idx: 0,
    total: questionData.length,
    correct: 0,
    shuffled: null   // set per question
  };

  _renderReviewQuestion();
}

function _renderReviewQuestion() {
  if (!_reviewState) return;
  const { items, idx, total } = _reviewState;
  const item = items[idx];
  const shuffled = _shuffleReviewOptions(item.question);
  _reviewState.shuffled = shuffled;

  const pct = Math.round((idx / total) * 100);
  const optionsHtml = Object.entries(shuffled.options).map(([key, text]) =>
    `<button class="review-option" data-key="${key}" onclick="window._selectReviewAnswer('${key}')">
      <span class="review-option-key">${key}</span>
      <span class="review-option-text">${text}</span>
    </button>`
  ).join('');

  mountView(`
    <div class="container review-container">
      <div class="review-header">
        <a href="#/" class="btn btn-ghost btn-sm">${t('review.exit')}</a>
        <span class="review-counter">${t('review.of', { n: idx + 1, total })}</span>
      </div>

      <div class="review-progress-bar">
        <div class="review-progress-fill" style="width:${pct}%"></div>
      </div>

      <div class="review-chapter-tag">${item.chapterId} · ${item.chapterTitle}</div>

      <div class="card review-card">
        <div class="card-body">
          <p class="review-stem">${shuffled.stem}</p>
          <div class="review-options" id="reviewOptions">${optionsHtml}</div>
          <div class="review-explanation" id="reviewExpl" style="display:none;"></div>
          <div class="review-next-wrap" id="reviewNextWrap" style="display:none;">
            <button class="btn btn-primary" onclick="window._advanceReview()">
              ${idx + 1 < total ? t('review.next') : t('review.see_results')}
            </button>
          </div>
        </div>
      </div>
    </div>
  `);
}

window._selectReviewAnswer = function(selectedKey) {
  if (!_reviewState || !_reviewState.shuffled) return;
  const { shuffled, items, idx } = _reviewState;
  const isCorrect = selectedKey === shuffled.correct;
  if (isCorrect) _reviewState.correct++;

  // Lock all buttons + highlight
  document.querySelectorAll('.review-option').forEach(btn => {
    btn.disabled = true;
    const key = btn.dataset.key;
    if (key === shuffled.correct) btn.classList.add('correct');
    else if (key === selectedKey) btn.classList.add('wrong');
  });

  // Show explanation
  const expl = shuffled.explanation || {};
  const wrongExpl = (expl.wrong || {})[selectedKey] || '';
  const explHtml = `
    <div class="review-expl-verdict ${isCorrect ? 'expl-correct' : 'expl-wrong'}">
      ${isCorrect ? t('review.correct_answer') : t('review.wrong_answer')}
    </div>
    <div class="review-expl-body">
      <p><strong>${t('review.why_correct')}</strong> ${expl.correct || ''}</p>
      ${!isCorrect && wrongExpl ? `<p style="margin-top:8px; color:var(--text-muted); font-size:0.88rem;">${wrongExpl}</p>` : ''}
      ${expl.pearl ? `<div class="review-expl-pearl">🔑 ${expl.pearl}</div>` : ''}
    </div>
  `;
  const explEl = document.getElementById('reviewExpl');
  if (explEl) { explEl.innerHTML = explHtml; explEl.style.display = 'block'; }
  const nextEl = document.getElementById('reviewNextWrap');
  if (nextEl) nextEl.style.display = 'block';

  // Schedule next review in spaced repetition
  const item = items[idx];
  Progress.scheduleReview(item.id, isCorrect, item.attempts || 0);
};

window._advanceReview = function() {
  if (!_reviewState) return;
  _reviewState.idx++;
  if (_reviewState.idx >= _reviewState.total) {
    _renderReviewComplete();
  } else {
    _renderReviewQuestion();
  }
};

function _renderReviewComplete() {
  if (!_reviewState) return;
  const { correct, total, items } = _reviewState;
  const pct = Math.round((correct / total) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '✅' : '📖';
  const chapterLinks = [...new Set(items.map(i => i.chapterId))].map(id => {
    const ch = ALL_CHAPTERS.find(c => c.id === id);
    return `<a href="#/chapter/${id}" class="btn btn-ghost btn-sm" style="margin:4px;">${id} ${ch ? '· ' + ch.title.slice(0, 28) + '…' : ''}</a>`;
  }).join('');

  mountView(`
    <div class="container" style="padding-top:60px; text-align:center; max-width:560px;">
      <div style="font-size:3rem; margin-bottom:12px;">${emoji}</div>
      <h2 style="color:var(--navy); margin-bottom:6px;">${t('review.done_title')}</h2>
      <div class="review-score-display">
        <span class="review-score-num">${correct}</span>
        <span class="review-score-sep">/</span>
        <span class="review-score-total">${total}</span>
      </div>
      <div class="review-progress-bar" style="margin:16px auto; max-width:280px;">
        <div class="review-progress-fill" style="width:${pct}%;"></div>
      </div>
      <p class="text-muted" style="margin-bottom:24px;">${t('review.done_score', { correct, total })}</p>
      ${chapterLinks.length ? `<div style="margin-bottom:20px;"><p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:8px;">${t('review.study_chapters')}</p>${chapterLinks}</div>` : ''}
      <a href="#/" class="btn btn-primary">${t('review.back_home2')}</a>
    </div>
  `);
  _reviewState = null;
}

/* ── Footer ─────────────────────────────────────────────────── */
function renderFooter() {
  return `<footer class="site-footer">
    <div class="container">
      <div class="footer-name">Dr. Pablo Lozano Lominchar, MD, PhD, EBPSM</div>
      <div>Consultant Surgeon – Surgical Oncology | HGUGM · Complutense University of Madrid</div>
      <div class="footer-links">
        <span>lozanon57@hotmail.com</span>
        <span>ORCID: 0000-0002-5413-8449</span>
        <span>NCCN 2025–2026 · ESMO 2024 · WSES 2025 · EASL 2024</span>
        <a href="#/abbreviations" style="color:inherit;">📖 Abbreviations Glossary</a>
        <span>For educational use within HGUGM Surgical Residency Programme</span>
        <span>CC BY-NC 4.0</span>
      </div>
    </div>
  </footer>`;
}

/* ── Dark Mode ──────────────────────────────────────────────── */
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('surgres_theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else if (saved === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    document.getElementById('themeToggle').addEventListener('click', () => this.toggle());
    this.updateIcon();
  },

  toggle() {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('surgres_theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('surgres_theme', 'dark');
    }
    this.updateIcon();
  },

  isDark() {
    return document.documentElement.classList.contains('dark') ||
      (!document.documentElement.classList.contains('light') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
  },

  updateIcon() {
    document.getElementById('themeToggle').textContent = this.isDark() ? '☀️' : '🌙';
  }
};

/* ── Bottom Tab Pill Indicator ──────────────────────────────── */
const TabIndicator = {
  indicator: null,

  init() {
    this.indicator = document.getElementById('tabIndicator');
    this.update();
    window.addEventListener('hashchange', () => this.update());
  },

  update() {
    if (!this.indicator) return;
    const active = document.querySelector('.bottom-tabs a.active');
    if (!active) return;
    const tabs = document.querySelector('.bottom-tabs');
    const tabRect = tabs.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    this.indicator.style.left = (activeRect.left - tabRect.left) + 'px';
    this.indicator.style.width = activeRect.width + 'px';
  }
};

/* ── Scroll Reveal ──────────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── Service Worker Registration ────────────────────────────── */
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

/* ── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  TabIndicator.init();
  Knowledge.loadPearls();
  SearchEngine.buildIndex(CURRICULUM);
  if (typeof I18N !== 'undefined') I18N.init();
  Router.init();
  registerServiceWorker();

  // Re-render current view when language is toggled
  document.addEventListener('locale-changed', () => {
    Router.resolve();
  });
});
