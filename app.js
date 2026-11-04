/* NDM website behavior: platform choice, complete-release refresh, honest fallback, hash copying. */
(function () {
  'use strict';

  var RELEASE_API = 'https://api.github.com/repos/JAHURULNILL/ndm/releases/latest';
  var RELEASE_PATH = '/JAHURULNILL/ndm/releases/download/';
  var RELEASE_PAGE_PATH = '/JAHURULNILL/ndm/releases/tag/';
  var PACKAGE_KEYS = ['win_setup', 'win', 'win_x86', 'deb', 'linux_portable', 'ext'];
  var BUNDLED_VERSION = '2.3.1';
  var selectedPlatform = 'windows';

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
    var href = release && safeReleasePageUrl(release.html_url);
    if (link && href) {
      link.href = href;
      link.textContent = 'GitHub release v' + (versionFromTag(release.tag_name) || '') + ' ↗';
    }
  }

  function findPackageLink(key) {
    return document.querySelector('.package-row [data-get="' + key + '"]');
  }

  function findPackageValue(attribute, key) {
    var node = document.querySelector('[data-' + attribute + '="' + key + '"]');
    return node ? node.textContent.trim() : '';
  }

  function syncSelectedPackage() {
    if (selectedPlatform === 'windows') {
      choosePlatform('windows', false);
    } else if (selectedPlatform === 'linux') {
      choosePlatform('linux', false);
    }
  }

  function choosePlatform(platform, announce) {
    var buttons = document.querySelectorAll('[data-platform-choice]');
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-platform-choice') === platform ? 'true' : 'false');
    });

    var title = document.getElementById('selected-build-kind');
    var note = document.getElementById('selected-build-note');
    var button = document.getElementById('hero-download');
    var buttonLabel = document.getElementById('hero-download-label');
    var size = document.getElementById('selected-file-size');
    var filename = document.getElementById('selected-file-name');
    var alternate = document.getElementById('alternate-package');
    var status = document.getElementById('platform-status');

    if (!button || !buttonLabel || !title || !note) { return; }

    var mainKey;
    var alternateKey;
    if (platform === 'windows') {
      selectedPlatform = 'windows';
      mainKey = 'win_setup';
      alternateKey = 'win';
      title.textContent = 'Universal installer';
      note.textContent = 'Includes 32-bit and 64-bit; installs the matching build.';
      buttonLabel.textContent = 'Download for Windows';
      if (alternate) { alternate.textContent = 'Prefer portable? Get the 64-bit ZIP'; }
      if (status && announce) { status.textContent = 'Windows selected. The universal installer supports 32-bit and 64-bit.'; }
    } else if (platform === 'linux') {
      selectedPlatform = 'linux';
      mainKey = 'deb';
      alternateKey = 'linux_portable';
      title.textContent = 'Debian package';
      note.textContent = 'For Debian-family Linux distributions on x86-64.';
      buttonLabel.textContent = 'Download for Linux';
      if (alternate) { alternate.textContent = 'Prefer portable? Get the tar.xz package'; }
      if (status && announce) { status.textContent = 'Linux selected. NDM supports Debian-family distributions on x86-64.'; }
    } else {
      selectedPlatform = null;
      title.textContent = 'Choose Windows or Linux';
      note.textContent = 'Linux downloads are for Debian-family x86-64 systems.';
      buttonLabel.textContent = 'See all downloads';
      button.href = '#downloads';
      button.removeAttribute('data-get');
      if (size) { size.textContent = ''; }
      if (filename) { filename.textContent = ''; }
      if (alternate) {
        alternate.href = '#downloads';
        alternate.removeAttribute('data-get');
        alternate.textContent = 'Browse all five desktop packages and the optional extension';
      }
      if (status && announce) { status.textContent = 'Choose a supported desktop platform or browse the packages below.'; }
      return;
    }

    var primary = findPackageLink(mainKey);
    if (primary) {
      button.href = primary.href;
      button.setAttribute('data-get', mainKey);
    }
    if (size) { size.textContent = findPackageValue('size', mainKey); }
    if (filename) { filename.textContent = findPackageValue('filename', mainKey); }
    if (alternate) {
      var alternateLink = findPackageLink(alternateKey);
      if (alternateLink) {
        alternate.href = alternateLink.href;
        alternate.setAttribute('data-get', alternateKey);
      }
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
    syncSelectedPackage();
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
  document.querySelectorAll('[data-platform-choice]').forEach(function (button) {
    button.addEventListener('click', function () {
      choosePlatform(button.getAttribute('data-platform-choice'), true);
    });
  });

  selectedPlatform = detectPlatform();
  choosePlatform(selectedPlatform, false);
  refreshReleaseMetadata();
})();
