/* Live release feed: this page reads NDM's release.json straight from
   GitHub, so the version, notes and download links are always current —
   no redeploy needed when a new version ships. The values baked into
   the HTML are the offline fallback. */
(function () {
  var FEED = 'https://raw.githubusercontent.com/JAHURULNILL/ndm/main/release.json';
  fetch(FEED, {cache: 'no-store'})
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (info) {
      if (!info || !info.version) return;
      var v = String(info.version);
      document.querySelectorAll('.ver').forEach(function (el) { el.textContent = v; });
      var badge = document.getElementById('versionBadge');
      if (badge) badge.textContent = 'Version ' + v;
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
        var cmd = document.querySelector('.install-line code');
        if (cmd && file) cmd.innerHTML = 'sudo apt install ./' + file;
      }
      var live = document.getElementById('liveState');
      if (live) live.textContent = 'Live — showing release v' + v + ' from the official feed.';
    })
    .catch(function () { /* fallback content stays */ });
})();
