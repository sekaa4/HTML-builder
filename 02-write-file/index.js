const fs = require('fs');
const process = require('process');
const { stdin, stdout, exit } = process;
const path = require('path');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write(`Hello, write any information\n`);
stdin.on('data', (data) => {
  data.toString().trim() === `exit` ? exit() : null;
  output.write(data);
});

process.on('exit', () => stdout.write(`\nBye, file created and information written to the file`));
process.on('SIGINT', () => exit());