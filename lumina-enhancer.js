// plugin.js
// Lampa Plugin Manifest + Bootstrap

if (!window.Lampa) throw new Error('Lampa core not found');

const PLUGIN_ID = 'lumina_enhancer';
const PLUGIN_NAME = 'LUMINA VIDEO ENHANCER PRO';
const VERSION = '1.0.0';

// 1. Register Styles (Injected into Lampa App)
const styles = `
.lumina-panel { background: rgba(12,12,16,0.98); border: 1px solid #2a2a3a; border-radius: 12px; color: #e8e8f0; font-family: 'Roboto', 'Segoe UI', sans-serif; box-shadow: 0 8px 32px rgba(0,0,0,0.6); backdrop-filter: blur(12px); }
.lumina-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #2a2a3a; }
.lumina-title { font-size: 22px; font-weight: 700; letter-spacing: 0.5px; background: linear-gradient(90deg, #fff, #a0c4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.lumina-status { font-size: 13px; padding: 4px 10px; border-radius: 6px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.lumina-status.active { background: linear-gradient(135deg, #1a5c2e, #0d3b1e); color: #6eff9a; border: 1px solid #2d7a3f; }
.lumina-status.color-only { background: linear-gradient(135deg, #5c4a1a, #3b2e0d); color: #ffe06e; border: 1px solid #7a6b2f; }
.lumina-status.inactive { background: #2a2a3a; color: #888; }

.lumina-tabs { display: flex; gap: 4px; padding: 8px 12px; border-bottom: 1px solid #1e1e2e; overflow-x: auto; }
.lumina-tab { padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #9aa0b0; background: transparent; border: none; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.lumina-tab:hover { color: #fff; background: #25253a; }
.lumina-tab.active { color: #121218; background: linear-gradient(135deg, #a0c4ff, #6ec6ff); font-weight: 600; }

.lumina-content { padding: 16px 20px 20px; max-height: 60vh; overflow-y: auto; }
.lumina-section { margin-bottom: 24px; }
.lumina-section-title { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #6ec6ff; margin-bottom: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
.lumina-section-title::before { content: ''; width: 8px; height: 8px; background: #6ec6ff; border-radius: 2px; }

.lumina-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #1a1a28; gap: 16px; }
.lumina-row:last-child { border-bottom: none; }
.lumina-label { font-size: 15px; color: #d0d4e0; min-width: 200px; }
.lumina-label small { display: block; font-size: 11px; color: #6a6f8a; margin-top: 2px; font-weight: 400; }

.lumina-slider-wrap { flex: 1; max-width: 400px; position: relative; }
.lumina-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 3px; background: #2a2a3a; outline: none; cursor: pointer; }
.lumina-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg, #6ec6ff, #a0c4ff); cursor: pointer; border: 2px solid #121218; box-shadow: 0 0 0 2px rgba(110,198,255,0.4); transition: transform 0.15s, box-shadow 0.15s; }
.lumina-slider::-webkit-slider-thumb:hover { transform: scale(1.15); box-shadow: 0 0 0 4px rgba(110,198,255,0.6); }
.lumina-slider:disabled { opacity: 0.35; cursor: not-allowed; }
.lumina-slider:disabled::-webkit-slider-thumb { background: #4a4a6a; box-shadow: none; border-color: #2a2a3a; }
.lumina-value { font-size: 14px; font-weight: 600; color: #6ec6ff; min-width: 40px; text-align: right; font-variant-numeric: tabular-nums; }

.lumina-toggle { position: relative; width: 56px; height: 30px; }
.lumina-toggle input { opacity: 0; width: 0; height: 0; }
.lumina-toggle-track { position: absolute; inset: 0; background: #2a2a3a; border-radius: 15px; border: 1px solid #3a3a4a; transition: all 0.2s; }
.lumina-toggle-thumb { position: absolute; top: 2px; left: 2px; width: 24px; height: 24px; background: #fff; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.4); transition: transform 0.2s cubic-bezier(0.4,0,0.2,1); }
.lumina-toggle input:checked + .lumina-toggle-track { background: linear-gradient(135deg, #1a5c2e, #0d3b1e); border-color: #2d7a3f; }
.lumina-toggle input:checked + .lumina-toggle-track + .lumina-toggle-thumb { transform: translateX(26px); }
.lumina-toggle input:disabled + .lumina-toggle-track { opacity: 0.4; }

.lumina-select { background: #1a1a28; border: 1px solid #2a2a3a; border-radius: 8px; color: #e8e8f0; padding: 10px 14px; font-size: 14px; min-width: 180px; cursor: pointer; outline: none; }
.lumina-select:focus { border-color: #6ec6ff; box-shadow: 0 0 0 2px rgba(110,198,255,0.2); }
.lumina-select:disabled { opacity: 0.4; }

.lumina-btn { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; border: none; cursor: pointer; transition: all 0.15s; }
.lumina-btn.primary { background: linear-gradient(135deg, #6ec6ff, #4aa8e8); color: #0a0a12; }
.lumina-btn.primary:hover { box-shadow: 0 0 20px rgba(110,198,255,0.4); transform: translateY(-1px); }
.lumina-btn.secondary { background: #2a2a3a; color: #d0d4e0; border: 1px solid #3a3a4a; }
.lumina-btn.secondary:hover { background: #35354a; border-color: #4a4a6a; }
.lumina-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; box-shadow: none !important; }

.lumina-perf { display: flex; gap: 16px; padding: 12px; background: #12121a; border-radius: 8px; border: 1px solid #222232; font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 12px; flex-wrap: wrap; }
.lumina-perf-item { display: flex; flex-direction: column; gap: 2px; }
.lumina-perf-label { color: #6a6f8a; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
.lumina-perf-value { color: #6ec6ff; font-weight: 600; }
.lumina-perf-value.warn { color: #ffcc00; }
.lumina-perf-value.danger { color: #ff5c5c; }

.lumina-tooltip { position: relative; }
.lumina-tooltip:hover::after { content: attr(data-tip); position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%); background: #1a1a28; border: 1px solid #3a3a4a; padding: 8px 12px; border-radius: 6px; font-size: 11px; color: #aaa; white-space: nowrap; z-index: 100; pointer-events: none; box-shadow: 0 4px 16px rgba(0,0,0,0.5); }

/* Focus Styles for TV Remote */
.lumina-tab:focus, .lumina-slider:focus, .lumina-select:focus, .lumina-btn:focus, .lumina-toggle:focus-within { outline: none; box-shadow: 0 0 0 3px rgba(110,198,255,0.5); border-radius: 8px; }
.lumina-slider:focus { border-radius: 3px; }
.lumina-toggle:focus-within .lumina-toggle-track { border-color: #6ec6ff; }

/* Comparison Overlay */
.lumina-compare-overlay { position: absolute; inset: 0; pointer-events: none; z-index: 1000; }
.lumina-compare-split { position: absolute; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, transparent, #6ec6ff, transparent); box-shadow: 0 0 8px #6ec6ff; left: 50%; }
.lumina-compare-handle { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 40px; height: 40px; border-radius: 50%; background: #121218; border: 2px solid #6ec6ff; display: flex; align-items: center; justify-content: center; color: #6ec6ff; font-weight: 700; font-size: 12px; cursor: ew-resize; box-shadow: 0 0 20px rgba(110,198,255,0.4); }
.lumina-compare-label { position: absolute; top: 16px; padding: 4px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.lumina-compare-label.original { left: 16px; background: rgba(20,20,30,0.9); color: #ffcc00; border: 1px solid #444; }
.lumina-compare-label.enhanced { right: 16px; background: rgba(10,30,15,0.9); color: #6eff9a; border: 1px solid #2d7a3f; }
`;

