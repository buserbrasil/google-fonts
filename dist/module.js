'use strict';

const path = require('path');
const consola = require('consola');
const defu = require('defu');
const googleFontsHelper = require('google-fonts-helper');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

const consola__default = /*#__PURE__*/_interopDefaultLegacy(consola);
const defu__default = /*#__PURE__*/_interopDefaultLegacy(defu);

var name = "@nuxtjs/google-fonts";
var version = "2.0.0";

const logger = consola__default['default'].withTag("nuxt:google-fonts");
const CONFIG_KEY = "googleFonts";
const nuxtModule = function(moduleOptions) {
  const DEFAULTS = {
    families: {},
    display: null,
    subsets: [],
    text: null,
    prefetch: true,
    preconnect: true,
    preload: false,
    useStylesheet: false,
    download: true,
    base64: false,
    inject: true,
    overwriting: false,
    crossOrigin: null,
    outputDir: this.options.dir.assets,
    stylePath: "css/fonts.css",
    fontsDir: "fonts",
    fontsPath: "~assets/fonts"
  };
  this.nuxt.hook("build:before", async () => {
    const options = defu__default['default'](this.options["google-fonts"], this.options[CONFIG_KEY], moduleOptions, DEFAULTS);
    if (!options.display && !options.preload) {
      options.display = "swap";
    }
    const googleFontsHelper$1 = new googleFontsHelper.GoogleFontsHelper({
      families: options.families,
      display: options.display,
      subsets: options.subsets,
      text: options.text
    });
    const fontsParsed = (this.options.head.link || []).filter((link) => googleFontsHelper.GoogleFontsHelper.isValidURL(link.href)).map((link) => googleFontsHelper.GoogleFontsHelper.parse(link.href));
    if (fontsParsed.length) {
      googleFontsHelper$1.merge(...fontsParsed);
    }
    const url = googleFontsHelper$1.constructURL();
    if (!url) {
      logger.warn("No provided fonts.");
      return;
    }
    this.options.head.link = (this.options.head.link || []).filter((link) => !googleFontsHelper.GoogleFontsHelper.isValidURL(link.href));
    if (options.download) {
      const outputDir = this.nuxt.resolver.resolveAlias(options.outputDir);
      try {
        await googleFontsHelper.GoogleFontsHelper.download(url, {
          base64: options.base64,
          overwriting: options.overwriting,
          outputDir,
          stylePath: options.stylePath,
          fontsDir: options.fontsDir,
          fontsPath: options.fontsPath
        });
        if (options.inject) {
          this.options.css.push(path.resolve(outputDir, options.stylePath));
        }
      } catch (e) {
        logger.error(e);
      }
      return;
    }
    if (options.prefetch) {
      this.options.head.link.push({
        hid: "gf-prefetch",
        rel: "dns-prefetch",
        href: "https://fonts.gstatic.com/"
      });
    }
    if (options.preconnect) {
      this.options.head.link.push({
        hid: "gf-preconnect",
        rel: "preconnect",
        href: "https://fonts.gstatic.com/",
        crossorigin: ""
      });
      this.options.head.link.push({
        hid: "gf-origin-preconnect",
        rel: "preconnect",
        href: "https://fonts.googleapis.com/"
      });
    }
    if (options.preload) {
      this.options.head.link.push({
        hid: "gf-preload",
        rel: "preload",
        as: "style",
        href: url
      });
    }
    if (options.useStylesheet) {
      this.options.head.link.push({
        hid: "gf-style",
        rel: "stylesheet",
        href: url
      });
      return;
    }
    this.options.head.script = this.options.head.script || [];
    if (options.crossOrigin) {
      this.options.head.script.push({
        hid: "gf-script",
        innerHTML: `(function(){var l=document.createElement('link');l.rel="stylesheet";l.href="${url}";l.crossOrigin="${options.crossOrigin}";document.querySelector("head").appendChild(l);})();`
      });
    } else {
      this.options.head.script.push({
        hid: "gf-script",
        innerHTML: `(function(){var l=document.createElement('link');l.rel="stylesheet";l.href="${url}";document.querySelector("head").appendChild(l);})();`
      });
    }
    this.options.head.noscript = this.options.head.noscript || [];
    this.options.head.noscript.push({
      hid: "gf-noscript",
      innerHTML: `<link rel="stylesheet" href="${url}">`
    });
    this.options.head.__dangerouslyDisableSanitizersByTagID = this.options.head.__dangerouslyDisableSanitizersByTagID || {};
    this.options.head.__dangerouslyDisableSanitizersByTagID["gf-script"] = ["innerHTML"];
    this.options.head.__dangerouslyDisableSanitizersByTagID["gf-noscript"] = ["innerHTML"];
  });
};
nuxtModule.meta = {name, version};

module.exports = nuxtModule;
