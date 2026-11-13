(function () {
    'use strict';

    var ID = 'lumina_enhancer';
    var NAME = 'LUMINA VIDEO ENHANCER PRO';
    var VERSION = '2.0.0';
    var started = false;
    var observer = null;
    var styleNode = null;
    var panelNode = null;
    var currentVideo = null;
    var videoObserver = null;

    var defaults = {
        enabled: true,
        brightness: 100,
        contrast: 100,
        saturation: 100,
        warmth: 0,
        hue: 0
    };

    function log() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('[LUMINA ' + VERSION + ']');
        if (window.console && console.log) console.log.apply(console, args);
    }

    function notify(message) {
        try {
            if (window.Lampa && Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show(message);
            else log(message);
        } catch (e) { log(message); }
    }

    function getValue(key) {
        var value;
        try {
            if (window.Lampa && Lampa.Storage && Lampa.Storage.get) {
                value = Lampa.Storage.get(ID + '_' + key, defaults[key]);
            } else {
                value = localStorage.getItem(ID + '_' + key);
                if (value === null) value = defaults[key];
            }
        } catch (e) { value = defaults[key]; }
        if (key === 'enabled') return value === true || value === 'true' || value === 1;
        var number = Number(value);
        return isFinite(number) ? number : defaults[key];
    }

    function setValue(key, value) {
        try {
            if (window.Lampa && Lampa.Storage && Lampa.Storage.set) Lampa.Storage.set(ID + '_' + key, value);
            else localStorage.setItem(ID + '_' + key, String(value));
        } catch (e) { log('Storage error', e); }
        applyToVideo();
    }

    function readSettings() {
        var result = {};
        Object.keys(defaults).forEach(function (key) { result[key] = getValue(key); });
        return result;
    }

    function buildFilter(s) {
        if (!s.enabled) return 'none';
        return 'brightness(' + (s.brightness / 100) + ') ' +
            'contrast(' + (s.contrast / 100) + ') ' +
            'saturate(' + (s.saturation / 100) + ') ' +
            'sepia(' + (Math.max(-100, Math.min(100, s.warmth)) / 100) + ') ' +
            'hue-rotate(' + s.hue + 'deg)';
    }

    function applyToVideo() {
        var videos = document.querySelectorAll('video');
        var filter = buildFilter(readSettings());
        for (var i = 0; i < videos.length; i++) {
            videos[i].style.setProperty('filter', filter, 'important');
            videos[i].style.setProperty('-webkit-filter', filter, 'important');
            videos[i].style.setProperty('will-change', 'filter');
            currentVideo = videos[i];
        }
    }

    function watchVideos() {
        applyToVideo();
        if (videoObserver) return;
        if (typeof MutationObserver !== 'undefined' && document.documentElement) {
            videoObserver = new MutationObserver(function () { applyToVideo(); });
            videoObserver.observe(document.documentElement, { childList: true, subtree: true });
        }
        document.addEventListener('play', function (event) {
            if (event.target && event.target.tagName === 'VIDEO') applyToVideo();
        }, true);
        if (window.Lampa && Lampa.Player && Lampa.Player.listener && Lampa.Player.listener.follow) {
            try {
                Lampa.Player.listener.follow('ready', function () {
                    setTimeout(applyToVideo, 250);
                    setTimeout(applyToVideo, 1000);
                });
            } catch (e) { log('Player listener unavailable', e); }
        }
    }

    function closePanel() {
        if (panelNode && panelNode.parentNode) panelNode.parentNode.removeChild(panelNode);
        panelNode = null;
    }

    function makeRow(title, key, min, max, step, suffix) {
        var row = document.createElement('div');
        row.className = 'lumina-row';
        var label = document.createElement('label');
        label.className = 'lumina-label';
        label.textContent = title;
        var range = document.createElement('input');
        range.type = 'range';
        range.min = min;
        range.max = max;
        range.step = step;
        range.value = getValue(key);
        range.className = 'lumina-range';
        var value = document.createElement('span');
        value.className = 'lumina-value';
        value.textContent = range.value + (suffix || '');
        range.addEventListener('input', function () {
            value.textContent = range.value + (suffix || '');
            setValue(key, Number(range.value));
        });
        row.appendChild(label);
        row.appendChild(range);
        row.appendChild(value);
        return row;
    }

    function openPanel() {
        closePanel();
        var wrap = document.createElement('div');
        wrap.className = 'lumina-overlay';
        wrap.setAttribute('role', 'dialog');
        wrap.setAttribute('aria-label', NAME);

        var box = document.createElement('div');
        box.className = 'lumina-box';
        var header = document.createElement('div');
        header.className = 'lumina-header';
        var title = document.createElement('div');
        title.className = 'lumina-title';
        title.textContent = NAME;
        var close = document.createElement('button');
        close.className = 'lumina-close';
        close.textContent = 'Закрыть';
        close.addEventListener('click', closePanel);
        header.appendChild(title);
        header.appendChild(close);
        box.appendChild(header);

        var enabledRow = document.createElement('div');
        enabledRow.className = 'lumina-row';
        var enabledLabel = document.createElement('label');
        enabledLabel.className = 'lumina-label';
        enabledLabel.textContent = 'Улучшение изображения';
        var enabled = document.createElement('input');
        enabled.type = 'checkbox';
        enabled.checked = getValue('enabled');
        enabled.className = 'lumina-check';
        enabled.addEventListener('change', function () { setValue('enabled', enabled.checked); });
        enabledRow.appendChild(enabledLabel);
        enabledRow.appendChild(enabled);
        box.appendChild(enabledRow);

        box.appendChild(makeRow('Яркость', 'brightness', 50, 150, 1, '%'));
        box.appendChild(makeRow('Контрастность', 'contrast', 50, 150, 1, '%'));
        box.appendChild(makeRow('Насыщенность', 'saturation', 0, 200, 1, '%'));
        box.appendChild(makeRow('Тёплый оттенок', 'warmth', 0, 100, 1, '%'));
        box.appendChild(makeRow('Цветовой тон', 'hue', -30, 30, 1, '°'));

        var note = document.createElement('div');
        note.className = 'lumina-note';
        note.textContent = 'Работает через аппаратные CSS-фильтры браузера. Не является AI-апскейлером и не увеличивает реальное разрешение видео.';
        box.appendChild(note);

        var reset = document.createElement('button');
        reset.className = 'lumina-reset';
        reset.textContent = 'Сбросить настройки';
        reset.addEventListener('click', function () {
            Object.keys(defaults).forEach(function (key) {
                try {
                    if (window.Lampa && Lampa.Storage && Lampa.Storage.set) Lampa.Storage.set(ID + '_' + key, defaults[key]);
                    else localStorage.setItem(ID + '_' + key, String(defaults[key]));
                } catch (e) {}
            });
            closePanel();
            openPanel();
            applyToVideo();
        });
        box.appendChild(reset);
        wrap.appendChild(box);
        wrap.addEventListener('click', function (event) {
            if (event.target === wrap) closePanel();
        });
        document.body.appendChild(wrap);
        panelNode = wrap;
        close.focus();
    }

    function registerSettings() {
        if (!Lampa.SettingsApi || !Lampa.SettingsApi.addComponent || !Lampa.SettingsApi.addParam) {
            log('SettingsApi not available in this Lampa build');
            return;
        }
        var icon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"/></svg>';
        try {
            Lampa.SettingsApi.addComponent({ component: ID, name: NAME, icon: icon });
            Lampa.SettingsApi.addParam({
                component: ID,
                param: { name: ID + '_open', type: 'button' },
                field: { name: 'Открыть настройки LUMINA', description: 'Цветокоррекция изображения во встроенном плеере' },
                onChange: function () { openPanel(); }
            });
            log('Settings registered');
        } catch (e) { log('Settings registration failed', e); }
    }

    function registerMenu() {
        if (!Lampa.Menu || typeof Lampa.Menu.addButton !== 'function') {
            log('Menu.addButton not available in this Lampa build');
            return;
        }
        try {
            var icon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"/></svg>';
            Lampa.Menu.addButton(icon, NAME, openPanel);
            log('Main menu button registered');
        } catch (e) { log('Menu registration failed', e); }
    }

    function installStyles() {
        if (document.getElementById('lumina-v2-styles')) return;
        styleNode = document.createElement('style');
        styleNode.id = 'lumina-v2-styles';
        styleNode.textContent =
            '.lumina-overlay{position:fixed;inset:0;z-index:2147483000;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box}' +
            '.lumina-box{width:min(760px,96vw);max-height:92vh;overflow:auto;background:#171923;color:#f4f5fa;border:1px solid #454b60;border-radius:14px;padding:20px;box-sizing:border-box;font-family:Arial,sans-serif}' +
            '.lumina-header{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}' +
            '.lumina-title{font-size:20px;font-weight:700}' +
            '.lumina-close,.lumina-reset{background:#30384c;color:#fff;border:1px solid #68738d;border-radius:8px;padding:12px 18px;font-size:16px}' +
            '.lumina-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid #34394a}' +
            '.lumina-label{flex:1;font-size:16px}.lumina-range{flex:2;min-width:100px}.lumina-value{width:58px;text-align:right;font-size:15px;color:#8cc8ff}' +
            '.lumina-check{width:26px;height:26px}.lumina-note{font-size:13px;line-height:1.5;color:#b8bfd0;padding:16px 0}.lumina-reset{margin-top:8px}' +
            '.lumina-close:focus,.lumina-reset:focus,.lumina-range:focus{outline:3px solid #8cc8ff;outline-offset:3px}';
        document.head.appendChild(styleNode);
    }

    function init() {
        if (started) return;
        started = true;
        installStyles();
        registerSettings();
        registerMenu();
        watchVideos();
        log('Started successfully');
        notify(NAME + ' ' + VERSION + ': загружен');
    }

    function waitForLampa() {
        if (!window.Lampa) {
            setTimeout(waitForLampa, 250);
            return;
        }
        if (window.appready) init();
        else if (Lampa.Listener && Lampa.Listener.follow) {
            var readyHandler = function (event) {
                if (event && event.type === 'ready') init();
            };
            Lampa.Listener.follow('app', readyHandler);
            setTimeout(function () { if (window.appready) init(); }, 1500);
        } else {
            setTimeout(init, 1000);
        }
    }

    if (!window.__lumina_video_enhancer_v2__) {
        window.__lumina_video_enhancer_v2__ = true;
        waitForLampa();
    }
})();