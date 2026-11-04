/* NDM website behavior: recommended route, complete-release refresh, honest fallback, hash copying. */
(function () {
  'use strict';

  var RELEASE_API = 'https://api.github.com/repos/JAHURULNILL/ndm/releases/latest';
  var RELEASE_PATH = '/JAHURULNILL/ndm/releases/download/';
  var RELEASE_PAGE_PATH = '/JAHURULNILL/ndm/releases/tag/';
  var PACKAGE_KEYS = ['win_setup', 'win', 'win_x86', 'deb', 'linux_portable', 'ext'];
  var BUNDLED_VERSION = '2.3.2';

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

  function safeReleasePageUrl(value) {
    if (typeof value !== 'string') { return null; }
    try {
      var url = new URL(value);
      if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.pathname.indexOf(RELEASE_PAGE_PATH) !== 0) {
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

  function versionFromTag(tag) {
    if (typeof tag !== 'string') { return null; }
    var version = tag.replace(/^v/i, '');
    return /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version) ? version : null;
  }

  function formatFileSize(bytes) {
    if (typeof bytes !== 'number' || !isFinite(bytes) || bytes < 0) { return null; }
    if (bytes < 1024 * 1024) { return Math.round(bytes / 1024) + ' KB'; }
    var mib = bytes / (1024 * 1024);
    return mib >= 100 ? mib.toFixed(1) + ' MB' : mib.toFixed(2) + ' MB';
  }

  function setReleaseStatus(message, state) {
    var wrapper = document.getElementById('release-status');
    var copy = document.getElementById('release-status-copy');
    if (copy) { copy.textContent = message; }
    if (wrapper) { wrapper.setAttribute('data-status', state || 'static'); }
  }

  function setLatestReleaseLink(release) {
    var link = document.getElementById('latest-release-link');
    var label = document.getElementById('latest-release-label');
    var href = release && safeReleasePageUrl(release.html_url);
    var version = versionFromTag(release && release.tag_name);
    if (link && href) {
      link.href = href;
      if (label) { label.textContent = version ? 'GitHub release v' + version : 'GitHub release'; }
    }
  }

  function markRecommendedRoute(platform) {
    var routes = document.querySelectorAll('[data-route-platform]');
    routes.forEach(function (route) {
      var recommended = route.getAttribute('data-route-platform') === platform;
      route.setAttribute('data-recommended', recommended ? 'true' : 'false');
      var badge = route.querySelector('.route-recommendation');
      if (badge) { badge.hidden = !recommended; }
    });

    var status = document.getElementById('platform-status');
    if (!status) { return; }
    if (platform === 'windows') {
      status.textContent = 'Windows detected. The Windows installer is marked; Linux and browser-extension downloads are still available.';
    } else if (platform === 'linux') {
      status.textContent = 'Linux detected. The Debian-family package is marked; Windows and browser-extension downloads are still available.';
    } else {
      status.textContent = 'Choose Windows, Linux, or the optional browser extension. All download routes remain visible.';
    }
  }

  function detectPlatform() {
    var uaPlatform = navigator.userAgentData && navigator.userAgentData.platform
      ? navigator.userAgentData.platform
      : '';
    var platform = [uaPlatform, navigator.userAgent || '', navigator.platform || ''].join(' ');
    if (/android|iphone|ipad|ipod/i.test(platform)) { return null; }
    if (/windows|win32|win64/i.test(platform)) { return 'windows'; }
    if (/linux|x11/i.test(platform)) { return 'linux'; }
    return null;
  }

  function updateFromRelease(release) {
    if (!release || !Array.isArray(release.assets)) { return false; }
    var version = versionFromTag(release.tag_name);
    if (!version) { return false; }

    var assets = {};
    release.assets.forEach(function (asset) {
      if (!asset || typeof asset.name !== 'string') { return; }
      var key = getPackageKey(asset.name);
      if (key) { assets[key] = asset; }
    });

    for (var i = 0; i < PACKAGE_KEYS.length; i += 1) {
      var asset = assets[PACKAGE_KEYS[i]];
      var href = asset && safeReleaseUrl(asset.browser_download_url);
      var digest = asset && typeof asset.digest === 'string' ? asset.digest.match(/^sha256:([a-f0-9]{64})$/i) : null;
      var size = asset && formatFileSize(asset.size);
      if (!asset || !href || !digest || !size) { return false; }
    }

    document.querySelectorAll('[data-ver]').forEach(function (node) {
      node.textContent = version;
    });
    PACKAGE_KEYS.forEach(function (key) {
      var asset = assets[key];
      var href = safeReleaseUrl(asset.browser_download_url);
      var digest = asset.digest.slice('sha256:'.length).toLowerCase();
      document.querySelectorAll('[data-get="' + key + '"]').forEach(function (link) {
        link.href = href;
      });
      document.querySelectorAll('[data-filename="' + key + '"]').forEach(function (node) {
        node.textContent = asset.name;
      });
      document.querySelectorAll('[data-size="' + key + '"]').forEach(function (node) {
        node.textContent = formatFileSize(asset.size);
      });
      document.querySelectorAll('[data-hash="' + key + '"]').forEach(function (node) {
        node.textContent = digest;
      });
    });
    setReleaseStatus('Downloadable package set refreshed from GitHub release v' + version + '.', 'complete');
    return true;
  }

  function describeIncompleteRelease(release) {
    var version = versionFromTag(release && release.tag_name);
    if (!version) { return false; }
    var present = {};
    (release.assets || []).forEach(function (asset) {
      if (asset && typeof asset.name === 'string') {
        var key = getPackageKey(asset.name);
        if (key) { present[key] = true; }
      }
    });
    var missing = PACKAGE_KEYS.filter(function (key) { return !present[key]; }).length;
    var suffix = release.assets && release.assets.length === 0
      ? ' It has no downloadable package files yet.'
      : ' Its complete set of six packages and SHA-256 values is not available yet.';
    setReleaseStatus('GitHub release v' + version + ' is newer than the downloadable files below.' + suffix + ' The available package set remains v' + BUNDLED_VERSION + '.', 'incomplete');
    return missing > 0;
  }

  function refreshReleaseMetadata() {
    if (!('fetch' in window)) { return; }
    setReleaseStatus('Checking GitHub for a complete newer package set. Showing bundled v' + BUNDLED_VERSION + ' files until verified.', 'checking');
    window.fetch(RELEASE_API, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store'
    }).then(function (response) {
      if (!response.ok) { throw new Error('Latest GitHub release is unavailable.'); }
      return response.json();
    }).then(function (release) {
      setLatestReleaseLink(release);
      if (!updateFromRelease(release)) {
        describeIncompleteRelease(release);
      }
    }).catch(function () {
      setReleaseStatus('Could not verify a newer package set. The bundled v' + BUNDLED_VERSION + ' download links remain available.', 'error');
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

  markRecommendedRoute(detectPlatform());
  refreshReleaseMetadata();
})();
