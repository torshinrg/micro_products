// next-sitemap.config.js
const { getTrainingTypes } = require('./src/sitemapTrainings');
const { slugify } = require('./src/utils/slugify');

module.exports = {
  siteUrl: 'https://app.meetluna.one',
  generateRobotsTxt: true,
  pagesDirectory: null, // Disable automatic pages scanning
  additionalPaths: async () => {
    const workouts = getTrainingTypes() || [];
    // Build objects for each dynamic workout page
    const trainingPaths = workouts.map((workout) => ({
      loc: `/training/${slugify(workout)}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }));
    // Define static pages you want included
    const staticPaths = [
      {
        loc: `/`,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      },
      {
        loc: `/training`,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
    ];
    return [...staticPaths, ...trainingPaths];
  },
};
