/*!
 * wajha-model.bundle.mjs
 *
 * GENERATED FILE. Do not edit. Rebuild with: node build-bundle.mjs
 *
 * This file contains code from two MIT-licensed projects. Their notices are kept below,
 * as the MIT license requires.
 *
 * 1. Wajha (https://github.com/M-Alkassem/Wajha)
 *    Source: src/model (projectFromTemplate, validateProject, validateTemplate, catalog)
 *            and src/platform/limits.ts (image checks).
 *    Pinned commit: 2246e6d3c9260497abe250b068e8a12a5e55f75e
 *
 *    MIT License
 *
 *    Copyright (c) 2026 Wajha contributors
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a copy
 *    of this software and associated documentation files (the "Software"), to deal
 *    in the Software without restriction, including without limitation the rights
 *    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *    copies of the Software, and to permit persons to whom the Software is
 *    furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice shall be included in all
 *    copies or substantial portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 *
 * 2. fflate 0.8.3 (https://github.com/101arrowz/fflate)
 *
 *    MIT License
 *
 *    Copyright (c) 2026 Arjun Barrett
 *
 *    Permission is hereby granted, free of charge, to any person obtaining a copy
 *    of this software and associated documentation files (the "Software"), to deal
 *    in the Software without restriction, including without limitation the rights
 *    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *    copies of the Software, and to permit persons to whom the Software is
 *    furnished to do so, subject to the following conditions:
 *
 *    The above copyright notice and this permission notice shall be included in all
 *    copies or substantial portions of the Software.
 *
 *    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *    SOFTWARE.
 */

// ../../../wajha-clone/src/model/catalog.ts
var size = (s) => s;
var turned = (family, sizes) => sizes.map((s) => ({ ...s, id: `${s.id}-land`, family, label: `${s.label} landscape`, width: s.height, height: s.width, folder: `${s.folder} landscape` }));
var IPHONE_SIZES = [
  size({ id: "ios-6.9", family: "iphone", store: "app-store", label: "iPhone 6.9\u2033", devices: "iPhone 17 Pro Max, 16 Pro Max", width: 1320, height: 2868, required: true, default: true, folder: "iPhone 6.9" }),
  size({ id: "ios-6.9-b", family: "iphone", store: "app-store", label: "iPhone 6.9\u2033 (1290)", devices: "iPhone 16 Plus, 15 Pro Max, 15 Plus, 14 Pro Max", width: 1290, height: 2796, required: false, default: false, folder: "iPhone 6.9 (1290)" }),
  size({ id: "ios-6.5", family: "iphone", store: "app-store", label: "iPhone 6.5\u2033", devices: "iPhone 14 Plus, 13 Pro Max, 12 Pro Max", width: 1284, height: 2778, required: false, default: false, folder: "iPhone 6.5" }),
  size({ id: "ios-6.5-b", family: "iphone", store: "app-store", label: "iPhone 6.5\u2033 (1242)", devices: "iPhone 11 Pro Max, XS Max", width: 1242, height: 2688, required: false, default: false, folder: "iPhone 6.5 (1242)" }),
  size({ id: "ios-6.3", family: "iphone", store: "app-store", label: "iPhone 6.3\u2033", devices: "iPhone 17 Pro, 17, 16 Pro", width: 1206, height: 2622, required: true, default: true, folder: "iPhone 6.3" }),
  size({ id: "ios-6.1", family: "iphone", store: "app-store", label: "iPhone 6.1\u2033", devices: "iPhone 17e, 16e, 14, 13, 13 Pro, 12, 12 Pro", width: 1170, height: 2532, required: false, default: false, folder: "iPhone 6.1" })
];
var IPAD_SIZES = [
  size({ id: "ipad-13", family: "ipad", store: "app-store", label: "iPad 13\u2033", devices: "iPad Pro 13\u2033 (M4, M5), iPad Air 13\u2033", width: 2064, height: 2752, required: true, default: true, folder: "iPad 13" }),
  size({ id: "ipad-12.9", family: "ipad", store: "app-store", label: "iPad 12.9\u2033", devices: "iPad Pro 12.9\u2033 (2nd\u20136th gen)", width: 2048, height: 2732, required: false, default: false, folder: "iPad 12.9" }),
  size({ id: "ipad-11", family: "ipad", store: "app-store", label: "iPad 11\u2033", devices: "iPad Pro 11\u2033 (M4), iPad Air 11\u2033", width: 1668, height: 2420, required: false, default: false, folder: "iPad 11" })
];
var PLAY_PHONE_SIZES = [
  size({ id: "play-phone", family: "android-phone", store: "google-play", label: "Phone 1080 \xD7 1920", devices: "All Android phones (9:16)", width: 1080, height: 1920, required: true, default: true, folder: "Phone", supplyFolder: "phoneScreenshots" }),
  size({ id: "play-phone-hd", family: "android-phone", store: "google-play", label: "Phone 1440 \xD7 2560", devices: "All Android phones (9:16, high resolution)", width: 1440, height: 2560, required: false, default: false, folder: "Phone (1440)", supplyFolder: "phoneScreenshots" })
];
var FAMILIES = {
  iphone: {
    id: "iphone",
    label: "iPhone",
    shortLabel: "iPhone",
    stores: ["app-store"],
    design: { width: 1320, height: 2868 },
    aspectClass: "tall",
    defaultFrame: "iphone",
    screenAspect: 2868 / 1320,
    maxSlides: 10,
    sizes: IPHONE_SIZES
  },
  "iphone-landscape": {
    id: "iphone-landscape",
    label: "iPhone landscape",
    shortLabel: "iPhone \u2194",
    stores: ["app-store"],
    design: { width: 2868, height: 1320 },
    aspectClass: "wide",
    defaultFrame: "iphone",
    screenAspect: 1320 / 2868,
    maxSlides: 10,
    landscape: true,
    sizes: turned("iphone-landscape", IPHONE_SIZES)
  },
  ipad: {
    id: "ipad",
    label: "iPad",
    shortLabel: "iPad",
    stores: ["app-store"],
    design: { width: 2064, height: 2752 },
    aspectClass: "tablet",
    defaultFrame: "ipad",
    screenAspect: 2752 / 2064,
    maxSlides: 10,
    sizes: IPAD_SIZES
  },
  "ipad-landscape": {
    id: "ipad-landscape",
    label: "iPad landscape",
    shortLabel: "iPad \u2194",
    stores: ["app-store"],
    design: { width: 2752, height: 2064 },
    aspectClass: "wide",
    defaultFrame: "ipad",
    screenAspect: 2064 / 2752,
    maxSlides: 10,
    landscape: true,
    sizes: turned("ipad-landscape", IPAD_SIZES)
  },
  "android-phone": {
    id: "android-phone",
    label: "Android phone",
    shortLabel: "Android",
    stores: ["google-play"],
    design: { width: 1080, height: 1920 },
    aspectClass: "tall",
    defaultFrame: "android-phone",
    screenAspect: 2400 / 1080,
    maxSlides: 8,
    sizes: PLAY_PHONE_SIZES
  },
  "android-landscape": {
    id: "android-landscape",
    label: "Android phone landscape",
    shortLabel: "Android \u2194",
    stores: ["google-play"],
    design: { width: 1920, height: 1080 },
    aspectClass: "wide",
    defaultFrame: "android-phone",
    screenAspect: 1080 / 2400,
    maxSlides: 8,
    landscape: true,
    sizes: turned("android-landscape", PLAY_PHONE_SIZES)
  },
  "android-tablet": {
    id: "android-tablet",
    label: "Android tablet",
    shortLabel: "Tablet",
    stores: ["google-play"],
    design: { width: 1440, height: 2560 },
    aspectClass: "tablet",
    defaultFrame: "android-tablet",
    screenAspect: 2560 / 1600,
    maxSlides: 8,
    sizes: [
      size({ id: "play-tablet-7", family: "android-tablet", store: "google-play", label: "7\u2033 tablet", devices: "7-inch Android tablets (9:16)", width: 1080, height: 1920, required: false, default: true, folder: "Tablet 7", supplyFolder: "sevenInchScreenshots" }),
      size({ id: "play-tablet-10", family: "android-tablet", store: "google-play", label: "10\u2033 tablet", devices: "10-inch Android tablets (9:16)", width: 1440, height: 2560, required: false, default: true, folder: "Tablet 10", supplyFolder: "tenInchScreenshots" })
    ]
  },
  mac: {
    id: "mac",
    label: "Mac",
    shortLabel: "Mac",
    stores: ["app-store"],
    design: { width: 2880, height: 1800 },
    aspectClass: "wide",
    defaultFrame: "macbook",
    screenAspect: 1800 / 2880,
    maxSlides: 10,
    sizes: [
      size({ id: "mac-2880", family: "mac", store: "app-store", label: "Mac 2880 \xD7 1800", devices: "Mac (Retina 16:10)", width: 2880, height: 1800, required: true, default: true, folder: "Mac 2880" }),
      size({ id: "mac-2560", family: "mac", store: "app-store", label: "Mac 2560 \xD7 1600", devices: "Mac (Retina 16:10)", width: 2560, height: 1600, required: false, default: false, folder: "Mac 2560" }),
      size({ id: "mac-1440", family: "mac", store: "app-store", label: "Mac 1440 \xD7 900", devices: "Mac (16:10)", width: 1440, height: 900, required: false, default: false, folder: "Mac 1440" }),
      size({ id: "mac-1280", family: "mac", store: "app-store", label: "Mac 1280 \xD7 800", devices: "Mac (16:10)", width: 1280, height: 800, required: false, default: false, folder: "Mac 1280" })
    ]
  },
  watch: {
    id: "watch",
    label: "Apple Watch",
    shortLabel: "Watch",
    stores: ["app-store"],
    design: { width: 422, height: 514 },
    aspectClass: "tablet",
    defaultFrame: "watch",
    screenAspect: 514 / 422,
    maxSlides: 10,
    sizes: [
      size({ id: "watch-ultra-3", family: "watch", store: "app-store", label: "Apple Watch Ultra 3", devices: "Apple Watch Ultra 3", width: 422, height: 514, required: true, default: true, folder: "Apple Watch Ultra 3" }),
      size({ id: "watch-11", family: "watch", store: "app-store", label: "Apple Watch Series 11", devices: "Apple Watch Series 11, 10", width: 416, height: 496, required: false, default: false, folder: "Apple Watch Series 11" }),
      size({ id: "watch-ultra-2", family: "watch", store: "app-store", label: "Apple Watch Ultra 2", devices: "Apple Watch Ultra 2, Ultra", width: 410, height: 502, required: false, default: false, folder: "Apple Watch Ultra 2" }),
      size({ id: "watch-9", family: "watch", store: "app-store", label: "Apple Watch Series 9", devices: "Apple Watch Series 9, 8, 7", width: 396, height: 484, required: false, default: false, folder: "Apple Watch Series 9" }),
      size({ id: "watch-6", family: "watch", store: "app-store", label: "Apple Watch Series 6", devices: "Apple Watch Series 6, 5, 4, SE", width: 368, height: 448, required: false, default: false, folder: "Apple Watch Series 6" }),
      size({ id: "watch-3", family: "watch", store: "app-store", label: "Apple Watch Series 3", devices: "Apple Watch Series 3", width: 312, height: 390, required: false, default: false, folder: "Apple Watch Series 3" })
    ]
  },
  "apple-tv": {
    id: "apple-tv",
    label: "Apple TV",
    shortLabel: "TV",
    stores: ["app-store"],
    design: { width: 3840, height: 2160 },
    aspectClass: "wide",
    defaultFrame: "tv",
    screenAspect: 2160 / 3840,
    maxSlides: 10,
    sizes: [
      size({ id: "tv-4k", family: "apple-tv", store: "app-store", label: "Apple TV 3840 \xD7 2160", devices: "Apple TV 4K", width: 3840, height: 2160, required: true, default: true, folder: "Apple TV 4K" }),
      size({ id: "tv-hd", family: "apple-tv", store: "app-store", label: "Apple TV 1920 \xD7 1080", devices: "Apple TV HD", width: 1920, height: 1080, required: false, default: false, folder: "Apple TV" })
    ]
  },
  vision: {
    id: "vision",
    label: "Apple Vision Pro",
    shortLabel: "Vision",
    stores: ["app-store"],
    design: { width: 3840, height: 2160 },
    aspectClass: "wide",
    defaultFrame: "vision",
    screenAspect: 2160 / 3840,
    maxSlides: 10,
    sizes: [
      size({ id: "vision-pro", family: "vision", store: "app-store", label: "Apple Vision Pro 3840 \xD7 2160", devices: "Apple Vision Pro", width: 3840, height: 2160, required: true, default: true, folder: "Apple Vision Pro" })
    ]
  },
  "play-feature": {
    id: "play-feature",
    label: "Play feature graphic",
    shortLabel: "Feature",
    stores: ["google-play"],
    design: { width: 1024, height: 500 },
    aspectClass: "wide",
    defaultFrame: "android-phone",
    screenAspect: 2400 / 1080,
    maxSlides: 1,
    sizes: [
      size({ id: "play-feature", family: "play-feature", store: "google-play", label: "Feature graphic 1024 \xD7 500", devices: "Google Play store listing banner", width: 1024, height: 500, required: true, default: true, folder: "Feature graphic", supplyFolder: "featureGraphic" })
    ]
  }
};
var FAMILY_ORDER = [
  "iphone",
  "iphone-landscape",
  "ipad",
  "ipad-landscape",
  "mac",
  "watch",
  "apple-tv",
  "vision",
  "android-phone",
  "android-landscape",
  "android-tablet",
  "play-feature"
];
var ALL_SIZES = FAMILY_ORDER.flatMap((f) => FAMILIES[f].sizes);
function sizeById(id) {
  return ALL_SIZES.find((s) => s.id === id);
}
var L = (code, name, native, appStore, play, rtl = false, wrap = "space") => ({
  code,
  name,
  native,
  rtl,
  appStore,
  play,
  wrap
});
var LANGUAGES = [
  L("en-US", "English (US)", "English (US)", "en-US", "en-US"),
  L("en-GB", "English (UK)", "English (UK)", "en-GB", "en-GB"),
  L("en-AU", "English (Australia)", "English (Australia)", "en-AU", "en-AU"),
  L("en-CA", "English (Canada)", "English (Canada)", "en-CA", "en-CA"),
  L("ar-SA", "Arabic", "\u0627\u0644\u0639\u0631\u0628\u064A\u0629", "ar-SA", "ar", true),
  L("bn-BD", "Bangla", "\u09AC\u09BE\u0982\u09B2\u09BE", "bn-BD", "bn-BD"),
  L("ca", "Catalan", "Catal\xE0", "ca", "ca"),
  L("zh-Hans", "Chinese (Simplified)", "\u7B80\u4F53\u4E2D\u6587", "zh-Hans", "zh-CN", false, "char"),
  L("zh-Hant", "Chinese (Traditional)", "\u7E41\u9AD4\u4E2D\u6587", "zh-Hant", "zh-TW", false, "char"),
  L("hr", "Croatian", "Hrvatski", "hr", "hr"),
  L("cs", "Czech", "\u010Ce\u0161tina", "cs", "cs-CZ"),
  L("da", "Danish", "Dansk", "da", "da-DK"),
  L("nl-NL", "Dutch", "Nederlands", "nl-NL", "nl-NL"),
  L("fi", "Finnish", "Suomi", "fi", "fi-FI"),
  L("fr-FR", "French", "Fran\xE7ais", "fr-FR", "fr-FR"),
  L("fr-CA", "French (Canada)", "Fran\xE7ais (Canada)", "fr-CA", "fr-CA"),
  L("de-DE", "German", "Deutsch", "de-DE", "de-DE"),
  L("el", "Greek", "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC", "el", "el-GR"),
  L("gu-IN", "Gujarati", "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0", "gu-IN", "gu"),
  L("he", "Hebrew", "\u05E2\u05D1\u05E8\u05D9\u05EA", "he", "iw-IL", true),
  L("hi", "Hindi", "\u0939\u093F\u0928\u094D\u0926\u0940", "hi", "hi-IN"),
  L("hu", "Hungarian", "Magyar", "hu", "hu-HU"),
  L("id", "Indonesian", "Bahasa Indonesia", "id", "id"),
  L("it", "Italian", "Italiano", "it", "it-IT"),
  L("ja", "Japanese", "\u65E5\u672C\u8A9E", "ja", "ja-JP", false, "char"),
  L("kn-IN", "Kannada", "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1", "kn-IN", "kn-IN"),
  L("ko", "Korean", "\uD55C\uAD6D\uC5B4", "ko", "ko-KR"),
  L("ms", "Malay", "Bahasa Melayu", "ms", "ms"),
  L("ml-IN", "Malayalam", "\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02", "ml-IN", "ml-IN"),
  L("mr-IN", "Marathi", "\u092E\u0930\u093E\u0920\u0940", "mr-IN", "mr-IN"),
  L("no", "Norwegian", "Norsk", "no", "no-NO"),
  L("or-IN", "Odia", "\u0B13\u0B21\u0B3C\u0B3F\u0B06", "or-IN", null),
  L("fa", "Persian", "\u0641\u0627\u0631\u0633\u06CC", null, "fa", true),
  L("pl", "Polish", "Polski", "pl", "pl-PL"),
  L("pt-BR", "Portuguese (Brazil)", "Portugu\xEAs (Brasil)", "pt-BR", "pt-BR"),
  L("pt-PT", "Portuguese (Portugal)", "Portugu\xEAs (Portugal)", "pt-PT", "pt-PT"),
  L("pa-IN", "Punjabi", "\u0A2A\u0A70\u0A1C\u0A3E\u0A2C\u0A40", "pa-IN", "pa"),
  L("ro", "Romanian", "Rom\xE2n\u0103", "ro", "ro"),
  L("ru", "Russian", "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", "ru", "ru-RU"),
  L("sk", "Slovak", "Sloven\u010Dina", "sk", "sk"),
  L("sl-SI", "Slovenian", "Sloven\u0161\u010Dina", "sl-SI", "sl"),
  L("es-ES", "Spanish (Spain)", "Espa\xF1ol (Espa\xF1a)", "es-ES", "es-ES"),
  L("es-MX", "Spanish (Mexico)", "Espa\xF1ol (M\xE9xico)", "es-MX", "es-419"),
  L("sv", "Swedish", "Svenska", "sv", "sv-SE"),
  L("ta-IN", "Tamil", "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD", "ta-IN", "ta-IN"),
  L("te-IN", "Telugu", "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41", "te-IN", "te-IN"),
  L("th", "Thai", "\u0E44\u0E17\u0E22", "th", "th", false, "char"),
  L("tr", "Turkish", "T\xFCrk\xE7e", "tr", "tr-TR"),
  L("uk", "Ukrainian", "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430", "uk", "uk"),
  L("ur-PK", "Urdu", "\u0627\u0631\u062F\u0648", "ur-PK", "ur", true),
  L("vi", "Vietnamese", "Ti\u1EBFng Vi\u1EC7t", "vi", "vi")
];

