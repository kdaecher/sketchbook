const esbuild = require('esbuild');

const config = {
  entryPoints: ['index.ts'],
  bundle: true,
  outfile: 'index.js',
  format: 'iife',
  globalName: 'sketchBundle',
  plugins: [{
    name: 'p5-global',
    setup(build) {
      build.onResolve({ filter: /^p5$/ }, args => ({
        path: args.path,
        namespace: 'p5-global'
      }));
      build.onLoad({ filter: /.*/, namespace: 'p5-global' }, () => ({
        contents: 'module.exports = window.p5 || p5',
        loader: 'js'
      }));
    }
  }]
};

const isWatch = process.argv.includes('--watch');

if (isWatch) {
  esbuild.context(config).then(ctx => {
    ctx.watch();
    console.log('Watching for changes...');
  }).catch(() => process.exit(1));
} else {
  esbuild.build(config).catch(() => process.exit(1));
}