// 2. Bootstrap
async function bootstrap() {
    // Inject Styles
    const styleEl = document.createElement('style');
    styleEl.id = 'lumina-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);

    // Load Modules (ESM style simulation via dynamic import or bundled)
    // In production, bundle with esbuild/rollup into single file.
    // Here we define classes inline for single-file delivery.
    await loadModules();
    
    // Initialize Core
    window.LuminaCore = new LuminaCore();
    await window.LuminaCore.init();

    // Register a real Lampa entry point. Do not rely on the non-standard
    // Lampa.Plugin / Lampa.Settings APIs: many Lampa builds do not expose them.
    function openLuminaPanel() {
        try {
            const container = window.LuminaCore.ui.renderSettings();
            if (Lampa.Modal && typeof Lampa.Modal.open === 'function') {
                Lampa.Modal.open({ title: PLUGIN_NAME, content: container, size: 'large' });
            } else {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'position:fixed;inset:3%;z-index:999999;background:#080810;overflow:auto;padding:12px;';
                const close = document.createElement('button');
                close.textContent = '✕ Закрыть';
                close.style.cssText = 'position:sticky;top:0;z-index:2;padding:10px 18px;margin-bottom:10px;';
                close.addEventListener('click', function () { wrap.remove(); });
                wrap.appendChild(close);
                wrap.appendChild(container);
                document.body.appendChild(wrap);
            }
        } catch (err) {
            console.error('[LUMINA] Не удалось открыть панель', err);
            if (Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show('LUMINA: ошибка открытия панели');
        }
    }

    // The player hook is optional; the panel must remain available even
    // on Lampa forks that do not implement Lampa.Plugin.
    try {
        if (Lampa.Plugin && typeof Lampa.Plugin.add === 'function') {
            Lampa.Plugin.add(PLUGIN_ID, {
                start: function () {},
                player: function (player) { return window.LuminaCore.attachPlayer(player); },
                render: function () { return window.LuminaCore.onRender(); },
                destroy: function () { return window.LuminaCore.destroy(); }
            });
        }
    } catch (hookError) {
        console.warn('[LUMINA] Player hooks unavailable:', hookError);
    }

    // Register in Lampa's supported Settings API and main sidebar.
    try {
        if (Lampa.SettingsApi && typeof Lampa.SettingsApi.addComponent === 'function') {
            Lampa.SettingsApi.addComponent({
                component: PLUGIN_ID,
                name: PLUGIN_NAME,
                icon: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"/></svg>'
            });
            if (typeof Lampa.SettingsApi.addParam === 'function') {
                Lampa.SettingsApi.addParam({
                    component: PLUGIN_ID,
                    param: { name: 'lumina_open_panel', type: 'button' },
                    field: { name: 'Открыть LUMINA VIDEO ENHANCER PRO', description: 'Настройки изображения и видеоэффектов' },
                    onRender: function (item) {
                        item.on('hover:enter click', openLuminaPanel);
                    }
                });
            }
        }
    } catch (settingsError) {
        console.error('[LUMINA] Settings API registration failed:', settingsError);
    }

    try {
        if (Lampa.Menu && typeof Lampa.Menu.addButton === 'function') {
            Lampa.Menu.addButton(
                '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l2.2 6.8L21 11l-6.8 2.2L12 20l-2.2-6.8L3 11l6.8-2.2L12 2z"/></svg>',
                PLUGIN_NAME,
                openLuminaPanel
            );
        }
    } catch (menuError) {
        console.warn('[LUMINA] Sidebar button unavailable:', menuError);
    }

    Lampa.Log && Lampa.Log('[' + PLUGIN_NAME + '] v' + VERSION + ' Loaded');
}

// Lampa APIs are not ready at window.load. Wait for the app's own ready event.
let luminaBootstrapStarted = false;
function startLuminaWhenReady() {
    if (luminaBootstrapStarted) return;
    luminaBootstrapStarted = true;
    bootstrap().catch(function (err) {
        luminaBootstrapStarted = false;
        console.error('[LUMINA] Bootstrap failed:', err);
        if (window.Lampa && Lampa.Noty && Lampa.Noty.show) Lampa.Noty.show('LUMINA: ошибка запуска плагина');
    });
}

if (window.appready) {
    startLuminaWhenReady();
} else if (window.Lampa && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
    Lampa.Listener.follow('app', function (event) {
        if (event && event.type === 'ready') startLuminaWhenReady();
    });
} else {
    // Fallback for forks that do not expose the app event bus immediately.
    window.addEventListener('load', function () {
        if (window.appready) startLuminaWhenReady();
        else if (window.Lampa && Lampa.Listener && typeof Lampa.Listener.follow === 'function') {
            Lampa.Listener.follow('app', function (event) {
                if (event && event.type === 'ready') startLuminaWhenReady();
            });
        }
    });
}

// ============================================================================
// MODULE DEFINITIONS (Bundled for single-file deployment)
// ============================================================================

async function loadModules() {
    // --- UTILS ---
    window.LuminaUtils = {
        Logger: class Logger {
            constructor(prefix) { this.prefix = prefix; this.enabled = Lampa.Storage.get('lumina_debug', false); }
            log(...args) { if (this.enabled) console.log(`[${this.prefix}]`, ...args); }
            warn(...args) { console.warn(`[${this.prefix}]`, ...args); }
            error(...args) { console.error(`[${this.prefix}]`, ...args); }
            perf(label, fn) { const t = performance.now(); const r = fn(); this.log(`${label}: ${(performance.now()-t).toFixed(2)}ms`); return r; }
        },
        Storage: {
            get: (k, d) => Lampa.Storage.get(`lumina_${k}`, d),
            set: (k, v) => Lampa.Storage.set(`lumina_${k}`, v),
            getJSON: (k, d) => { try { return JSON.parse(Lampa.Storage.get(`lumina_${k}`)) || d; } catch { return d; } },
            setJSON: (k, v) => Lampa.Storage.set(`lumina_${k}`, JSON.stringify(v))
        },
        WebGL: {
            createShader: (gl, type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; },
            createProgram: (gl, vs, fs) => { const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p); if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p; },
            createVAO: (gl, ext, buffers, indices) => { const vao = ext.createVertexArrayOES(); ext.bindVertexArrayOES(vao); buffers.forEach(({buffer, size, loc}) => { gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0); }); if (indices) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indices); ext.bindVertexArrayOES(null); return vao; }
        }
    };

    // --- SETTINGS SCHEMA ---
    window.LuminaSettings = {
        schema: {
            // Global
            enabled: { type: 'bool', default: true, label: 'Enable Enhancement' },
            mode: { type: 'enum', values: ['light', 'pro', 'ultra'], default: 'pro', label: 'Processing Mode' },
            gpuMode: { type: 'enum', values: ['auto', 'webgl', 'css'], default: 'auto', label: 'Render Backend', hidden: true },
            
            // Comparison
            compareMode: { type: 'enum', values: ['off', 'split', 'toggle'], default: 'off', label: 'Comparison Mode' },
            compareSplit: { type: 'float', min: 0, max: 1, default: 0.5, step: 0.05, label: 'Split Position' },

            // Color Engine (Works in BOTH modes)
            contrast: { type: 'float', min: 0, max: 200, default: 100, step: 1, label: 'Contrast', unit: '%' },
            brightness: { type: 'float', min: 0, max: 200, default: 100, step: 1, label: 'Brightness', unit: '%' },
            saturation: { type: 'float', min: 0, max: 300, default: 100, step: 1, label: 'Saturation', unit: '%' },
            gamma: { type: 'float', min: 50, max: 200, default: 100, step: 1, label: 'Gamma', unit: '%' },
            temperature: { type: 'float', min: 0, max: 100, default: 50, step: 1, label: 'Temperature', unit: '%' },
            tint: { type: 'float', min: 0, max: 100, default: 50, step: 1, label: 'Tint (Green/Magenta)', unit: '%' },
            vibrance: { type: 'float', min: 0, max: 200, default: 100, step: 1, label: 'Vibrance (Smart Sat)', unit: '%' },
            highlights: { type: 'float', min: 0, max: 100, default: 50, step: 1, label: 'Highlights', unit: '%' },
            shadows: { type: 'float', min: 0, max: 100, default: 50, step: 1, label: 'Shadows', unit: '%' },

            // WebGL Only Engine (Disabled in CSS mode)
            sharpness: { type: 'float', min: 0, max: 150, default: 0, step: 1, label: 'Sharpness', unit: '%', webglOnly: true },
            denoise: { type: 'float', min: 0, max: 100, default: 0, step: 1, label: 'Noise Reduction', unit: '%', webglOnly: true },
            detail: { type: 'float', min: 0, max: 100, default: 0, step: 1, label: 'Detail Enhancement', unit: '%', webglOnly: true },
            textureBoost: { type: 'float', min: 0, max: 100, default: 0, step: 1, label: 'Fine Texture', unit: '%', webglOnly: true },
            haloProtection: { type: 'float', min: 0, max: 100, default: 80, step: 1, label: 'Halo Protection', unit: '%', webglOnly: true },

            // Auto Cinema
            autoEnabled: { type: 'bool', default: false, label: 'Auto Cinema Mode' },
            autoInterval: { type: 'int', min: 5, max: 60, default: 10, step: 1, label: 'Analysis Interval (s)' },

            // Performance
            perfEnabled: { type: 'bool', default: true, label: 'Performance Monitor' },
            targetFps: { type: 'int', min: 24, max: 60, default: 60, step: 1, label: 'Target FPS' },
            adaptiveQuality: { type: 'bool', default: true, label: 'Adaptive Quality' },

            // Profiles
            currentProfile: { type: 'string', default: 'custom', label: 'Active Profile' }
        },
        
        presets: {
            cinema: { name: 'Cinematic', icon: '🎬', desc: 'Natural colors, filmic contrast, gentle sharpness', settings: { mode: 'pro', contrast: 105, brightness: 98, saturation: 95, gamma: 100, temperature: 52, vibrance: 105, sharpness: 15, denoise: 10, detail: 10 } },
            vivid: { name: 'Vivid', icon: '🌈', desc: 'Punchy colors, high contrast, sharp details', settings: { mode: 'pro', contrast: 115, brightness: 102, saturation: 125, gamma: 95, temperature: 48, vibrance: 120, sharpness: 25, denoise: 5, detail: 15 } },
            natural: { name: 'Natural', icon: '🌿', desc: 'Reference accuracy, neutral temperature', settings: { mode: 'pro', contrast: 100, brightness: 100, saturation: 100, gamma: 100, temperature: 50, tint: 50, vibrance: 100, sharpness: 5, denoise: 15 } },
            dark_cinema: { name: 'Dark Cinema', icon: '🌙', desc: 'Shadow detail lift, crushed blacks protection', settings: { mode: 'ultra', contrast: 108, brightness: 105, saturation: 100, gamma: 108, temperature: 55, shadows: 65, highlights: 40, denoise: 20, detail: 20 } },
            anime: { name: 'Anime', icon: '✨', desc: 'Line art sharpening, cel-shading pop', settings: { mode: 'ultra', contrast: 110, brightness: 100, saturation: 115, gamma: 98, sharpness: 35, textureBoost: 20, denoise: 5, detail: 10 } },
            action: { name: 'Action/Sport', icon: '💥', desc: 'Motion clarity, reduced blur, high detail', settings: { mode: 'ultra', contrast: 112, brightness: 100, saturation: 105, gamma: 97, sharpness: 30, detail: 25, denoise: 10, textureBoost: 15 } },
            custom: { name: 'Custom', icon: '⚙️', desc: 'User defined settings', settings: {} }
        },

        getAll() { 
            const s = {}; 
            for (const [k, v] of Object.entries(this.schema)) s[k] = LuminaUtils.Storage.get(k, v.default); 
            return s; 
        },
        setAll(obj) { for (const [k, v] of Object.entries(obj)) if (this.schema[k]) LuminaUtils.Storage.set(k, v); },
        get(k) { const v = this.schema[k]; return LuminaUtils.Storage.get(k, v?.default); },
        set(k, v) { if (this.schema[k]) LuminaUtils.Storage.set(k, v); }
    };

    // --- SHADERS (GLSL 300 ES) ---
    window.LuminaShaders = {
        quadVert: `#version 300 es
            layout(location=0) in vec2 a_pos;
            layout(location=1) in vec2 a_uv;
            out vec2 v_uv;
            void main() { v_uv = a_uv; gl_Position = vec4(a_pos, 0.0, 1.0); }
        `,
        // Color Grading: Lift/Gamma/Gain, Sat, Vibrance, Temp, Tint, Highlights/Shadows
        colorFrag: `#version 300 es
            precision highp float;
            in vec2 v_uv;
            layout(location=0) out vec4 outColor;
            uniform sampler2D u_tex;
            uniform vec3 u_lift;    // Shadows
            uniform vec3 u_gamma;   // Midtones
            uniform vec3 u_gain;    // Highlights
            uniform float u_sat;    // Saturation
            uniform float u_vib;    // Vibrance
            uniform float u_temp;   // Temperature
            uniform float u_tint;   // Tint
            uniform float u_contrast;
            uniform float u_brightness;
            uniform float u_gammaGlobal;

            // Rec.709 Luma
            const vec3 LUM = vec3(0.2126, 0.7152, 0.0722);

            vec3 rgb2hsv(vec3 c) { vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0); vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g)); vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r)); float d = q.x - min(q.w, q.y); float e = 1.0e-10; return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x); }
            vec3 hsv2rgb(vec3 c) { vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0); vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www); return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y); }

            void main() {
                vec3 col = texture(u_tex, v_uv).rgb;
                
                // 1. Exposure/Brightness (Linear)
                col *= u_brightness;
                
                // 2. Contrast (Pivot 0.5)
                col = (col - 0.5) * u_contrast + 0.5;
                
                // 3. Lift/Gamma/Gain (ASC CDL style approx)
                col = col * u_gain + u_lift;
                col = pow(max(col, 0.0), u_gamma);
                
                // 4. Global Gamma
                col = pow(max(col, 0.0), vec3(1.0 / u_gammaGlobal));
                
                // 5. Temperature / Tint (Simplified Planckian offset)
                // Temp: Blue<->Orange (Yellow/Blue balance)
                // Tint: Green<->Magenta
                float temp = (u_temp - 0.5) * 0.1; // -0.05 to 0.05
                float tint = (u_tint - 0.5) * 0.1;
                col.r += temp + tint;
                col.b += -temp + tint;
                col.g += -tint * 0.5; // Compensate green slightly
                
                // 6. Saturation / Vibrance
                float lum = dot(col, LUM);
                vec3 grey = vec3(lum);
                
                // Vibrance: saturates low-sat pixels more
                float maxC = max(max(col.r, col.g), col.b);
                float minC = min(min(col.r, col.g), col.b);
                float sat = (maxC - minC) / (maxC + 1e-5);
                float vibFactor = 1.0 + u_vib * (1.0 - sat);
                
                col = mix(grey, col, u_sat * vibFactor);
                
                // 7. Highlights / Shadows (Simple curve)
                float l = dot(col, LUM);
                float hl = smoothstep(0.6, 1.0, l);
                float sh = smoothstep(0.0, 0.4, 1.0 - l);
                col = mix(col, col * (1.0 + (u_highlights - 1.0) * hl), hl);
                col = mix(col, col * (1.0 + (u_shadows - 1.0) * sh), sh);
                
                outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
            }
        `,
        // Sharpen: Unsharp Mask + Edge Adaptive + Halo Protection
        sharpenFrag: `#version 300 es
            precision highp float;
            in vec2 v_uv;
            layout(location=0) out vec4 outColor;
            uniform sampler2D u_tex;
            uniform vec2 u_texelSize;
            uniform float u_strength;      // 0.0 - 1.5
            uniform float u_haloProtection; // 0.0 - 1.0
            uniform float u_textureBoost;  // 0.0 - 1.0
            
            // 3x3 Gaussian weights
            const float w[9] = float[](0.0625, 0.125, 0.0625, 0.125, 0.25, 0.125, 0.0625, 0.125, 0.0625);
            
            void main() {
                vec3 center = texture(u_tex, v_uv).rgb;
                vec3 blur = vec3(0.0);
                
                // 3x3 Blur
                for (int y = -1; y <= 1; y++) {
                    for (int x = -1; x <= 1; x++) {
                        vec2 off = vec2(float(x), float(y)) * u_texelSize;
                        int i = (y + 1) * 3 + (x + 1);
                        blur += texture(u_tex, v_uv + off).rgb * w[i];
                    }
                }
                
                vec3 highFreq = center - blur;
                
                // Edge Detection (Luma variance) for Adaptive Sharpening
                float lumaCenter = dot(center, vec3(0.2126, 0.7152, 0.0722));
                float lumaBlur = dot(blur, vec3(0.2126, 0.7152, 0.0722));
                float edge = abs(lumaCenter - lumaBlur);
                
                // Halo Protection: Reduce sharpening near high contrast edges (overshoot)
                // If highFreq sign differs from edge direction? No, simple magnitude clamp.
                float hp = u_haloProtection;
                highFreq *= mix(1.0, smoothstep(0.02, 0.1, edge), hp); // Reduce on strong edges
                
                // Texture Boost: High-pass smaller radius (1px) added
                vec3 microDetail = vec3(0.0);
                if (u_textureBoost > 0.0) {
                    vec3 blur2 = (texture(u_tex, v_uv + vec2(u_texelSize.x, 0.0)).rgb +
                                  texture(u_tex, v_uv - vec2(u_texelSize.x, 0.0)).rgb +
                                  texture(u_tex, v_uv + vec2(0.0, u_texelSize.y)).rgb +
                                  texture(u_tex, v_uv - vec2(0.0, u_texelSize.y)).rgb) * 0.25;
                    microDetail = center - blur2;
                }
                
                vec3 result = center + highFreq * u_strength + microDetail * u_textureBoost * 0.5;
                outColor = vec4(clamp(result, 0.0, 1.0), 1.0);
            }
        `,
        // Denoise: Spatial (Non-Local Means approximation / Bilateral) + Temporal (Prev Frame)
        denoiseFrag: `#version 300 es
            precision highp float;
            in vec2 v_uv;
            layout(location=0) out vec4 outColor;
            uniform sampler2D u_tex;
            uniform sampler2D u_prevTex; // Temporal
            uniform vec2 u_texelSize;
            uniform float u_strength;    // 0.0 - 1.0
            uniform float u_temporal;    // 0.0 - 1.0
            uniform float u_edgePreserve; // 0.0 - 1.0
            
            void main() {
                vec3 center = texture(u_tex, v_uv).rgb;
                vec3 result = center;
                
                // Spatial: 5x5 Bilateral-ish (Fast approximation: 3x3 weighted by color diff)
                if (u_strength > 0.0) {
                    vec3 sum = vec3(0.0);
                    float wSum = 0.0;
                    for (int y = -2; y <= 2; y++) {
                        for (int x = -2; x <= 2; x++) {
                            if (x == 0 && y == 0) continue;
                            vec2 off = vec2(float(x), float(y)) * u_texelSize;
                            vec3 sample = texture(u_tex, v_uv + off).rgb;
                            float dist = length(vec2(float(x), float(y))) * 0.25;
                            float colorDiff = length(sample - center);
                            // Gaussian spatial * Gaussian range
                            float w = exp(-dist * 2.0) * exp(-colorDiff * colorDiff * 50.0 * (1.0 + u_edgePreserve * 4.0));
                            sum += sample * w;
                            wSum += w;
                        }
                    }
                    vec3 spatial = sum / max(wSum, 1e-5);
                    result = mix(center, spatial, u_strength);
                }
                
                // Temporal: Blend with previous frame (Motion adaptive)
                if (u_temporal > 0.0 && u_prevTex != u_tex) { // Check bound
                    vec3 prev = texture(u_prevTex, v_uv).rgb;
                    float diff = length(result - prev);
                    // Simple motion detection: if diff high, trust current (reduce ghosting)
                    float motion = smoothstep(0.02, 0.15, diff);
                    float blend = u_temporal * (1.0 - motion);
                    result = mix(result, prev, blend);
                }
                
                outColor = vec4(result, 1.0);
            }
        `,
        // Detail: Local Contrast (Unsharp on Luma only) + Clarity
        detailFrag: `#version 300 es
            precision highp float;
            in vec2 v_uv;
            layout(location=0) out vec4 outColor;
            uniform sampler2D u_tex;
            uniform vec2 u_texelSize;
            uniform float u_amount;      // 0.0 - 1.0
            uniform float u_radius;      // 1.0 - 5.0 (scale)
            
            const vec3 LUM = vec3(0.2126, 0.7152, 0.0722);
            
            void main() {
                vec3 col = texture(u_tex, v_uv).rgb;
                float luma = dot(col, LUM);
                
                // Large radius blur for Local Contrast (Clarity)
                // Separable 2-pass would be better, here single pass 9-tap scaled
                float blur = 0.0;
                float wSum = 0.0;
                float r = u_radius;
                for (int i = -4; i <= 4; i++) {
                    float f = float(i) * r;
                    vec2 off = vec2(f, 0.0) * u_texelSize;
                    float w = exp(-f * f * 0.1);
                    blur += dot(texture(u_tex, v_uv + off).rgb, LUM) * w;
                    wSum += w;
                    off = vec2(0.0, f) * u_texelSize;
                    blur += dot(texture(u_tex, v_uv + off).rgb, LUM) * w;
                    wSum += w;
                }
                blur /= wSum;
                
                float contrast = (luma - blur) * u_amount;
                // Apply contrast to color preserving hue/sat (approx)
                col = col + (col - vec3(luma)) * 0.0 + vec3(contrast); // Simplified: add to all channels
                
                outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
            }
        `,
        // LUT / Final Output (Tonemap, Dither)
        outputFrag: `#version 300 es
            precision highp float;
            in vec2 v_uv;
            layout(location=0) out vec4 outColor;
            uniform sampler2D u_tex;
            uniform float u_dither;
            
            void main() {
                vec3 col = texture(u_tex, v_uv).rgb;
                // Dither (8-bit banding fix)
                if (u_dither > 0.0) {
                    float noise = fract(sin(dot(v_uv * 1000.0, vec2(12.9898, 78.233))) * 43758.5453);
                    col += (noise - 0.5) / 255.0 * u_dither;
                }
                // sRGB Encode (Assume linear input from pipeline? No, shaders work in sRGB space usually for video)
                // Video is already sRGB. Skip tonemap.
                outColor = vec4(clamp(col, 0.0, 1.0), 1.0);
            }
        `
    };

    // --- CORE: PLAYER BRIDGE ---
    class PlayerBridge {
        constructor() {
            this.player = null;
            this.video = null;
            this.canvas = null;
            this.gl = null;
            this.corsOk = false;
            this.drmDetected = false;
            this.onFrameCallbacks = new Set();
            this.logger = new LuminaUtils.Logger('Bridge');
        }

        async attach(player) {
            this.player = player;
            // Lampa player object has .html (container) and .video (HTMLVideoElement) usually
            // Wait for video element to be ready
            const findVideo = () => {
                if (player.video) return player.video;
                if (player.html) return player.html.querySelector('video');
                return null;
            };

            this.video = findVideo();
            if (!this.video) {
                // Try deferred
                await new Promise(r => setTimeout(r, 500));
                this.video = findVideo();
            }
            if (!this.video) { this.logger.error('Video element not found'); return false; }

            this.logger.log('Video element attached', this.video.src);
            
            // Detect DRM
            this.drmDetected = this.video.src?.includes('widevine') || this.video.src?.includes('drm') || !!this.video.mediaKeys;
            
            // Test CORS: Try to draw to canvas (will throw if tainted)
            this.corsOk = await this.testCORS();
            
            // Setup Canvas Overlay (for WebGL Path)
            if (this.corsOk && !this.drmDetected) {
                this.setupCanvas();
            }

            // Hook Events
            this.video.addEventListener('play', () => this.onPlay());
            this.video.addEventListener('pause', () => this.onPause());
            this.video.addEventListener('ended', () => this.onPause());
            this.video.addEventListener('ratechange', () => this.onRateChange());
            
            // Lampa specific: Fullscreen changes, Quality changes
            if (player.on) {
                player.on('resize', () => this.onResize());
                player.on('quality', () => this.onQualityChange());
            }

            return true;
        }

        async testCORS() {
            if (!this.video || this.drmDetected) return false;
            // Create a tiny offscreen canvas to test tainting
            const testCanvas = document.createElement('canvas');
            testCanvas.width = 1; testCanvas.height = 1;
            const ctx = testCanvas.getContext('2d');
            try {
                // Need to wait for video to have frame
                if (this.video.readyState < 2) await new Promise(r => this.video.onloadeddata = r);
                ctx.drawImage(this.video, 0, 0, 1, 1);
                ctx.getImageData(0, 0, 1, 1); // This throws SecurityError if tainted
                this.logger.log('CORS Test: PASSED (Full WebGL Available)');
                return true;
            } catch (e) {
                this.logger.warn('CORS Test: FAILED (CSS Filter Mode Only)', e.name);
                return false;
            }
        }

        setupCanvas() {
            this.canvas = document.createElement('canvas');
            this.canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:none;z-index:10;'; // Hidden by default
            this.video.parentNode.insertBefore(this.canvas, this.video.nextSibling);
            
            // High DPI
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            this.canvas.width = this.video.videoWidth * dpr;
            this.canvas.height = this.video.videoHeight * dpr;
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';

            this.gl = this.canvas.getContext('webgl2', { alpha: false, antialias: false, preserveDrawingBuffer: false, powerPreference: 'high-performance' });
            if (!this.gl) { this.logger.error('WebGL2 not supported'); this.corsOk = false; return; }
            
            // Extensions
            this.extVAO = this.gl.getExtension('OES_vertex_array_object');
            this.extFloat = this.gl.getExtension('EXT_color_buffer_float');
            this.logger.log('WebGL Context Created', { dpr, ext: { vao: !!this.extVAO, float: !!this.extFloat } });
        }

        onPlay() { this.running = true; this.tick(); }
        onPause() { this.running = false; }
        onRateChange() { /* handle slowmo */ }
        onResize() { if (this.canvas) { const dpr = Math.min(window.devicePixelRatio||1,2); this.canvas.width=this.video.videoWidth*dpr; this.canvas.height=this.video.videoHeight*dpr; } }
        onQualityChange() { setTimeout(() => this.corsOk = this.testCORS(), 1000); }

        tick() {
            if (!this.running) return;
            if (this.corsOk && this.gl && this.video.readyState >= 3) {
                // Notify engines
                this.onFrameCallbacks.forEach(cb => cb(this.gl, this.video, this.canvas));
            }
            requestAnimationFrame(() => this.tick());
        }

        onFrame(cb) { this.onFrameCallbacks.add(cb); return () => this.onFrameCallbacks.delete(cb); }
        showCanvas(show) { if (this.canvas) this.canvas.style.display = show ? 'block' : 'none'; if (show) this.video.style.opacity = '0'; else this.video.style.opacity = '1'; }
        destroy() { this.running = false; this.onFrameCallbacks.clear(); if (this.canvas) this.canvas.remove(); }
    }

    // --- ENGINE: CSS FILTER (Path B - Universal) ---
    class CSSEngine {
        constructor(video) { this.video = video; this.styleEl = null; this.svgFilterId = 'lumina-svg-filter'; this.svgNS = 'http://www.w3.org/2000/svg'; this.logger = new LuminaUtils.Logger('CSSEngine'); }
        
        apply(settings) {
            if (!this.video) return;
            
            // 1. CSS Filters (Fast, Hardware Compositor)
            // Order matters: contrast -> brightness -> saturate -> hue -> blur
            const c = settings.contrast / 100;
            const b = settings.brightness / 100;
            const s = settings.saturation / 100;
            const g = settings.gamma / 100; // CSS has no gamma. Approx via contrast/brightness curve? No.
            // Gamma requires SVG Component Transfer or WebGL.
            
            let cssFilter = `contrast(${c}) brightness(${b}) saturate(${s})`;
            
            // Temperature/Tint approx via Hue-Rotate + Sepia hack (Limited)
            // Hue rotate shifts all colors. Temp needs selective R/B shift.
            // We will use SVG Filter for Temp/Tint/Gamma/Highlights/Shadows/Vibrance.
            
            this.video.style.filter = cssFilter;
            this.applySVG(settings);
        }

        applySVG(settings) {
            // Remove old
            let svg = document.getElementById(this.svgFilterId);
            if (!svg) {
                svg = document.createElementNS(this.svgNS, 'svg');
                svg.id = this.svgFilterId;
                svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;';
                svg.innerHTML = `<filter id="lumina-filter"><feComponentTransfer id="lumina-gamma"/><feColorMatrix id="lumina-colormatrix" type="matrix"/><feFuncR id="lumina-funcR" type="table"/><feFuncG id="lumina-funcG" type="table"/><feFuncB id="lumina-funcB" type="table"/></filter>`; // feComponentTransfer needs children
                // Fix structure
                svg.innerHTML = `
                    <filter id="lumina-filter" color-interpolation-filters="sRGB">
                        <feComponentTransfer id="lumina-gamma">
                            <feFuncR type="gamma" amplitude="1" exponent="1" offset="0"/>
                            <feFuncG type="gamma" amplitude="1" exponent="1" offset="0"/>
                            <feFuncB type="gamma" amplitude="1" exponent="1" offset="0"/>
                        </feComponentTransfer>
                        <feColorMatrix id="lumina-colormatrix" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
                        <feComponentTransfer id="lumina-hlsh">
                            <feFuncR type="table" tableValues="0 1"/>
                            <feFuncG type="table" tableValues="0 1"/>
                            <feFuncB type="table" type="table" tableValues="0 1"/>
                        </feComponentTransfer>
                    </filter>`;
                document.body.appendChild(svg);
            }
            
            const filter = svg.querySelector('#lumina-filter');
            if (!filter) return;
            
            // Apply to video
            this.video.style.filter = this.video.style.filter.replace(/url\(#lumina-filter\)/, '') + ` url(#${this.svgFilterId})`;
            
            // 1. Gamma (feComponentTransfer)
            const g = settings.gamma / 100;
            const exp = 1.0 / Math.max(0.01, g);
            ['R','G','B'].forEach(ch => {
                const el = svg.querySelector(`#lumina-gamma feFunc${ch}`);
                if (el) { el.setAttribute('exponent', exp); el.setAttribute('amplitude', 1); el.setAttribute('offset', 0); }
            });

            // 2. Color Matrix: Temp, Tint, Vibrance, Sat (additional)
            // Matrix: [R, G, B, A, Offset]
            // Vibrance/Sat/Temp/Tint are complex in 4x5 matrix. 
            // We'll implement a simplified Temp/Tint matrix.
            const temp = (settings.temperature - 50) / 50; // -1 to 1
            const tint = (settings.tint - 50) / 50;       // -1 to 1
            const vib = settings.vibrance / 100;
            
            // Simple Temp Matrix (Bradford adapted approx)
            // R += temp * 0.5; B -= temp * 0.5; G unchanged mostly
            // Tint: R += tint * 0.5; G -= tint; B += tint * 0.5
            const m = [
                1 + temp*0.2 + tint*0.2,     -tint*0.1,                   -temp*0.2 + tint*0.2, 0, 0,
                -tint*0.1,                   1 - tint*0.2,                -tint*0.1, 0, 0,
                -temp*0.2 + tint*0.2,        -tint*0.1,                   1 - temp*0.2 + tint*0.2, 0, 0,
                0, 0, 0, 1, 0
            ];
            svg.querySelector('#lumina-colormatrix').setAttribute('values', m.join(' '));
            
            // 3. Highlights/Shadows via feComponentTransfer Table (Curves)
            // Generate 256 values for R,G,B (same for simplicity)
            const hl = settings.highlights / 50; // 0-2
            const sh = settings.shadows / 50;    // 0-2
            let table = '';
            for (let i=0; i<256; i++) {
                let v = i / 255;
                // Shadow lift
                if (v < 0.5) v = Math.pow(v, 2 - sh); 
                // Highlight compression
                else v = 1 - Math.pow(1 - v, 2 - hl);
                table += v.toFixed(4) + ' ';
            }
            ['R','G','B'].forEach(ch => {
                const el = svg.querySelector(`#lumina-hlsh feFunc${ch}`);
                if (el) { el.setAttribute('tableValues', table.trim()); el.setAttribute('type', 'table'); }
            });
        }

        disable() { 
            if (this.video) this.video.style.filter = 'none'; 
            const svg = document.getElementById(this.svgFilterId);
            if (svg) svg.remove();
        }
    }

    // --- ENGINE: WEBGL (Path A - Full) ---
    class WebGLEngine {
        constructor(bridge) {
            this.bridge = bridge;
            this.gl = bridge.gl;
            this.extVAO = bridge.extVAO;
            this.logger = new LuminaUtils.Logger('WebGL');
            this.programs = {};
            this.textures = { input: null, temp1: null, temp2: null, prev: null };
            this.vao = null;
            this.frameCount = 0;
            this.settings = {};
            this.initGL();
        }

        initGL() {
            const gl = this.gl;
            // Compile Shaders
            const vs = LuminaUtils.WebGL.createShader(gl, gl.VERTEX_SHADER, LuminaShaders.quadVert);
            this.programs.color = LuminaUtils.WebGL.createProgram(gl, vs, LuminaUtils.WebGL.createShader(gl, gl.FRAGMENT_SHADER, LuminaShaders.colorFrag));
            this.programs.sharpen = LuminaUtils.WebGL.createProgram(gl, vs, LuminaUtils.WebGL.createShader(gl, gl.FRAGMENT_SHADER, LuminaShaders.sharpenFrag));
            this.programs.denoise = LuminaUtils.WebGL.createProgram(gl, vs, LuminaUtils.WebGL.createShader(gl, gl.FRAGMENT_SHADER, LuminaShaders.denoiseFrag));
            this.programs.detail = LuminaUtils.WebGL.createProgram(gl, vs, LuminaUtils.WebGL.createShader(gl, gl.FRAGMENT_SHADER, LuminaShaders.detailFrag));
            this.programs.output = LuminaUtils.WebGL.createProgram(gl, vs, LuminaUtils.WebGL.createShader(gl, gl.FRAGMENT_SHADER, LuminaShaders.outputFrag));

            // Cache Uniform Locations
            this.unilocs = {};
            for (const [k, p] of Object.entries(this.programs)) {
                gl.useProgram(p);
                this.unilocs[k] = {};
                const num = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
                for (let i=0; i<num; i++) {
                    const u = gl.getActiveUniform(p, i);
                    this.unilocs[k][u.name] = gl.getUniformLocation(p, u.name);
                }
            }

            // Quad VAO
            const posBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, posBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
            const uvBuf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,1, 1,1, 0,0, 1,0]), gl.STATIC_DRAW);
            this.vao = LuminaUtils.WebGL.createVAO(gl, this.extVAO, [
                {buffer: posBuf, size: 2, loc: 0},
                {buffer: uvBuf, size: 2, loc: 1}
            ]);
            
            // Textures created on first frame (need video dims)
        }

        ensureTextures(w, h) {
            const gl = this.gl;
            if (this.textures.input && this.textures.input.width === w && this.textures.input.height === h) return;
            
            const createTex = (filter = gl.LINEAR) => {
                const t = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D, t);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                return t;
            };

            this.textures.input = createTex();
            this.textures.temp1 = createTex();
            this.textures.temp2 = createTex();
            this.textures.prev = createTex(); // For temporal denoise
            
            // Framebuffers
            this.fbo1 = gl.createFramebuffer();
            this.fbo2 = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo1); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures.temp1, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo2); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.textures.temp2, 0);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            
            this.logger.log('Textures/FBOs Created', { w, h });
        }

        renderFrame(video, settings) {
            const gl = this.gl;
            const dpr = this.bridge.canvas.width / video.videoWidth;
            const w = video.videoWidth; // Logical
            const h = video.videoHeight;
            
            this.ensureTextures(this.bridge.canvas.width, this.bridge.canvas.height);
            
            gl.viewport(0, 0, this.bridge.canvas.width, this.bridge.canvas.height);
            gl.disable(gl.BLEND); gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
            
            // 1. Upload Video to Input Texture
            gl.bindTexture(gl.TEXTURE_2D, this.textures.input);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, video);
            
            let currentRead = this.textures.input;
            let currentFBO = this.fbo1;
            let currentWrite = this.textures.temp1;
            const texelSize = [1.0 / this.bridge.canvas.width, 1.0 / this.bridge.canvas.height];
            
            const pingPong = (progName, uniforms) => {
                const prog = this.programs[progName];
                gl.useProgram(prog);
                this.extVAO.bindVertexArrayOES(this.vao);
                gl.bindFramebuffer(gl.FRAMEBUFFER, currentFBO);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, currentWrite, 0);
                gl.viewport(0, 0, this.bridge.canvas.width, this.bridge.canvas.height);
                
                gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, currentRead);
                gl.uniform1i(this.unilocs[progName].u_tex, 0);
                if (this.unilocs[progName].u_prevTex) { gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.textures.prev); gl.uniform1i(this.unilocs[progName].u_prevTex, 1); }
                if (this.unilocs[progName].u_texelSize) gl.uniform2fv(this.unilocs[progName].u_texelSize, texelSize);
                
                Object.entries(uniforms).forEach(([k, v]) => {
                    const loc = this.unilocs[progName][k];
                    if (!loc) return;
                    if (Array.isArray(v)) gl[`uniform${v.length}fv`](loc, v);
                    else gl.uniform1f(loc, v);
                });
                
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                
                // Swap
                [currentRead, currentWrite] = [currentWrite, currentRead];
                [currentFBO] = [currentFBO === this.fbo1 ? this.fbo2 : this.fbo1];
            };

            // --- PIPELINE ORDER ---
            // 1. Denoise (Needs clean input)
            if (settings.denoise > 0) {
                pingPong('denoise', { 
                    u_strength: settings.denoise / 100, 
                    u_temporal: settings.denoise / 200, // Mild temporal
                    u_edgePreserve: 0.5 
                });
            }
            
            // 2. Color Grading (Base look)
            // Map settings to shader uniforms
            const lift = settings.shadows / 50 - 1; // -1 to 1
            const gain = settings.highlights / 50;  // 0 to 2
            const gamma = settings.gamma / 100;
            
            pingPong('color', {
                u_lift: [lift*0.02, lift*0.02, lift*0.02],
                u_gamma: [gamma, gamma, gamma],
                u_gain: [gain, gain, gain],
                u_sat: settings.saturation / 100,
                u_vib: (settings.vibrance - 100) / 100,
                u_temp: settings.temperature / 100,
                u_tint: settings.tint / 100,
                u_contrast: settings.contrast / 100,
                u_brightness: settings.brightness / 100,
                u_gammaGlobal: gamma,
                u_highlights: settings.highlights / 50,
                u_shadows: settings.shadows / 50
            });

            // 3. Sharpening
            if (settings.sharpness > 0) {
                pingPong('sharpen', {
                    u_strength: settings.sharpness / 100,
                    u_haloProtection: settings.haloProtection / 100,
                    u_textureBoost: settings.textureBoost / 100
                });
            }

            // 4. Detail / Local Contrast
            if (settings.detail > 0) {
                pingPong('detail', {
                    u_amount: settings.detail / 100,
                    u_radius: 1.0 + settings.textureBoost / 50
                });
            }

            // 5. Final Output (Dither) -> Screen
            gl.bindFramebuffer(gl.FRAMEBUFFER, null); // Draw to Canvas (Screen)
            gl.viewport(0, 0, this.bridge.canvas.width, this.bridge.canvas.height);
            const prog = this.programs.output;
            gl.useProgram(prog);
            this.extVAO.bindVertexArrayOES(this.vao);
            gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, currentRead);
            gl.uniform1i(this.unilocs.output.u_tex, 0);
            gl.uniform1f(this.unilocs.output.u_dither, 1.0);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            
            // Copy currentRead to Prev Texture for next frame temporal
            // Blit is faster than readback/draw
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, currentFBO === this.fbo1 ? this.fbo2 : this.fbo1); // The one we just wrote to (currentRead)
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, gl.createFramebuffer()); // Temp? No, bind prev texture to a fbo.
            // Simpler: Just draw currentRead to prevTex via blit if same size, or shader.
            // We'll skip temporal blit for brevity, denoise temporal uses prev frame from last loop.
            // Need to copy currentRead -> textures.prev
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null); // Can't blit from texture directly easily without FBO.
            // Hack: Bind prevTex to fbo1, blit from current FBO (which holds currentRead? No, currentRead is texture).
            // Let's just accept no temporal for now or use copyTexSubImage2D.
            gl.bindTexture(gl.TEXTURE_2D, this.textures.prev);
            gl.copyTexSubImage2D(gl.TEXTURE_2D, 0, 0, 0, 0, 0, this.bridge.canvas.width, this.bridge.canvas.height);
            
            this.extVAO.bindVertexArrayOES(null);
            this.frameCount++;
        }

        updateSettings(s) { this.settings = s; }
        destroy() { 
            const gl = this.gl;
            Object.values(this.programs).forEach(p => gl.deleteProgram(p));
            Object.values(this.textures).forEach(t => gl.deleteTexture(t));
            gl.deleteFramebuffer(this.fbo1); gl.deleteFramebuffer(this.fbo2);
            this.extVAO.deleteVertexArrayOES(this.vao);
        }
    }

    // --- ENGINE: AUTO CINEMA ---
    class AutoCinema {
        constructor(bridge) { this.bridge = bridge; this.logger = new LuminaUtils.Logger('AutoCinema'); this.running = false; this.interval = null; }
        async analyzeFrame() {
            if (!this.bridge.corsOk) return null; // Cannot analyze pixels
            // Draw to small canvas, read pixels, compute histogram
            const c = document.createElement('canvas'); c.width = 160; c.height = 90;
            const ctx = c.getContext('2d');
            ctx.drawImage(this.bridge.video, 0, 0, 160, 90);
            const data = ctx.getImageData(0, 0, 160, 90).data;
            
            let lumSum = 0, satSum = 0, cnt = 0;
            const hist = new Array(256).fill(0);
            for (let i=0; i<data.length; i+=4) {
                const r=data[i], g=data[i+1], b=data[i+2];
                const l = 0.2126*r + 0.7152*g + 0.0722*b;
                const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
                const s = mx === 0 ? 0 : (mx-mn)/mx;
                lumSum += l; satSum += s; cnt++;
                hist[Math.round(l)]++;
            }
            const avgLum = lumSum / cnt / 255;
            const avgSat = satSum / cnt;
            
            // Detect Scene Type
            let profile = 'cinema';
            if (avgLum < 0.2) profile = 'dark_cinema';
            else if (avgSat > 0.4) profile = 'vivid';
            else if (avgLum > 0.7) profile = 'natural';
            
            return { profile, avgLum, avgSat, hist };
        }
        start(cb) { if (this.running) return; this.running = true; this.cb = cb; this.tick(); }
        stop() { this.running = false; if (this.interval) clearInterval(this.interval); }
        async tick() { if (!this.running) return; const res = await this.analyzeFrame(); if (res && this.cb) this.cb(res); this.interval = setTimeout(() => this.tick(), LuminaSettings.get('autoInterval') * 1000); }
    }

    // --- PERFORMANCE MONITOR ---
    class PerformanceMonitor {
        constructor() { this.frames = []; this.lastTime = performance.now(); this.dropped = 0; this.stats = { fps: 60, frameTime: 16.6, gpuTime: 0, resolution: '0x0' }; }
        frameStart() { this.frameStartTime = performance.now(); }
        frameEnd(gpuTime = 0) {
            const now = performance.now();
            const cpuTime = now - this.frameStartTime;
            const dt = now - this.lastTime;
            this.lastTime = now;
            this.frames.push({ cpu: cpuTime, gpu: gpuTime, dt });
            if (this.frames.length > 120) this.frames.shift();
            
            // Calc FPS
            if (this.frames.length > 1) {
                const totalDt = this.frames[this.frames.length-1].dt * this.frames.length; // approx
                this.stats.fps = 1000 / (this.frames[this.frames.length-1].dt || 16.6);
                this.stats.frameTime = this.frames.reduce((a,b)=>a+b.cpu,0)/this.frames.length;
                this.stats.gpuTime = gpuTime;
            }
        }
        getStats() { return { ...this.stats, fps: Math.round(this.stats.fps), frameTime: this.stats.frameTime.toFixed(2) }; }
        checkAdaptive(settings, applyPreset) {
            if (!LuminaSettings.get('adaptiveQuality')) return;
            const s = this.getStats();
            if (s.fps < LuminaSettings.get('targetFps') * 0.85) {
                // Downgrade
                if (settings.mode === 'ultra') { applyPreset('pro'); this.logger.warn('Perf: Downgraded to PRO'); }
                else if (settings.mode === 'pro') { applyPreset('light'); this.logger.warn('Perf: Downgraded to LIGHT'); }
                else { LuminaSettings.set('enabled', false); this.logger.error('Perf: Disabled Enhancement'); }
            }
        }
    }

    // --- UI: PANEL & CONTROLS ---
    class LuminaUI {
        constructor(core) { this.core = core; this.panel = null; this.focusable = []; this.focusIndex = 0; this.logger = new LuminaUtils.Logger('UI'); }
        
        renderSettings() {
            // Called from Lampa Settings Menu
            const container = document.createElement('div');
            container.className = 'lumina-settings-container';
            container.innerHTML = this.buildPanelHTML();
            this.bindEvents(container);
            this.updateAllValues();
            return container;
        }

        buildPanelHTML() {
            const s = LuminaSettings.schema;
            const presets = LuminaSettings.presets;
            const current = LuminaSettings.getAll();
            const mode = current.mode;
            const isWebGL = this.core.bridge.corsOk && !this.core.bridge.drmDetected && current.gpuMode !== 'css';
            
            let html = `
                <div class="lumina-panel" style="max-width: 720px; margin: 20px auto;">
                    <div class="lumina-header">
                        <div class="lumina-title">LUMINA VIDEO ENHANCER PRO</div>
                        <div class="lumina-status ${isWebGL ? 'active' : 'color-only'}">${isWebGL ? 'GPU: FULL PIPELINE' : 'GPU: COLOR ONLY (CORS Limited)'}</div>
                    </div>
                    <div class="lumina-tabs" role="tablist">
                        <button class="lumina-tab active" data-tab="main" role="tab">Main</button>
                        <button class="lumina-tab" data-tab="color" role="tab">Color</button>
                        <button class="lumina-tab" data-tab="enhance" role="tab" ${!isWebGL ? 'disabled' : ''}>Enhance</button>
                        <button class="lumina-tab" data-tab="profiles" role="tab">Profiles</button>
                        <button class="lumina-tab" data-tab="perf" role="tab">Performance</button>                    </div>
            `;

            // MAIN TAB
            html += `<div class="lumina-content" id="tab-main">`;
            html += this.renderSection('Global', [
                this.renderToggle('enabled', 'Enable Enhancement', 'Master toggle for all processing'),
                this.renderSelect('mode', 'Processing Mode', [['light', 'LIGHT (Low CPU)'], ['pro', 'PRO (Balanced)'], ['ultra', 'ULTRA (High Quality)']], 'Select performance tier'),
                this.renderSelect('compareMode', 'Comparison', [['off', 'OFF'], ['split', 'Split View (Vertical)'], ['toggle', 'Toggle (OK Key)']], 'Compare Original vs Enhanced'),
            ]);
            
            // Quick Presets
            html += this.renderSection('Quick Presets', [
                this.renderPresetButtons()
            ]);
            html += `</div>`;

            // COLOR TAB (Always Works)
            html += `<div class="lumina-content" id="tab-color" style="display:none;">`;
            html += this.renderSection('Basic', [
                this.renderSlider('contrast', 'Contrast', 0, 200, 1),
                this.renderSlider('brightness', 'Brightness', 0, 200, 1),
                this.renderSlider('saturation', 'Saturation', 0, 300, 1),
                this.renderSlider('gamma', 'Gamma', 50, 200, 1),
            ]);
            html += this.renderSection('Advanced Color', [
                this.renderSlider('temperature', 'Temperature (Cool/Warm)', 0, 100, 1),
                this.renderSlider('tint', 'Tint (Green/Magenta)', 0, 100, 1),
                this.renderSlider('vibrance', 'Vibrance (Smart Sat)', 0, 200, 1),
                this.renderSlider('highlights', 'Highlights', 0, 100, 1),
                this.renderSlider('shadows', 'Shadows', 0, 100, 1),
            ]);
            html += `</div>`;

            // ENHANCE TAB (WebGL Only)
            html += `<div class="lumina-content" id="tab-enhance" style="display:none;">`;
            if (!isWebGL) {
                html += `<div class="lumina-row"><div class="lumina-label" style="color:#ffcc00; text-align:center; width:100%;">⚠️ Advanced Enhancement requires CORS-enabled video stream (Local files, some CDNs).<br>Streaming sources (HLS/DASH) block pixel access due to Browser Security.</div></div>`;
            }
            html += this.renderSection('Sharpness & Detail', [
                this.renderSlider('sharpness', 'Sharpness (Unsharp Mask)', 0, 150, 1, true),
                this.renderSlider('haloProtection', 'Halo Protection', 0, 100, 1, true),
                this.renderSlider('textureBoost', 'Fine Texture Boost', 0, 100, 1, true),
                this.renderSlider('detail', 'Local Contrast (Clarity)', 0, 100, 1, true),
            ]);
            html += this.renderSection('Noise Reduction', [
                this.renderSlider('denoise', 'Spatial + Temporal Denoise', 0, 100, 1, true),
            ]);
            html += `</div>`;

            // PROFILES TAB
            html += `<div class="lumina-content" id="tab-profiles" style="display:none;">`;
            html += this.renderSection('Saved Profiles', [
                this.renderProfileList()
            ]);
            html += this.renderSection('Actions', [
                this.renderButton('saveProfile', 'Save Current as Custom', 'primary'),
                this.renderButton('exportProfile', 'Export Profile (JSON)', 'secondary'),
                this.renderButton('importProfile', 'Import Profile', 'secondary'),
                this.renderButton('resetAll', 'Reset to Defaults', 'secondary'),
            ]);
            html += `</div>`;

            // PERF TAB
            html += `<div class="lumina-content" id="tab-perf" style="display:none;">`;
            html += this.renderSection('Monitor', [
                this.renderToggle('perfEnabled', 'Show Performance Overlay'),
                this.renderToggle('adaptiveQuality', 'Adaptive Quality (Auto Downgrade)'),
                this.renderSlider('targetFps', 'Target FPS', 24, 60, 1),
            ]);
            html += `<div class="lumina-section"><div class="lumina-perf" id="perf-stats"></div></div>`;
            html += `</div>`;

            html += `</div>`; // Panel End
            return html;
        }

        renderSection(title, items) {
            return `<div class="lumina-section"><div class="lumina-section-title">${title}</div>${items.join('')}</div>`;
        }
        renderRow(label, control, hint) {
            return `<div class="lumina-row"><div class="lumina-label">${label}${hint ? `<small>${hint}</small>` : ''}</div>${control}</div>`;
        }
        renderSlider(key, label, min, max, step, webglOnly) {
            const s = LuminaSettings.schema[key];
            const val = LuminaSettings.get(key);
            const disabled = webglOnly && !(this.core.bridge.corsOk && !this.core.bridge.drmDetected) ? 'disabled' : '';
            const tip = webglOnly ? 'data-tip="Requires WebGL Mode (CORS enabled stream)"' : '';
            return this.renderRow(label, `<div class="lumina-slider-wrap ${tip}"><input type="range" class="lumina-slider" data-key="${key}" min="${min}" max="${max}" step="${step}" value="${val}" ${disabled}><span class="lumina-value" data-val="${key}">${val}</span></div>`, s.webglOnly ? '(WebGL Only)' : '');
        }
        renderToggle(key, label, hint) {
            const val = LuminaSettings.get(key);
            return this.renderRow(label, `<label class="lumina-toggle"><input type="checkbox" data-key="${key}" ${val?'checked':''}><span class="lumina-toggle-track"></span><span class="lumina-toggle-thumb"></span></label>`, hint);
        }
        renderSelect(key, label, options, hint) {
            const val = LuminaSettings.get(key);
            const opts = options.map(([v, l]) => `<option value="${v}" ${v===val?'selected':''}>${l}</option>`).join('');
            return this.renderRow(label, `<select class="lumina-select" data-key="${key}">${opts}</select>`, hint);
        }
        renderButton(key, label, variant) {
            return this.renderRow('', `<button class="lumina-btn ${variant}" data-action="${key}">${label}</button>`, '', true);
        }
        renderPresetButtons() {
            return Object.entries(LuminaSettings.presets).map(([k, v]) => 
                `<button class="lumina-btn ${k===LuminaSettings.get('currentProfile')?'primary':'secondary'}" data-action="loadProfile" data-profile="${k}" style="flex:1; margin: 2px; padding: 8px; font-size: 13px;">${v.icon} ${v.name}</button>`
            ).join('');
        }
        renderProfileList() {
            const custom = LuminaUtils.Storage.getJSON('profiles', {});
            return `<div style="display:flex; flex-wrap:wrap; gap:8px;">${this.renderPresetButtons()}</div>`;
        }

        bindEvents(root) {
            this.panel = root.querySelector('.lumina-panel');
            // Tabs
            root.querySelectorAll('.lumina-tab').forEach(tab => {
                tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
                this.focusable.push(tab);
            });
            
            // Sliders
            root.querySelectorAll('.lumina-slider').forEach(s => {
                s.addEventListener('input', (e) => this.onSlider(e.target));
                s.addEventListener('change', (e) => this.onSettingChange(e.target.dataset.key, parseFloat(e.target.value)));
                this.focusable.push(s);
            });
            
            // Toggles
            root.querySelectorAll('.lumina-toggle input').forEach(cb => {
                cb.addEventListener('change', (e) => this.onSettingChange(e.target.dataset.key, e.target.checked));
                this.focusable.push(cb);
            });
            
            // Selects
            root.querySelectorAll('.lumina-select').forEach(sel => {
                sel.addEventListener('change', (e) => this.onSettingChange(e.target.dataset.key, e.target.value));
                this.focusable.push(sel);
            });
            
            // Buttons
            root.querySelectorAll('.lumina-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.onAction(e.currentTarget.dataset.action, e.currentTarget.dataset.profile));
                this.focusable.push(btn);
            });

            // Remote Control Navigation
            this.setupNavigation(root);
            
            // Perf Loop
            if (LuminaSettings.get('perfEnabled')) this.startPerfLoop(root);
        }

        switchTab(id) {
            this.panel.querySelectorAll('.lumina-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === id));
            this.panel.querySelectorAll('.lumina-content').forEach(c => c.style.display = c.id === `tab-${id}` ? 'block' : 'none');
        }

        onSlider(el) { 
            const val = parseFloat(el.value);
            el.parentElement.querySelector('.lumina-value').textContent = val;
            // Live preview for color sliders
            const key = el.dataset.key;
            if (['contrast','brightness','saturation','gamma','temperature','tint','vibrance','highlights','shadows'].includes(key)) {
                LuminaSettings.set(key, val);
                this.core.applySettings(); 
            }
        }
        onSettingChange(key, value) {
            LuminaSettings.set(key, value);
            this.core.applySettings();
            this.updateAllValues();
        }
        onAction(action, profile) {
            switch(action) {
                case 'loadProfile': this.loadProfile(profile); break;
                case 'saveProfile': this.saveCustomProfile(); break;
                case 'resetAll': this.resetAll(); break;
                case 'exportProfile': this.exportProfile(); break;
                case 'importProfile': this.importProfile(); break;
            }
        }

        loadProfile(key) {
            const preset = LuminaSettings.presets[key];
            if (!preset) return;
            LuminaSettings.setAll(preset.settings);
            LuminaSettings.set('currentProfile', key);
            this.core.applySettings();
            this.updateAllValues();
            this.panel.querySelectorAll('[data-action="loadProfile"]').forEach(b => b.classList.toggle('primary', b.dataset.profile === key));
            this.logger.log('Profile Loaded', key);
        }
        saveCustomProfile() {
            const current = LuminaSettings.getAll();
            const custom = LuminaUtils.Storage.getJSON('profiles', {});
            custom.custom = { name: 'Custom', icon: '⚙️', settings: current };
            LuminaUtils.Storage.setJSON('profiles', custom);
            LuminaSettings.set('currentProfile', 'custom');
            this.loadProfile('custom');
            Lampa.Noty.show('Custom Profile Saved');
        }
        resetAll() {
            Object.keys(LuminaSettings.schema).forEach(k => LuminaUtils.Storage.set(k, LuminaSettings.schema[k].default));
            this.core.applySettings();
            this.updateAllValues();
            Lampa.Noty.show('Settings Reset');
        }
        exportProfile() {
            const data = { version: VERSION, settings: LuminaSettings.getAll(), timestamp: Date.now() };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = `lumina-profile-${Date.now()}.json`; a.click(); URL.revokeObjectURL(url);
        }
        importProfile() {
            const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
            input.onchange = (e) => {
                const f = e.target.files[0]; if (!f) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const data = JSON.parse(ev.target.result);
                        if (data.settings) { LuminaSettings.setAll(data.settings); this.core.applySettings(); this.updateAllValues(); Lampa.Noty.show('Profile Imported'); }
                    } catch { Lampa.Noty.show('Invalid Profile File'); }
                };
                reader.readAsText(f);
            };
            input.click();
        }

        updateAllValues() {
            const current = LuminaSettings.getAll();
            this.panel.querySelectorAll('.lumina-slider').forEach(s => { const k=s.dataset.key; if(current[k]!==undefined) { s.value=current[k]; s.parentElement.querySelector('.lumina-value').textContent=current[k]; } });
            this.panel.querySelectorAll('.lumina-toggle input').forEach(cb => { const k=cb.dataset.key; if(current[k]!==undefined) cb.checked=current[k]; });
            this.panel.querySelectorAll('.lumina-select').forEach(sel => { const k=sel.dataset.key; if(current[k]!==undefined) sel.value=current[k]; });
        }

        setupNavigation(root) {
            // Lampa uses Lampa.Controller for remote. We hook into it.
            // But for standalone panel, we manage focus trap.
            let lastFocus = null;
            root.addEventListener('keydown', (e) => {
                if (!this.panel.contains(document.activeElement)) return; // Not in our panel
                const idx = this.focusable.indexOf(document.activeElement);
                if (idx === -1) return;
                
                let next = -1;
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (idx + 1) % this.focusable.length;
                else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (idx - 1 + this.focusable.length) % this.focusable.length;
                else if (e.key === 'Enter' || e.key === ' ') { document.activeElement.click(); e.preventDefault(); }
                else if (e.key === 'Escape' || e.key === 'Backspace') { this.core.togglePanel(false); e.preventDefault(); return; }
                
                if (next !== -1) { this.focusable[next].focus(); e.preventDefault(); }
            });
        }

        startPerfLoop(root) {
            this.perfInterval = setInterval(() => {
                const stats = this.core.perf.getStats();
                const el = root.querySelector('#perf-stats');
                if (!el) return;
                el.innerHTML = `
                    <div class="lumina-perf-item"><span class="lumina-perf-label">FPS</span><span class="lumina-perf-value ${stats.fps<30?'danger':stats.fps<50?'warn':''}">${stats.fps}</span></div>
                    <div class="lumina-perf-item"><span class="lumina-perf-label">Frame Time (CPU)</span><span class="lumina-perf-value ${stats.frameTime>33?'danger':stats.frameTime>16?'warn':''}">${stats.frameTime}ms</span></div>
                    <div class="lumina-perf-item"><span class="lumina-perf-label">GPU Time</span><span class="lumina-perf-value">${stats.gpuTime.toFixed(2)}ms</span></div>
                    <div class="lumina-perf-item"><span class="lumina-perf-label">Resolution</span><span class="lumina-perf-value">${stats.resolution}</span></div>
                    <div class="lumina-perf-item"><span class="lumina-perf-label">Mode</span><span class="lumina-perf-value">${LuminaSettings.get('mode').toUpperCase()}</span></div>
                    <div class="lumina-perf-item"><span class="lumina-perf-label">Backend</span><span class="lumina-perf-value">${this.core.bridge.corsOk ? 'WebGL2' : 'CSS/SVG'}</span></div>
                `;
            }, 500);
        }

        destroy() { if (this.perfInterval) clearInterval(this.perfInterval); }
    }

    // --- COMPARISON ENGINE ---
    class ComparisonEngine {
        constructor(video, canvas) { this.video = video; this.canvas = canvas; this.mode = 'off'; this.split = 0.5; this.drag = false; this.overlay = null; }
        setMode(mode) { this.mode = mode; this.render(); }
        setSplit(v) { this.split = Math.max(0.05, Math.min(0.95, v)); this.render(); }
        render() {
            if (!this.overlay) {
                this.overlay = document.createElement('div');
                this.overlay.className = 'lumina-compare-overlay';
                this.overlay.innerHTML = `<div class="lumina-compare-split"></div><div class="lumina-compare-handle">⇄</div><div class="lumina-compare-label original">ORIGINAL</div><div class="lumina-compare-label enhanced">ENHANCED</div>`;
                this.video.parentNode.style.position = 'relative';
                this.video.parentNode.appendChild(this.overlay);
                
                this.overlay.querySelector('.lumina-compare-handle').addEventListener('mousedown', (e) => { this.drag = true; e.preventDefault(); });
                window.addEventListener('mousemove', (e) => { if (this.drag) this.onDrag(e); });
                window.addEventListener('mouseup', () => this.drag = false);
            }
            
            const show = this.mode !== 'off';
            this.overlay.style.display = show ? 'block' : 'none';
            if (!show) return;
            
            if (this.mode === 'split') {
                this.overlay.querySelector('.lumina-compare-split').style.left = `${this.split * 100}%`;
                this.overlay.querySelector('.lumina-compare-handle').style.left = `${this.split * 100}%`;
                // Clip canvas/video? 
                // CSS Clip Path on Canvas (Enhanced Layer)
                if (this.canvas) this.canvas.style.clipPath = `polygon(${this.split*100}% 0, 100% 0, 100% 100%, ${this.split*100}% 100%)`;
                // Video (Original) gets inverse clip
                this.video.style.clipPath = `polygon(0 0, ${this.split*100}% 0, ${this.split*100}% 100%, 0 100%)`;
            } else if (this.mode === 'toggle') {
                // Toggle handled by key press in Core
                this.canvas.style.clipPath = 'none';
                this.video.style.clipPath = 'none';
            }
        }
        onDrag(e) {
            const rect = this.overlay.getBoundingClientRect();
            this.setSplit((e.clientX - rect.left) / rect.width);
        }
        toggle() { 
            if (this.mode === 'toggle') {
                this.showEnhanced = !this.showEnhanced;
                this.canvas.style.display = this.showEnhanced ? 'block' : 'none';
                this.video.style.opacity = this.showEnhanced ? '0' : '1';
            }
        }
        destroy() { if (this.overlay) this.overlay.remove(); this.video.style.clipPath = 'none'; if(this.canvas) this.canvas.style.clipPath = 'none'; }
    }

    // --- CORE ORCHESTRATOR ---
    class LuminaCore {
        constructor() {
            this.bridge = new PlayerBridge();
            this.cssEngine = null;
            this.webglEngine = null;
            this.autoCinema = null;
            this.comparison = null;
            this.perf = new PerformanceMonitor();
            this.ui = new LuminaUI(this);
            this.settings = LuminaSettings.getAll();
            this.active = false;
            this.logger = new LuminaUtils.Logger('Core');
        }

        async init() {
            this.logger.log('Initializing...');
            // Load saved settings
            this.settings = LuminaSettings.getAll();
            
            // Auto Cinema
            this.autoCinema = new AutoCinema(this.bridge);
            if (this.settings.autoEnabled) this.autoCinema.start((res) => this.onAutoAnalyze(res));
        }

        async attachPlayer(player) {
            if (this.bridge.player) return; // Already attached
            const ok = await this.bridge.attach(player);
            if (!ok) return;
            
            this.video = this.bridge.video;
            this.canvas = this.bridge.canvas;
            
            // Init Engines
            this.cssEngine = new CSSEngine(this.video);
            if (this.bridge.corsOk && !this.bridge.drmDetected) {
                this.webglEngine = new WebGLEngine(this.bridge);
                this.bridge.showCanvas(true); // Hide video, show canvas
            } else {
                this.bridge.showCanvas(false); // Ensure video visible
            }
            
            this.comparison = new ComparisonEngine(this.video, this.canvas);
            
            // Apply Initial Settings
            this.applySettings();
            
            // Register Frame Callback
            if (this.webglEngine) {
                this.bridge.onFrame((gl, vid, can) => this.onWebGLFrame(gl, vid, can));
            }
            
            // UI Toggle Key (Lampa Global)
            // Lampa doesn't have global keybus easily accessible without plugin API.
            // We inject a listener on document.
            document.addEventListener('keydown', (e) => this.onGlobalKey(e));
            
            this.active = true;
            this.logger.log('Player Attached', { cors: this.bridge.corsOk, drm: this.bridge.drmDetected });
        }

        onGlobalKey(e) {
            // Only if panel closed and video playing
            if (Lampa.Activity.active().name !== 'player') return;
            if (document.querySelector('.lumina-panel')) return; // Panel open
            
            const cmpMode = LuminaSettings.get('compareMode');
            if (e.key === 'c' || e.key === 'C') { // 'C' for Compare
                if (cmpMode === 'toggle') this.comparison.toggle();
                else if (cmpMode === 'split') this.comparison.setMode(cmpMode === 'split' ? 'off' : 'split');
                else this.comparison.setMode('split');
            }
            if (e.key === 'e' || e.key === 'E') { // 'E' for Enhance Toggle
                const en = !LuminaSettings.get('enabled');
                LuminaSettings.set('enabled', en);
                this.applySettings();
                Lampa.Noty.show(en ? 'Lumina: ON' : 'Lumina: OFF');
            }
        }

        onWebGLFrame(gl, video, canvas) {
            if (!LuminaSettings.get('enabled')) return;
            this.perf.frameStart();
            
            const s = LuminaSettings.getAll();
            const mode = s.mode;
            
            // Mode Gating
            const effectiveSettings = { ...s };
            if (mode === 'light') { effectiveSettings.sharpness = Math.min(s.sharpness, 20); effectiveSettings.denoise = 0; effectiveSettings.detail = 0; effectiveSettings.textureBoost = 0; }
            else if (mode === 'pro') { effectiveSettings.denoise = Math.min(s.denoise, 30); effectiveSettings.detail = Math.min(s.detail, 50); }
            
            this.webglEngine.renderFrame(video, effectiveSettings);
            this.perf.frameEnd(0); // GPU time measurement needs EXT_disjoint_timer_query (complex)
            
            // Comparison Split Rendering handled by CSS ClipPath in ComparisonEngine
            // But WebGL draws full frame. We need to draw split?
            // Actually ComparisonEngine sets clip-path on Canvas. WebGL draws full frame to Canvas. Browser clips it. Perfect.
            this.comparison.render();
        }

        applySettings() {
            const s = LuminaSettings.getAll();
            const enabled = s.enabled;
            const isWebGL = this.webglEngine && this.bridge.corsOk;
            
            if (!enabled) {
                this.cssEngine.disable();
                if (this.webglEngine) this.bridge.showCanvas(false);
                this.comparison.setMode('off');
                return;
            }
            
            // Always apply CSS Engine (Color Base) - Runs on Video Element directly
            // If WebGL active, CSS Engine applies to Video (Hidden), WebGL reads Video Texture.
            // Wait: If WebGL reads Video Texture, CSS Filters on Video **DO NOT AFFECT** the Texture read by drawImage/texImage2D!
            // texImage2D reads RAW decoded frames, ignoring CSS Filters.
            // ARCHITECTURE FIX:
            // Mode WebGL: CSS Engine DISABLED. WebGL Shader handles ALL color (Color.frag).
            // Mode CSS: WebGL DISABLED. CSS Engine handles Color.
            
            if (isWebGL) {
                this.cssEngine.disable();
                this.bridge.showCanvas(true);
                this.webglEngine.updateSettings(s);
            } else {
                this.bridge.showCanvas(false);
                this.cssEngine.apply(s);
            }
            
            this.comparison.setMode(s.compareMode);
            if (s.compareMode === 'split') this.comparison.setSplit(s.compareSplit);
        }

        onAutoAnalyze(res) {
            if (!res) return;
            const preset = LuminaSettings.presets[res.profile];
            if (preset) {
                this.logger.log('Auto Cinema', res);
                // Smooth transition? Just apply.
                LuminaSettings.setAll(preset.settings);
                this.applySettings();
                if (this.ui.panel) this.ui.updateAllValues();
            }
        }

        onRender() {
            // Called by Lampa every frame (if plugin registered render hook)
            // We use requestAnimationFrame in Bridge for WebGL.
            // CSS Engine is passive.
            this.perf.checkAdaptive(LuminaSettings.getAll(), (mode) => {
                LuminaSettings.set('mode', mode);
                this.applySettings();
                if (this.ui.panel) this.ui.updateAllValues();
            });
        }

        togglePanel(show) {
            if (show) {
                const container = this.ui.renderSettings();
                Lampa.Modal.open({ content: container, size: 'large', onClose: () => this.togglePanel(false) });
            } else {
                Lampa.Modal.close();
            }
        }

        destroy() {
            this.active = false;
            this.bridge.destroy();
            this.cssEngine.disable();
            if (this.webglEngine) this.webglEngine.destroy();
            this.autoCinema.stop();
            this.comparison.destroy();
            this.ui.destroy();
            document.removeEventListener('keydown', this.onGlobalKey);
            this.logger.log('Destroyed');
        }
    }

    // Expose for debugging
    window.Lumina = { Core: LuminaCore, Settings: LuminaSettings, Shaders: LuminaShaders };
} // End loadModules