// ../../../wajha-clone/src/model/clone.ts
function deepClone(value) {
  return cloneValue(value);
}
function cloneValue(v) {
  if (v === null || typeof v !== "object") return v;
  if (Array.isArray(v)) {
    const out2 = new Array(v.length);
    for (let i2 = 0; i2 < v.length; i2++) out2[i2] = cloneValue(v[i2]);
    return out2;
  }
  const out = {};
  for (const key of Object.keys(v)) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") continue;
    out[key] = cloneValue(v[key]);
  }
  return out;
}

// ../../../wajha-clone/src/model/geometry.ts
var WIDE_RATIO = 1.15;
var positive = (v, fallback) => typeof v === "number" && Number.isFinite(v) && v > 0 ? v : fallback;
function canvasMetrics(shape) {
  const width = positive(shape?.width, 1);
  const height = positive(shape?.height, 1);
  const u = Math.min(width, height);
  return { width, height, u, wu: width / u, hu: height / u, wide: width > height * WIDE_RATIO };
}
function familyMetrics(family) {
  return canvasMetrics((FAMILIES[family] ?? FAMILIES.iphone).design);
}
var BEZEL_ALLOWANCE = {
  iphone: 0.06,
  "android-phone": 0.06,
  ipad: 0.08,
  "android-tablet": 0.08,
  // Lid bezel plus the aluminium base.
  macbook: 0.07,
  // Case and black border around the display.
  watch: 0.2,
  tv: 0.03,
  // Glass rim plus the grab bar under the window.
  vision: 0.06,
  // Title bar and URL bar.
  browser: 0.09,
  none: 0
};
function deviceHeightFactor(frame, screenAspect) {
  const aspect = Math.min(5, Math.max(0.2, positive(screenAspect, 2)));
  return aspect + (BEZEL_ALLOWANCE[frame] ?? 0.06);
}
var DEFAULT_FRAMES = new Set(FAMILY_ORDER.map((f) => FAMILIES[f].defaultFrame));
function isFamilyDefaultFrame(frame) {
  return DEFAULT_FRAMES.has(frame);
}
function familyForCanvas(shape) {
  const m = canvasMetrics(shape);
  for (const f of FAMILY_ORDER) {
    const d = FAMILIES[f].design;
    if (d.width === m.width && d.height === m.height) return f;
  }
  const target = Math.log(m.width / m.height);
  let best = "iphone";
  let bestDiff = Infinity;
  for (const f of FAMILY_ORDER) {
    const d = FAMILIES[f].design;
    const diff = Math.abs(Math.log(d.width / d.height) - target);
    if (diff < bestDiff - 1e-9) {
      bestDiff = diff;
      best = f;
    }
  }
  return best;
}

