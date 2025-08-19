const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const srcTs = path.resolve(__dirname, '..', 'src', 'sw.ts');
const destJs = path.resolve(__dirname, '..', 'build', 'service-worker.js');

if (!fs.existsSync(srcTs)) process.exit(0);
const code = fs.readFileSync(srcTs, 'utf-8');
const out = ts.transpileModule(code, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2017 } });
// Elimina 'export {};' final si existe para que el SW no sea un módulo
let js = out.outputText.replace(/\nexport \{\};?\s*$/m, '\n');
fs.writeFileSync(destJs, js, 'utf-8');
console.log('Emitted', destJs);


