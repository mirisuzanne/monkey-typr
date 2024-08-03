import pluginWebc from "@11ty/eleventy-plugin-webc";
import pluginRss, { absoluteUrl } from "@11ty/eleventy-plugin-rss";
import { load } from 'js-yaml';

export default async function (eleventyConfig) {
  eleventyConfig.addWatchTarget("./txt/");

  eleventyConfig.addPassthroughCopy('src/images');
  eleventyConfig.addPassthroughCopy('src/css');
  eleventyConfig.addPassthroughCopy('src/fonts');

  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginWebc, {
    components: [
      'npm:@terriblemia/monkey-write/*.webc',
      'src/_components/**/*.webc',
    ],
  });

  eleventyConfig.addJavaScriptFunction("absoluteUrl", absoluteUrl);
  eleventyConfig.addJavaScriptFunction("year", () =>
    `${new Date().getUTCFullYear()}`
  );

  eleventyConfig.addDataExtension('yml, yaml', (contents) => load(contents));

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
