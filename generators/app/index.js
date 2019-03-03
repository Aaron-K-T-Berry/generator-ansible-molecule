"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");
const path = require("path");
const _ = require("lodash");
const exec = require("child_process").exec;
const prompt = require("./src/prompts");
const getLicenseValue = require("./src/prompts").getLicenseValue;

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(`Welcome to the groundbreaking ${chalk.red("generator-ansible")} generator!`));

    const prompts = [
      ...prompt.basicQuestionsPrompts,
      ...prompt.gitCredentialsPrompts,
      ...prompt.moleculePrompts,
      ...prompt.metaPrompts
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  default() {
    // Folder root
    const roleRoot = `./${this.props.roleName}`;
    this.props.roleRoot = roleRoot;
    mkdirp.sync(roleRoot);
    this.fs.copy(this.templatePath("root-files"), roleRoot);
    this.fs.copy(this.templatePath("root-files/.**"), roleRoot);

    // CIRCLECI
    if (this.props.includeCircleCi) {
      mkdirp.sync(path.join(roleRoot, ".circleci"));
      this.fs.copy(this.templatePath(".circleci"), path.join(roleRoot, ".circleci"));
    }

    // DEFAULTS
    mkdirp.sync(path.join(roleRoot, "defaults"));
    this.fs.copy(this.templatePath("defaults"), path.join(roleRoot, "defaults"));

    // HANDLERS
    mkdirp.sync(path.join(roleRoot, "handlers"));
    this.fs.copy(this.templatePath("handlers"), path.join(roleRoot, "handlers"));

    // TASKS
    mkdirp.sync(path.join(roleRoot, "tasks"));
    this.fs.copy(this.templatePath("tasks"), path.join(roleRoot, "tasks"));

    // VARS
    mkdirp.sync(path.join(roleRoot, "vars"));
    this.fs.copy(this.templatePath("vars"), path.join(roleRoot, "vars"));
  }

  writing() {
    const roleRoot = `./${this.props.roleName}`;

    // MOLECULE
    if (this.props.includeMolecule) {
      mkdirp.sync(path.join(roleRoot, "molecule/default/tests"));
      this.fs.copy(this.templatePath("molecule"), path.join(roleRoot, "molecule"));
      const playbookTemplate = _.template(
        this.fs.read(this.templatePath("molecule/default/playbook.yml"))
      );
      this.fs.write(
        path.join(roleRoot, "molecule/default/playbook.yml"),
        playbookTemplate({
          roleName: this.props.roleName
        })
      );
    }

    const readMeTemplate = _.template(this.fs.read(this.templatePath("root-files/README.md")));
    this.fs.write(
      path.join(roleRoot, "README.md"),
      readMeTemplate({
        roleName: this.props.roleName,
        authorName: this.props.gitAuthorName,
        authorEmail: this.props.gitAuthorEmail
      })
    );
    const runScriptTemplate = _.template(this.fs.read(this.templatePath("root-files/run-test.sh")));
    this.fs.write(
      path.join(roleRoot, "run-test.sh"),
      runScriptTemplate({
        roleName: this.props.roleName
      })
    );

    // META
    if (this.props.includeMeta) {
      const metaTemplate = _.template(this.fs.read(this.templatePath("meta/main.yml")));
      this.fs.write(
        path.join(roleRoot, "meta/main.yml"),
        metaTemplate({
          authorName: this.props.gitAuthorName,
          description: this.props.description,
          metaCompany: this.props.metaCompany,
          metaLicence: getLicenseValue(this.props.license)
        })
      );
    }

    // Package.json
    let pkgTemplate = {
      name: this.props.roleName,
      version: "1.0.0",
      main: "index.js",
      repository: this.props.gitIncludeRepoUrl ? this.props.gitRepoUrl : "",
      description: this.props.description,
      author: this.props.gitAuthorName,
      license: getLicenseValue(this.props.license),
      dependencies: {},
      scripts: {
        venv: "virtualenv venv",
        "venv-activate": "source venv/bin/activate",
        requirements: "pip install -r requirements.txt"
      }
    };
    if (this.props.includeMolecule) {
      pkgTemplate = {
        ...pkgTemplate,
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
    this.fs.writeJSON(path.join(roleRoot, "package.json"), pkgTemplate);
  }

  install() {
    // Fixing permissions
    exec(`chmod +x ${path.join(this.destinationRoot(), this.props.roleRoot, "run-test.sh")}`);
  }
};
