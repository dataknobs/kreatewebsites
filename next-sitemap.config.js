// next-sitemap.js
module.exports = {
  siteUrl: 'https://cms.kreatewebsites.com',
  generateRobotsTxt: true, // (optional) Generate robots.txt file
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7, // Default priority (can be overridden in transform)
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => {
    // Determine the URL from the path
    const url = `${config.siteUrl}${path}`;
    let priority = 0.5; // Default priority

    // Customize priorities based on the path
    switch (path) {
      case '/':
        priority = 1.0; // Homepage
        break;
      case '/file-manager':
        priority = 0.8; // File Manager
        break;
      case '/signup':
        priority = 0.6; // Signup page
        break;
      case '/login':
        priority = 0.7; // Login page
        break;
      case '/cms-dashboard':
        priority = 0.9; // Dashboard
        break;
      default:
        priority = 0.5; // Default for all other pages
        break;
    }

    return {
      loc: url,
      changefreq: config.changefreq,
      priority: priority,
    };
  },
};
