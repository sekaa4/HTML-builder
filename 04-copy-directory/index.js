const { readdir, mkdir, copyFile, rm } = require('node:fs/promises');
const path = require('path');

const absPath = path.join(__dirname, 'files');
const absNewPath = path.join(__dirname, 'files-copy');

async function createDir () {
  try {
    await mkdir(absNewPath, { recursive: true });
  } catch (err) {
    console.error(err.message);
  }
}

async function deleteFiles () {
  try {
    const files = await readdir(absNewPath);
    for (let prop of files) {
      await rm(path.join(absNewPath, prop));
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function copyFiles () {
  try {
    const files = await readdir(absPath);
    for (let prop of files) {
      await copyFile(path.join(absPath, prop), path.join(absNewPath, prop));
    }
  } catch (err) {
    console.error(err.message);
  }
}

async function copyDir () {
  await createDir();
  await deleteFiles();
  await copyFiles();
}

copyDir();