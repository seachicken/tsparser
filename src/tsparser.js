import readline from 'readline';
import ts from 'typescript';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

rl.on('line', (input) => {
  const program = ts.createProgram([input], { allowJs: true });
  const sourceFile = program.getSourceFile(input);

  function parse(node) {
    node.kindName = ts.SyntaxKind[node.kind];
    node.start = node.getStart(sourceFile);
    ts.forEachChild(node, parse);
  }
  ts.forEachChild(sourceFile, parse);

  try {
    process.stdout.write(`${JSON.stringify(sourceFile, getCircularReplacer())}\n`);
  } catch (error) {
    process.stdout.write(`\n`);
    process.stderr.write(`${error}\n`);
  }
}).on('close', () => {
  process.exit(0);
});
