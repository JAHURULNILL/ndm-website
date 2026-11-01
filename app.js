/* NDM website behaviour:
   1. Live release feed — version labels, download links, file names
      and SHA-256 values refresh themselves from the app's update
      feed. The feed is tried at its canonical address first, then at
      the mirror the app itself uses as a fallback; the static HTML
      values (current release) stay if both are unreachable.
   2. Copy buttons: the apt install command and the full hashes. */
(function () {
  var FEEDS = [
    'https://github.com/JAHURULNILL/ndm/releases/latest/download/release.json',
    'https://raw.githubusercontent.com/JAHURULNILL/ndm/main/release.json'
  ];

  var FILE_NAMES = {
    deb: function (v) { return 'NDM_' + v + '_amd64.deb'; },
    linuxport: function (v) { return 'NDM_' + v + '_Linux_Portable.tar.xz'; },
    setup: function (v) { return 'NDM_' + v + '_x64-setup.exe'; },
    winport: function (v) { return 'NDM_' + v + '_Windows_Portable.zip'; },
    ext: function (v) { return 'ndm-extension-' + v + '.zip'; }
  };
  var HASH_KEYS = ['deb_sha256', 'ext_sha256', 'win_sha256', 'win_setup_sha256'];

  function shortHash(h) {
    return h.length > 24 ? h.slice(0, 16) + '…' + h.slice(-8) : h;
  }

  function applyFeed(info) {
    if (!info || !info.version) return;
    var v = String(info.version);
    document.querySelectorAll('[data-version]').forEach(function (el) {
      el.textContent = 'v' + v;
    });
    document.querySelectorAll('.meta').forEach(function (el) {
      var fmt = el.getAttribute('data-format');
      var size = el.getAttribute('data-size');
      if (fmt) el.textContent = fmt + ' · v' + v + (size ? ' · ' + size : '');
    });
    document.querySelectorAll('[data-fname]').forEach(function (el) {
      var build = FILE_NAMES[el.getAttribute('data-fname')];
      if (build) el.textContent = build(v);
    });
    HASH_KEYS.forEach(function (key) {
      var full = info[key];
      if (!full) return;
      document.querySelectorAll('[data-hash="' + key + '"]').forEach(function (el) {
        el.setAttribute('data-full', full);
        el.textContent = shortHash(full);
      });
    });
    var base = 'https://github.com/JAHURULNILL/ndm/releases/download/v' + v + '/';
    var set = function (sel, url) {
      if (!url) return;
      document.querySelectorAll(sel).forEach(function (a) { a.href = url; });
    };
    set('.win-setup-link', info.win_setup_url || base + FILE_NAMES.setup(v));
    set('.win-port-link', info.win_url || base + FILE_NAMES.winport(v));
    set('.deb-link', info.deb_url || base + FILE_NAMES.deb(v));
    set('.linux-port-link', info.linux_url || base + FILE_NAMES.linuxport(v));
    set('.ext-link', base + FILE_NAMES.ext(v));
    var deb = info.deb_url || base + FILE_NAMES.deb(v);
    var cmd = document.getElementById('installCmd');
    if (cmd) cmd.textContent = 'sudo apt install ./' + deb.split('/').pop();
  }

  function tryFeed(i) {
    if (i >= FEEDS.length) return;
    fetch(FEEDS[i], { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (info) {
        if (info && info.version) applyFeed(info);
        else tryFeed(i + 1);
      })
      .catch(function () { tryFeed(i + 1); });
  }
  tryFeed(0);

  function copyText(text, btn, label) {
    var done = function () {
      if (!btn) return;
      btn.classList.add('done');
      var span = btn.querySelector('span');
      var target = span || btn;
      var original = target.textContent;
      target.textContent = 'Copied';
      setTimeout(function () {
        btn.classList.remove('done');
        target.textContent = label || original;
      }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(done);
    } else { done(); }
  }

  var copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var cmd = document.getElementById('installCmd');
      copyText(cmd ? cmd.textContent.trim() : '', copyBtn, 'Copy');
    });
  }

  document.querySelectorAll('[data-copy-hash]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-copy-hash');
      var el = document.querySelector('[data-hash="' + key + '"]');
      copyText(el ? (el.getAttribute('data-full') || el.textContent.trim()) : '', btn, 'Copy');
    });
  });
})();
