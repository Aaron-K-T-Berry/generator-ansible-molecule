const path = require("path");
const rimraf = require("rimraf");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");
const fs = require("fs");

describe("Include meta is true", () => {
  const roleName = "test";
  const authorName = "John smith";
  const description = "Role description";
  const metaLicense = "MIT";
  const includeMeta = true;
  const metaCompany = "Company co";

  beforeEach(() => {
    return helpers.run(path.join(__dirname, "../generators/app")).withPrompts({
      roleName,
      authorName,
      description,
      metaLicense,
      includeMeta,
      metaCompany
    });
  });

  it("Copied defaults/main.yml", () => {
    assert.file(`${roleName}/defaults/main.yml`);
  });

  it("Copied handlers/main.yml", () => {
    assert.file(`${roleName}/handlers/main.yml`);
  });

  it("Copied meta/main.yml", () => {
    assert.file(`${roleName}/meta/main.yml`);
  });

  it("Contents meta/main.yml", () => {
    assert.fileContent(`${roleName}/meta/main.yml`, `author: ${authorName}`);
    assert.fileContent(`${roleName}/meta/main.yml`, `description: ${description}`);
    assert.fileContent(`${roleName}/meta/main.yml`, `company: ${metaCompany}`);
    assert.fileContent(`${roleName}/meta/main.yml`, `license: ${metaLicense}`);
  });

  it("Copied molecule/default/tests files", () => {
    assert.file(`${roleName}/molecule/default/tests/test_default.py`);
    assert.file(`${roleName}/molecule/default/tests/test_default.pyc`);
  });

  it("Copied molecule/default files", () => {
    assert.file(`${roleName}/molecule/default/Dockerfile.j2`);
    assert.file(`${roleName}/molecule/default/INSTALL.rst`);
    assert.file(`${roleName}/molecule/default/molecule.yml`);
    assert.file(`${roleName}/molecule/default/playbook.yml`);
  });

  it("Contents of molecule/default/playbook.yml", () => {
    assert.fileContent(`${roleName}/molecule/default/playbook.yml`, `- role: ${roleName}`);
  });

  it("Copied tasks/main.yml", () => {
    assert.file(`${roleName}/tasks/main.yml`);
  });

  it("Copied vars/main.yml", () => {
    assert.file(`${roleName}/vars/main.yml`);
  });

  it("Copied .yamllint", () => {
    assert.file(`${roleName}/.yamllint`);
  });

  it("Copied README.md", () => {
    assert.file(`${roleName}/README.md`);
  });

  it("Contents of README.md", () => {
    assert.fileContent(`${roleName}/README.md`, roleName);
    assert.fileContent(`${roleName}/README.md`, `Author: ${authorName}`);
  });

  it("Copied requirements.txt", () => {
    assert.file(`${roleName}/requirements.txt`);
  });

  it("Copied run-test.sh", () => {
    assert.file(`${roleName}/requirements.txt`);
  });

  it("Copied package.json", () => {
    assert.file(`${roleName}/package.json`);
  });

  it("content package.json", () => {
    assert.JSONFileContent(`${roleName}/package.json`, {
      name: roleName,
      version: "1.0.0",
      main: "index.js",
      repository: "git@github.com:Aaron-K-T-Berry/generator-ansible.git",
      description: description,
      author: authorName,
      license: metaLicense,
      dependencies: {},
      scripts: {
        venv: "virtualenv venv",
        "venv-activate": "source venv/bin/activate",
        requirements: "pip install -r requirements.txt",
        check: "molecule check",
        converge: "molecule converge",
        create: "molecule create",
        dependency: "molecule dependency",
        destroy: "molecule destroy",
        idempotence: "molecule idempotence",
        lint: "molecule lint",
        list: "molecule list",
        login: "molecule login",
        matrix: "molecule matrix",
        prepare: "molecule prepare",
        "side-effect": "molecule side-effect",
        syntax: "molecule syntax",
        test: "molecule test",
        verify: "molecule verify"
      }
    });
  });
});

describe("Include meta is false", () => {
  const roleName = "test";
  const authorName = "John smith";
  const description = "Role description";
  const metaLicense = "MIT";
  const includeMeta = false;
  const metaCompany = "Company co";

  beforeEach(() => {
    return helpers.run(path.join(__dirname, "../generators/app")).withPrompts({
      roleName,
      authorName,
      description,
      metaLicense,
      includeMeta,
      metaCompany
    });
  });

  it("Copied defaults/main.yml", () => {
    assert.file(`${roleName}/defaults/main.yml`);
  });

  it("Copied handlers/main.yml", () => {
    assert.file(`${roleName}/handlers/main.yml`);
  });

  it("Did not copy meta/main.yml", () => {
    assert.noFile(`${roleName}/meta/main.yml`);
  });

  it("Copied molecule/default/tests files", () => {
    assert.file(`${roleName}/molecule/default/tests/test_default.py`);
    assert.file(`${roleName}/molecule/default/tests/test_default.pyc`);
  });

  it("Copied molecule/default files", () => {
    assert.file(`${roleName}/molecule/default/Dockerfile.j2`);
    assert.file(`${roleName}/molecule/default/INSTALL.rst`);
    assert.file(`${roleName}/molecule/default/molecule.yml`);
    assert.file(`${roleName}/molecule/default/playbook.yml`);
  });

  it("Contents of molecule/default/playbook.yml", () => {
    assert.fileContent(`${roleName}/molecule/default/playbook.yml`, `- role: ${roleName}`);
  });

  it("Copied tasks/main.yml", () => {
    assert.file(`${roleName}/tasks/main.yml`);
  });

  it("Copied vars/main.yml", () => {
    assert.file(`${roleName}/vars/main.yml`);
  });

  it("Copied .yamllint", () => {
    assert.file(`${roleName}/.yamllint`);
  });

  it("Copied README.md", () => {
    assert.file(`${roleName}/README.md`);
  });

  it("Contents of README.md", () => {
    assert.fileContent(`${roleName}/README.md`, roleName);
    assert.fileContent(`${roleName}/README.md`, `Author: ${authorName}`);
  });

  it("Copied requirements.txt", () => {
    assert.file(`${roleName}/requirements.txt`);
  });

  it("Copied run-test.sh", () => {
    assert.file(`${roleName}/requirements.txt`);
  });

  it("Copied package.json", () => {
    assert.file(`${roleName}/package.json`);
  });

  it("content package.json", () => {
    assert.JSONFileContent(`${roleName}/package.json`, {
      name: roleName,
      version: "1.0.0",
      main: "index.js",
      repository: "git@github.com:Aaron-K-T-Berry/generator-ansible.git",
      description: description,
      author: authorName,
      license: metaLicense,
      dependencies: {},
      scripts: {
        venv: "virtualenv venv",
        "venv-activate": "source venv/bin/activate",
        requirements: "pip install -r requirements.txt",
        check: "molecule check",
        converge: "molecule converge",
        create: "molecule create",
        dependency: "molecule dependency",
        destroy: "molecule destroy",
        idempotence: "molecule idempotence",
        lint: "molecule lint",
        list: "molecule list",
        login: "molecule login",
        matrix: "molecule matrix",
        prepare: "molecule prepare",
        "side-effect": "molecule side-effect",
        syntax: "molecule syntax",
        test: "molecule test",
        verify: "molecule verify"
      }
    });
  });
});
