/* NDM website behaviour:
   1. Live release feed — version, notes, download links and the install
      command update themselves from GitHub's release.json (the HTML
      values are the offline fallback).
   2. One orchestrated reveal system (IntersectionObserver).
   3. Copy-the-install-command button. */
(function () {
  var FEED = 'https://raw.githubusercontent.com/JAHURULNILL/ndm/main/release.json';

  fetch(FEED, {cache: 'no-store'})
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (info) {
      if (!info || !info.version) return;
      var v = String(info.version);
      var badge = document.getElementById('versionBadge');
      if (badge) badge.textContent = 'v' + v;
      var navVer = document.getElementById('navVer');
      if (navVer) navVer.textContent = 'v' + v;
      var verLabel = document.querySelector('.ver-label');
      if (verLabel) verLabel.textContent = 'v' + v;
      if (info.notes) {
        var notes = document.getElementById('releaseNotes');
        if (notes) notes.textContent = info.notes;
      }
      if (info.deb_url) {
        document.querySelectorAll('.dl-link').forEach(function (a) { a.href = info.deb_url; });
        var file = info.deb_url.split('/').pop() || '';
        var meta = document.getElementById('dlMeta');
        if (meta && file) meta.textContent = '.deb · v' + v + ' · 3.7 MB';
        var cmd = document.getElementById('installCmd');
        if (cmd && file) cmd.textContent = 'sudo apt install ./' + file;
      }
      var live = document.getElementById('liveState');
      if (live) live.textContent = 'Live — showing release v' + v + ' from the official feed.';
    })
    .catch(function () { /* fallback content stays */ });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold: 0.12});
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
