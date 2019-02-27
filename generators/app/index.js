"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");
const path = require("path");
const _ = require("lodash");
const exec = require("child_process").exec;
// TODO [GIT] GET GIT CONFIGS
// const gitConfig = require("git-config");

const licenses = [
  { name: "Apache 2.0", value: "Apache-2.0" },
  { name: "MIT", value: "MIT" },
  { name: "Mozilla Public License 2.0", value: "MPL-2.0" },
  { name: "BSD 2-Clause (FreeBSD) License", value: "BSD-2-Clause-FreeBSD" },
  { name: "BSD 3-Clause (NewBSD) License", value: "BSD-3-Clause" },
  { name: "Internet Systems Consortium (ISC) License", value: "ISC" },
  { name: "GNU AGPL 3.0", value: "AGPL-3.0" },
  { name: "GNU GPL 3.0", value: "GPL-3.0" },
  { name: "GNU LGPL 3.0", value: "LGPL-3.0" },
  { name: "Unlicense", value: "unlicense" },
  { name: "No License (Copyrighted)", value: "UNLICENSED" }
];

const getLicenseValue = name => {
  for (const item of licenses) {
    if (item.name === name) {
      return item.value;
    }
  }
};

module.exports = class extends Generator {
  prompting() {
    
    this.log(yosay(`Welcome to the groundbreaking ${chalk.red("generator-ansible")} generator!`));
    
    const prompts = [
      {
        type: "text",
        name: "roleName",
        message: "What is the name of this role?"
      },
      {
        type: "text",
        name: "authorName",
        message: "What is your name?"
      },
      {
        type: "text",
        name: "description",
        message: "What is the description for this role?"
      },
      {
        type: "list",
        name: "metaLicense",
        message: "What is the license for this role?",
        choices: licenses.map(item => item.name)
      },
      {
        type: "confirm",
        name: "includeMolecule",
        message: "Would you like to include the molecule testing boilerplate?",
        default: false
      },
      {
        when: response => {
          return response.includeMolecule;
        },
        type: "text",
        name: "includeCircleCi",
        message: "Would you like to include a basic circle ci config for molecule?",
        default: false
      },
      {
        type: "confirm",
        name: "includeMeta",
        message: "Would you like to include the meta folder?",
        default: false
      },
      {
        when: response => {
          return response.includeMeta;
        },
        type: "text",
        name: "metaCompany",
        message: "What is the company for this role?"
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
      // Formatting some props
      // this.props.roleName = _.kebabCase(this.props.roleName);
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
    if(this.props.includeCircleCi){
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
        authorName: this.props.authorName
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
          authorName: this.props.authorName,
          description: this.props.description,
          metaCompany: this.props.metaCompany,
          metaLicence: getLicenseValue(this.props.metaLicense)
        })
      );
    }

    // Package.json
    let pkgTemplate = {
      name: this.props.roleName,
      version: "1.0.0",
      main: "index.js",
      // TODO [GIT] grab this dynamically
      repository: "git@github.com:Aaron-K-T-Berry/generator-ansible.git",
      description: this.props.description,
      author: this.props.authorName,
      license: getLicenseValue(this.props.metaLicense),
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
