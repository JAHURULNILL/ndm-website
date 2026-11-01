/* NDM website behaviour:
   1. Live release feed — version labels and download links refresh
      themselves from the app's update feed. The feed is tried at its
      canonical address first, then at the mirror the app itself uses
      as a fallback; the static HTML values (current release) stay if
      both are unreachable.
   2. One reveal-on-scroll system (IntersectionObserver).
   3. Copy-the-install-command button. */
(function () {
  var FEEDS = [
    'https://github.com/JAHURULNILL/ndm/releases/latest/download/release.json',
    'https://raw.githubusercontent.com/JAHURULNILL/ndm/main/release.json'
  ];

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
    var base = 'https://github.com/JAHURULNILL/ndm/releases/download/v' + v + '/';
    var set = function (sel, url) {
      if (!url) return;
      document.querySelectorAll(sel).forEach(function (a) { a.href = url; });
    };
    set('.win-setup-link', info.win_setup_url || base + 'NDM_' + v + '_x64-setup.exe');
    set('.win-port-link', info.win_url || base + 'NDM_' + v + '_Windows_Portable.zip');
    set('.deb-link', info.deb_url || base + 'NDM_' + v + '_amd64.deb');
    set('.ext-link', base + 'ndm-extension-' + v + '.zip');
    var deb = info.deb_url || base + 'NDM_' + v + '_amd64.deb';
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

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  var copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var cmd = document.getElementById('installCmd');
      var text = cmd ? cmd.textContent.trim() : '';
      var done = function () {
        copyBtn.classList.add('done');
        copyBtn.querySelector('span').textContent = 'Copied';
        setTimeout(function () {
          copyBtn.classList.remove('done');
          copyBtn.querySelector('span').textContent = 'Copy';
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else { done(); }
    });
  }
})();
