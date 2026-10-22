import fs from "node:fs";
import path from "node:path";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";

const MONTHS = ["tammikuuta", "helmikuuta", "maaliskuuta", "huhtikuuta", "toukokuuta", "kesäkuuta", "heinäkuuta", "elokuuta", "syyskuuta", "lokakuuta", "marraskuuta", "joulukuuta"];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fonts = {
  "@fontsource/inter": ["300", "400", "500"].map((w) => `inter-latin-${w}-normal.woff2`),
  "@fontsource/cormorant-garamond": ["300", "400", "500"].flatMap((w) => [`cormorant-garamond-latin-${w}-normal.woff2`, `cormorant-garamond-latin-${w}-italic.woff2`]),
};

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "jpeg"],
    outputDir: "./_site/img/",
    urlPath: "/img/",
    widths: [480, 960, 1600],
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async" },
      fallback: "largest",
    },
  });

  eleventyConfig.addPassthroughCopy({ "src/style.css": "style.css" });
  for (const [pkg, files] of Object.entries(fonts)) {
    for (const f of files) eleventyConfig.addPassthroughCopy({ [`node_modules/${pkg}/files/${f}`]: `fonts/${f}` });
  }
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  eleventyConfig.addShortcode("inlineAssets", (names, dir) =>
    String(names || "")
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => fs.readFileSync(path.join("src", dir, `${n}.${dir}`), "utf8").trim())
      .join("\n")
  );

  eleventyConfig.addFilter("fiDate", (d) => {
    const x = new Date(d);
    return `${x.getUTCDate()}. ${MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("hl", (s) =>
    esc(s || "")
      .replace(/\*([^*]+)\*/g, '<em class="hl">$1</em>')
      .replace(/\r?\n/g, "<br>")
  );
  eleventyConfig.addFilter("stripSlash", (s) => String(s || "").replace(/[/]+$/, ""));
  eleventyConfig.addFilter("plain", (s) => String(s || "").replace(/\*/g, "").replace(/\r?\n/g, " "));
  eleventyConfig.addFilter("others", (arr, url, n) => (arr || []).filter((p) => p.url !== url).slice(0, n));
  eleventyConfig.addFilter("where", (arr, key, val) => (arr || []).filter((x) => x[key] === val));
  eleventyConfig.addFilter("readTime", (html) => {
    const words = String(html || "").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });

  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("src/blogi/*.md")
      .filter((p) => !p.data.draft)
      .sort((a, b) => b.date - a.date)
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
