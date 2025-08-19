// Ensures TypeScript SW gets emitted as /service-worker.js in CRA builds
const fs = require('fs');
const path = require('path');

module.exports = {
  // no CRA overrides; post-build copy
};

// Post build copy: service-worker.ts -> build/service-worker.js via simple transpile
if (process.env.POST_BUILD_SW === 'true') {
  const swSrc = path.resolve(__dirname, 'src/service-worker.ts');
  const swDest = path.resolve(__dirname, 'build/service-worker.js');
  if (fs.existsSync(swSrc)) {
    const ts = require('typescript');
    const code = fs.readFileSync(swSrc, 'utf-8');
    const out = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2017 } });
    fs.writeFileSync(swDest, out.outputText, 'utf-8');
    console.log('Service worker emitted to', swDest);
  }
}


