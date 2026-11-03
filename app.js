/* NDM website behavior: GitHub release metadata, OS-aware download, hash copying. */
(function () {
  'use strict';

  var RELEASE_API = 'https://api.github.com/repos/JAHURULNILL/ndm/releases/latest';
  var RELEASE_PATH = '/JAHURULNILL/ndm/releases/download/';
  var PACKAGE_KEYS = ['win_setup', 'win', 'win_x86', 'deb', 'linux_portable', 'ext'];

  function safeReleaseUrl(value) {
    if (typeof value !== 'string') { return null; }
    try {
      var url = new URL(value);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.pathname.indexOf(RELEASE_PATH) !== 0) {
        return null;
      }
      return url.href;
    } catch (error) {
      return null;
    }
  }

  function getPackageKey(name) {
    if (/^NDM_.+_setup\.exe$/i.test(name)) { return 'win_setup'; }
    if (/^NDM_.+_Windows_Portable_x86\.zip$/i.test(name)) { return 'win_x86'; }
    if (/^NDM_.+_Windows_Portable\.zip$/i.test(name)) { return 'win'; }
    if (/^NDM_.+_amd64\.deb$/i.test(name)) { return 'deb'; }
    if (/^NDM_.+_Linux_Portable\.tar\.xz$/i.test(name)) { return 'linux_portable'; }
    if (/^ndm-extension-.+\.zip$/i.test(name)) { return 'ext'; }
    return null;
  }

  function formatFileSize(bytes) {
    if (typeof bytes !== 'number' || !isFinite(bytes) || bytes < 0) { return null; }
    if (bytes < 1024 * 1024) { return Math.round(bytes / 1024) + ' KB'; }
    var mib = bytes / (1024 * 1024);
    return mib >= 100 ? mib.toFixed(1) + ' MB' : mib.toFixed(2) + ' MB';
  }

  function setPrimaryDownload() {
    var button = document.getElementById('hero-download');
    var note = document.getElementById('hero-download-note');
    if (!button) { return; }

    var uaPlatform = navigator.userAgentData && navigator.userAgentData.platform
      ? navigator.userAgentData.platform
      : '';
    var platform = [uaPlatform, navigator.userAgent || '', navigator.platform || ''].join(' ');
    var linuxDesktop = /linux|x11/i.test(platform) && !/android/i.test(platform);
    var windowsDesktop = /windows|win32|win64/i.test(platform);

    if (linuxDesktop) {
      var deb = document.querySelector('.package-row [data-get="deb"]');
      if (deb) { button.setAttribute('href', deb.getAttribute('href')); }
      button.setAttribute('data-get', 'deb');
      var linuxTitle = button.querySelector('strong');
      if (linuxTitle) { linuxTitle.textContent = 'Download for Linux'; }
      if (note) { note.textContent = 'Debian family · x86-64'; }
    } else if (windowsDesktop) {
      var setup = document.querySelector('.package-row [data-get="win_setup"]');
      if (setup) { button.setAttribute('href', setup.getAttribute('href')); }
      button.setAttribute('data-get', 'win_setup');
      var windowsTitle = button.querySelector('strong');
      if (windowsTitle) { windowsTitle.textContent = 'Download for Windows'; }
      if (note) { note.textContent = 'Universal installer · 32-bit + 64-bit'; }
    } else {
      button.removeAttribute('data-get');
      button.setAttribute('href', '#downloads');
      var generalTitle = button.querySelector('strong');
      if (generalTitle) { generalTitle.textContent = 'Choose a desktop build'; }
      if (note) { note.textContent = 'Windows 7–11 · Debian-family Linux'; }
    }
  }

  function updateFromRelease(release) {
    if (!release || typeof release.tag_name !== 'string' || !Array.isArray(release.assets)) { return false; }
    var version = release.tag_name.replace(/^v/i, '');
    if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version)) { return false; }

    var assets = {};
    release.assets.forEach(function (asset) {
      if (!asset || typeof asset.name !== 'string') { return; }
      var key = getPackageKey(asset.name);
      if (key) { assets[key] = asset; }
    });

    /* Avoid mixing a new release with stale fallback links or hashes. */
    for (var i = 0; i < PACKAGE_KEYS.length; i += 1) {
      var asset = assets[PACKAGE_KEYS[i]];
      var href = asset && safeReleaseUrl(asset.browser_download_url);
      var match = asset && typeof asset.digest === 'string' ? asset.digest.match(/^sha256:([a-f0-9]{64})$/i) : null;
      var size = asset && formatFileSize(asset.size);
      if (!asset || !href || !match || !size) { return false; }
    }

    document.querySelectorAll('[data-ver]').forEach(function (node) {
      node.textContent = version;
    });
    PACKAGE_KEYS.forEach(function (key) {
      var asset = assets[key];
      var href = safeReleaseUrl(asset.browser_download_url);
      var digest = asset.digest.slice('sha256:'.length).toLowerCase();
      document.querySelectorAll('[data-get="' + key + '"]').forEach(function (link) {
        link.setAttribute('href', href);
      });
      var filename = document.querySelector('[data-filename="' + key + '"]');
      if (filename) { filename.textContent = asset.name; }
      var size = document.querySelector('[data-size="' + key + '"]');
      if (size) { size.textContent = formatFileSize(asset.size); }
      var hash = document.querySelector('[data-hash="' + key + '"]');
      if (hash) { hash.textContent = digest; }
    });
    setPrimaryDownload();
    return true;
  }

  function refreshReleaseMetadata() {
    if (!('fetch' in window)) { return; }
    window.fetch(RELEASE_API, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'default'
    }).then(function (response) {
      if (!response.ok) { throw new Error('Latest release is unavailable.'); }
      return response.json();
    }).then(function (release) {
      updateFromRelease(release);
    }).catch(function () {
      /* Bundled version, filenames, links, sizes, and hashes remain usable. */
    });
  }

  function fallbackCopy(text) {
    var field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    field.style.pointerEvents = 'none';
    document.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, field.value.length);
    var copied = false;
    try { copied = document.execCommand('copy'); } catch (error) { copied = false; }
    document.body.removeChild(field);
    return copied;
  }

  function copyHash(button) {
    var key = button.getAttribute('data-copy-hash');
    var code = document.querySelector('[data-hash="' + key + '"]');
    var status = document.querySelector('[data-copy-status="' + key + '"]');
    if (!code || !status) { return; }

    var text = code.textContent.trim();
    var original = button.textContent;
    function announce(message) {
      status.textContent = message;
      button.textContent = message === 'Copied.' ? 'Copied' : original;
      window.setTimeout(function () {
        button.textContent = original;
        status.textContent = '';
      }, 2200);
    }

    if (navigator.clipboard && window.isSecureContext) {
      try {
        navigator.clipboard.writeText(text).then(function () {
          announce('Copied.');
        }).catch(function () {
          announce(fallbackCopy(text) ? 'Copied.' : 'Select the hash to copy.');
        });
      } catch (error) {
        announce(fallbackCopy(text) ? 'Copied.' : 'Select the hash to copy.');
      }
    } else {
      announce(fallbackCopy(text) ? 'Copied.' : 'Select the hash to copy.');
    }
  }

  document.querySelectorAll('[data-copy-hash]').forEach(function (button) {
    button.addEventListener('click', function () { copyHash(button); });
  });

  setPrimaryDownload();
  refreshReleaseMetadata();
})();
