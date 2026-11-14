(function () {
    'use strict';

    var ID = 'nova_interface';
    var NAME = 'NOVA • Интерфейс';
    var VERSION = '1.0.0';
    var ready = false;

    var defaults = {
        accent: 'blue',
        density: 'comfortable',
        animations: true,
        showHints: true
    };

    function get(key) {
        try {
            return Lampa.Storage.get('nova_' + key, defaults[key]);
        } catch (e) {
            return defaults[key];
        }
    }

    function set(key, value) {
        try {
            Lampa.Storage.set('nova_' + key, value);
            if (Lampa.Settings && Lampa.Settings.update) Lampa.Settings.update();
            if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show('NOVA: настройки сохранены');
        } catch (e) {
            console.error('[NOVA] Storage error', e);
        }
    }

    function select(title, items, current, callback) {
        var selected = items.map(function (item) {
            return {
                title: item.title,
                value: item.value,
                selected: String(item.value) === String(current)
            };
        });

        Lampa.Select.show({
            title: title,
            items: selected,
            onSelect: function (item) {
                callback(item.value);
                Lampa.Controller.toggle('settings');
            },
            onBack: function () {
                Lampa.Controller.toggle('settings');
            }
        });
    }

    function showAbout() {
        Lampa.Modal.open({
            title: 'NOVA • Интерфейс',
            html: '<div style="padding:20px;line-height:1.6;color:#fff">' +
                '<div style="font-size:22px;font-weight:700;margin-bottom:10px">NOVA UI 1.0</div>' +
                '<div style="opacity:.8">Демонстрационный интерфейс настроек для Lampa.</div>' +
                '<div style="margin-top:14px;padding:12px;border-radius:10px;background:rgba(255,255,255,.08)"> ' +
                'Настройки сохраняются отдельно и не изменяют работу видеоплеера.</div></div>',
            size: 'medium'
        });
    }

    function register() {
        if (!window.Lampa || !Lampa.SettingsApi) return false;

        var icon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 4v5.4l3.5 2.1-1 1.7-4.5-2.8V6h2z"/></svg>';

        Lampa.SettingsApi.addComponent({
            component: ID,
            name: NAME,
            icon: icon
        });

        Lampa.SettingsApi.addParam({
            component: ID,
            param: { name: 'nova_intro', type: 'button' },
            field: { name: 'Открыть информацию', description: 'Версия и описание интерфейса' },
            onChange: showAbout
        });

        Lampa.SettingsApi.addParam({
            component: ID,
            param: { name: 'nova_accent', type: 'button' },
            field: { name: 'Цвет оформления', description: 'Сейчас: ' + get('accent').toUpperCase() },
            onChange: function () {
                select('Цвет оформления', [
                    { title: 'Синий', value: 'blue' },
                    { title: 'Фиолетовый', value: 'purple' },
                    { title: 'Бирюзовый', value: 'teal' },
                    { title: 'Красный', value: 'red' }
                ], get('accent'), function (value) { set('accent', value); });
            }
        });

        Lampa.SettingsApi.addParam({
            component: ID,
            param: { name: 'nova_density', type: 'button' },
            field: { name: 'Размер элементов', description: 'Настройка плотности интерфейса' },
            onChange: function () {
                select('Размер элементов', [
                    { title: 'Компактный', value: 'compact' },
                    { title: 'Стандартный', value: 'comfortable' },
                    { title: 'Крупный', value: 'large' }
                ], get('density'), function (value) { set('density', value); });
            }
        });

        Lampa.SettingsApi.addParam({
            component: ID,
            param: { name: 'nova_animations', type: 'select', values: { 'true': 'Включены', 'false': 'Выключены' }, 'default': String(get('animations')) },
            field: { name: 'Анимации', description: 'Включить или отключить анимации интерфейса' },
            onChange: function (value) { set('animations', value === true || value === 'true'); }
        });

        Lampa.SettingsApi.addParam({
            component: ID,
            param: { name: 'nova_hints', type: 'select', values: { 'true': 'Показывать', 'false': 'Скрыть' }, 'default': String(get('showHints')) },
            field: { name: 'Подсказки', description: 'Показывать пояснения к настройкам' },
            onChange: function (value) { set('showHints', value === true || value === 'true'); }
        });

        Lampa.SettingsApi.addParam({
            component: ID,
            param: { name: 'nova_reset', type: 'button' },
            field: { name: 'Сбросить настройки', description: 'Вернуть стандартные параметры NOVA' },
            onChange: function () {
                Object.keys(defaults).forEach(function (key) { set(key, defaults[key]); });
                if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show('NOVA: настройки сброшены');
            }
        });

        return true;
    }

    function boot() {
        if (ready) return;
        if (!window.Lampa || !Lampa.SettingsApi) {
            setTimeout(boot, 500);
            return;
        }
        try {
            if (register()) {
                ready = true;
                console.log('[NOVA] Interface ' + VERSION + ' loaded');
                if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show('NOVA • Интерфейс загружен');
            }
        } catch (e) {
            console.error('[NOVA] Initialization failed', e);
        }
    }

    boot();
})();