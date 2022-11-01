const { readdir, readFile, appendFile, stat, rm } = require('node:fs/promises');
const path = require('path');

const absPath = path.join(__dirname, 'styles');
const bandlePath = path.join(__dirname, 'project-dist');

async function deleteBundle () {
  await rm(path.join(bandlePath, 'bundle.css'), { force: true });

}

async function readData () {
  const files = await readdir(absPath);
  for (let prop of files) {
    const fileStat = await stat(path.join(absPath, prop));
    const isFile = fileStat.isFile();

    if (isFile && prop.endsWith('.css')) {
      const data = await readFile(path.join(absPath, prop), 'utf8');
      await write(data);
    }
  }
}

async function write (data) {
  await appendFile(path.join(bandlePath, 'bundle.css'), data);
}

(async function bundle () {
  await deleteBundle();
  await readData();
})();