const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");

const buildPkgJson = params => {
  let template = {
    name: params.roleName,
    version: "1.0.0",
    main: "index.js",
    repository: "git@github.com:Aaron-K-T-Berry/generator-ansible.git",
    description: params.description,
    author: params.authorName,
    license: params.metaLicense,
    dependencies: {},
    scripts: {
      venv: "virtualenv venv",
      "venv-activate": "source venv/bin/activate",
      requirements: "pip install -r requirements.txt"
    }
  };

  if (params.includeMolecule) {
    template = {
      ...template,
      ...{
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
    };
  }
  return template;
};

const defaultPrompts = {
  roleName: "test",
  authorName: "John smith",
  description: "Role description",
  metaLicense: "MIT",
  includeMolecule: false,
  includeMeta: false,
  metaCompany: "Company co."
};

describe("Defaults included", () => {
  const prompts = { ...defaultPrompts };

  beforeEach(() => {
    return helpers.run(path.join(__dirname, "../generators/app")).withPrompts(prompts);
  });

  it("Copied defaults/main.yml", () => {
    assert.file(`${prompts.roleName}/defaults/main.yml`);
  });

  it("Copied handlers/main.yml", () => {
    assert.file(`${prompts.roleName}/handlers/main.yml`);
  });

  it("Copied meta/main.yml", () => {
    assert.noFile(`${prompts.roleName}/meta/main.yml`);
  });

  it("Copied molecule/default/tests files", () => {
    assert.noFile(`${prompts.roleName}/molecule/default/tests/test_default.py`);
    assert.noFile(`${prompts.roleName}/molecule/default/tests/test_default.pyc`);
  });

  it("Copied molecule/default files", () => {
    assert.noFile(`${prompts.roleName}/molecule/default/Dockerfile.j2`);
    assert.noFile(`${prompts.roleName}/molecule/default/INSTALL.rst`);
    assert.noFile(`${prompts.roleName}/molecule/default/molecule.yml`);
    assert.noFile(`${prompts.roleName}/molecule/default/playbook.yml`);
  });

  it("Copied tasks/main.yml", () => {
    assert.file(`${prompts.roleName}/tasks/main.yml`);
  });

  it("Copied vars/main.yml", () => {
    assert.file(`${prompts.roleName}/vars/main.yml`);
  });

  it("Copied .yamllint", () => {
    assert.file(`${prompts.roleName}/.yamllint`);
  });

  it("Copied README.md", () => {
    assert.file(`${prompts.roleName}/README.md`);
  });

  it("Contents of README.md", () => {
    assert.fileContent(`${prompts.roleName}/README.md`, prompts.roleName);
    assert.fileContent(`${prompts.roleName}/README.md`, `Author: ${prompts.authorName}`);
  });

  it("Copied requirements.txt", () => {
    assert.file(`${prompts.roleName}/requirements.txt`);
  });

  it("Copied run-test.sh", () => {
    assert.file(`${prompts.roleName}/requirements.txt`);
  });

  it("Copied package.json", () => {
    assert.file(`${prompts.roleName}/package.json`);
  });

  it("Content package.json", () => {
    assert.JSONFileContent(`${prompts.roleName}/package.json`, buildPkgJson(prompts));
  });
});

describe("Molecule included", () => {
  const prompts = { ...defaultPrompts, includeMolecule: true };

  beforeEach(() => {
    return helpers.run(path.join(__dirname, "../generators/app")).withPrompts(prompts);
  });

  it("Copied molecule/default/tests files", () => {
    assert.file(`${prompts.roleName}/molecule/default/tests/test_default.py`);
    assert.file(`${prompts.roleName}/molecule/default/tests/test_default.pyc`);
  });

  it("Copied molecule/default files", () => {
    assert.file(`${prompts.roleName}/molecule/default/Dockerfile.j2`);
    assert.file(`${prompts.roleName}/molecule/default/INSTALL.rst`);
    assert.file(`${prompts.roleName}/molecule/default/molecule.yml`);
    assert.file(`${prompts.roleName}/molecule/default/playbook.yml`);
  });

  it("Contents of molecule/default/playbook.yml", () => {
    assert.fileContent(
      `${prompts.roleName}/molecule/default/playbook.yml`,
      `- role: ${prompts.roleName}`
    );
  });

  it("Content package.json", () => {
    assert.JSONFileContent(`${prompts.roleName}/package.json`, buildPkgJson(prompts));
  });
});

describe("CircleCi included", () => {
  const prompts = { ...defaultPrompts, includeMolecule: true, includeCircleCi: true };

  beforeEach(() => {
    return helpers.run(path.join(__dirname, "../generators/app")).withPrompts(prompts);
  });

  it("Copied .circleci/config.yml", () => {
    assert.file(`${prompts.roleName}/.circleci/config.yml`);
  })
});

describe("Meta included", () => {
  const prompts = { ...defaultPrompts, ...{ includeMeta: true, metaCompany: "Company co." } };

  const roleName = "test";
  const authorName = "John smith";
  const description = "Role description";
  const metaLicense = "MIT";
  const includeMolecule = false;
  const includeMeta = true;
  const metaCompany = "Company co.";

  beforeEach(() => {
    return helpers.run(path.join(__dirname, "../generators/app")).withPrompts(prompts);
  });

  it("Copied meta/main.yml", () => {
    assert.file(`${prompts.roleName}/meta/main.yml`);
  });

  it("Contents meta/main.yml", () => {
    assert.fileContent(`${prompts.roleName}/meta/main.yml`, `author: ${authorName}`);
    assert.fileContent(`${prompts.roleName}/meta/main.yml`, `description: ${description}`);
    assert.fileContent(`${prompts.roleName}/meta/main.yml`, `company: ${metaCompany}`);
    assert.fileContent(`${prompts.roleName}/meta/main.yml`, `license: ${metaLicense}`);
  });

  it("Content package.json", () => {
    assert.JSONFileContent(`${prompts.roleName}/package.json`, buildPkgJson(prompts));
  });
});