// ../../../wajha-clone/src/model/rules.ts
var ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
var TEMPLATE_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
var WINDOWS_DEVICE_RE = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i;
var ASSET_ID_RE = /^[0-9a-f]{64}\.(png|jpg|webp)$/;
var COLOR_RE = /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;
var LANG_RE = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;
var KEY_RE = /^[A-Za-z0-9_.-]{1,40}$/;
var FORBIDDEN_KEYS = /* @__PURE__ */ new Set([...Object.getOwnPropertyNames(Object.prototype), "prototype"]);
var LIMITS = {
  /** Project, template, asset, element and author names. */
  name: 200,
  /** Slide texts and descriptions. */
  text: 2e3,
  font: 100,
  tag: 40,
  path: 300,
  date: 64,
  langCode: 35,
  id: 64,
  slides: 100,
  templateSlides: 10,
  elements: 200,
  palette: 32,
  stops: 16,
  meshPoints: 16,
  tags: 20,
  languages: 100,
  textKeys: 100,
  slots: 20,
  assets: 5e3,
  fonts: 24,
  galleryTemplates: 1e3,
  galleryAssets: 200
};
var RANGES = {
  position: { min: -2, max: 3 },
  rotation: { min: -360, max: 360 },
  unit: { min: 0, max: 1 },
  deviceWidth: { min: 0.02, max: 4 },
  textWidth: { min: 0.02, max: 6 },
  shapeSize: { min: 1e-3, max: 8 },
  imageWidth: { min: 0.01, max: 8 },
  cornerRadius: { min: 0, max: 0.5 },
  shapeRadius: { min: 0, max: 1 },
  stroke: { min: 0, max: 2 },
  blur: { min: 0, max: 2 },
  shadowOffset: { min: -2, max: 2 },
  fontSize: { min: 4e-3, max: 1 },
  fontWeight: { min: 1, max: 1e3, int: true },
  lineHeight: { min: 0.5, max: 4 },
  /** Per-language factor on every text's line height (model/typography.ts). */
  lineSpacing: { min: 0.8, max: 2 },
  letterSpacing: { min: -0.5, max: 2 },
  maxLines: { min: 0, max: 50, int: true },
  seed: { min: 0, max: 2147483647, int: true },
  angle: { min: -360, max: 360 },
  gradientCenter: { min: -2, max: 3 },
  gradientRadius: { min: 0.01, max: 4 },
  patternScale: { min: 2e-3, max: 2 },
  imageBlur: { min: 0, max: 1 },
  pixels: { min: 1, max: 1e5, int: true },
  bytes: { min: 0, max: Number.MAX_SAFE_INTEGER, int: true },
  timestamp: { min: 0, max: 864e13, int: true },
  jpegQuality: { min: 0.5, max: 1 },
  galleryVersion: { min: 0, max: 1e9, int: true }
};
function clampToRange(v, r) {
  let x2 = Number.isNaN(v) ? r.min : v < r.min ? r.min : v > r.max ? r.max : v;
  if (r.int) x2 = Math.round(x2);
  return x2;
}
function isFamilyId(v) {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(FAMILIES, v);
}
function isLangCode(v) {
  return typeof v === "string" && v.length <= LIMITS.langCode && LANG_RE.test(v);
}
function isSafeKey(v) {
  return typeof v === "string" && v.length <= 40 && KEY_RE.test(v) && !FORBIDDEN_KEYS.has(v);
}
function isId(v) {
  return typeof v === "string" && v.length <= LIMITS.id && ID_RE.test(v);
}
function isWindowsDeviceName(v) {
  return WINDOWS_DEVICE_RE.test(v);
}
function isTemplateId(v) {
  return typeof v === "string" && v.length <= LIMITS.id && TEMPLATE_ID_RE.test(v) && !isWindowsDeviceName(v);
}
var FONT_FILE = /^[0-9a-f]{64}\.(ttf|otf|woff|woff2)$/;
function isFontFile(v) {
  return typeof v === "string" && FONT_FILE.test(v);
}
function isAssetId(v) {
  return typeof v === "string" && v.length <= 69 && ASSET_ID_RE.test(v);
}
function normalizeColor(v) {
  if (typeof v !== "string" || v.length > 9) return null;
  if (COLOR_RE.test(v)) return v.toLowerCase();
  if (/^#[0-9a-fA-F]{3,4}$/.test(v)) {
    return `#${[...v.slice(1)].map((c) => c + c).join("")}`.toLowerCase();
  }
  return null;
}
var isHighSurrogate = (c) => c >= 55296 && c <= 56319;
var isLowSurrogate = (c) => c >= 56320 && c <= 57343;
function truncate(s, max2) {
  if (s.length <= max2) return s;
  let i2 = 0;
  let n = 0;
  while (i2 < s.length && n < max2) {
    i2 += isHighSurrogate(s.charCodeAt(i2)) && isLowSurrogate(s.charCodeAt(i2 + 1)) ? 2 : 1;
    n++;
  }
  return s.slice(0, i2);
}
var NAME_CONTROLS = /[\u0000-\u001f\u007f-\u009f]/g;
var TEXT_CONTROLS = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/g;
var SURROGATES = /[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
function wellFormed(s) {
  return s.replace(SURROGATES, (m) => m.length === 2 ? m : "\uFFFD");
}
function cleanName(s, max2 = LIMITS.name) {
  const head = s.length > max2 * 4 + 64 ? s.slice(0, max2 * 4 + 64) : s;
  return truncate(wellFormed(head).replace(NAME_CONTROLS, " ").replace(/\s+/g, " ").trim(), max2);
}
function cleanText(s, max2 = LIMITS.text) {
  const head = s.length > max2 * 2 + 64 ? s.slice(0, max2 * 2 + 64) : s;
  return truncate(wellFormed(head).replace(/\r\n?/g, "\n").replace(TEXT_CONTROLS, ""), max2);
}
function cleanFontName(s, fallback) {
  const head = s.length > LIMITS.font * 2 ? s.slice(0, LIMITS.font * 2) : s;
  const out = truncate(wellFormed(head).replace(NAME_CONTROLS, "").replace(/["\\;{}<>]/g, "").replace(/\s+/g, " ").trim(), LIMITS.font);
  return out === "" ? fallback : out;
}
function uniqueFamilies(list) {
  const out = [];
  if (!Array.isArray(list)) return out;
  for (const f of list) if (isFamilyId(f) && !out.includes(f)) out.push(f);
  return out;
}
function uniqueLanguages(list) {
  const out = [];
  if (!Array.isArray(list)) return out;
  for (const l of list) {
    if (out.length >= LIMITS.languages) break;
    if (isLangCode(l) && !out.includes(l)) out.push(l);
  }
  return out;
}

// ../../../wajha-clone/src/model/adapt.ts
var MARGIN = 0.06;
var TEXT_MAX_WIDTH = 0.92;
var EPS = 2e-3;
var JOIN_GAP_U = 0.15;
var NEAR_EDGE_U = 0.15;
var FAR_EDGE_U = 0.3;
var STACK_GAP_U = 0.05;
var K_MIN = 0.15;
var K_MAX = 3;
var GROUP_REACH = 0.1;
var BACKDROP = 1.5;
var DECOR_GAP_U = 0.03;
var DECOR_MIN_SCALE = 0.5;
var SOFT_BLUR = 0.1;
var MIN_COPY_BAND = 0.4;
var COPY_REACH_U = 0.06;
var WIDE_COPY = { x: 0.28, w: 0.44 };
var WIDE_DEVICES = { x: 0.74, w: 0.42, bleedTop: 0.12 };
var TALL_COPY = { top: 0.11, w: 0.86, gap: 0.07 };
var num = (v, fallback) => typeof v === "number" && Number.isFinite(v) ? v : fallback;
var clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
var clampInto = (v, lo, hi) => lo > hi ? (lo + hi) / 2 : clamp(v, lo, hi);
function isElementLike(e) {
  return typeof e === "object" && e !== null && typeof e.kind === "string";
}
function adaptLayout(layout, from, to, toFamily) {
  const fam = FAMILIES[toFamily] ?? FAMILIES.iphone;
  const F = canvasMetrics(from);
  const T = canvasMetrics(to);
  const c = { F, T, srcAspect: FAMILIES[familyForCanvas(F)].screenAspect, dstAspect: fam.screenAspect };
  const src = Array.isArray(layout?.elements) ? layout.elements.filter(isElementLike) : [];
  const out = src.map((el) => deepClone(el));
  for (const el of out) {
    if (el.kind === "device" && isFamilyDefaultFrame(el.frame)) el.frame = fam.defaultFrame;
  }
  const hasDevice = src.some((e) => e.kind === "device");
  if (hasDevice && !F.wide && T.wide) toWide(src, out, c);
  else if (hasDevice && F.wide && !T.wide) fromWide(src, out, c);
  else relative(src, out, c);
  const maxTextW = TEXT_MAX_WIDTH * T.wu;
  for (const el of out) if (el.kind === "text") capTextWidth(el, maxTextW);
  return {
    background: layout?.background ? deepClone(layout.background) : null,
    elements: out.map(finalize)
  };
}
function textExtent(el, M) {
  const size2 = num(el.style?.size, 0.05);
  const lineHeight = num(el.style?.lineHeight, 1.2);
  const lines = num(el.style?.maxLines, 0) === 1 ? 1 : 2;
  const h = Math.max(0, lines * size2 * lineHeight);
  const y = num(el.y, 0.5) * M.hu;
  const top = el.valign === "middle" ? y - h / 2 : el.valign === "bottom" ? y - h : y;
  return { top, bottom: top + h };
}
function deviceBox(w, factor, rotation) {
  const r = rotation * Math.PI / 180;
  const cos = Math.abs(Math.cos(r));
  const sin = Math.abs(Math.sin(r));
  const h = w * factor;
  return { bw: w * cos + h * sin, bh: w * sin + h * cos };
}
function clusterTexts(src, idx, F) {
  const items = idx.map((i2) => ({ i: i2, ...textExtent(src[i2], F) })).sort((a, b) => a.top - b.top || a.i - b.i);
  const groups = [];
  for (const it of items) {
    const g = groups.length ? groups[groups.length - 1] : void 0;
    if (g && it.top <= g.bottom + JOIN_GAP_U) {
      g.members.push(it.i);
      g.bottom = Math.max(g.bottom, it.bottom);
    } else {
      groups.push({ members: [it.i], top: it.top, bottom: it.bottom });
    }
  }
  return groups;
}
var indicesOf = (src, kind) => src.reduce((acc, e, i2) => e.kind === kind ? (acc.push(i2), acc) : acc, []);
function keepsShape(s, o, c) {
  const ratio = deviceHeightFactor(o.frame, c.dstAspect) / deviceHeightFactor(s.frame, c.srcAspect);
  return ratio > 0.6 && ratio < 1.6;
}
function relative(src, out, c) {
  const { F, T } = c;
  const textIdx = indicesOf(src, "text");
  const shifts = [];
  const copyMoves = [];
  const scale = F.wide && T.wide ? clamp(T.wu / F.wu, 0.5, 1.2) : 1;
  const recenter = F.wide !== T.wide;
  for (const g of clusterTexts(src, textIdx, F)) {
    const center = (g.top + g.bottom) / 2;
    const rel = center / F.hu;
    let anchorSrc;
    let anchorDst;
    if (rel < 0.4) {
      anchorSrc = g.top;
      anchorDst = edgeDistance(g.top, F, T, scale);
    } else if (rel > 0.6) {
      anchorSrc = g.bottom;
      anchorDst = T.hu - edgeDistance(F.hu - g.bottom, F, T, scale);
    } else {
      anchorSrc = center;
      anchorDst = center / F.hu * T.hu;
    }
    const map = (u) => anchorDst + (u - anchorSrc) * scale;
    let shift = 0;
    const top = map(g.top);
    const bottom = map(g.bottom);
    if (g.top >= -EPS * F.hu && g.bottom <= F.hu * (1 + EPS)) {
      const lo = 0.02 * T.hu;
      const hi = 0.98 * T.hu;
      if (bottom - top > hi - lo) shift = (lo + hi) / 2 - (top + bottom) / 2;
      else if (top < lo) shift = lo - top;
      else if (bottom > hi) shift = hi - bottom;
    }
    let left = Infinity;
    let right = -Infinity;
    for (const i2 of g.members) {
      const s = src[i2];
      const w = Math.max(0, num(s.width, 0.8));
      left = Math.min(left, num(s.x, 0.5) * F.wu - w / 2);
      right = Math.max(right, num(s.x, 0.5) * F.wu + w / 2);
    }
    const groupCenter = (left + right) / 2;
    let placedLeft = Infinity;
    let placedRight = -Infinity;
    for (const i2 of g.members) {
      const s = src[i2];
      const o = out[i2];
      o.y = (map(num(s.y, 0.5) * F.hu) + shift) / T.hu;
      o.width = num(s.width, 0.8) * scale;
      if (o.style) o.style.size = num(s.style?.size, 0.05) * scale;
      const xU = recenter ? T.wu / 2 + (num(s.x, 0.5) * F.wu - groupCenter) * scale : num(s.x, 0.5) * T.wu;
      placeTextX(s, o, c, xU);
      placedLeft = Math.min(placedLeft, o.x * T.wu - o.width / 2);
      placedRight = Math.max(placedRight, o.x * T.wu + o.width / 2);
    }
    shifts.push({ srcTop: g.top / F.hu, srcBottom: g.bottom / F.hu, dstTop: (top + shift) / T.hu, dstBottom: (bottom + shift) / T.hu });
    copyMoves.push({ box: { left, right, top: g.top, bottom: g.bottom }, fromX: groupCenter, toX: (placedLeft + placedRight) / 2, y: (u) => map(u) + shift, scale });
  }
  const deviceIdx = indicesOf(src, "device");
  for (const i2 of deviceIdx) fitDevice(src[i2], out[i2], c, shifts);
  const withDevices = /* @__PURE__ */ new Set();
  const follow = !F.wide && !T.wide ? true : F.wide && T.wide && deviceIdx.every((i2) => keepsShape(src[i2], out[i2], c));
  if (deviceIdx.length && follow) {
    const { box: from } = sourceDevices(src, deviceIdx, c);
    const decor = groupDecor(src, from, c);
    for (const i2 of decor) withDevices.add(i2);
    moveDecor(src, out, decor, fittedMove(src, out, deviceIdx, from, c), copyBox(out, textIdx, T), c, copyBox(src, textIdx, F));
  }
  moveCopyDecor(src, out, copyMoves, withDevices, c);
}
function moveCopyDecor(src, out, moves, skip, c) {
  if (!moves.length) return;
  const { F, T } = c;
  src.forEach((el, i2) => {
    if (el.kind !== "shape" && el.kind !== "image" || skip.has(i2)) return;
    const size2 = decorExtent(el);
    const x2 = num(el.x, 0.5) * F.wu;
    const y = num(el.y, 0.5) * F.hu;
    const move = moves.find(({ box: b }) => {
      const w = b.right - b.left;
      const h = b.bottom - b.top;
      return size2.w <= w + 2 * COPY_REACH_U && size2.h <= h + 2 * COPY_REACH_U && x2 > b.left - COPY_REACH_U && x2 < b.right + COPY_REACH_U && y > b.top - COPY_REACH_U && y < b.bottom + COPY_REACH_U;
    });
    if (!move) return;
    const o = out[i2];
    o.x = (move.toX + (x2 - move.fromX) * move.scale) / T.wu;
    o.y = move.y(y) / T.hu;
    if (move.scale === 1) return;
    if (o.kind === "shape") {
      o.width = num(o.width, 0.4) * move.scale;
      o.height = num(o.height, 0.4) * move.scale;
      o.stroke = num(o.stroke, 0) * move.scale;
      o.blur = num(o.blur, 0) * move.scale;
    } else if (o.kind === "image") {
      o.width = num(o.width, 0.4) * move.scale;
    }
  });
}
function fittedMove(src, out, idx, from, c) {
  const { T } = c;
  const to = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
  let before = 0;
  let after = 0;
  for (const i2 of idx) {
    const o = out[i2];
    const w = num(o.width, 0.6);
    const b = deviceBox(w, deviceHeightFactor(o.frame, c.dstAspect), num(o.rotation, 0));
    const x2 = num(o.x, 0.5) * T.wu;
    const y = num(o.y, 0.5) * T.hu;
    to.left = Math.min(to.left, x2 - b.bw / 2);
    to.right = Math.max(to.right, x2 + b.bw / 2);
    to.top = Math.min(to.top, y - b.bh / 2);
    to.bottom = Math.max(to.bottom, y + b.bh / 2);
    before += Math.max(RANGES.deviceWidth.min, num(src[i2].width, 0.6));
    after += w;
  }
  return { from, to, scale: after / Math.max(1e-6, before) };
}
function edgeDistance(distU, F, T, scale) {
  const relative2 = distU / F.hu * T.hu;
  if (distU < 0) return relative2;
  const w = clamp((distU - NEAR_EDGE_U) / (FAR_EDGE_U - NEAR_EDGE_U), 0, 1);
  return (1 - w) * distU * scale + w * relative2;
}
function capTextWidth(o, maxW) {
  const w = num(o.width, 0.8);
  if (w <= maxW) return;
  o.width = maxW;
  if (o.style) o.style.size = num(o.style.size, 0.05) * (maxW / w);
}
function placeTextX(s, o, c, xU) {
  const { F, T } = c;
  capTextWidth(o, TEXT_MAX_WIDTH * T.wu);
  const x2 = num(s.x, 0.5);
  const w = num(s.width, 0.8);
  const inside = x2 * F.wu - w / 2 >= -EPS * F.wu && x2 * F.wu + w / 2 <= F.wu * (1 + EPS);
  const half = num(o.width, w) / 2;
  o.x = (inside ? clampInto(xU, half, T.wu - half) : xU) / T.wu;
}
var sideMargin = (free) => free < -EPS ? MARGIN : Math.min(MARGIN, Math.max(0, free));
function fitDevice(s, o, c, groups) {
  const { F, T } = c;
  const rot = num(s.rotation, 0);
  const wF = Math.max(RANGES.deviceWidth.min, num(s.width, 0.6));
  const fF = deviceHeightFactor(s.frame, c.srcAspect);
  const fT = deviceHeightFactor(o.frame, c.dstAspect);
  const sb = deviceBox(wF, fF, rot);
  const cx = num(s.x, 0.5);
  const cy = num(s.y, 0.5);
  const topF = cy - sb.bh / (2 * F.hu);
  const bottomF = cy + sb.bh / (2 * F.hu);
  const leftF = cx - sb.bw / (2 * F.wu);
  const rightF = cx + sb.bw / (2 * F.wu);
  const shapeChange = fF >= 1 !== fT >= 1;
  const bleedT = !shapeChange && topF < -EPS;
  const bleedB = !shapeChange && bottomF > 1 + EPS;
  const fitsW = leftF >= -EPS && rightF <= 1 + EPS;
  const srcH = Math.max(1e-6, bottomF - topF);
  const srcW = sb.bw / F.wu;
  let above = null;
  let below = null;
  for (const g of groups) {
    if (g.srcBottom <= topF + 0.02 && (!above || g.srcBottom > above.srcBottom)) above = g;
    if (g.srcTop >= bottomF - 0.02 && (!below || g.srcTop < below.srcTop)) below = g;
  }
  const topLimit = above ? above.dstBottom + (topF - above.srcBottom) * F.hu / T.hu : null;
  const bottomLimit = below ? below.dstTop - (below.srcTop - bottomF) * F.hu / T.hu : null;
  const tb = deviceBox(wF, fT, rot);
  const bh1 = Math.max(1e-6, tb.bh / T.hu);
  const bw1 = Math.max(1e-6, tb.bw / T.wu);
  let kV;
  let placeY;
  let band = null;
  if (!bleedT && !bleedB) {
    const mTop = sideMargin(topF);
    const mBot = sideMargin(1 - bottomF);
    let availTop = topLimit !== null ? Math.max(mTop, topLimit) : mTop;
    let availBottom = bottomLimit !== null ? Math.min(1 - mBot, bottomLimit) : 1 - mBot;
    if (availBottom - availTop < 0.08) {
      availTop = MARGIN;
      availBottom = 1 - MARGIN;
    }
    let bandTop = Math.max(availTop, topLimit ?? topF);
    let bandBottom = Math.min(availBottom, bottomLimit ?? bottomF);
    if (bandBottom - bandTop < 0.08) {
      bandTop = availTop;
      bandBottom = availBottom;
    }
    const kFill = (bandBottom - bandTop) / bh1;
    const kAvail = (availBottom - availTop) / bh1;
    const kKeepWidth = srcW / bw1;
    kV = Math.min(kAvail, Math.max(kFill, kKeepWidth));
    const mid = (bandTop + bandBottom) / 2;
    placeY = () => mid;
    band = { lo: availTop, hi: availBottom };
  } else if (bleedB && !bleedT) {
    const hidden = clamp((bottomF - 1) / srcH, 0, 0.75);
    const top = clamp(topLimit ?? topF, 0, 0.75);
    kV = (1 - top) / (1 - hidden) / bh1;
    placeY = (bh2) => 1 + hidden * bh2 - bh2 / 2;
  } else if (bleedT && !bleedB) {
    const hidden = clamp(-topF / srcH, 0, 0.75);
    const bottom = clamp(bottomLimit ?? bottomF, 0.25, 1);
    kV = bottom / (1 - hidden) / bh1;
    placeY = (bh2) => -hidden * bh2 + bh2 / 2;
  } else {
    kV = srcH / bh1;
    placeY = () => cy;
  }
  let kH = Infinity;
  let mL = 0;
  let mR = 0;
  if (fitsW) {
    mL = sideMargin(leftF);
    mR = sideMargin(1 - rightF);
    let maxW = 1 - mL - mR;
    if (T.wide && Math.abs(cx - 0.5) > 0.1) {
      maxW = Math.min(maxW, Math.max(srcW, 2 * (Math.abs(cx - 0.5) - 0.02)));
    }
    kH = maxW / bw1;
  }
  const k = clamp(Math.min(kV, kH), K_MIN, K_MAX);
  const w = clampToRange(wF * k, RANGES.deviceWidth);
  const b = deviceBox(w, fT, rot);
  const bh = b.bh / T.hu;
  const bw = b.bw / T.wu;
  let y = placeY(bh);
  if (band) y = clampInto(y, band.lo + bh / 2, band.hi - bh / 2);
  const x2 = fitsW ? clampInto(cx, mL + bw / 2, 1 - mR - bw / 2) : cx;
  o.width = w;
  o.x = x2;
  o.y = y;
}
function stackCopy(src, out, idx, c, o) {
  const { F, T } = c;
  const groups = clusterTexts(src, idx, F);
  const offsets = /* @__PURE__ */ new Map();
  let cursor = 0;
  let left = Infinity;
  let right = -Infinity;
  let widest = 0;
  for (const g of groups) {
    for (const i2 of g.members) {
      const s = src[i2];
      offsets.set(i2, cursor + (num(s.y, 0.5) * F.hu - g.top));
      const w = Math.max(0, num(s.width, 0.8));
      const xu = num(s.x, 0.5) * F.wu;
      left = Math.min(left, xu - w / 2);
      right = Math.max(right, xu + w / 2);
      widest = Math.max(widest, w);
    }
    cursor += g.bottom - g.top + STACK_GAP_U;
  }
  const height = Math.max(1e-6, cursor - STACK_GAP_U);
  const scale = clamp(Math.min(o.grow, o.maxW / Math.max(1e-6, widest), o.maxH / height), 0.3, 1.5);
  const top = o.top ?? T.hu / 2 - height * scale / 2;
  const centerX = Number.isFinite(left) && Number.isFinite(right) ? (left + right) / 2 : F.wu / 2;
  for (const i2 of idx) {
    const s = src[i2];
    const t = out[i2];
    const width = Math.max(0, num(s.width, 0.8)) * scale;
    const xu = o.cx + (num(s.x, 0.5) * F.wu - centerX) * scale;
    t.width = width;
    t.x = clampInto(xu, width / 2 + 0.02 * T.wu, T.wu - width / 2 - 0.02 * T.wu) / T.wu;
    t.y = (top + (offsets.get(i2) ?? 0) * scale) / T.hu;
    if (t.style) {
      t.style.size = num(s.style?.size, 0.05) * scale;
      if (o.centerAlign) t.style.align = "center";
    }
  }
  return { top, bottom: top + height * scale };
}
function sourceDevices(src, idx, c) {
  const { F } = c;
  const box = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
  const items = idx.map((i2) => {
    const s = src[i2];
    const w = Math.max(RANGES.deviceWidth.min, num(s.width, 0.6));
    const rot = num(s.rotation, 0);
    const b = deviceBox(w, deviceHeightFactor(s.frame, c.srcAspect), rot);
    const cx = num(s.x, 0.5) * F.wu;
    const cy = num(s.y, 0.5) * F.hu;
    box.left = Math.min(box.left, cx - b.bw / 2);
    box.right = Math.max(box.right, cx + b.bw / 2);
    box.top = Math.min(box.top, cy - b.bh / 2);
    box.bottom = Math.max(box.bottom, cy + b.bh / 2);
    return { i: i2, w, rot, cx, cy };
  });
  return { items, box };
}
function placeDeviceGroup(src, out, idx, c, r) {
  if (!idx.length) return null;
  const { F, T } = c;
  const { items, box } = sourceDevices(src, idx, c);
  const { left: sl, right: sr, top: st, bottom: sbm } = box;
  const gcx = (sl + sr) / 2;
  const gcy = (st + sbm) / 2;
  const bleedB = sbm > F.hu * (1 + EPS);
  const bleedT = st < -EPS * F.hu;
  let tl = Infinity;
  let tr = -Infinity;
  let tt = Infinity;
  let tbm = -Infinity;
  for (const it of items) {
    const b = deviceBox(it.w, deviceHeightFactor(out[it.i].frame, c.dstAspect), it.rot);
    const dx = it.cx - gcx;
    const dy = it.cy - gcy;
    tl = Math.min(tl, dx - b.bw / 2);
    tr = Math.max(tr, dx + b.bw / 2);
    tt = Math.min(tt, dy - b.bh / 2);
    tbm = Math.max(tbm, dy + b.bh / 2);
  }
  const GW = Math.max(1e-6, tr - tl);
  const GH = Math.max(1e-6, tbm - tt);
  const ocx = (tl + tr) / 2;
  const ocy = (tt + tbm) / 2;
  const gW = r.maxW * T.wu / GW;
  const regionH = Math.max(1e-6, (r.bottom - r.top) * T.hu);
  let g = Math.min(gW, regionH / GH);
  let cyU = (r.top + r.bottom) / 2 * T.hu;
  if (bleedB && !bleedT) {
    const hidden = clamp((sbm - F.hu) / Math.max(1e-6, sbm - st), 0.02, 0.6);
    const topU = r.bleedTop * T.hu;
    const gV = (T.hu - topU) / (1 - hidden) / GH;
    const gb = Math.min(gV, gW);
    const gh = GH * gb;
    const groupTop = T.hu + hidden * gh - gh;
    if (!(gW < gV && groupTop > (r.top + r.bottom) / 2 * T.hu)) {
      g = gb;
      cyU = groupTop + gh / 2;
    }
  }
  g = clamp(g, K_MIN, K_MAX);
  const cxU = r.cx * T.wu;
  for (const it of items) {
    const o = out[it.i];
    o.width = clampToRange(it.w * g, RANGES.deviceWidth);
    o.x = (cxU + (it.cx - gcx - ocx) * g) / T.wu;
    o.y = (cyU + (it.cy - gcy - ocy) * g) / T.hu;
  }
  const to = { left: cxU - GW * g / 2, right: cxU + GW * g / 2, top: cyU - GH * g / 2, bottom: cyU + GH * g / 2 };
  return { from: box, to, scale: g };
}
function decorExtent(el) {
  const w = Math.max(0, num(el.width, 0.4));
  const h = el.kind === "shape" ? Math.max(0, num(el.height, 0.4)) : w;
  const r = num(el.rotation, 0) * Math.PI / 180;
  const cos = Math.abs(Math.cos(r));
  const sin = Math.abs(Math.sin(r));
  const blur = el.kind === "shape" ? 2 * Math.max(0, num(el.blur, 0)) : 0;
  return { w: w * cos + h * sin + blur, h: w * sin + h * cos + blur };
}
var isSoft = (el) => el.kind === "shape" && num(el.blur, 0) >= SOFT_BLUR * Math.min(num(el.width, 0.4), num(el.height, 0.4));
function clearScale(c, lo, hi, a, b) {
  if (hi <= a || lo >= b) return 1;
  if (c >= b) return lo < c ? Math.min(1, (c - b) / (c - lo)) : 1;
  if (c <= a) return hi > c ? Math.min(1, (a - c) / (hi - c)) : 1;
  return 0;
}
function copyBox(out, idx, T) {
  let box = null;
  for (const i2 of idx) {
    const t = out[i2];
    const half = Math.max(0, num(t.width, 0.8)) / 2;
    const x2 = num(t.x, 0.5) * T.wu;
    const { top, bottom } = textExtent(t, T);
    box = box ? { left: Math.min(box.left, x2 - half), right: Math.max(box.right, x2 + half), top: Math.min(box.top, top), bottom: Math.max(box.bottom, bottom) } : { left: x2 - half, right: x2 + half, top, bottom };
  }
  return box;
}
function groupDecor(src, group, c) {
  const { F } = c;
  const reachX = GROUP_REACH * (group.right - group.left);
  const reachY = GROUP_REACH * (group.bottom - group.top);
  const left = Math.max(0, group.left - reachX);
  const right = Math.min(F.wu, group.right + reachX);
  const top = Math.max(0, group.top - reachY);
  const bottom = Math.min(F.hu, group.bottom + reachY);
  return src.reduce((acc, el, i2) => {
    if (el.kind !== "shape" && el.kind !== "image") return acc;
    const size2 = decorExtent(el);
    if (size2.w > BACKDROP * F.wu || size2.h > BACKDROP * F.hu) return acc;
    const x2 = num(el.x, 0.5) * F.wu;
    const y = num(el.y, 0.5) * F.hu;
    if (x2 > left && x2 < right && y > top && y < bottom) acc.push(i2);
    return acc;
  }, []);
}
function copyBand(src, out, skip, c) {
  const { T } = c;
  const full = { top: MARGIN * T.hu, bottom: (1 - MARGIN) * T.hu };
  const band = { ...full };
  const colLeft = (WIDE_COPY.x - WIDE_COPY.w / 2) * T.wu;
  const colRight = (WIDE_COPY.x + WIDE_COPY.w / 2) * T.wu;
  out.forEach((el, i2) => {
    if (el.kind !== "shape" && el.kind !== "image" || skip.has(i2) || isSoft(src[i2])) return;
    const size2 = decorExtent(el);
    const x2 = num(el.x, 0.5) * T.wu;
    const y = num(el.y, 0.5) * T.hu;
    if (x2 + size2.w / 2 <= colLeft || x2 - size2.w / 2 >= colRight) return;
    const top = y - size2.h / 2;
    const bottom = y + size2.h / 2;
    if (bottom >= T.hu * (1 - EPS) && top > T.hu / 2) band.bottom = Math.min(band.bottom, top - DECOR_GAP_U);
    if (top <= T.hu * EPS && bottom < T.hu / 2) band.top = Math.max(band.top, bottom + DECOR_GAP_U);
  });
  return band.bottom - band.top < MIN_COPY_BAND * T.hu ? full : band;
}
function moveDecor(src, out, idx, move, copy, c, before = null) {
  if (!idx.length) return;
  const { F, T } = c;
  const { from, to } = move;
  const fromX = (from.left + from.right) / 2;
  const fromY = (from.top + from.bottom) / 2;
  const toX = (to.left + to.right) / 2;
  const toY = (to.top + to.bottom) / 2;
  const sx = (to.right - to.left) / Math.max(1e-6, from.right - from.left);
  const sy = (to.bottom - to.top) / Math.max(1e-6, from.bottom - from.top);
  const attached = idx.map((i2) => ({ i: i2, x: toX + (num(src[i2].x, 0.5) * F.wu - fromX) * sx, y: toY + (num(src[i2].y, 0.5) * F.hu - fromY) * sy }));
  let k = 1;
  if (copy) {
    const keep = { left: copy.left - DECOR_GAP_U, right: copy.right + DECOR_GAP_U, top: copy.top - DECOR_GAP_U, bottom: copy.bottom + DECOR_GAP_U };
    for (const a of attached) {
      if (isSoft(src[a.i])) continue;
      const size2 = decorExtent(src[a.i]);
      if (before) {
        const x2 = num(src[a.i].x, 0.5) * F.wu;
        const y = num(src[a.i].y, 0.5) * F.hu;
        if (x2 - size2.w / 2 < before.right && x2 + size2.w / 2 > before.left && y - size2.h / 2 < before.bottom && y + size2.h / 2 > before.top) continue;
      }
      const hw = size2.w * move.scale / 2;
      const hh = size2.h * move.scale / 2;
      const kx = clearScale(toX, a.x - hw, a.x + hw, keep.left, keep.right);
      const ky = clearScale(toY, a.y - hh, a.y + hh, keep.top, keep.bottom);
      k = Math.min(k, Math.max(kx, ky));
    }
    k = Math.max(DECOR_MIN_SCALE, k);
  }
  const s = move.scale * k;
  for (const a of attached) {
    const o = out[a.i];
    o.x = (toX + (a.x - toX) * k) / T.wu;
    o.y = (toY + (a.y - toY) * k) / T.hu;
    if (o.kind === "shape") {
      o.width = num(o.width, 0.4) * s;
      o.height = num(o.height, 0.4) * s;
      o.stroke = num(o.stroke, 0) * s;
      o.blur = num(o.blur, 0) * s;
    } else if (o.kind === "image") {
      o.width = num(o.width, 0.4) * s;
      if (o.shadow) o.shadow = { ...o.shadow, blur: num(o.shadow.blur, 0) * s, x: num(o.shadow.x, 0) * s, y: num(o.shadow.y, 0) * s };
    }
  }
}
function toWide(src, out, c) {
  const { T } = c;
  const textIdx = indicesOf(src, "text");
  const deviceIdx = indicesOf(src, "device");
  const decor = deviceIdx.length ? groupDecor(src, sourceDevices(src, deviceIdx, c).box, c) : [];
  if (textIdx.length) {
    const band = copyBand(src, out, new Set(decor), c);
    const block = stackCopy(src, out, textIdx, c, {
      cx: WIDE_COPY.x * T.wu,
      maxW: WIDE_COPY.w * T.wu,
      maxH: band.bottom - band.top,
      grow: 1,
      centerAlign: true
    });
    const shift = block.bottom > band.bottom ? band.bottom - block.bottom : block.top < band.top ? band.top - block.top : 0;
    if (shift) for (const i2 of textIdx) out[i2].y = num(out[i2].y, 0.5) + shift / T.hu;
  }
  const region = textIdx.length ? { cx: WIDE_DEVICES.x, maxW: WIDE_DEVICES.w, top: MARGIN, bottom: 1 - MARGIN, bleedTop: WIDE_DEVICES.bleedTop } : { cx: 0.5, maxW: 1 - 2 * MARGIN, top: MARGIN, bottom: 1 - MARGIN, bleedTop: WIDE_DEVICES.bleedTop };
  const move = placeDeviceGroup(src, out, deviceIdx, c, region);
  if (move) moveDecor(src, out, decor, move, copyBox(out, textIdx, T), c);
}
function fromWide(src, out, c) {
  const { T } = c;
  const textIdx = indicesOf(src, "text");
  let regionTop = MARGIN;
  if (textIdx.length) {
    const { bottom } = stackCopy(src, out, textIdx, c, {
      cx: T.wu / 2,
      maxW: TALL_COPY.w * T.wu,
      maxH: 0.4 * T.hu,
      grow: 1.25,
      top: TALL_COPY.top,
      centerAlign: false
    });
    regionTop = Math.min(0.6, (bottom + TALL_COPY.gap) / T.hu);
  }
  const deviceIdx = indicesOf(src, "device");
  const move = placeDeviceGroup(src, out, deviceIdx, c, {
    cx: 0.5,
    maxW: 1 - 2 * MARGIN,
    top: regionTop,
    bottom: 1 - MARGIN,
    bleedTop: regionTop
  });
  if (move) moveDecor(src, out, groupDecor(src, move.from, c), move, copyBox(out, textIdx, T), c);
}
var tidy = (v, fallback, range) => Math.round(clampToRange(num(v, fallback), range) * 1e6) / 1e6;
function finalize(el) {
  el.x = tidy(el.x, 0.5, RANGES.position);
  el.y = tidy(el.y, 0.5, RANGES.position);
  el.rotation = tidy(el.rotation, 0, RANGES.rotation);
  el.opacity = tidy(el.opacity, 1, RANGES.unit);
  switch (el.kind) {
    case "device":
      el.width = tidy(el.width, 0.6, RANGES.deviceWidth);
      el.cornerRadius = tidy(el.cornerRadius, 0, RANGES.cornerRadius);
      break;
    case "text":
      el.width = tidy(el.width, 0.8, RANGES.textWidth);
      if (el.style) {
        el.style.size = tidy(el.style.size, 0.05, RANGES.fontSize);
        el.style.lineHeight = tidy(el.style.lineHeight, 1.2, RANGES.lineHeight);
        el.style.letterSpacing = tidy(el.style.letterSpacing, 0, RANGES.letterSpacing);
      }
      break;
    case "shape":
      el.width = tidy(el.width, 0.4, RANGES.shapeSize);
      el.height = tidy(el.height, 0.4, RANGES.shapeSize);
      el.stroke = tidy(el.stroke, 0, RANGES.stroke);
      el.blur = tidy(el.blur, 0, RANGES.blur);
      break;
    case "image":
      el.width = tidy(el.width, 0.4, RANGES.imageWidth);
      if (el.shadow) el.shadow = { ...el.shadow, blur: tidy(el.shadow.blur, 0, RANGES.blur), x: tidy(el.shadow.x, 0, RANGES.shadowOffset), y: tidy(el.shadow.y, 0, RANGES.shadowOffset) };
      break;
  }
  return el;
}

// ../../../wajha-clone/src/model/colorMath.ts
function rgb(hex) {
  const s = typeof hex === "string" ? hex.replace(/^#/, "") : "";
  const full = /^[0-9a-fA-F]{3,4}$/.test(s) ? [...s].map((c) => c + c).join("") : s;
  if (!/^[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(full)) return { r: 128, g: 128, b: 128 };
  return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
}
var hex2 = (v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0");
function toHex(c) {
  return `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}`;
}
function luminance(hex) {
  const { r, g, b } = rgb(hex);
  const lin = (v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrast(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
function mixColors(a, b, t) {
  const x2 = rgb(a);
  const y = rgb(b);
  const k = Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0;
  return toHex({ r: x2.r + (y.r - x2.r) * k, g: x2.g + (y.g - x2.g) * k, b: x2.b + (y.b - x2.b) * k });
}
function withAlpha(hex, alpha) {
  const a = Number.isFinite(alpha) ? Math.min(1, Math.max(0, alpha)) : 1;
  return `${toHex(rgb(hex))}${hex2(a * 255)}`;
}
function average(colors) {
  if (colors.length === 0) return "#808080";
  let r = 0;
  let g = 0;
  let b = 0;
  for (const c of colors) {
    const v = rgb(c);
    r += v.r;
    g += v.g;
    b += v.b;
  }
  return toHex({ r: r / colors.length, g: g / colors.length, b: b / colors.length });
}
function fillTone(fill) {
  switch (fill?.type) {
    case "solid":
      return toHex(rgb(fill.color));
    case "linear":
    case "radial":
      return average(Array.isArray(fill.stops) ? fill.stops.map((s) => s.color) : []);
    case "mesh": {
      const points = Array.isArray(fill.points) ? fill.points : [];
      return points.length ? mixColors(fill.base, average(points.map((p) => p.color)), 0.5) : toHex(rgb(fill.base));
    }
    case "image":
      return fill.tint ? mixColors("#303030", fill.tint, 0.5) : "#303030";
    default:
      return "#808080";
  }
}
function backgroundTone(bg) {
  return fillTone(bg?.fill);
}
function prefersLightText(tone) {
  return contrast(tone, "#ffffff") >= contrast(tone, "#14121f");
}
function pickAccent(palette, tone, text, fallback) {
  let best = null;
  let bestScore = 0;
  for (const c of palette) {
    const vsBg = contrast(c, tone);
    if (vsBg < 3 || contrast(c, text) < 1.4) continue;
    const { r, g, b } = rgb(c);
    const chroma = (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
    const score = vsBg * (0.5 + chroma);
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  return best ? toHex(rgb(best)) : fallback;
}

// ../../../wajha-clone/src/model/ids.ts
var ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
function newId(prefix = "") {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let out = prefix;
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

// ../../../wajha-clone/src/model/defaults.ts
var DEFAULT_FONT = "Inter Variable";
var DEFAULT_PROJECT_NAME = "Untitled";
var DEFAULT_FAMILY = "iphone";
var DEFAULT_LANGUAGE = "en-US";
var TALL = {
  headTop: 0.11,
  headSize: 0.075,
  headLine: 1.08,
  subSize: 0.04,
  subLine: 1.25,
  gapHeadSub: 0.06,
  gapSubDevice: 0.07
};
var WIDE = {
  headSize: 0.06,
  subSize: 0.032,
  gapHeadSub: 0.045,
  /** Copy column: x center and width as fractions of the canvas width. */
  columnX: 0.28,
  columnW: 0.44,
  /** Device area: x center and maximum width as fractions of the canvas width. */
  deviceX: 0.74,
  deviceW: 0.42
};
var tallSubTop = () => TALL.headTop + 2 * TALL.headSize * TALL.headLine + TALL.gapHeadSub;
var tallDeviceTop = () => tallSubTop() + 2 * TALL.subSize * TALL.subLine + TALL.gapSubDevice;
function wideCopyTop(hu) {
  const block = 2 * WIDE.headSize * TALL.headLine + WIDE.gapHeadSub + 2 * WIDE.subSize * TALL.subLine;
  return Math.max(0.04, hu / 2 - block / 2);
}
var round = (v) => Math.round(v * 1e6) / 1e6;
function defaultBackground() {
  return {
    fill: {
      type: "mesh",
      base: "#130b33",
      points: [
        { x: 0.12, y: 0.06, color: "#6c47ff", radius: 0.62 },
        { x: 0.95, y: 0.28, color: "#b43ce6", radius: 0.5 },
        { x: 0.06, y: 0.74, color: "#3150ff", radius: 0.52 },
        { x: 0.92, y: 0.98, color: "#ff4f9a", radius: 0.42 }
      ]
    },
    pattern: null
  };
}
function defaultTheme() {
  return {
    background: defaultBackground(),
    panorama: false,
    fonts: { heading: DEFAULT_FONT, body: DEFAULT_FONT },
    // Accent first (mock screens use it), then supporting hues, then light and dark neutrals.
    palette: ["#7c5cff", "#ff5c9d", "#ffc46b", "#3dd6c6", "#ffffff", "#130b33"],
    mockDark: false
  };
}
function defaultExportSettings() {
  return { sizes: [], languages: [], format: "png", jpegQuality: 0.92, structure: "stores" };
}
function textColors(theme) {
  const tone = backgroundTone(theme?.background);
  const light = prefersLightText(tone);
  const text = light ? "#ffffff" : "#14121f";
  const palette = Array.isArray(theme?.palette) ? theme.palette : [];
  const highlight = pickAccent(palette, tone, text, light ? "#ffc46b" : "#6a4cff");
  return { text, secondary: withAlpha(text, 0.75), caption: withAlpha(text, 0.7), highlight };
}
var fontsOf = (theme) => ({
  heading: typeof theme?.fonts?.heading === "string" && theme.fonts.heading ? theme.fonts.heading : DEFAULT_FONT,
  body: typeof theme?.fonts?.body === "string" && theme.fonts.body ? theme.fonts.body : DEFAULT_FONT
});
function newTextElement(role, family, theme) {
  const m = familyMetrics(family);
  const colors = textColors(theme);
  const fonts = fontsOf(theme);
  const maxW = 0.92 * m.wu;
  const base = {
    id: newId("e"),
    kind: "text",
    rotation: 0,
    opacity: 1,
    style: {
      font: fonts.body,
      weight: 500,
      size: 0.04,
      lineHeight: 1.25,
      letterSpacing: 0,
      color: colors.text,
      highlight: colors.highlight,
      highlightMode: "color",
      align: "center",
      transform: "none",
      maxLines: 3,
      shadow: null
    }
  };
  if (role === "caption") {
    return {
      ...base,
      key: "caption",
      x: 0.5,
      y: 0.5,
      width: round(Math.min(0.6, maxW)),
      valign: "middle",
      style: {
        ...base.style,
        weight: 700,
        size: m.wide ? 0.026 : 0.03,
        lineHeight: 1.3,
        letterSpacing: 0.08,
        color: colors.caption,
        transform: "uppercase",
        maxLines: 2
      }
    };
  }
  const headline = role === "headline";
  const size2 = m.wide ? headline ? WIDE.headSize : WIDE.subSize : headline ? TALL.headSize : TALL.subSize;
  let x2 = 0.5;
  let width = headline ? 0.86 : 0.8;
  let topU;
  if (m.wide) {
    x2 = WIDE.columnX;
    width = WIDE.columnW * m.wu;
    const top = wideCopyTop(m.hu);
    topU = headline ? top : top + 2 * WIDE.headSize * TALL.headLine + WIDE.gapHeadSub;
  } else {
    topU = headline ? TALL.headTop : tallSubTop();
  }
  return {
    ...base,
    key: role,
    x: x2,
    y: round(topU / m.hu),
    width: round(Math.min(width, maxW)),
    valign: "top",
    style: {
      ...base.style,
      font: headline ? fonts.heading : fonts.body,
      weight: headline ? 800 : 500,
      size: size2,
      lineHeight: headline ? TALL.headLine : TALL.subLine,
      letterSpacing: headline ? -0.02 : 0,
      color: headline ? colors.text : colors.secondary
    }
  };
}
var DEVICE_STYLE = { color: "#3a3a3f", finish: "metal", bezel: "black" };
function deviceShadow(theme) {
  const light = !prefersLightText(backgroundTone(theme?.background));
  return light ? { color: "#1a103340", blur: 0.06, x: 0, y: 0.025 } : { color: "#00000073", blur: 0.07, x: 0, y: 0.03 };
}
function newDeviceElement(family, theme) {
  const fam = FAMILIES[family] ?? FAMILIES[DEFAULT_FAMILY];
  const m = familyMetrics(fam.id);
  const factor = deviceHeightFactor(fam.defaultFrame, fam.screenAspect);
  let width;
  let x2 = 0.5;
  let yU;
  if (m.wide) {
    x2 = WIDE.deviceX;
    const maxW = WIDE.deviceW * m.wu;
    if (maxW * factor > 0.88 * m.hu) {
      const top = 0.12 * m.hu;
      width = Math.min(maxW, (m.hu - top) / 0.8 / factor);
      yU = top + width * factor / 2;
    } else {
      width = maxW;
      yU = m.hu / 2;
    }
  } else {
    const top = tallDeviceTop();
    if (fam.aspectClass === "tablet") {
      width = 0.8;
    } else {
      width = Math.min(0.78, Math.max(0.62, (m.hu - top) / 0.95 / factor));
    }
    yU = top + width * factor / 2;
  }
  return {
    id: newId("e"),
    kind: "device",
    x: x2,
    y: round(yU / m.hu),
    rotation: 0,
    opacity: 1,
    frame: fam.defaultFrame,
    style: { ...DEVICE_STYLE },
    width: round(width),
    slot: "main",
    cornerRadius: 0.06,
    shadow: deviceShadow(theme)
  };
}
var DEFAULT_LAYOUT_IDS = { device: "device", headline: "headline", subtitle: "subtitle" };
function defaultLayout(family, theme, ids = DEFAULT_LAYOUT_IDS) {
  return {
    background: null,
    elements: [
      { ...newDeviceElement(family, theme), id: ids.device },
      { ...newTextElement("headline", family, theme), id: ids.headline },
      { ...newTextElement("subtitle", family, theme), id: ids.subtitle }
    ]
  };
}
function familiesOrDefault(families) {
  const out = uniqueFamilies(families);
  return out.length ? out : [DEFAULT_FAMILY];
}
function languagesOrDefault(languages) {
  const out = uniqueLanguages(languages);
  return out.length ? out : [DEFAULT_LANGUAGE];
}
function newSlide(families, theme, languages) {
  const ids = { device: newId("e"), headline: newId("e"), subtitle: newId("e") };
  const layouts = {};
  for (const f of familiesOrDefault(families)) layouts[f] = defaultLayout(f, theme, ids);
  const texts = {};
  for (const lang of languagesOrDefault(languages)) texts[lang] = { headline: "", subtitle: "" };
  return { id: newId("s"), texts, shots: {}, layouts };
}

// ../../../wajha-clone/src/model/resolve.ts
var EMPTY_LAYOUT = Object.freeze({ background: null, elements: Object.freeze([]) });

// ../../../wajha-clone/src/model/instantiate.ts
var REFERENCE_FAMILY = { tall: "iphone", tablet: "ipad", wide: "mac" };
var ASPECT_CLASSES = ["tall", "tablet", "wide"];
function remapIds(layout, ids) {
  const used = /* @__PURE__ */ new Set();
  const elements = (Array.isArray(layout.elements) ? layout.elements : []).map((el) => {
    const copy = deepClone(el);
    let id = ids.get(el.id);
    if (!id || used.has(id)) {
      id = newId("e");
      if (!ids.has(el.id)) ids.set(el.id, id);
    }
    used.add(id);
    copy.id = id;
    return copy;
  });
  return { background: layout.background ? deepClone(layout.background) : null, elements };
}
var scriptOf = (code) => code.split("-").find((part, i2) => i2 > 0 && /^[A-Za-z]{4}$/.test(part))?.toLowerCase();
function sameLanguageTexts(texts, lang) {
  const own = (k) => Object.prototype.hasOwnProperty.call(texts, k) ? texts[k] : void 0;
  const exact = own(lang);
  if (exact) return exact;
  const primary = lang.split("-")[0];
  const bare = own(primary);
  if (bare) return bare;
  const script = scriptOf(lang);
  const variant = Object.keys(texts).find((k) => {
    if (k.split("-")[0] !== primary) return false;
    const other = scriptOf(k);
    return !script || !other || script === other;
  });
  return variant ? texts[variant] : void 0;
}
function pickTexts(texts, lang) {
  const same = sameLanguageTexts(texts, lang);
  if (same) return same;
  const keys = Object.keys(texts);
  const en = (Object.prototype.hasOwnProperty.call(texts, DEFAULT_LANGUAGE) ? texts[DEFAULT_LANGUAGE] : void 0) ?? keys.filter((k) => k.split("-")[0] === "en").map((k) => texts[k])[0];
  if (en) return en;
  return keys.length ? texts[keys[0]] : {};
}
function layoutForFamily(classLayouts, family) {
  const info = FAMILIES[family];
  const ref = REFERENCE_FAMILY[info.aspectClass];
  const own = classLayouts[info.aspectClass];
  if (own) return family === ref ? deepClone(own) : adaptLayout(own, FAMILIES[ref].design, info.design, family);
  const tall = classLayouts.tall;
  if (!tall) return { background: null, elements: [] };
  return adaptLayout(tall, FAMILIES.iphone.design, info.design, family);
}
function slideFromTemplate(ts, families, languages) {
  const ids = /* @__PURE__ */ new Map();
  const classLayouts = {};
  for (const cls of ASPECT_CLASSES) {
    const l = ts.layouts?.[cls];
    if (l) classLayouts[cls] = remapIds(l, ids);
  }
  if (!classLayouts.tall) {
    const cls = ASPECT_CLASSES.find((k) => classLayouts[k]);
    if (cls) classLayouts.tall = adaptLayout(classLayouts[cls], FAMILIES[REFERENCE_FAMILY[cls]].design, FAMILIES.iphone.design, "iphone");
  }
  const primary = families[0];
  const primaryClass = FAMILIES[primary].aspectClass;
  const layouts = {};
  for (const f of families) {
    const cls = FAMILIES[f].aspectClass;
    if (f === primary || cls !== primaryClass && ts.layouts?.[cls]) layouts[f] = layoutForFamily(classLayouts, f);
  }
  const texts = {};
  const source = ts.texts ?? {};
  languages.forEach((lang, i2) => {
    const copy = i2 === 0 ? pickTexts(source, lang) : sameLanguageTexts(source, lang);
    if (copy) texts[lang] = deepClone(copy);
  });
  return { id: newId("s"), texts, shots: {}, layouts };
}
function projectFromTemplate(template, opts) {
  const families = uniqueFamilies(opts?.families);
  if (!families.length) families.push(DEFAULT_FAMILY);
  const languages = uniqueLanguages(opts?.languages);
  if (!languages.length) languages.push(DEFAULT_LANGUAGE);
  const theme = deepClone(template.theme);
  const slides = (Array.isArray(template.slides) ? template.slides : []).slice(0, LIMITS.templateSlides).map((ts) => slideFromTemplate(ts, families, languages));
  if (!slides.length) slides.push(newSlide(families, theme, languages));
  const name = (typeof opts?.name === "string" ? cleanName(opts.name) : "") || cleanName(template.name ?? "") || DEFAULT_PROJECT_NAME;
  const now = Date.now();
  return {
    format: "wajha.project",
    version: 1,
    id: newId(),
    name,
    createdAt: now,
    updatedAt: now,
    templateId: isTemplateId(template.id) ? template.id : null,
    theme,
    families,
    languages,
    slides,
    assets: deepClone(template.assets ?? {}),
    export: defaultExportSettings()
  };
}

// ../../../wajha-clone/src/model/validate.ts
var ValidationError = class extends Error {
  path;
  constructor(path, message) {
    super(`${path}: ${message}`);
    this.name = "ValidationError";
    this.path = path;
  }
};
var ELEMENT_KINDS = ["device", "text", "shape", "image"];
var DEVICE_FRAMES = ["iphone", "ipad", "android-phone", "android-tablet", "macbook", "watch", "tv", "vision", "browser", "none"];
var FRAME_FINISHES = ["metal", "matte", "clay"];
var SHAPE_KINDS = ["circle", "rect", "blob", "ring"];
var PATTERN_KINDS = ["dots", "grid", "diagonal", "noise", "waves", "rings"];
var FILL_TYPES = ["solid", "linear", "radial", "mesh", "image"];
var IMAGE_FITS = ["cover", "contain", "tile"];
var TEMPLATE_CATEGORY_LIST = ["minimal", "bold", "gradient", "dark", "playful", "panorama", "elegant"];
var EXPORT_STRUCTURES = ["stores", "fastlane", "flat"];
var BEZELS = ["black", "match"];
var VALIGNS = ["top", "middle", "bottom"];
var ALIGNS = ["start", "center", "end"];
var TRANSFORMS = ["none", "uppercase"];
var HIGHLIGHT_MODES = ["color", "marker"];
var FORMATS = ["png", "jpeg"];
var CURRENT_VERSION = 1;
function contextFor(assets) {
  return { assets: new Set(assets ? Object.keys(assets) : []) };
}
function fail(path, message) {
  throw new ValidationError(path || "$", message);
}
function at(path, key) {
  if (typeof key === "number") return `${path}[${key}]`;
  if (/^[A-Za-z_$][A-Za-z0-9_$-]*$/.test(key)) return path ? `${path}.${key}` : key;
  const shown = key.length > 80 ? `${key.slice(0, 80)}\u2026` : key;
  return `${path}[${JSON.stringify(shown)}]`;
}
var hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
function get(o, key) {
  return hasOwn(o, key) ? o[key] : void 0;
}
var isMissing = (v) => v === void 0 || v === null;
function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function asObject(v, path) {
  if (!isPlainObject(v)) fail(path, "must be an object");
  return v;
}
function objectField(o, key, path) {
  const p = at(path, key);
  const v = get(o, key);
  if (isMissing(v)) fail(p, "is required");
  return asObject(v, p);
}
function arrayField(o, key, path, max2, required = false) {
  const p = at(path, key);
  const v = get(o, key);
  if (isMissing(v)) {
    if (required) fail(p, "is required");
    return [];
  }
  if (!Array.isArray(v)) fail(p, "must be an array");
  return v.length > max2 ? v.slice(0, max2) : v;
}
function numberField(o, key, path, range, fallback) {
  const p = at(path, key);
  const v = get(o, key);
  if (isMissing(v) || typeof v === "number" && Number.isNaN(v)) {
    if (fallback === void 0) fail(p, "is required");
    return fallback;
  }
  if (typeof v !== "number") fail(p, "must be a number");
  return clampToRange(v, range);
}
function boolField(o, key, path, fallback) {
  const v = get(o, key);
  if (isMissing(v)) return fallback;
  if (typeof v !== "boolean") fail(at(path, key), "must be true or false");
  return v;
}
function rawString(o, key, path, fallback) {
  const p = at(path, key);
  const v = get(o, key);
  if (isMissing(v)) {
    if (fallback === void 0) fail(p, "is required");
    return fallback;
  }
  if (typeof v !== "string") fail(p, "must be a string");
  return v;
}
function nameField(o, key, path, fallback, max2 = LIMITS.name) {
  return cleanName(rawString(o, key, path, fallback), max2);
}
function enumField(o, key, path, allowed, fallback) {
  const p = at(path, key);
  const v = get(o, key);
  if (isMissing(v)) {
    if (fallback === void 0) fail(p, "is required");
    return fallback;
  }
  if (typeof v !== "string") fail(p, "must be a string");
  if (!allowed.includes(v)) fail(p, `must be one of ${allowed.join(", ")}`);
  return v;
}
function colorValue(v, path) {
  if (typeof v !== "string") fail(path, "must be a colour string");
  const c = normalizeColor(v);
  if (!c) fail(path, "must be a hex colour like #RRGGBB or #RRGGBBAA");
  return c;
}
function colorField(o, key, path, fallback) {
  const v = get(o, key);
  if (isMissing(v)) {
    if (fallback === void 0) fail(at(path, key), "is required");
    return fallback;
  }
  return colorValue(v, at(path, key));
}
function recordKeys(o, max2, accept) {
  const out = [];
  for (const k of Object.keys(o)) {
    if (out.length >= max2) break;
    if (accept(k)) out.push(k);
  }
  return out;
}
function cleanShadow(v, path) {
  if (isMissing(v)) return null;
  const o = asObject(v, path);
  return {
    color: colorField(o, "color", path),
    blur: numberField(o, "blur", path, RANGES.blur, 0.04),
    x: numberField(o, "x", path, RANGES.shadowOffset, 0),
    y: numberField(o, "y", path, RANGES.shadowOffset, 0.02)
  };
}
function cleanStops(o, path) {
  const raw = arrayField(o, "stops", path, LIMITS.stops, true);
  if (raw.length === 0) fail(at(path, "stops"), "needs at least one stop");
  return raw.map((s, i2) => {
    const p = at(at(path, "stops"), i2);
    const so = asObject(s, p);
    return { offset: numberField(so, "offset", p, RANGES.unit), color: colorField(so, "color", p) };
  });
}
function cleanFill(v, path, ctx) {
  const o = asObject(v, path);
  const type = enumField(o, "type", path, FILL_TYPES);
  switch (type) {
    case "solid":
      return { type, color: colorField(o, "color", path) };
    case "linear":
      return { type, angle: numberField(o, "angle", path, RANGES.angle, 180), stops: cleanStops(o, path) };
    case "radial":
      return {
        type,
        cx: numberField(o, "cx", path, RANGES.gradientCenter, 0.5),
        cy: numberField(o, "cy", path, RANGES.gradientCenter, 0.5),
        radius: numberField(o, "radius", path, RANGES.gradientRadius, 0.75),
        stops: cleanStops(o, path)
      };
    case "mesh": {
      const points = arrayField(o, "points", path, LIMITS.meshPoints).map((pt, i2) => {
        const p = at(at(path, "points"), i2);
        const po = asObject(pt, p);
        return {
          x: numberField(po, "x", p, RANGES.position),
          y: numberField(po, "y", p, RANGES.position),
          color: colorField(po, "color", p),
          radius: numberField(po, "radius", p, RANGES.gradientRadius, 0.5)
        };
      });
      return { type, base: colorField(o, "base", path), points };
    }
    case "image": {
      const assetId = rawString(o, "assetId", path);
      const tintRaw = get(o, "tint");
      const fill = {
        type,
        assetId,
        fit: enumField(o, "fit", path, IMAGE_FITS, "cover"),
        opacity: numberField(o, "opacity", path, RANGES.unit, 1),
        blur: numberField(o, "blur", path, RANGES.imageBlur, 0),
        tint: isMissing(tintRaw) ? null : colorValue(tintRaw, at(path, "tint"))
      };
      return isAssetId(assetId) && ctx.assets.has(assetId) ? fill : null;
    }
  }
}
function cleanPattern(v, path) {
  if (isMissing(v)) return null;
  const o = asObject(v, path);
  return {
    kind: enumField(o, "kind", path, PATTERN_KINDS),
    color: colorField(o, "color", path),
    opacity: numberField(o, "opacity", path, RANGES.unit, 0.15),
    scale: numberField(o, "scale", path, RANGES.patternScale, 0.05)
  };
}
function cleanBackground(v, path, ctx) {
  if (isMissing(v)) return null;
  const o = asObject(v, path);
  const fillRaw = get(o, "fill");
  if (isMissing(fillRaw)) fail(at(path, "fill"), "is required");
  const fill = cleanFill(fillRaw, at(path, "fill"), ctx);
  const pattern = cleanPattern(get(o, "pattern"), at(path, "pattern"));
  return fill ? { fill, pattern } : null;
}
var DANGLING_SHAPE_FILL = { type: "solid", color: "#808080" };
function cleanTextStyle(v, path, fallbackFont = DEFAULT_FONT) {
  const o = asObject(v, path);
  const color = colorField(o, "color", path);
  return {
    font: cleanFontName(rawString(o, "font", path, fallbackFont), fallbackFont),
    weight: numberField(o, "weight", path, RANGES.fontWeight, 400),
    size: numberField(o, "size", path, RANGES.fontSize),
    lineHeight: numberField(o, "lineHeight", path, RANGES.lineHeight, 1.2),
    letterSpacing: numberField(o, "letterSpacing", path, RANGES.letterSpacing, 0),
    color,
    highlight: colorField(o, "highlight", path, color),
    highlightMode: enumField(o, "highlightMode", path, HIGHLIGHT_MODES, "color"),
    align: enumField(o, "align", path, ALIGNS, "center"),
    transform: enumField(o, "transform", path, TRANSFORMS, "none"),
    maxLines: numberField(o, "maxLines", path, RANGES.maxLines, 0),
    shadow: cleanShadow(get(o, "shadow"), at(path, "shadow"))
  };
}
function keyField(o, key, path, fallback) {
  const v = rawString(o, key, path, fallback);
  if (!isSafeKey(v)) fail(at(path, key), 'must be 1-40 letters, digits, ".", "_" or "-", and not a reserved name such as "toString"');
  return v;
}
function cleanElement(v, path, ctx, ids = /* @__PURE__ */ new Set()) {
  const o = asObject(v, path);
  const kind = enumField(o, "kind", path, ELEMENT_KINDS);
  const rawId = get(o, "id");
  const id = isId(rawId) && !ids.has(rawId) ? rawId : newId("e");
  const base = {
    id,
    x: numberField(o, "x", path, RANGES.position),
    y: numberField(o, "y", path, RANGES.position),
    rotation: numberField(o, "rotation", path, RANGES.rotation, 0),
    opacity: numberField(o, "opacity", path, RANGES.unit, 1)
  };
  const name = get(o, "name");
  if (!isMissing(name)) {
    if (typeof name !== "string") fail(at(path, "name"), "must be a string");
    const clean = cleanName(name);
    if (clean) base.name = clean;
  }
  if (boolField(o, "hidden", path, false)) base.hidden = true;
  if (boolField(o, "locked", path, false)) base.locked = true;
  let el = null;
  switch (kind) {
    case "device": {
      const sp = at(path, "style");
      const so = objectField(o, "style", path);
      const device = {
        ...base,
        kind,
        frame: enumField(o, "frame", path, DEVICE_FRAMES),
        style: {
          color: colorField(so, "color", sp),
          finish: enumField(so, "finish", sp, FRAME_FINISHES, "metal"),
          bezel: enumField(so, "bezel", sp, BEZELS, "black")
        },
        width: numberField(o, "width", path, RANGES.deviceWidth),
        slot: keyField(o, "slot", path, "main"),
        cornerRadius: numberField(o, "cornerRadius", path, RANGES.cornerRadius, 0),
        shadow: cleanShadow(get(o, "shadow"), at(path, "shadow"))
      };
      el = device;
      break;
    }
    case "text": {
      const styleRaw = get(o, "style");
      if (isMissing(styleRaw)) fail(at(path, "style"), "is required");
      const text = {
        ...base,
        kind,
        key: keyField(o, "key", path),
        width: numberField(o, "width", path, RANGES.textWidth),
        valign: enumField(o, "valign", path, VALIGNS, "top"),
        style: cleanTextStyle(styleRaw, at(path, "style"))
      };
      el = text;
      break;
    }
    case "shape": {
      const fillRaw = get(o, "fill");
      if (isMissing(fillRaw)) fail(at(path, "fill"), "is required");
      const shape = {
        ...base,
        kind,
        shape: enumField(o, "shape", path, SHAPE_KINDS),
        width: numberField(o, "width", path, RANGES.shapeSize),
        height: numberField(o, "height", path, RANGES.shapeSize),
        fill: cleanFill(fillRaw, at(path, "fill"), ctx) ?? { ...DANGLING_SHAPE_FILL },
        radius: numberField(o, "radius", path, RANGES.shapeRadius, 0),
        stroke: numberField(o, "stroke", path, RANGES.stroke, 0),
        blur: numberField(o, "blur", path, RANGES.blur, 0),
        seed: numberField(o, "seed", path, RANGES.seed, 0)
      };
      el = shape;
      break;
    }
    case "image": {
      const assetId = rawString(o, "assetId", path);
      const image = {
        ...base,
        kind,
        assetId,
        width: numberField(o, "width", path, RANGES.imageWidth),
        cornerRadius: numberField(o, "cornerRadius", path, RANGES.cornerRadius, 0),
        shadow: cleanShadow(get(o, "shadow"), at(path, "shadow"))
      };
      el = isAssetId(assetId) && ctx.assets.has(assetId) ? image : null;
      break;
    }
  }
  if (el) ids.add(el.id);
  return el;
}
function cleanLayout(v, path, ctx) {
  const o = asObject(v, path);
  const ids = /* @__PURE__ */ new Set();
  const elements = [];
  arrayField(o, "elements", path, LIMITS.elements).forEach((e, i2) => {
    const el = cleanElement(e, at(at(path, "elements"), i2), ctx, ids);
    if (el) elements.push(el);
  });
  return { background: cleanBackground(get(o, "background"), at(path, "background"), ctx), elements };
}
function cleanTheme(v, path, ctx) {
  const o = asObject(v, path);
  const bgRaw = get(o, "background");
  const background = isMissing(bgRaw) ? defaultBackground() : cleanBackground(bgRaw, at(path, "background"), ctx) ?? defaultBackground();
  const fontsRaw = get(o, "fonts");
  let fonts = { heading: DEFAULT_FONT, body: DEFAULT_FONT };
  if (!isMissing(fontsRaw)) {
    const fp = at(path, "fonts");
    const fo = asObject(fontsRaw, fp);
    fonts = {
      heading: cleanFontName(rawString(fo, "heading", fp, DEFAULT_FONT), DEFAULT_FONT),
      body: cleanFontName(rawString(fo, "body", fp, DEFAULT_FONT), DEFAULT_FONT)
    };
  }
  const palette = [];
  arrayField(o, "palette", path, LIMITS.palette).forEach((c, i2) => {
    const color = colorValue(c, at(at(path, "palette"), i2));
    if (!palette.includes(color)) palette.push(color);
  });
  return {
    background,
    panorama: boolField(o, "panorama", path, false),
    fonts,
    palette,
    mockDark: boolField(o, "mockDark", path, false)
  };
}
function cleanAssetInfo(v, path, id) {
  const o = asObject(v, path);
  return {
    id,
    name: nameField(o, "name", path, id) || id,
    width: numberField(o, "width", path, RANGES.pixels),
    height: numberField(o, "height", path, RANGES.pixels),
    bytes: numberField(o, "bytes", path, RANGES.bytes, 0),
    addedAt: numberField(o, "addedAt", path, RANGES.timestamp, 0)
  };
}
function cleanAssets(v, path) {
  const out = {};
  if (isMissing(v)) return out;
  const o = asObject(v, path);
  for (const k of recordKeys(o, LIMITS.assets, isAssetId)) out[k] = cleanAssetInfo(o[k], at(path, k), k);
  return out;
}
function cleanFonts(v, path) {
  if (isMissing(v)) return [];
  const out = [];
  const families = /* @__PURE__ */ new Set();
  const files = /* @__PURE__ */ new Set();
  if (!Array.isArray(v)) return out;
  v.slice(0, LIMITS.fonts).forEach((raw, i2) => {
    if (!isPlainObject(raw)) return;
    const file = raw.file;
    if (!isFontFile(file) || files.has(file)) return;
    const family = nameField(raw, "family", at(path, i2), "");
    if (!family || families.has(family.toLowerCase())) return;
    families.add(family.toLowerCase());
    files.add(file);
    out.push({ family, file, name: nameField(raw, "name", at(path, i2), file) || file });
  });
  return out;
}
function cleanExportSettings(v, path, languages) {
  const d = defaultExportSettings();
  if (isMissing(v)) return d;
  const o = asObject(v, path);
  const sizes = [];
  arrayField(o, "sizes", path, 64).forEach((s, i2) => {
    if (typeof s !== "string") fail(at(at(path, "sizes"), i2), "must be a string");
    if (sizeById(s) && !sizes.includes(s)) sizes.push(s);
  });
  const langs = [];
  arrayField(o, "languages", path, LIMITS.languages).forEach((l, i2) => {
    if (typeof l !== "string") fail(at(at(path, "languages"), i2), "must be a string");
    if (languages.includes(l) && !langs.includes(l)) langs.push(l);
  });
  return {
    sizes,
    languages: langs,
    format: enumField(o, "format", path, FORMATS, d.format),
    jpegQuality: numberField(o, "jpegQuality", path, RANGES.jpegQuality, d.jpegQuality),
    structure: enumField(o, "structure", path, EXPORT_STRUCTURES, d.structure)
  };
}
function cleanTexts(v, path) {
  const out = {};
  if (isMissing(v)) return out;
  const o = asObject(v, path);
  for (const lang of recordKeys(o, LIMITS.languages, isLangCode)) {
    const lp = at(path, lang);
    const byKey = asObject(o[lang], lp);
    const texts = {};
    for (const key of recordKeys(byKey, LIMITS.textKeys, isSafeKey)) {
      const t = byKey[key];
      if (isMissing(t)) continue;
      if (typeof t !== "string") fail(at(lp, key), "must be a string");
      texts[key] = cleanText(t);
    }
    out[lang] = texts;
  }
  return out;
}
function cleanShots(v, path, ctx) {
  const out = {};
  if (isMissing(v)) return out;
  const o = asObject(v, path);
  for (const family of recordKeys(o, 16, isFamilyId)) {
    const fp = at(path, family);
    const bySlot = asObject(o[family], fp);
    const map = {};
    for (const slot of recordKeys(bySlot, LIMITS.slots, isSafeKey)) {
      const sp = at(fp, slot);
      const byLang = asObject(bySlot[slot], sp);
      const langs = {};
      for (const lang of recordKeys(byLang, LIMITS.languages, isLangCode)) {
        const id = byLang[lang];
        if (isMissing(id)) continue;
        if (typeof id !== "string") fail(at(sp, lang), "must be an asset id string");
        if (isAssetId(id) && ctx.assets.has(id)) langs[lang] = id;
      }
      if (Object.keys(langs).length) map[slot] = langs;
    }
    if (Object.keys(map).length) out[family] = map;
  }
  return out;
}
function cleanLayouts(v, path, ctx) {
  const out = {};
  if (isMissing(v)) return out;
  const o = asObject(v, path);
  for (const family of recordKeys(o, 16, isFamilyId)) {
    out[family] = cleanLayout(o[family], at(path, family), ctx);
  }
  return out;
}
function cleanSlide(v, path, ctx, ids) {
  const o = asObject(v, path);
  const rawId = get(o, "id");
  const id = isId(rawId) && !ids.has(rawId) ? rawId : newId("s");
  ids.add(id);
  return {
    id,
    texts: cleanTexts(get(o, "texts"), at(path, "texts")),
    shots: cleanShots(get(o, "shots"), at(path, "shots"), ctx),
    layouts: cleanLayouts(get(o, "layouts"), at(path, "layouts"), ctx)
  };
}
function cleanFamilyList(o, path) {
  const out = [];
  arrayField(o, "families", path, 64).forEach((f, i2) => {
    if (typeof f !== "string") fail(at(at(path, "families"), i2), "must be a string");
    if (isFamilyId(f) && !out.includes(f)) out.push(f);
  });
  return out.length ? out : [DEFAULT_FAMILY];
}
function cleanLanguageList(o, path) {
  const out = [];
  arrayField(o, "languages", path, LIMITS.languages * 2).forEach((l, i2) => {
    if (typeof l !== "string") fail(at(at(path, "languages"), i2), "must be a string");
    if (out.length < LIMITS.languages && isLangCode(l) && !out.includes(l)) out.push(l);
  });
  return out.length ? out : [DEFAULT_LANGUAGE];
}
var MIGRATIONS = {
  project: {},
  template: {},
  gallery: {}
};
function migrate(kind, json) {
  let o = json;
  for (let guard = 0; guard < 100; guard++) {
    const v = get(o, "version");
    if (isMissing(v)) fail("version", "is required");
    if (typeof v !== "number" || !Number.isInteger(v) || v < 1) fail("version", "must be a positive integer");
    if (v === CURRENT_VERSION) return o;
    if (v > CURRENT_VERSION) fail("version", `${v} is newer than this app understands (${CURRENT_VERSION}); update Wajha to open it`);
    const step = MIGRATIONS[kind][v];
    if (!step) fail("version", `no upgrade from version ${v}`);
    o = step(o);
  }
  return fail("version", "migration did not converge");
}
function checkFormat(o, expected) {
  const f = get(o, "format");
  if (f !== expected) fail("format", `must be "${expected}"`);
}
function cleanTypography(v, path, languages) {
  const out = {};
  if (isMissing(v)) return out;
  const o = asObject(v, path);
  for (const lang of languages) {
    const raw = get(o, lang);
    if (isMissing(raw)) continue;
    const p = at(path, lang);
    const lo = asObject(raw, p);
    const entry = {};
    const font = get(lo, "font");
    if (!isMissing(font)) {
      if (typeof font !== "string") fail(at(p, "font"), "must be a string");
      const name = cleanFontName(font, "");
      if (name) entry.font = name;
    }
    const spacing = Math.round(numberField(lo, "lineSpacing", p, RANGES.lineSpacing, 1) * 100) / 100;
    if (spacing !== 1) entry.lineSpacing = spacing;
    if (entry.font || entry.lineSpacing) out[lang] = entry;
  }
  return out;
}
function validateProject(json) {
  const root = asObject(json, "$");
  checkFormat(root, "wajha.project");
  const o = migrate("project", root);
  const id = rawString(o, "id", "");
  if (!isId(id)) fail("id", 'must be 1-64 letters, digits, "_" or "-"');
  const now = Date.now();
  const createdAt = numberField(o, "createdAt", "", RANGES.timestamp, now);
  const updatedAt = numberField(o, "updatedAt", "", RANGES.timestamp, createdAt);
  const tid = get(o, "templateId");
  if (!isMissing(tid) && typeof tid !== "string") fail("templateId", "must be a string or null");
  const assets = cleanAssets(get(o, "assets"), "assets");
  const ctx = contextFor(assets);
  const themeRaw = get(o, "theme");
  const theme = isMissing(themeRaw) ? defaultTheme() : cleanTheme(themeRaw, "theme", ctx);
  const families = cleanFamilyList(o, "");
  const languages = cleanLanguageList(o, "");
  const ids = /* @__PURE__ */ new Set();
  const slides = arrayField(o, "slides", "", LIMITS.slides).map((s, i2) => cleanSlide(s, at("slides", i2), ctx, ids));
  if (!slides.length) slides.push(newSlide(families, theme, languages));
  const fonts = cleanFonts(get(o, "fonts"), "fonts");
  const mirrorRtl = boolField(o, "mirrorRtl", "", true);
  const typography = cleanTypography(get(o, "typography"), "typography", languages);
  return {
    format: "wajha.project",
    version: 1,
    id,
    name: nameField(o, "name", "", DEFAULT_PROJECT_NAME) || DEFAULT_PROJECT_NAME,
    createdAt,
    updatedAt,
    templateId: isTemplateId(tid) ? tid : null,
    theme,
    families,
    languages,
    ...mirrorRtl ? {} : { mirrorRtl: false },
    ...Object.keys(typography).length ? { typography } : {},
    slides,
    assets,
    ...fonts.length ? { fonts } : {},
    export: cleanExportSettings(get(o, "export"), "export", languages)
  };
}
var REFERENCE_CANVAS = { tall: FAMILIES.iphone.design, tablet: FAMILIES.ipad.design, wide: FAMILIES.mac.design };
function cleanTemplateSlide(v, path, ctx) {
  const o = asObject(v, path);
  const texts = cleanTexts(get(o, "texts"), at(path, "texts"));
  if (!texts[DEFAULT_LANGUAGE]) {
    const first = Object.keys(texts)[0];
    texts[DEFAULT_LANGUAGE] = first ? { ...texts[first] } : {};
  }
  const lp = at(path, "layouts");
  const lo = objectField(o, "layouts", path);
  const read = (cls) => isMissing(get(lo, cls)) ? void 0 : cleanLayout(lo[cls], at(lp, cls), ctx);
  const tablet = read("tablet");
  const wide = read("wide");
  let tall = read("tall");
  if (!tall) {
    if (tablet) tall = adaptLayout(tablet, REFERENCE_CANVAS.tablet, REFERENCE_CANVAS.tall, "iphone");
    else if (wide) tall = adaptLayout(wide, REFERENCE_CANVAS.wide, REFERENCE_CANVAS.tall, "iphone");
    else fail(at(lp, "tall"), "is required");
  }
  const layouts = { tall };
  if (tablet) layouts.tablet = tablet;
  if (wide) layouts.wide = wide;
  return { texts, layouts };
}
function cleanTags(o, path) {
  const tags = [];
  arrayField(o, "tags", path, LIMITS.tags * 4).forEach((t, i2) => {
    if (typeof t !== "string") fail(at(at(path, "tags"), i2), "must be a string");
    const tag = cleanName(t, LIMITS.tag);
    if (tag && !tags.includes(tag) && tags.length < LIMITS.tags) tags.push(tag);
  });
  return tags;
}
function templateIdField(o, path) {
  const id = rawString(o, "id", path);
  if (!isTemplateId(id)) {
    fail(at(path, "id"), isWindowsDeviceName(id) ? "must not be a name Windows reserves (con, prn, aux, nul, com1-9, lpt1-9)" : 'must be kebab-case (a-z, 0-9 and "-"), at most 64 characters');
  }
  return id;
}
function validateTemplate(json) {
  const root = asObject(json, "$");
  checkFormat(root, "wajha.template");
  const o = migrate("template", root);
  const id = templateIdField(o, "");
  const assets = cleanAssets(get(o, "assets"), "assets");
  const ctx = contextFor(assets);
  const themeRaw = get(o, "theme");
  const theme = isMissing(themeRaw) ? defaultTheme() : cleanTheme(themeRaw, "theme", ctx);
  const slides = arrayField(o, "slides", "", LIMITS.templateSlides).map((s, i2) => cleanTemplateSlide(s, at("slides", i2), ctx));
  if (!slides.length) {
    const blank = newSlide(["iphone"], theme, [DEFAULT_LANGUAGE]);
    slides.push({ texts: blank.texts, layouts: { tall: blank.layouts.iphone } });
  }
  return {
    format: "wajha.template",
    version: 1,
    id,
    name: nameField(o, "name", "", id) || id,
    author: nameField(o, "author", "", ""),
    description: cleanText(rawString(o, "description", "", ""), LIMITS.text),
    category: enumField(o, "category", "", TEMPLATE_CATEGORY_LIST, "minimal"),
    tags: cleanTags(o, ""),
    theme,
    slides,
    assets
  };
}

// ../../../wajha-clone/src/platform/limits.ts
var MB = 1024 * 1024;
var MAX_IMAGE_BYTES = 100 * MB;
var ARCHIVE_MAX_BYTES = 500 * MB;
var TEMPLATE_ARCHIVE_MAX_BYTES = 100 * MB;
var MAX_MANIFEST_BYTES = 16 * MB;
var MAX_CSV_BYTES = 10 * MB;
var MAX_FONT_BYTES = 30 * MB;
var MAX_LOGO_BYTES = 20 * MB;
var IMAGE_LIMITS = { maxBytes: MAX_IMAGE_BYTES, maxSide: 16384, maxPixels: 8192 * 8192 };
var THUMBNAIL_LIMITS = { maxBytes: 4 * MB, maxSide: 4096, maxPixels: 2048 * 2048 };
function sniffImageExt(data) {
  const b = data;
  if (b.length >= 8 && b[0] === 137 && b[1] === 80 && b[2] === 78 && b[3] === 71 && b[4] === 13 && b[5] === 10 && b[6] === 26 && b[7] === 10) return "png";
  if (b.length >= 3 && b[0] === 255 && b[1] === 216 && b[2] === 255) return "jpg";
  if (b.length >= 12 && b[0] === 82 && b[1] === 73 && b[2] === 70 && b[3] === 70 && // RIFF
  b[8] === 87 && b[9] === 69 && b[10] === 66 && b[11] === 80) return "webp";
  return null;
}
var ascii = (b, at2, text) => {
  for (let i2 = 0; i2 < text.length; i2++) if (b[at2 + i2] !== text.charCodeAt(i2)) return false;
  return true;
};
var u16be = (b, i2) => b[i2] << 8 | b[i2 + 1];
var u32be = (b, i2) => (b[i2] << 24 | b[i2 + 1] << 16 | b[i2 + 2] << 8 | b[i2 + 3]) >>> 0;
var u24le = (b, i2) => b[i2] | b[i2 + 1] << 8 | b[i2 + 2] << 16;
function pngSize(b) {
  if (b.length < 24 || u32be(b, 8) !== 13 || !ascii(b, 12, "IHDR")) return null;
  return { width: u32be(b, 16), height: u32be(b, 20) };
}
function jpegSize(b) {
  let i2 = 2;
  while (i2 + 3 < b.length) {
    if (b[i2] !== 255) {
      i2++;
      continue;
    }
    const marker = b[i2 + 1];
    if (marker === 255) {
      i2++;
      continue;
    }
    if (marker === 216 || marker === 1 || marker >= 208 && marker <= 215) {
      i2 += 2;
      continue;
    }
    if (marker === 217 || marker === 218) return null;
    const length = u16be(b, i2 + 2);
    if (length < 2) return null;
    const isFrame = marker >= 192 && marker <= 207 && marker !== 196 && marker !== 200 && marker !== 204;
    if (isFrame) {
      if (i2 + 9 > b.length) return null;
      return { width: u16be(b, i2 + 7), height: u16be(b, i2 + 5) };
    }
    i2 += 2 + length;
  }
  return null;
}
function webpSize(b) {
  if (b.length < 30) return null;
  if (ascii(b, 12, "VP8 ")) {
    if (b[23] !== 157 || b[24] !== 1 || b[25] !== 42) return null;
    return { width: (b[26] | b[27] << 8) & 16383, height: (b[28] | b[29] << 8) & 16383 };
  }
  if (ascii(b, 12, "VP8L")) {
    if (b[20] !== 47) return null;
    return {
      width: 1 + ((b[22] & 63) << 8 | b[21]),
      height: 1 + ((b[24] & 15) << 10 | b[23] << 2 | (b[22] & 192) >> 6)
    };
  }
  if (ascii(b, 12, "VP8X")) return { width: 1 + u24le(b, 24), height: 1 + u24le(b, 27) };
  return null;
}
function readImageSize(b, type) {
  const size2 = type === "png" ? pngSize(b) : type === "jpg" ? jpegSize(b) : webpSize(b);
  return size2 && size2.width > 0 && size2.height > 0 ? size2 : null;
}
function fitsImageLimits({ width, height }, limits = IMAGE_LIMITS) {
  return width <= limits.maxSide && height <= limits.maxSide && width * height <= limits.maxPixels;
}

// ../../../wajha-clone/node_modules/fflate/esm/index.mjs
import { createRequire } from "module";
var require2 = createRequire("/");
var _a;
var Worker;
var isMarkedAsUntransferable;
try {
  _a = require2("worker_threads"), Worker = _a.Worker, isMarkedAsUntransferable = _a.isMarkedAsUntransferable;
} catch (e) {
}
var u8 = Uint8Array;
var u16 = Uint16Array;
var i32 = Int32Array;
var fleb = new u8([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]);
var fdeb = new u8([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]);
var clim = new u8([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]);
var freb = function(eb, start) {
  var b = new u16(31);
  for (var i2 = 0; i2 < 31; ++i2) {
    b[i2] = start += 1 << eb[i2 - 1];
  }
  var r = new i32(b[30]);
  for (var i2 = 1; i2 < 30; ++i2) {
    for (var j = b[i2]; j < b[i2 + 1]; ++j) {
      r[j] = j - b[i2] << 5 | i2;
    }
  }
  return { b, r };
};
var _a = freb(fleb, 2);
var fl = _a.b;
var revfl = _a.r;
fl[28] = 258, revfl[258] = 28;
var _b = freb(fdeb, 0);
var fd = _b.b;
var revfd = _b.r;
var rev = new u16(32768);
for (i = 0; i < 32768; ++i) {
  x = (i & 43690) >> 1 | (i & 21845) << 1;
  x = (x & 52428) >> 2 | (x & 13107) << 2;
  x = (x & 61680) >> 4 | (x & 3855) << 4;
  rev[i] = ((x & 65280) >> 8 | (x & 255) << 8) >> 1;
}
var x;
var i;
var hMap = (function(cd, mb, r) {
  var s = cd.length;
  var i2 = 0;
  var l = new u16(mb);
  for (; i2 < s; ++i2) {
    if (cd[i2])
      ++l[cd[i2] - 1];
  }
  var le = new u16(mb);
  for (i2 = 1; i2 < mb; ++i2) {
    le[i2] = le[i2 - 1] + l[i2 - 1] << 1;
  }
  var co;
  if (r) {
    co = new u16(1 << mb);
    var rvb = 15 - mb;
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        var sv = i2 << 4 | cd[i2];
        var r_1 = mb - cd[i2];
        var v = le[cd[i2] - 1]++ << r_1;
        for (var m = v | (1 << r_1) - 1; v <= m; ++v) {
          co[rev[v] >> rvb] = sv;
        }
      }
    }
  } else {
    co = new u16(s);
    for (i2 = 0; i2 < s; ++i2) {
      if (cd[i2]) {
        co[i2] = rev[le[cd[i2] - 1]++] >> 15 - cd[i2];
      }
    }
  }
  return co;
});
var flt = new u8(288);
for (i = 0; i < 144; ++i)
  flt[i] = 8;
var i;
for (i = 144; i < 256; ++i)
  flt[i] = 9;
var i;
for (i = 256; i < 280; ++i)
  flt[i] = 7;
var i;
for (i = 280; i < 288; ++i)
  flt[i] = 8;
var i;
var fdt = new u8(32);
for (i = 0; i < 32; ++i)
  fdt[i] = 5;
var i;
var flm = /* @__PURE__ */ hMap(flt, 9, 0);
var flrm = /* @__PURE__ */ hMap(flt, 9, 1);
var fdm = /* @__PURE__ */ hMap(fdt, 5, 0);
var fdrm = /* @__PURE__ */ hMap(fdt, 5, 1);
var max = function(a) {
  var m = a[0];
  for (var i2 = 1; i2 < a.length; ++i2) {
    if (a[i2] > m)
      m = a[i2];
  }
  return m;
};
var bits = function(d, p, m) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8) >> (p & 7) & m;
};
var bits16 = function(d, p) {
  var o = p / 8 | 0;
  return (d[o] | d[o + 1] << 8 | d[o + 2] << 16) >> (p & 7);
};
var shft = function(p) {
  return (p + 7) / 8 | 0;
};
var slc = function(v, s, e) {
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  return new u8(v.subarray(s, e));
};
var ec = [
  "unexpected EOF",
  "invalid block type",
  "invalid length/literal",
  "invalid distance",
  "stream finished",
  "no stream handler",
  ,
  // determined by compression function
  "no callback",
  "invalid UTF-8 data",
  "extra field too long",
  "date not in range 1980-2099",
  "filename too long",
  "stream finishing",
  "invalid zip data"
  // determined by unknown compression method
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var inflt = function(dat, st, buf, dict) {
  var sl = dat.length, dl = dict ? dict.length : 0;
  if (!sl || st.f && !st.l)
    return buf || new u8(0);
  var noBuf = !buf;
  var resize = noBuf || st.i != 2;
  var noSt = st.i;
  if (noBuf)
    buf = new u8(sl * 3);
  var cbuf = function(l2) {
    var bl = buf.length;
    if (l2 > bl) {
      var nbuf = new u8(Math.max(bl * 2, l2));
      nbuf.set(buf);
      buf = nbuf;
    }
  };
  var final = st.f || 0, pos = st.p || 0, bt = st.b || 0, lm = st.l, dm = st.d, lbt = st.m, dbt = st.n;
  var tbts = sl * 8;
  do {
    if (!lm) {
      final = bits(dat, pos, 1);
      var type = bits(dat, pos + 1, 3);
      pos += 3;
      if (!type) {
        var s = shft(pos) + 4, l = dat[s - 4] | dat[s - 3] << 8, t = s + l;
        if (t > sl) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + l);
        buf.set(dat.subarray(s, t), bt);
        st.b = bt += l, st.p = pos = t * 8, st.f = final;
        continue;
      } else if (type == 1)
        lm = flrm, dm = fdrm, lbt = 9, dbt = 5;
      else if (type == 2) {
        var hLit = bits(dat, pos, 31) + 257, hcLen = bits(dat, pos + 10, 15) + 4;
        var tl = hLit + bits(dat, pos + 5, 31) + 1;
        pos += 14;
        var ldt = new u8(tl);
        var clt = new u8(19);
        for (var i2 = 0; i2 < hcLen; ++i2) {
          clt[clim[i2]] = bits(dat, pos + i2 * 3, 7);
        }
        pos += hcLen * 3;
        var clb = max(clt), clbmsk = (1 << clb) - 1;
        var clm = hMap(clt, clb, 1);
        for (var i2 = 0; i2 < tl; ) {
          var r = clm[bits(dat, pos, clbmsk)];
          pos += r & 15;
          var s = r >> 4;
          if (s < 16) {
            ldt[i2++] = s;
          } else {
            var c = 0, n = 0;
            if (s == 16)
              n = 3 + bits(dat, pos, 3), pos += 2, c = ldt[i2 - 1];
            else if (s == 17)
              n = 3 + bits(dat, pos, 7), pos += 3;
            else if (s == 18)
              n = 11 + bits(dat, pos, 127), pos += 7;
            while (n--)
              ldt[i2++] = c;
          }
        }
        var lt = ldt.subarray(0, hLit), dt = ldt.subarray(hLit);
        lbt = max(lt);
        dbt = max(dt);
        lm = hMap(lt, lbt, 1);
        dm = hMap(dt, dbt, 1);
      } else
        err(1);
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
    }
    if (resize)
      cbuf(bt + 131072);
    var lms = (1 << lbt) - 1, dms = (1 << dbt) - 1;
    var lpos = pos;
    for (; ; lpos = pos) {
      var c = lm[bits16(dat, pos) & lms], sym = c >> 4;
      pos += c & 15;
      if (pos > tbts) {
        if (noSt)
          err(0);
        break;
      }
      if (!c)
        err(2);
      if (sym < 256)
        buf[bt++] = sym;
      else if (sym == 256) {
        lpos = pos, lm = null;
        break;
      } else {
        var add = sym - 254;
        if (sym > 264) {
          var i2 = sym - 257, b = fleb[i2];
          add = bits(dat, pos, (1 << b) - 1) + fl[i2];
          pos += b;
        }
        var d = dm[bits16(dat, pos) & dms], dsym = d >> 4;
        if (!d)
          err(3);
        pos += d & 15;
        var dt = fd[dsym];
        if (dsym > 3) {
          var b = fdeb[dsym];
          dt += bits16(dat, pos) & (1 << b) - 1, pos += b;
        }
        if (pos > tbts) {
          if (noSt)
            err(0);
          break;
        }
        if (resize)
          cbuf(bt + 131072);
        var end = bt + add;
        if (bt < dt) {
          var shift = dl - dt, dend = Math.min(dt, end);
          if (shift + bt < 0)
            err(3);
          for (; bt < dend; ++bt)
            buf[bt] = dict[shift + bt];
        }
        for (; bt < end; ++bt)
          buf[bt] = buf[bt - dt];
      }
    }
    st.l = lm, st.p = lpos, st.b = bt, st.f = final;
    if (lm)
      final = 1, st.m = lbt, st.d = dm, st.n = dbt;
  } while (!final);
  return bt != buf.length && noBuf ? slc(buf, 0, bt) : buf.subarray(0, bt);
};
var wbits = function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
};
var wbits16 = function(d, p, v) {
  v <<= p & 7;
  var o = p / 8 | 0;
  d[o] |= v;
  d[o + 1] |= v >> 8;
  d[o + 2] |= v >> 16;
};
var hTree = function(d, mb) {
  var t = [];
  for (var i2 = 0; i2 < d.length; ++i2) {
    if (d[i2])
      t.push({ s: i2, f: d[i2] });
  }
  var s = t.length;
  var t2 = t.slice();
  if (!s)
    return { t: et, l: 0 };
  if (s == 1) {
    var v = new u8(t[0].s + 1);
    v[t[0].s] = 1;
    return { t: v, l: 1 };
  }
  t.sort(function(a, b) {
    return a.f - b.f;
  });
  t.push({ s: -1, f: 25001 });
  var l = t[0], r = t[1], i0 = 0, i1 = 1, i22 = 2;
  t[0] = { s: -1, f: l.f + r.f, l, r };
  while (i1 != s - 1) {
    l = t[t[i0].f < t[i22].f ? i0++ : i22++];
    r = t[i0 != i1 && t[i0].f < t[i22].f ? i0++ : i22++];
    t[i1++] = { s: -1, f: l.f + r.f, l, r };
  }
  var maxSym = t2[0].s;
  for (var i2 = 1; i2 < s; ++i2) {
    if (t2[i2].s > maxSym)
      maxSym = t2[i2].s;
  }
  var tr = new u16(maxSym + 1);
  var mbt = ln(t[i1 - 1], tr, 0);
  if (mbt > mb) {
    var i2 = 0, dt = 0;
    var lft = mbt - mb, cst = 1 << lft;
    t2.sort(function(a, b) {
      return tr[b.s] - tr[a.s] || a.f - b.f;
    });
    for (; i2 < s; ++i2) {
      var i2_1 = t2[i2].s;
      if (tr[i2_1] > mb) {
        dt += cst - (1 << mbt - tr[i2_1]);
        tr[i2_1] = mb;
      } else
        break;
    }
    dt >>= lft;
    while (dt > 0) {
      var i2_2 = t2[i2].s;
      if (tr[i2_2] < mb)
        dt -= 1 << mb - tr[i2_2]++ - 1;
      else
        ++i2;
    }
    for (; i2 >= 0 && dt; --i2) {
      var i2_3 = t2[i2].s;
      if (tr[i2_3] == mb) {
        --tr[i2_3];
        ++dt;
      }
    }
    mbt = mb;
  }
  return { t: new u8(tr), l: mbt };
};
var ln = function(n, l, d) {
  return n.s == -1 ? Math.max(ln(n.l, l, d + 1), ln(n.r, l, d + 1)) : l[n.s] = d;
};
var lc = function(c) {
  var s = c.length;
  while (s && !c[--s])
    ;
  var cl = new u16(++s);
  var cli = 0, cln = c[0], cls = 1;
  var w = function(v) {
    cl[cli++] = v;
  };
  for (var i2 = 1; i2 <= s; ++i2) {
    if (c[i2] == cln && i2 != s)
      ++cls;
    else {
      if (!cln && cls > 2) {
        for (; cls > 138; cls -= 138)
          w(32754);
        if (cls > 2) {
          w(cls > 10 ? cls - 11 << 5 | 28690 : cls - 3 << 5 | 12305);
          cls = 0;
        }
      } else if (cls > 3) {
        w(cln), --cls;
        for (; cls > 6; cls -= 6)
          w(8304);
        if (cls > 2)
          w(cls - 3 << 5 | 8208), cls = 0;
      }
      while (cls--)
        w(cln);
      cls = 1;
      cln = c[i2];
    }
  }
  return { c: cl.subarray(0, cli), n: s };
};
var clen = function(cf, cl) {
  var l = 0;
  for (var i2 = 0; i2 < cl.length; ++i2)
    l += cf[i2] * cl[i2];
  return l;
};
var wfblk = function(out, pos, dat) {
  var s = dat.length;
  var o = shft(pos + 2);
  out[o] = s & 255;
  out[o + 1] = s >> 8;
  out[o + 2] = out[o] ^ 255;
  out[o + 3] = out[o + 1] ^ 255;
  for (var i2 = 0; i2 < s; ++i2)
    out[o + i2 + 4] = dat[i2];
  return (o + 4 + s) * 8;
};
var wblk = function(dat, out, final, syms, lf, df, eb, li, bs, bl, p) {
  wbits(out, p++, final);
  ++lf[256];
  var _a2 = hTree(lf, 15), dlt = _a2.t, mlb = _a2.l;
  var _b2 = hTree(df, 15), ddt = _b2.t, mdb = _b2.l;
  var _c = lc(dlt), lclt = _c.c, nlc = _c.n;
  var _d = lc(ddt), lcdt = _d.c, ndc = _d.n;
  var lcfreq = new u16(19);
  for (var i2 = 0; i2 < lclt.length; ++i2)
    ++lcfreq[lclt[i2] & 31];
  for (var i2 = 0; i2 < lcdt.length; ++i2)
    ++lcfreq[lcdt[i2] & 31];
  var _e = hTree(lcfreq, 7), lct = _e.t, mlcb = _e.l;
  var nlcc = 19;
  for (; nlcc > 4 && !lct[clim[nlcc - 1]]; --nlcc)
    ;
  var flen = bl + 5 << 3;
  var ftlen = clen(lf, flt) + clen(df, fdt) + eb;
  var dtlen = clen(lf, dlt) + clen(df, ddt) + eb + 14 + 3 * nlcc + clen(lcfreq, lct) + 2 * lcfreq[16] + 3 * lcfreq[17] + 7 * lcfreq[18];
  if (bs >= 0 && flen <= ftlen && flen <= dtlen)
    return wfblk(out, p, dat.subarray(bs, bs + bl));
  var lm, ll, dm, dl;
  wbits(out, p, 1 + (dtlen < ftlen)), p += 2;
  if (dtlen < ftlen) {
    lm = hMap(dlt, mlb, 0), ll = dlt, dm = hMap(ddt, mdb, 0), dl = ddt;
    var llm = hMap(lct, mlcb, 0);
    wbits(out, p, nlc - 257);
    wbits(out, p + 5, ndc - 1);
    wbits(out, p + 10, nlcc - 4);
    p += 14;
    for (var i2 = 0; i2 < nlcc; ++i2)
      wbits(out, p + 3 * i2, lct[clim[i2]]);
    p += 3 * nlcc;
    var lcts = [lclt, lcdt];
    for (var it = 0; it < 2; ++it) {
      var clct = lcts[it];
      for (var i2 = 0; i2 < clct.length; ++i2) {
        var len = clct[i2] & 31;
        wbits(out, p, llm[len]), p += lct[len];
        if (len > 15)
          wbits(out, p, clct[i2] >> 5 & 127), p += clct[i2] >> 12;
      }
    }
  } else {
    lm = flm, ll = flt, dm = fdm, dl = fdt;
  }
  for (var i2 = 0; i2 < li; ++i2) {
    var sym = syms[i2];
    if (sym > 255) {
      var len = sym >> 18 & 31;
      wbits16(out, p, lm[len + 257]), p += ll[len + 257];
      if (len > 7)
        wbits(out, p, sym >> 23 & 31), p += fleb[len];
      var dst = sym & 31;
      wbits16(out, p, dm[dst]), p += dl[dst];
      if (dst > 3)
        wbits16(out, p, sym >> 5 & 8191), p += fdeb[dst];
    } else {
      wbits16(out, p, lm[sym]), p += ll[sym];
    }
  }
  wbits16(out, p, lm[256]);
  return p + ll[256];
};
var deo = /* @__PURE__ */ new i32([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]);
var et = /* @__PURE__ */ new u8(0);
var dflt = function(dat, lvl, plvl, pre, post, st) {
  var s = st.z || dat.length;
  var o = new u8(pre + s + 5 * (1 + Math.ceil(s / 7e3)) + post);
  var w = o.subarray(pre, o.length - post);
  var lst = st.l;
  var pos = (st.r || 0) & 7;
  if (lvl) {
    if (pos)
      w[0] = st.r >> 3;
    var opt = deo[lvl - 1];
    var n = opt >> 13, c = opt & 8191;
    var msk_1 = (1 << plvl) - 1;
    var prev = st.p || new u16(32768), head = st.h || new u16(msk_1 + 1);
    var bs1_1 = Math.ceil(plvl / 3), bs2_1 = 2 * bs1_1;
    var hsh = function(i3) {
      return (dat[i3] ^ dat[i3 + 1] << bs1_1 ^ dat[i3 + 2] << bs2_1) & msk_1;
    };
    var syms = new i32(25e3);
    var lf = new u16(288), df = new u16(32);
    var lc_1 = 0, eb = 0, i2 = st.i || 0, li = 0, wi = st.w || 0, bs = 0;
    for (; i2 + 2 < s; ++i2) {
      var hv = hsh(i2);
      var imod = i2 & 32767, pimod = head[hv];
      prev[imod] = pimod;
      head[hv] = imod;
      if (wi <= i2) {
        var rem = s - i2;
        if ((lc_1 > 7e3 || li > 24576) && (rem > 423 || !lst)) {
          pos = wblk(dat, w, 0, syms, lf, df, eb, li, bs, i2 - bs, pos);
          li = lc_1 = eb = 0, bs = i2;
          for (var j = 0; j < 286; ++j)
            lf[j] = 0;
          for (var j = 0; j < 30; ++j)
            df[j] = 0;
        }
        var l = 2, d = 0, ch_1 = c, dif = imod - pimod & 32767;
        if (rem > 2 && hv == hsh(i2 - dif)) {
          var maxn = Math.min(n, rem) - 1;
          var maxd = Math.min(32767, i2);
          var ml = Math.min(258, rem);
          while (dif <= maxd && --ch_1 && imod != pimod) {
            if (dat[i2 + l] == dat[i2 + l - dif]) {
              var nl = 0;
              for (; nl < ml && dat[i2 + nl] == dat[i2 + nl - dif]; ++nl)
                ;
              if (nl > l) {
                l = nl, d = dif;
                if (nl > maxn)
                  break;
                var mmd = Math.min(dif, nl - 2);
                var md = 0;
                for (var j = 0; j < mmd; ++j) {
                  var ti = i2 - dif + j & 32767;
                  var pti = prev[ti];
                  var cd = ti - pti & 32767;
                  if (cd > md)
                    md = cd, pimod = ti;
                }
              }
            }
            imod = pimod, pimod = prev[imod];
            dif += imod - pimod & 32767;
          }
        }
        if (d) {
          syms[li++] = 268435456 | revfl[l] << 18 | revfd[d];
          var lin = revfl[l] & 31, din = revfd[d] & 31;
          eb += fleb[lin] + fdeb[din];
          ++lf[257 + lin];
          ++df[din];
          wi = i2 + l;
          ++lc_1;
        } else {
          syms[li++] = dat[i2];
          ++lf[dat[i2]];
        }
      }
    }
    for (i2 = Math.max(i2, wi); i2 < s; ++i2) {
      syms[li++] = dat[i2];
      ++lf[dat[i2]];
    }
    pos = wblk(dat, w, lst, syms, lf, df, eb, li, bs, i2 - bs, pos);
    if (!lst) {
      st.r = pos & 7 | w[pos / 8 | 0] << 3;
      pos -= 7;
      st.h = head, st.p = prev, st.i = i2, st.w = wi;
    }
  } else {
    for (var i2 = st.w || 0; i2 < s + lst; i2 += 65535) {
      var e = i2 + 65535;
      if (e >= s) {
        w[pos / 8 | 0] = lst;
        e = s;
      }
      pos = wfblk(w, pos + 1, dat.subarray(i2, e));
    }
    st.i = s;
  }
  return slc(o, 0, pre + shft(pos) + post);
};
var crct = /* @__PURE__ */ (function() {
  var t = new Int32Array(256);
  for (var i2 = 0; i2 < 256; ++i2) {
    var c = i2, k = 9;
    while (--k)
      c = (c & 1 && -306674912) ^ c >>> 1;
    t[i2] = c;
  }
  return t;
})();
var crc = function() {
  var c = -1;
  return {
    p: function(d) {
      var cr = c;
      for (var i2 = 0; i2 < d.length; ++i2)
        cr = crct[cr & 255 ^ d[i2]] ^ cr >>> 8;
      c = cr;
    },
    d: function() {
      return ~c;
    }
  };
};
var dopt = function(dat, opt, pre, post, st) {
  if (!st) {
    st = { l: 1 };
    if (opt.dictionary) {
      var dict = opt.dictionary.subarray(-32768);
      var newDat = new u8(dict.length + dat.length);
      newDat.set(dict);
      newDat.set(dat, dict.length);
      dat = newDat;
      st.w = dict.length;
    }
  }
  return dflt(dat, opt.level == null ? 6 : opt.level, opt.mem == null ? st.l ? Math.ceil(Math.max(8, Math.min(13, Math.log(dat.length))) * 1.5) : 20 : 12 + opt.mem, pre, post, st);
};
var mrg = function(a, b) {
  var o = {};
  for (var k in a)
    o[k] = a[k];
  for (var k in b)
    o[k] = b[k];
  return o;
};
var b2 = function(d, b) {
  return d[b] | d[b + 1] << 8;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var b8 = function(d, b) {
  return b4(d, b) + b4(d, b + 4) * 4294967296;
};
var wbytes = function(d, b, v) {
  for (; v; ++b)
    d[b] = v, v >>>= 8;
};
function deflateSync(data, opts) {
  return dopt(data, opts || {}, 0, 0);
}
function inflateSync(data, opts) {
  return inflt(data, { i: 2 }, opts && opts.out, opts && opts.dictionary);
}
var fltn = function(d, p, t, o) {
  for (var k in d) {
    var val = d[k], n = p + k, op = o;
    if (Array.isArray(val))
      op = mrg(o, val[1]), val = val[0];
    if (ArrayBuffer.isView(val))
      t[n] = [val, op];
    else {
      t[n += "/"] = [new u8(0), op];
      fltn(val, n, t, o);
    }
  }
};
var te = typeof TextEncoder != "undefined" && /* @__PURE__ */ new TextEncoder();
var td = typeof TextDecoder != "undefined" && /* @__PURE__ */ new TextDecoder();
var tds = 0;
try {
  td.decode(et, { stream: true });
  tds = 1;
} catch (e) {
}
var dutf8 = function(d) {
  for (var r = "", i2 = 0; ; ) {
    var c = d[i2++];
    var eb = (c > 127) + (c > 223) + (c > 239);
    if (i2 + eb > d.length)
      return { s: r, r: slc(d, i2 - 1) };
    if (!eb)
      r += String.fromCharCode(c);
    else if (eb == 3) {
      c = ((c & 15) << 18 | (d[i2++] & 63) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63) - 65536, r += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
    } else if (eb & 1)
      r += String.fromCharCode((c & 31) << 6 | d[i2++] & 63);
    else
      r += String.fromCharCode((c & 15) << 12 | (d[i2++] & 63) << 6 | d[i2++] & 63);
  }
};
function strToU8(str, latin1) {
  if (latin1) {
    var ar_1 = new u8(str.length);
    for (var i2 = 0; i2 < str.length; ++i2)
      ar_1[i2] = str.charCodeAt(i2);
    return ar_1;
  }
  if (te)
    return te.encode(str);
  var l = str.length;
  var ar = new u8(str.length + (str.length >> 1));
  var ai = 0;
  var w = function(v) {
    ar[ai++] = v;
  };
  for (var i2 = 0; i2 < l; ++i2) {
    if (ai + 5 > ar.length) {
      var n = new u8(ai + 8 + (l - i2 << 1));
      n.set(ar);
      ar = n;
    }
    var c = str.charCodeAt(i2);
    if (c < 128 || latin1)
      w(c);
    else if (c < 2048)
      w(192 | c >> 6), w(128 | c & 63);
    else if (c > 55295 && c < 57344)
      c = 65536 + (c & 1023 << 10) | str.charCodeAt(++i2) & 1023, w(240 | c >> 18), w(128 | c >> 12 & 63), w(128 | c >> 6 & 63), w(128 | c & 63);
    else
      w(224 | c >> 12), w(128 | c >> 6 & 63), w(128 | c & 63);
  }
  return slc(ar, 0, ai);
}
function strFromU8(dat, latin1) {
  if (latin1) {
    var r = "";
    for (var i2 = 0; i2 < dat.length; i2 += 16384)
      r += String.fromCharCode.apply(null, dat.subarray(i2, i2 + 16384));
    return r;
  } else if (td) {
    return td.decode(dat);
  } else {
    var _a2 = dutf8(dat), s = _a2.s, r = _a2.r;
    if (r.length)
      err(8);
    return s;
  }
}
var slzh = function(d, b) {
  return b + 30 + b2(d, b + 26) + b2(d, b + 28);
};
var zh = function(d, b, z) {
  var fnl = b2(d, b + 28), efl = b2(d, b + 30), fn = strFromU8(d.subarray(b + 46, b + 46 + fnl), !(b2(d, b + 8) & 2048)), es = b + 46 + fnl;
  var _a2 = z64hs(d, es, efl, z, b4(d, b + 20), b4(d, b + 24), b4(d, b + 42)), sc = _a2[0], su = _a2[1], off = _a2[2];
  return [b2(d, b + 10), sc, su, fn, es + efl + b2(d, b + 32), off];
};
var z64hs = function(d, b, l, z, sc, su, off) {
  var nsc = sc == 4294967295, nsu = su == 4294967295, noff = off == 4294967295, e = b + l;
  var nf = nsc + nsu + noff;
  if (z && nf) {
    for (; b + 4 < e; b += 4 + b2(d, b + 2)) {
      if (b2(d, b) == 1) {
        return [
          nsc ? b8(d, b + 4 + 8 * nsu) : sc,
          nsu ? b8(d, b + 4) : su,
          noff ? b8(d, b + 4 + 8 * (nsu + nsc)) : off,
          1
        ];
      }
    }
    if (z < 2)
      err(13);
  }
  return [sc, su, off, 0];
};
var exfl = function(ex) {
  var le = 0;
  if (ex) {
    for (var k in ex) {
      var l = ex[k].length;
      if (l > 65535)
        err(9);
      le += l + 4;
    }
  }
  return le;
};
var wzh = function(d, b, f, fn, u, c, ce, co) {
  var fl2 = fn.length, ex = f.extra, col = co && co.length;
  var exl = exfl(ex);
  wbytes(d, b, ce != null ? 33639248 : 67324752), b += 4;
  if (ce != null)
    d[b++] = 20, d[b++] = f.os;
  d[b] = 20, b += 2;
  d[b++] = f.flag << 1 | (c < 0 && 8), d[b++] = u && 8;
  d[b++] = f.compression & 255, d[b++] = f.compression >> 8;
  var dt = new Date(f.mtime == null ? Date.now() : f.mtime), y = dt.getFullYear() - 1980;
  if (y < 0 || y > 119)
    err(10);
  wbytes(d, b, y << 25 | dt.getMonth() + 1 << 21 | dt.getDate() << 16 | dt.getHours() << 11 | dt.getMinutes() << 5 | dt.getSeconds() >> 1), b += 4;
  if (c != -1) {
    wbytes(d, b, f.crc);
    wbytes(d, b + 4, c < 0 ? -c - 2 : c);
    wbytes(d, b + 8, f.size);
  }
  wbytes(d, b + 12, fl2);
  wbytes(d, b + 14, exl), b += 16;
  if (ce != null) {
    wbytes(d, b, col);
    wbytes(d, b + 6, f.attrs);
    wbytes(d, b + 10, ce), b += 14;
  }
  d.set(fn, b);
  b += fl2;
  if (exl) {
    for (var k in ex) {
      var exf = ex[k], l = exf.length;
      wbytes(d, b, +k);
      wbytes(d, b + 2, l);
      d.set(exf, b + 4), b += 4 + l;
    }
  }
  if (col)
    d.set(co, b), b += col;
  return b;
};
var wzf = function(o, b, c, d, e) {
  wbytes(o, b, 101010256);
  wbytes(o, b + 8, c);
  wbytes(o, b + 10, c);
  wbytes(o, b + 12, d);
  wbytes(o, b + 16, e);
};
function zipSync(data, opts) {
  if (!opts)
    opts = {};
  var r = {};
  var files = [];
  fltn(data, "", r, opts);
  var o = 0;
  var tot = 0;
  for (var fn in r) {
    var _a2 = r[fn], file = _a2[0], p = _a2[1];
    var compression = p.level == 0 ? 0 : 8;
    var f = strToU8(fn), s = f.length;
    var com = p.comment, m = com && strToU8(com), ms = m && m.length;
    var exl = exfl(p.extra);
    if (s > 65535)
      err(11);
    var d = compression ? deflateSync(file, p) : file, l = d.length;
    var c = crc();
    c.p(file);
    files.push(mrg(p, {
      size: file.length,
      crc: c.d(),
      c: d,
      f,
      m,
      u: s != fn.length || m && com.length != ms,
      o,
      compression
    }));
    o += 30 + s + exl + l;
    tot += 76 + 2 * (s + exl) + (ms || 0) + l;
  }
  var out = new u8(tot + 22), oe = o, cdl = tot - o;
  for (var i2 = 0; i2 < files.length; ++i2) {
    var f = files[i2];
    wzh(out, f.o, f, f.f, f.u, f.c.length);
    var badd = 30 + f.f.length + exfl(f.extra);
    out.set(f.c, f.o + badd);
    wzh(out, o, f, f.f, f.u, f.c.length, f.o, f.m), o += 16 + badd + (f.m ? f.m.length : 0);
  }
  wzf(out, o, files.length, cdl, oe);
  return out;
}
function unzipSync(data, opts) {
  var files = {};
  var e = data.length - 22;
  for (; b4(data, e) != 101010256; --e) {
    if (!e || data.length - e > 65558)
      err(13);
  }
  ;
  var c = b2(data, e + 8);
  if (!c)
    return {};
  var o = b4(data, e + 16);
  var z = b4(data, e - 20) == 117853008;
  if (z) {
    var ze = b4(data, e - 12);
    z = b4(data, ze) == 101075792;
    if (z) {
      c = b4(data, ze + 32);
      o = b4(data, ze + 48);
    }
  }
  var fltr = opts && opts.filter;
  for (var i2 = 0; i2 < c; ++i2) {
    var _a2 = zh(data, o, z), c_2 = _a2[0], sc = _a2[1], su = _a2[2], fn = _a2[3], no = _a2[4], off = _a2[5], b = slzh(data, off);
    o = no;
    if (!fltr || fltr({
      name: fn,
      size: sc,
      originalSize: su,
      compression: c_2
    })) {
      if (!c_2)
        files[fn] = slc(data, b, b + sc);
      else if (c_2 == 8)
        files[fn] = inflateSync(data.subarray(b, b + sc), { out: new u8(su) });
      else
        err(14, "unknown compression type " + c_2);
    }
  }
  return files;
}
export {
  FAMILIES,
  IMAGE_LIMITS,
  LANGUAGES,
  LIMITS,
  fitsImageLimits,
  isLangCode,
  projectFromTemplate,
  readImageSize,
  sniffImageExt,
  strFromU8,
  strToU8,
  unzipSync,
  validateProject,
  validateTemplate,
  zipSync
};
