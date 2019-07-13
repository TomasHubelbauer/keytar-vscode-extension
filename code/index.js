const path = require('path');
const yeoman = require('yeoman-environment');
const fs = require('fs-extra');

// Cannot use `require.resolve` as `generator-code` lacks `main` in `package.json`
// https://github.com/microsoft/vscode-generator-code/pull/179
const generatorPath = path.join(__dirname, 'node_modules/generator-code/generators/app/index.js');

const displayName = 'Test extension';
const name = 'test-extension';
class Adapter {
  constructor() {
    // TODO: Find out why `this.create = function` won't work in `this.log` but yes with `this.log.create = function`
    this.log = function (_message) {
      // Ignore as this is only called for the Yeoman banner
    }

    this.log.create = function (path) {
      console.log(path);
    }

    // `identical`, `force` and `conflict` are not implemented because I rimraf the `text-extension` directory
    // before scaffolding
  }

  async prompt(/** @type {any[]} */ questions) {
    if (questions.length !== 1) {
      throw new Error(`Excepted a single question but got ${questions.length}!`);
    }

    const question = questions[0];
    switch (question.name) {
      case 'type': {
        if (question.type !== 'list') {
          throw new Error(`Excepted a list choice question but got ${question.type}!`);
        }

        return { type: 'ext-command-js' };
      }

      case 'displayName': {
        if (question.type !== 'input') {
          throw new Error(`Excepted an input value question but got ${question.type}!`);
        }

        return { displayName };
      }

      case 'name': {
        if (question.type !== 'input') {
          throw new Error(`Excepted an input value question but got ${question.type}!`);
        }

        return { name };
      }

      case 'description': {
        if (question.type !== 'input') {
          throw new Error(`Excepted an input value question but got ${question.type}!`);
        }

        return { description: '' };
      }

      case 'checkJavaScript': {
        if (question.type !== 'confirm') {
          throw new Error(`Excepted an input value question but got ${question.type}!`);
        }

        return { checkJavaScript: true };
      }

      case 'gitInit': {
        if (question.type !== 'confirm') {
          throw new Error(`Excepted an input value question but got ${question.type}!`);
        }

        return { gitInit: false };
      }

      case 'pkgManager': {
        if (question.type !== 'list') {
          throw new Error(`Excepted a list choice question but got ${question.type}!`);
        }

        return { pkgManager: 'npm' };
      }

      default: {
        throw new Error(`Received an unexpected question ${question.name} (${question.type})! ${question.message}`)
      }
    }
  }

  diff() {
    // Never called as we're always creating from scratch
  }
}

const environment = yeoman.createEnv(undefined, undefined, new Adapter());

// https://code.visualstudio.com/api/get-started/your-first-extension
environment.register(generatorPath, 'code:app');

void async function () {
  await fs.remove('test-extension');
  environment.run('code:app', console.log);
}()
