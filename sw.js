/* ─────────────────────────────────────────────────────────────────────────────
   HGUGM Surgical Residency Course — Service Worker
   Cache-first strategy with network fallback. Offline-capable PWA.
───────────────────────────────────────────────────────────────────────────── */

const CACHE_NAME = 'surgres-v2';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/main.css',
  './assets/js/app.js',
  './assets/js/reader.js',
  './assets/js/quiz.js',
  './assets/js/progress.js',
  './assets/js/search.js',
  './assets/js/knowledge.js',
  './assets/img/logo.svg',
  './assets/img/diagrams/tme_planes.svg',
  './assets/img/diagrams/liver_segments.svg',
  './assets/img/diagrams/research_pyramid.svg',
  './assets/img/diagrams/pico_framework.svg',
  './assets/img/diagrams/tnm_staging_colorectal.svg',
  './assets/img/diagrams/gastric_lymph_nodes.svg',
  './content/pearls/daily_pearls.json',
  // Chapter JSON files
  './content/chapters/a1_oncology_principles.json',
  './content/chapters/a2_colorectal.json',
  './content/chapters/a3_gastric.json',
  './content/chapters/a4_hpb.json',
  './content/chapters/a5_breast.json',
  './content/chapters/a6_sarcoma_peritoneal.json',
  './content/chapters/b1_emergency_surgery.json',
  './content/chapters/b2_hernia.json',
  './content/chapters/b3_bariatric.json',
  './content/chapters/b4_endocrine.json',
  './content/chapters/c1_hypothesis.json',
  './content/chapters/c2_study_design.json',
  './content/chapters/c3_biostatistics.json',
  './content/chapters/c4_databases.json',
  './content/chapters/c5_scientific_writing.json',
  './content/chapters/c6_peer_review.json',
  './content/chapters/c7_systematic_review.json',
  './content/chapters/c8_critical_appraisal.json',
  // Block D — Benign Digestive Surgery
  './content/chapters/d1_biliary.json',
  './content/chapters/d2_diverticulitis.json',
  './content/chapters/d3_ibd.json',
  './content/chapters/d4_proctology.json',
  './content/chapters/d5_pelvic_floor.json',
  './content/chapters/d6_oesophageal_benign.json',
  './content/chapters/d7_small_bowel.json',
  // Block E — Transplantation & Vascular
  './content/chapters/e1_liver_transplant.json',
  './content/chapters/e2_renal_transplant.json',
  './content/chapters/e3_vascular.json',
  // Block F — Trauma, Infections & Thoracic
  './content/chapters/f1_trauma.json',
  './content/chapters/f2_infections.json',
  './content/chapters/f3_thoracic.json',
  './content/chapters/f4_paediatric.json',
  // Block G — Perioperative & Minimally Invasive
  './content/chapters/g1_perioperative.json',
  './content/chapters/g2_nutrition.json',
  './content/chapters/g3_mis.json',
  // CDN libraries are NOT precached (network-only; app handles CDN failure gracefully)
];

/* ── INSTALL: precache all static assets ───────────────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

/* ── ACTIVATE: purge old caches ────────────────────────────────────────── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

/* ── FETCH: cache-first, network fallback ──────────────────────────────── */
self.addEventListener('fetch', event => {
  // Only handle GET requests for same-origin or content assets
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip CDN requests (marked.js, lunr, Chart.js) — let them hit the network
  if (!url.origin.startsWith(self.location.origin.split(':').slice(0,2).join(':')) &&
      !url.pathname.startsWith('/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;

        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type === 'opaque') {
              return response;
            }
            const toCache = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
            return response;
          })
          .catch(() => {
            // Offline fallback for navigation requests → serve index.html (SPA)
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});
