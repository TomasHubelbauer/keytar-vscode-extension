const { app, BrowserWindow } = require('electron');
const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs-extra');
const tar = require('tar');

app.on('ready', async () => {
  const win = new BrowserWindow({ width: 800, height: 600 });
  win.loadFile('index.html');

  const environment = 'electron'; // node / electron
  const response = await fetch('https://api.github.com/repos/atom/node-keytar/releases');
  console.log('Downloaded Keytar GitHub releases');
  const data = await response.json();
  console.log('Decoded releases');
  const release = data[0];
  const version = release.tag_name.substring(1); // Cut off the `v`
  console.log(`Picked the latest ${version} release`);
  const name = `keytar-v${version}-${environment}-v${process.versions.modules}-${process.platform}-${process.arch}`;
  const tarGzFilePath = path.join(__dirname, name + '.tar.gz');
  const tarFilePath = path.join(__dirname, name + '.tar.gz');
  const nodeFilePath = path.join(__dirname, 'build/Release/keytar.node');
  console.log(`Obtaining ${name}:`);
  const asset = release.assets.find(asset => asset.name === name + '.tar.gz');
  if (asset === undefined) {
    console.log(`Asset ${name} not found for version ${version}.`);
    return;
  }

  console.log(`Found the ${name} asset`);
  const response2 = await fetch(asset.browser_download_url);
  console.log('Downloaded the asset');
  await fs.writeFile(tarGzFilePath, await response2.buffer());
  console.log('Saved the asset');
  await tar.x({ f: tarGzFilePath, cwd: __dirname }, [name + '.tar']);
  console.log('Extracted the asset .tar.gz');
  await tar.x({ f: tarFilePath, cwd: __dirname }, ['build/Release/keytar.node']);
  console.log('Extracted the asset .tar');

  const keytar = require(nodeFilePath);
  console.log('Loaded the module');
  await keytar.setPassword('test', 'test', 'test');
  console.log('Set the password');
  console.log(await keytar.findPassword('test'));
  console.log('Found the password');

  // How come this prevents the crash when there is no more code after and async
  // & await prevent any asynchronous execution from happening past this point?
  //process.exit(0);
});
