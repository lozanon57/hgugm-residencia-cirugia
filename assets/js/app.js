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
          <div class="continue-label">Continue Reading</div>
          <div class="continue-title">${lastRead.id} · ${lastRead.title}</div>
          <div class="continue-progress">Section ${lastRead.nextSectionIdx + 1} of chapter</div>
        </div>
        <div class="continue-arrow">→</div>
      </a>`
    : `<a href="#/curriculum" class="continue-card">
        <div>
          <div class="continue-label">Get Started</div>
          <div class="continue-title">Browse all chapters</div>
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
    ? `<a href="#/progress" class="due-reviews-banner">
        <span class="due-reviews-icon">🔁</span>
        <span><strong>${dueCount}</strong> question${dueCount > 1 ? 's' : ''} due for review today</span>
        <span class="due-reviews-arrow">→</span>
      </a>`
    : '';

  const pearl = Knowledge.getRandomPearl();
  const pearlHtml = pearl
    ? `<div class="pearl-widget">
        <div class="pearl-tag">🔑 Today's Pearl</div>
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
        <h2 style="font-size:1rem; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.06em;">Curriculum Blocks</h2>
        ${streakHtml}
      </div>

      <div class="home-blocks-list">${blocksHtml}</div>

      ${pearlHtml}

      <div class="progress-overview">
        <div class="progress-label">Your overall progress — ${pct}% complete</div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${pct}%"></div>
        </div>
        <div class="progress-count">${doneSections} of ${totalSections} sections read</div>
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
    const CHAPTER_FILES = {
      // Block A — Surgical Oncology
      A1: 'a1_oncology_principles', A2: 'a2_colorectal', A3: 'a3_gastric',
      A4: 'a4_hpb', A5: 'a5_breast', A6: 'a6_sarcoma_peritoneal', A7: 'a7_endocrine',
      // Block B — General Surgery
      B1: 'b1_emergency_surgery', B2: 'b2_hernia', B3: 'b3_bariatric',
      // Block D — Benign Digestive Surgery
      D1: 'd1_biliary', D2: 'd2_diverticulitis', D3: 'd3_ibd',
      D4: 'd4_proctology', D5: 'd5_pelvic_floor', D6: 'd6_oesophageal_benign', D7: 'd7_small_bowel',
      // Block E — Transplantation & Vascular
      E1: 'e1_liver_transplant', E2: 'e2_renal_transplant', E3: 'e3_vascular',
      // Block F — Trauma, Infections & Thoracic
      F1: 'f1_trauma', F2: 'f2_infections', F3: 'f3_thoracic', F4: 'f4_paediatric',
      // Block G — Perioperative & MIS
      G1: 'g1_perioperative', G2: 'g2_nutrition', G3: 'g3_mis',
      // Block C — Academic Surgery
      C1: 'c1_hypothesis', C2: 'c2_study_design', C3: 'c3_biostatistics',
      C4: 'c4_databases', C5: 'c5_scientific_writing', C6: 'c6_peer_review',
      C7: 'c7_systematic_review', C8: 'c8_critical_appraisal',
    };
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
        <a href="#/curriculum" class="btn btn-ghost" style="margin-bottom:20px;">← Back to Curriculum</a>
        <div class="card">
          <div class="card-body">
            <div style="text-align:center; padding:40px 20px;">
              <div style="font-size:3rem; margin-bottom:16px;">📖</div>
              <h2 style="color:var(--navy); margin-bottom:8px;">${chInfo ? chInfo.title : chapterId}</h2>
              <p class="text-muted">This chapter content is being prepared. Check back soon.</p>
              <div style="margin-top:24px;">
                <a href="#/curriculum" class="btn btn-primary">Browse Other Chapters</a>
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
        <h1 style="font-size:1.8rem; color:var(--navy);">Search</h1>
        <p class="text-muted" style="margin-top:6px;">Search chapter titles, sections, and clinical pearls</p>
      </div>

      <div class="search-input-wrapper">
        <input type="search" class="search-input" id="searchInput"
          placeholder="Search topics, trials, procedures…"
          autocomplete="off" autocorrect="off" spellcheck="false"
          aria-label="Search course content" />
        <span class="search-icon" aria-hidden="true">🔍</span>
      </div>

      <div id="searchResults">
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Start typing to search</h3>
          <p>Search across all chapter content, clinical pearls, and landmark trials</p>
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
        <h1 style="font-size:1.8rem; color:var(--navy);">My Progress</h1>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${completedCount}</div>
          <div class="stat-label">Chapters Complete</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${doneSections}</div>
          <div class="stat-label">Sections Read</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${quizAvg > 0 ? quizAvg + '%' : '—'}</div>
          <div class="stat-label">Quiz Avg Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${streak.current > 0 ? streak.current + '🔥' : '0'}</div>
          <div class="stat-label">Day Streak</div>
        </div>
      </div>

      <div class="progress-overview" style="margin-bottom:28px;">
        <div class="progress-label">Overall course completion</div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" style="width:${Math.round(doneSections/totalSections*100)}%"></div>
        </div>
        <div class="progress-count">${doneSections} of ${totalSections} sections · ${totalTime} min total study time</div>
      </div>

      <h2 style="font-size:1rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); margin-bottom:16px;">Chapter-by-Chapter</h2>
      ${chaptersDetailHtml}

      <div style="margin-top:32px; text-align:center;">
        <button class="btn btn-ghost btn-sm" onclick="if(confirm('Reset all progress? This cannot be undone.')){Progress.reset(); Router.resolve();}">
          Reset Progress
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
});
