const fs = require('fs');
const { readdir, mkdir, copyFile, stat, rm, readFile, writeFile, appendFile } = require('node:fs/promises');
const path = require('node:path');

const absPathStyles = path.resolve(__dirname, './styles');
const absPathAssets = path.resolve(__dirname, './assets');
const absNewPath = path.resolve(__dirname, './project-dist');
const absPathComponents = path.resolve(__dirname, './components');
const absNewPathBundle = path.resolve(absNewPath, './style.css');
const absNewPathAssets = path.resolve(absNewPath, './assets');
const template = path.resolve(__dirname, './template.html');

async function readDir(absPath) {
  return await readdir(absPath);
}

async function makeDir(absPath) {
  return await mkdir(absPath, { recursive: true });
}

async function makeBundle(absPath) {
  const files = await readDir(absPathStyles);
  for (let file of files) {
    const statObj = await stat(path.join(absPath, file));
    const isFile = statObj.isFile();
    if (isFile && file.endsWith('.css')) {
      const content = await readFile(path.join(absPath, file), { encoding: 'utf8' });
      await appendFile(absNewPathBundle, content);
    }
  }
}

async function copyFiles(absPathFrom, absPathTo) {
  await makeDir(absPathTo);
  const files = await readDir(absPathFrom);

  if (files.length === 0) return;

  for (let file of files) {
    const statObj = await stat(path.join(absPathFrom, file));
    const isFile = statObj.isFile();
    if (isFile) {
      await copyFile(path.join(absPathFrom, file), path.join(absPathTo, file));
      continue;
    }
    await copyFiles(path.join(absPathFrom, file), path.join(absPathTo, file));
  }
}

async function deleteFiles() {
  const files = await readdir(absNewPath);
  for (let prop of files) {
    await rm(path.join(absNewPath, prop), { recursive: true });
  }
}

async function makeIndex(absPathFrom, absPathTo, template) {
  const templateTags = ['{{header}}', '{{articles}}', '{{footer}}', '{{about}}'];
  const files = await readDir(absPathFrom);
  const contentTemplate = await readFile(template, { encoding: 'utf8' });
  let indexContent = contentTemplate;
  for (let prop of templateTags) {
    if (contentTemplate.includes(prop)) {
      const nameArr = [];
      const index = templateTags.indexOf(prop);
      templateTags[index].split('')
        .forEach((el, i) => (el !== '{' && el !== '}')
          ? nameArr.push(el)
          : null);
      const name = nameArr.join('') + '.html';
      const contentComponent = await readFile(path.join(absPathFrom, name), { encoding: 'utf8' });
      indexContent = indexContent.replaceAll(prop, contentComponent);
    }
  }

  await writeFile(path.join(absPathTo, 'index.html'), indexContent);
}

(async function buildProject() {
  await makeDir(absNewPath);
  await deleteFiles();
  await makeBundle(absPathStyles);
  await copyFiles(absPathAssets, absNewPathAssets);
  await makeIndex(absPathComponents, absNewPath, template);
})();