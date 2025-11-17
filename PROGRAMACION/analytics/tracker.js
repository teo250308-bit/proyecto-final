(function () {
  if (window.NutrantTracker) return;

  const script = document.currentScript;
  const root = (script && script.dataset && script.dataset.root) ? script.dataset.root : '';
  const buildUrl = (path) => `${root || ''}${path}`;

  async function send(url, payload) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Tracker error', err);
    }
  }

  const tracker = {
    trackVisit(extra = {}) {
      const payload = Object.assign({
        page: window.location.pathname + window.location.search + window.location.hash,
        title: document.title || '',
        referrer: document.referrer || '',
      }, extra);
      send(buildUrl('analytics/track_visit.php'), payload);
    },
  };

  window.NutrantTracker = tracker;
  tracker.trackVisit();
})();
