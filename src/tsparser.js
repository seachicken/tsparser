import readline from 'readline';
import ts from 'typescript';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (input) => {
  const program = ts.createProgram([input], { allowJs: true });
  const sourceFile = program.getSourceFile(input);
  parse(sourceFile);

  function parse(node) {
    console.log(node);
    ts.forEachChild(node, parse);
  }
});
