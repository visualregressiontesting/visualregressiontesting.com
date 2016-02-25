var Metalsmith = require('metalsmith');
var drafts = require('metalsmith-drafts');
var markdown = require('metalsmith-markdown');
var excerpts = require('metalsmith-excerpts');
var layouts = require('metalsmith-layouts');
var collections = require('metalsmith-collections');
var feed = require('metalsmith-feed');
var serve = require('metalsmith-serve');
var watch = require('metalsmith-watch');
var assets = require('metalsmith-assets');
var sass = require('metalsmith-sass');
var nunjucks = require('nunjucks');
var nunjucksDate = require('nunjucks-date');
var metalsmith = Metalsmith(__dirname);



// General Options for build process
var options = {
  source_dir : 'src',
  dist_dir : 'dist',
  layout_dir : 'src/layouts',
  watch: {
    "${source}/**/*.md": true,
    'src/layouts/**/*' : "**/*",
    'src/sass/**/*.scss' : "**/*.scss",
  },
  port: 8080,
  assets: {
    source: './src/assets', // relative to the working directory
    destination: './assets' // relative to the build directory
  }
}

// Metadata to be passed to templates
var metadata = {
  categories: [
    {
      "collection": "articles",
      "title": "Articles"
    },
    {
      "collection": "videos",
      "title": "Videos"
    },
    {
      "collection": "tools",
      "title": "Tools"
    }
  ],
  site: {
    description: "Welcome to the ultimate collection of Visual Regression Testing resources. Find articles, video tutorials about visual testing, and browse our list of testing tools to get your project up and running.",
    title: "Visual Regression Testing",
    url: "http://visualregressiontesting.com",
    author: "Micah Godbolt & Kevin Lamping"
  }
}

// Page collections like all pages or all posts
var site_collections = {
  all: {
    pattern: 'content/**/*.md'
  },
  articles: {
    pattern: 'content/articles/*.md'
  },
  videos: {
    pattern: 'content/videos/*.md'
  },
  tools: {
    pattern: 'content/tools/*.md'
  },
  pages: {
    pattern: '*.md',
    sortBy: 'position'
  }
}



// Need to add configuration to nunjucks that metalsmith cannot
nunjucks
  .configure(options.layout_dir, {watch: false, noCache: true})
  .addFilter('date', nunjucksDate);
nunjucksDate
  .setDefaultFormat('MMMM Do, YYYY');

// if SERVE is set to true, server is started and files are watched
if (process.env.SERVE) {
  metadata.serve = true;
  metalsmith
    .use(serve({
        port: options.port
    }))
    .use(watch({
        paths: options.watch,
        livereload: true
    }));
}

// Run Metalsmith
metalsmith
  .metadata(metadata)
  .source(options.source_dir)
  .clean(true)
  .use(drafts(true))
  .use(collections(site_collections))
  .use(markdown())
  .use(excerpts())
  .use(assets(options.assets))
  .use(feed({
    collection: 'all'
  }))
  .use(sass({
    outputDir: 'css/'
  }))
  .use(layouts({
      engine: 'nunjucks',
      directory: options.layout_dir
  }))
  .destination(options.dist_dir)
  .build(function (err, files) {
    if (err) {
      console.log('Error!');
      console.log(err);
      throw err;
    }
  });
