'use strict';

const pluginRss = require("@11ty/eleventy-plugin-rss");
const yaml = require("js-yaml");
const now = new Date().getFullYear();

module.exports = (eleventyConfig) => {
  eleventyConfig.addWatchTarget("./txt/");

  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/fonts');

  eleventyConfig.addNunjucksShortcode("year", () => `${now}` );

  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
  eleventyConfig.addPlugin(pluginRss);

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data',
    },
    dataTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
  }
}
