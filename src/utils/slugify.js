// File: src/utils/slugify.js
function slugify(text) {
    return text.toLowerCase().replace(/\s+/g, "-");
  }
  module.exports = { slugify };
  