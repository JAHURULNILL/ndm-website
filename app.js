/* NDM website behaviour (The product performs):
   1. Live release feed — version labels, download hrefs and the feed
      hashes refresh from the app's own update feed. The extension
      link and hash stay static: the feed publishes only ext_sha256.
   2. Platform-aware primary buttons (Linux visitors get the .deb first).
   3. The video picker: typed address, example videos, selectable formats.
   4. Reveal on scroll — armed by this script, so content is never
      hidden if the script or the observer fails.
   5. How it runs: the pinned stage crossfades to the active step.
   6. The footer clock: Dhaka local time.
   No dependencies. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FEED_URL = 'https://github.com/JAHURULNILL/ndm/releases/latest/download/release.json';

  /* ---------- reveal ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.rv'));
  if (!reduced && 'IntersectionObserver' in window) {
    revealEls.forEach(function (el, i) {
      el.style.setProperty('--d', ((i % 3) * 80) + 'ms');
      el.classList.add('armed');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    /* Safety: nothing stays hidden, whatever the observer does. */
    setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }, 3000);
  }

  /* ---------- how it runs: pinned stage states ---------- */
  var steps = Array.prototype.slice.call(document.querySelectorAll('[data-how-step]'));
  var himgs = Array.prototype.slice.call(document.querySelectorAll('[data-how-img]'));
  var hcap = document.querySelector('[data-how-cap]');
  var CAPS = [
    'The main window, as it opens.',
    'The address dialog, waiting for a link.',
    'Progress by connection: the strip and the table.',
    'Finished: the completion dialog over the full strip.'
  ];
  if (steps.length && himgs.length && 'IntersectionObserver' in window) {
    var setState = function (idx) {
      steps.forEach(function (s, i) { s.classList.toggle('is-active', i === idx); });
      himgs.forEach(function (im, i) { im.classList.toggle('is-on', i === idx); });
      if (hcap && CAPS[idx]) { hcap.textContent = CAPS[idx]; }
    };
    var hio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { setState(steps.indexOf(e.target)); }
      });
    }, { rootMargin: '-42% 0px -42% 0px' });
    steps.forEach(function (s) { hio.observe(s); });
  }

  /* ---------- platform-aware primary buttons ---------- */
  var ua = navigator.userAgent || '';
  var isLinux = /Linux|X11/i.test(ua) && !/Win|Android|Macintosh/i.test(ua);
  function getHref(key) {
    var el = document.querySelector('[data-get="' + key + '"]');
    return el ? el.getAttribute('href') : null;
  }
  function applyPlatform() {
    if (!isLinux) { return; }
    var deb = getHref('deb');
    var setup = getHref('win_setup');
    if (!deb || !setup) { return; }
    var hero = document.getElementById('hero-download');
    var alt = document.getElementById('hero-alt');
    var foot = document.getElementById('footer-download');
    if (hero) { hero.setAttribute('href', deb); hero.textContent = 'Download for Linux'; }
    if (alt) { alt.setAttribute('href', setup); alt.textContent = 'Download for Windows'; }
    if (foot) { foot.setAttribute('href', deb); }
  }

  /* ---------- feed refresh ---------- */
  function setHref(sel, url) {
    document.querySelectorAll(sel).forEach(function (el) { el.setAttribute('href', url); });
  }
  fetch(FEED_URL).then(function (r) {
    if (!r.ok) { throw new Error('feed ' + r.status); }
    return r.json();
  }).then(function (feed) {
    if (!feed || !feed.version) { return; }
    var v = String(feed.version).replace(/^v/, '');
    document.querySelectorAll('[data-ver]').forEach(function (el) { el.textContent = v; });
    var urls = { win_setup: feed.win_setup_url, win: feed.win_url, win_x86: feed.win_x86_url, deb: feed.deb_url };
    Object.keys(urls).forEach(function (key) {
      if (urls[key]) { setHref('[data-get="' + key + '"]', urls[key]); }
    });
    var hashes = { win_setup: feed.win_setup_sha256, win: feed.win_sha256, win_x86: feed.win_x86_sha256, deb: feed.deb_sha256 };
    Object.keys(hashes).forEach(function (key) {
      var el = document.querySelector('[data-hash="' + key + '"]');
      if (el && hashes[key]) { el.textContent = hashes[key]; }
    });
    applyPlatform();
  }).catch(function () { /* static values match the current release */ });
  applyPlatform();

  /* ---------- footer clock (Dhaka) ---------- */
  var clock = document.getElementById('dhaka-time');
  if (clock && 'Intl' in window) {
    var fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', hour12: false
    });
    var tick = function () {
      clock.textContent = 'Local time ' + fmt.format(new Date()) + ', Bangladesh Standard Time';
    };
    tick();
    setInterval(tick, 30000);
  }

  /* ---------- video picker ---------- */
  /* Sample formats: example data in the style yt-dlp returns — the sizes
     are plausible magnitudes for these famous videos, not measurements. */
  var EXAMPLES = {
    zoo: {
      url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      title: 'Me at the zoo', host: 'youtube.com', dur: '0:19', pick: 1,
      formats: [['1080p MP4', '8.6 MB'], ['720p MP4', '4.9 MB'], ['480p MP4', '2.7 MB'], ['360p MP4', '1.6 MB'], ['M4A audio only', '0.4 MB']]
    },
    rick: {
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Never Gonna Give You Up', host: 'youtube.com', dur: '3:33', pick: 1,
      formats: [['1080p MP4', '42.1 MB'], ['720p MP4', '23.6 MB'], ['480p MP4', '12.4 MB'], ['360p MP4', '7.1 MB'], ['M4A audio only', '3.3 MB']]
    },
    gangnam: {
      url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      title: 'Gangnam Style', host: 'youtube.com', dur: '4:13', pick: 1,
      formats: [['1080p MP4', '63.8 MB'], ['720p MP4', '34.2 MB'], ['480p MP4', '18.7 MB'], ['360p MP4', '10.3 MB'], ['M4A audio only', '3.9 MB']]
    }
  };
  var input = document.getElementById('video-url');
  var rows = document.getElementById('pk-rows');
  var pkName = document.getElementById('pk-name');
  var pkHost = document.getElementById('pk-host');
  var pkDur = document.getElementById('pk-dur');
  var status = document.getElementById('pk-status');
  var queued = false;

  function render(ex) {
    pkName.textContent = ex.title;
    pkHost.textContent = ex.host;
    pkDur.textContent = ex.dur;
    rows.innerHTML = '';
    queued = false;
    ex.formats.forEach(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pk-row' + (i === ex.pick ? ' sel' : '');
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', i === ex.pick ? 'true' : 'false');
      var fmt = document.createElement('span');
      fmt.textContent = f[0];
      var size = document.createElement('span');
      size.className = 'pk-size';
      size.textContent = f[1];
      b.appendChild(fmt);
      b.appendChild(size);
      b.addEventListener('click', function () {
        rows.querySelectorAll('.pk-row').forEach(function (r) {
          r.classList.remove('sel');
          r.setAttribute('aria-checked', 'false');
        });
        b.classList.add('sel');
        b.setAttribute('aria-checked', 'true');
        status.textContent = f[0] + ' selected' + (queued ? ' — press Download to queue' : '');
      });
      rows.appendChild(b);
    });
    status.textContent = ex.formats[ex.pick][0] + ' selected';
  }

  document.querySelectorAll('[data-ex]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ex = EXAMPLES[btn.getAttribute('data-ex')];
      if (!ex) { return; }
      if (input) { input.value = ex.url; }
      render(ex);
    });
  });

  if (input) {
    input.addEventListener('input', function () {
      var v = input.value.trim().toLowerCase();
      if (v.indexOf('aqz-ke-bpkq') !== -1) { render(EXAMPLES.zoo); }
      else if (v.indexOf('dqw4w9wgxcq') !== -1) { render(EXAMPLES.rick); }
      else if (v.indexOf('9bzkp7q19f0') !== -1) { render(EXAMPLES.gangnam); }
    });
  }

  var pkDownload = document.getElementById('pk-download');
  if (pkDownload) {
    pkDownload.addEventListener('click', function () {
      var sel = rows.querySelector('.pk-row.sel');
      if (!sel) { return; }
      var fmtTxt = sel.firstChild.textContent;
      var sizeTxt = sel.lastChild.textContent;
      queued = true;
      status.textContent = 'Queued in NDM: ' + pkName.textContent + ' · ' + fmtTxt + ' · ' + sizeTxt;
    });
  }

  render(EXAMPLES.zoo);
})();
