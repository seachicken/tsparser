import readline from 'readline';
import ts from 'typescript';
import './cycle';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', (input) => {
  const program = ts.createProgram([input], { allowJs: true });
  const sourceFile = program.getSourceFile(input);

  function parse(node) {
    node.start = node.getStart(sourceFile);
    ts.forEachChild(node, parse);
  }
  ts.forEachChild(sourceFile, parse);

  try {
    process.stdout.write(`${JSON.stringify(sourceFile)}\n`);
  } catch (error) {
    process.stdout.write(`\n`);
    process.stderr.write(`${error}\n`);
  }
}).on('close', () => {
  process.exit(0);
});
