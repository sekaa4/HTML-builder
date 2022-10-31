const { readdir } = require('fs/promises');
const { open } = require('fs/promises');
const { stdout } = require('process');
const path = require('path');

(async () => {
  try {
    const absPath = path.join(__dirname, 'secret-folder');
    const files = await readdir(absPath, { withFileTypes: true });
    
    for (let prop of files) {
      if (prop.isFile()) {
        let fileHandle = await open(path.join(absPath, prop.name));
        let stat = await fileHandle.stat();
        const ext = path.extname(prop.name);
        const name = path.basename(prop.name, ext);
        stdout.write(`${name} - ${ext.slice(1)} - ${stat.size}b\n`);
      }
    }
  } catch (err) {
    if (err) {
      stdout.write(err.message);
    }
  }
})();