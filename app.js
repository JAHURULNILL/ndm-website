/* NDM website behaviour:
   1. Live release feed — version labels, download links, file names and
      SHA-256 values refresh themselves from the app's update feed.
   2. The hero fragment is the app's main window, working: a download runs,
      rows select, the per-download speed limiter applies.
   3. Section controls: download filters, the video picker, the question
      index, copy buttons, the platform choice in the closing sentence. */
(function () {
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- live release feed ---------- */
  var FEEDS = [
    'https://github.com/JAHURULNILL/ndm/releases/latest/download/release.json',
    'https://raw.githubusercontent.com/JAHURULNILL/ndm/main/release.json'
  ];
  var FILE_NAMES = {
    deb: function (v) { return 'NDM_' + v + '_amd64.deb'; },
    setup: function (v) { return 'NDM_' + v + '_x64-setup.exe'; },
    winport: function (v) { return 'NDM_' + v + '_Windows_Portable.zip'; },
    ext: function (v) { return 'ndm-extension-' + v + '.zip'; }
  };
  function applyFeed(info) {
    if (!info || !info.version) return;
    var v = String(info.version);
    document.querySelectorAll('[data-version]').forEach(function (el) { el.textContent = v; });
    document.querySelectorAll('[data-fname]').forEach(function (el) {
      var b = FILE_NAMES[el.getAttribute('data-fname')];
      if (b) el.textContent = b(v);
    });
    ['deb_sha256', 'ext_sha256', 'win_sha256', 'win_setup_sha256'].forEach(function (key) {
      var full = info[key]; if (!full) return;
      document.querySelectorAll('[data-hash="' + key + '"]').forEach(function (el) {
        el.setAttribute('data-full', full); el.textContent = full;
      });
    });
    var base = 'https://github.com/JAHURULNILL/ndm/releases/download/v' + v + '/';
    var set = function (sel, url) { if (url) document.querySelectorAll(sel).forEach(function (a) { a.href = url; }); };
    set('.win-setup-link', info.win_setup_url || base + FILE_NAMES.setup(v));
    set('.win-port-link', info.win_url || base + FILE_NAMES.winport(v));
    set('.deb-link', info.deb_url || base + FILE_NAMES.deb(v));
    set('.ext-link', base + FILE_NAMES.ext(v));
    var cmd = document.getElementById('installCmd');
    if (cmd) cmd.textContent = 'sudo apt install ./' + FILE_NAMES.deb(v);
    var ctaOs = document.getElementById('ctaOs');
    if (ctaOs) ctaOs.dispatchEvent(new Event('change'));
  }
  function tryFeed(i) {
    if (i >= FEEDS.length) return;
    fetch(FEEDS[i], { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (info) { if (info && info.version) applyFeed(info); else tryFeed(i + 1); })
      .catch(function () { tryFeed(i + 1); });
  }
  tryFeed(0);

  /* ---------- copy buttons ---------- */
  function copyText(text, btn) {
    var done = function () {
      if (!btn) return;
      var original = btn.textContent;
      btn.classList.add('done'); btn.textContent = 'Copied';
      setTimeout(function () { btn.classList.remove('done'); btn.textContent = original; }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done).catch(done);
    else done();
  }
  var copyBtn = document.getElementById('copyBtn');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var cmd = document.getElementById('installCmd');
    copyText(cmd ? cmd.textContent.trim() : '', copyBtn);
  });
  document.querySelectorAll('[data-copy-hash]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.querySelector('[data-hash="' + btn.getAttribute('data-copy-hash') + '"]');
      copyText(el ? (el.getAttribute('data-full') || el.textContent.trim()) : '', btn);
    });
  });

  /* ---------- the app fragment ---------- */
  var app = document.getElementById('ndmApp');
  var downloads = {
    arch:   { name: 'archlinux-2026.11.01-x86_64.iso', sizeMB: 1208.6, sizeText: '1.18 GB', status: 'paused', pct: 47.5, url: 'https://geo.mirror.pkgbuild.com/iso/2026.11.01/archlinux-2026.11.01-x86_64.iso' },
    libre:  { name: 'LibreOffice_25.8.2_Linux_x86-64_deb.tar.gz', sizeMB: 214, sizeText: '214 MB', status: 'complete', pct: 100, url: 'https://download.documentfoundation.org/libreoffice/stable/25.8.2/deb/x86_64/LibreOffice_25.8.2_Linux_x86-64_deb.tar.gz' },
    suse:   { name: 'openSUSE-Leap-15.6-NET-x86_64.iso', sizeMB: 201, sizeText: '201 MB', status: 'downloading', pct: 24.0, url: 'https://download.opensuse.org/distribution/leap/15.6/iso/openSUSE-Leap-15.6-NET-x86_64.iso' },
    ffmpeg: { name: 'ffmpeg-8.0.1.tar.xz', sizeMB: 11.4, sizeText: '11.4 MB', status: 'queued', pct: 0, url: 'https://ffmpeg.org/releases/ffmpeg-8.0.1.tar.xz' }
  };
  var selected = 'suse';
  var limiter = null; /* MB/s, per-download, for the running entry */
  var run = downloads.suse;
  run.downloadedMB = run.sizeMB * run.pct / 100;
  run.rate = 1.98;

  var rows = {};
  document.querySelectorAll('#uiRows tr').forEach(function (tr) { rows[tr.getAttribute('data-id')] = tr; });

  var strip = document.getElementById('fStrip');
  var blocks = [];
  for (var i = 0; i < 32; i++) { var b = document.createElement('span'); strip.appendChild(b); blocks.push(b); }

  function fmtMB(mb) { return mb >= 100 ? mb.toFixed(0) : mb.toFixed(1); }
  function fmtLeft(sec) {
    if (!isFinite(sec) || sec <= 0) return '—';
    sec = Math.round(sec);
    var m = Math.floor(sec / 60), s = sec % 60;
    return m > 0 ? m + ' min ' + s + ' sec' : s + ' sec';
  }
  function statusWord(d) {
    return d.status === 'downloading' ? 'Downloading' : d.status === 'paused' ? 'Paused' : d.status === 'complete' ? 'Complete' : 'Queued';
  }
  function statusCell(d) {
    if (d.status === 'complete') return 'Complete';
    if (d.status === 'queued') return 'Queued';
    return d.pct.toFixed(d.status === 'paused' ? 2 : 1) + '%';
  }
  function dotClass(d) {
    return d.status === 'downloading' ? 'dot-run' : d.status === 'paused' ? 'dot-pause' : d.status === 'complete' ? 'dot-done' : 'dot-queue';
  }

  var fUrl = document.getElementById('fUrl'), fStatus = document.getElementById('fStatus'),
      fSize = document.getElementById('fSize'), fDown = document.getElementById('fDown'),
      fRate = document.getElementById('fRate'), fLeft = document.getElementById('fLeft'),
      fBarFill = document.getElementById('fBarFill'), fBarPct = document.getElementById('fBarPct'),
      btnPause = document.getElementById('btnPause'), btnResume = document.getElementById('btnResume'),
      totalSpeed = document.getElementById('uiTotalSpeed'), statusBar = document.getElementById('uiStatusBar');

  function renderRow(id) {
    var d = downloads[id], tr = rows[id]; if (!tr) return;
    tr.querySelector('.row-bar i').style.width = d.pct + '%';
    var st = tr.querySelector('.row-status'); st.textContent = statusCell(d);
    tr.querySelector('.dot').className = 'dot ' + dotClass(d);
    tr.querySelector('.row-rate').textContent = id === 'suse' && d.status === 'downloading' ? d.rate.toFixed(2) + ' MB/s' : '—';
    tr.querySelector('.row-left').textContent = id === 'suse' && d.status === 'downloading' ? fmtLeft((d.sizeMB - d.downloadedMB) / d.rate) : '—';
  }
  function renderDetail() {
    var d = downloads[selected];
    fUrl.textContent = d.url;
    fStatus.textContent = statusWord(d);
    fSize.textContent = d.sizeText;
    var downMB = selected === 'suse' ? d.downloadedMB : d.sizeMB * d.pct / 100;
    fDown.textContent = fmtMB(downMB) + ' MB (' + d.pct.toFixed(1) + '%)';
    if (selected === 'suse' && d.status === 'downloading') {
      fRate.textContent = d.rate.toFixed(2) + ' MB/s';
      fLeft.textContent = fmtLeft((d.sizeMB - d.downloadedMB) / d.rate).replace(' sec', ' seconds');
    } else { fRate.textContent = '—'; fLeft.textContent = '—'; }
    fBarFill.style.width = d.pct + '%';
    fBarPct.textContent = d.pct.toFixed(1) + '%';
    var on = Math.round(32 * d.pct / 100);
    blocks.forEach(function (blk, i) { blk.className = i < on ? 'on' : ''; });
    btnPause.disabled = !(selected === 'suse' && d.status === 'downloading');
    btnResume.disabled = !(selected === 'suse' && (d.status === 'paused' || d.status === 'queued'));
    var count = Object.keys(rows).length;
    var active = run.status === 'downloading' ? 1 : 0;
    statusBar.textContent = count + ' files (' + active + ' downloading)';
    totalSpeed.textContent = run.status === 'downloading' ? run.rate.toFixed(2) + ' MB/s' : '0 B/s';
  }
  function renderAll() { Object.keys(downloads).forEach(renderRow); renderDetail(); }

  Object.keys(rows).forEach(function (id) {
    rows[id].addEventListener('click', function () {
      selected = id;
      Object.keys(rows).forEach(function (k) { rows[k].classList.toggle('selected', k === id); });
      renderDetail();
    });
  });

  btnPause.addEventListener('click', function () {
    if (run.status !== 'downloading') return;
    run.status = 'paused'; renderAll();
  });
  btnResume.addEventListener('click', function () {
    if (run.status === 'downloading' || run.status === 'complete') return;
    run.status = 'downloading'; renderAll();
  });

  /* detail tabs */
  document.querySelectorAll('.ndm-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.ndm-tab').forEach(function (t) {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      ['status', 'limiter', 'options'].forEach(function (k) {
        document.getElementById('pane' + k.charAt(0).toUpperCase() + k.slice(1)).hidden = tab.getAttribute('data-tab') !== k;
      });
    });
  });

  /* speed limiter */
  var limState = document.getElementById('uiLimiterState'), limNote = document.getElementById('limNote');
  document.getElementById('btnApplyLim').addEventListener('click', function () {
    var val = parseFloat(document.getElementById('limInput').value);
    if (!val || val <= 0) return;
    limiter = val;
    limState.textContent = 'ON';
    limNote.textContent = 'Limit set: this download will not pass ' + val.toFixed(1) + ' MB/s. Watch the transfer rate settle on it.';
  });
  document.getElementById('btnClearLim').addEventListener('click', function () {
    limiter = null;
    limState.textContent = 'OFF';
    limNote.textContent = 'No limit on this download. A limit set here applies while the download runs, and NDM remembers it across restarts.';
  });

  /* theme toggle — the app ships light and dark */
  var themeBtn = document.getElementById('uiThemeBtn');
  themeBtn.addEventListener('click', function () {
    var dark = app.classList.toggle('dark');
    themeBtn.textContent = dark ? 'Light' : 'Dark';
    themeBtn.setAttribute('aria-pressed', dark ? 'true' : 'false');
  });

  /* the running download */
  if (!reduced) {
    var t = 0;
    setInterval(function () {
      if (run.status !== 'downloading') return;
      t += 0.25;
      var natural = 1.98 + Math.sin(t * 0.7) * 0.22 + Math.sin(t * 2.3) * 0.07;
      var target = limiter ? Math.min(natural, limiter) : natural;
      run.rate += (target - run.rate) * 0.35;
      run.downloadedMB = Math.min(run.sizeMB, run.downloadedMB + run.rate * 0.25);
      run.pct = run.downloadedMB / run.sizeMB * 100;
      if (run.downloadedMB >= run.sizeMB) { run.pct = 100; run.status = 'complete'; }
      renderRow('suse');
      if (selected === 'suse') renderDetail(); else { totalSpeed.textContent = run.status === 'downloading' ? run.rate.toFixed(2) + ' MB/s' : '0 B/s'; }
    }, 250);
  }
  renderAll();

  /* mini cards: connection strips */
  document.querySelectorAll('.mini-strip').forEach(function (s) {
    var fill = parseInt(s.getAttribute('data-fill') || '0', 10);
    for (var i = 0; i < 32; i++) {
      var blk = document.createElement('span');
      if (i < fill) blk.className = 'on';
      s.appendChild(blk);
    }
  });

  /* ---------- downloads filter ---------- */
  document.querySelectorAll('.dl-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.dl-tab').forEach(function (t) {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      var f = tab.getAttribute('data-filter');
      document.querySelectorAll('.dl-row').forEach(function (row) {
        row.hidden = f !== 'all' && row.getAttribute('data-platform') !== f;
      });
    });
  });

  /* ---------- video picker ---------- */
  var pickerSize = document.getElementById('pickerSize');
  document.querySelectorAll('input[name="fmt"]').forEach(function (r) {
    r.addEventListener('change', function () { pickerSize.textContent = r.value + ' MB'; });
  });
  var urlInput = document.getElementById('videoUrl'), pickerSource = document.getElementById('pickerSource');
  urlInput.addEventListener('input', function () {
    var v = urlInput.value.trim().replace(/^https?:\/\/(www\.)?/, '');
    pickerSource.textContent = v || '…';
  });
  var pickerBtn = document.getElementById('pickerDownload'), added = false;
  pickerBtn.addEventListener('click', function () {
    if (added) return;
    added = true;
    var tbody = document.getElementById('uiRows');
    var tr = document.createElement('tr');
    tr.setAttribute('data-id', 'zoo'); tr.tabIndex = 0;
    var size = pickerSize.textContent;
    tr.innerHTML = '<td><span class="row-name">Me at the zoo.mp4</span><span class="row-bar"><i style="width:0%"></i></span></td>' +
      '<td class="r">' + size + '</td>' +
      '<td><span class="dot dot-queue"></span><span class="row-status">Queued</span></td>' +
      '<td class="r row-left">—</td><td class="r row-rate">—</td><td class="r">Just now</td>';
    tbody.appendChild(tr);
    rows.zoo = tr;
    downloads.zoo = { name: 'Me at the zoo.mp4', sizeMB: parseFloat(size), sizeText: size, status: 'queued', pct: 0, url: urlInput.value.trim() };
    tr.addEventListener('click', function () {
      selected = 'zoo';
      Object.keys(rows).forEach(function (k) { rows[k].classList.toggle('selected', k === 'zoo'); });
      renderDetail();
    });
    pickerBtn.textContent = 'In the list, at the top of this page';
    pickerBtn.classList.add('added');
    renderDetail();
  });

  /* ---------- question index ---------- */
  var pane = document.querySelector('.faq-pane');
  function showAnswer(btn) {
    document.querySelectorAll('.faq-q').forEach(function (q) {
      q.classList.toggle('active', q === btn);
      q.setAttribute('aria-selected', q === btn ? 'true' : 'false');
    });
    document.querySelectorAll('.faq-a').forEach(function (a) { a.hidden = a.id !== btn.getAttribute('data-answer'); });
    if (window.innerWidth <= 1024 && pane && btn.parentNode) btn.parentNode.appendChild(pane);
  }
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () { showAnswer(q); });
    q.addEventListener('focus', function () { showAnswer(q); });
    q.addEventListener('mouseenter', function () { if (window.innerWidth > 1024) showAnswer(q); });
  });

  /* ---------- closing sentence ---------- */
  var ctaOs = document.getElementById('ctaOs'), ctaBtn = document.getElementById('ctaBtn');
  var CTA_URLS = {
    win: 'https://github.com/JAHURULNILL/ndm/releases/download/v2.0.10/NDM_2.0.10_x64-setup.exe',
    linux: 'https://github.com/JAHURULNILL/ndm/releases/download/v2.0.10/NDM_2.0.10_amd64.deb'
  };
  ctaOs.addEventListener('change', function () {
    var feedWin = document.querySelector('.win-setup-link');
    var feedDeb = document.querySelector('.deb-link');
    CTA_URLS.win = feedWin ? feedWin.href : CTA_URLS.win;
    CTA_URLS.linux = feedDeb ? feedDeb.href : CTA_URLS.linux;
    ctaBtn.href = CTA_URLS[ctaOs.value];
  });

  /* ---------- demo video under reduced motion ---------- */
  var video = document.getElementById('demoVideo');
  if (video && reduced) { video.removeAttribute('autoplay'); video.pause(); }
})();
