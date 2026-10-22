module.exports = {
  layout: "article.njk",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/blogi/${data.page.fileSlug}.html`),
  },
};
