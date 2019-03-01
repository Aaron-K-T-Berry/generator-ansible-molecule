"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");
const path = require("path");
const _ = require("lodash");
const exec = require("child_process").exec;
const gitConfig = require("git-config");

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

const ciCdPlatforms = ["travisCi", "circleCi", "None"];

const getLicenseValue = name => {
  for (const item of licenses) {
    if (item.name === name) {
      return item.value;
    }
  }
};

let configs = {};
let roleRoot;

module.exports = class extends Generator {
  initializing() {
    configs.gitConfigs = gitConfig.sync();
  }

  prompting() {
    this.log(
      yosay(
        `Welcome to the groundbreaking ${chalk.red(
          "generator-ansible"
        )} generator!`
      )
    );

    const basicQuestionsPrompts = [
      {
        type: "text",
        name: "roleName",
        message: "What is the name of this role?"
      },
      {
        type: "text",
        name: "description",
        message: "What is the description for this role?"
      },
      {
        type: "list",
        name: "license",
        message: "What is the license for this role?",
        choices: licenses.map(item => item.name)
      }
    ];

    const gitCredentialsPrompts = [
      {
        type: "text",
        name: "gitAuthorName",

        message: "What is your name (Will be used in  the meta file and package.json)?",
        default: configs.gitConfigs.user.name
      },
      {
        type: "text",
        name: "gitAuthorEmail",
        message: "What is your email (Will be used in  the meta file and package.json)?",
        default: configs.gitConfigs.user.email
      },
      {
        type: "confirm",
        name: "gitIncludeRepoUrl",
        message: "Would you like to include a repository in the package.json?",
        default: true
      },
      {
        when: response => {
          return response.gitIncludeRepoUrl;
        },
        type: "text",
        name: "gitRepoUrl",
        message:
          "What is your email (Will be used in  the meta file and package.json)?"
      }
    ];

    const moleculePrompts = [
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
        type: "confirm",
        name: "includeCiCd",
        message: "Would you like to include a basic ci cd config for molecule?",
        default: true
      },
      {
        when: response => {
          return response.includeCiCd;
        },
        type: "list",
        name: "ciCdPlatform",
        message: "What ci cd platform?",
        choices: ciCdPlatforms
      }
    ];

    const metaPrompts = [
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

    const prompts = [
      ...basicQuestionsPrompts,
      ...gitCredentialsPrompts,
      ...moleculePrompts,
      ...metaPrompts
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  configuring() {
    // Setting veriables for the rest of the generator from prompts
    roleRoot = `./${this.props.roleName}`;
    
    // CICD
    if (this.props.includeCiCd) {
      switch (this.props.ciCdPlatform) {
        case "None":
          break;
        case "travisCi":
          this.fs.copy(this.templatePath("travis/.travis.yml"), path.join(roleRoot, ".travis.yml"));
          break;
        case "circleCi":
          mkdirp.sync(path.join(roleRoot, ".circleci"));
          this.fs.copy(this.templatePath("ci/.circleci"), path.join(roleRoot, ".circleci"));
          break;
      }
    }
  }

  default() {
    // Folder root
    this.props.roleRoot = roleRoot;
    mkdirp.sync(roleRoot);
    this.fs.copy(this.templatePath("root-files"), roleRoot);
    this.fs.copy(this.templatePath("root-files/.**"), roleRoot);

    // DEFAULTS
    mkdirp.sync(path.join(roleRoot, "defaults"));
    this.fs.copy(
      this.templatePath("defaults"),
      path.join(roleRoot, "defaults")
    );

    // HANDLERS
    mkdirp.sync(path.join(roleRoot, "handlers"));
    this.fs.copy(
      this.templatePath("handlers"),
      path.join(roleRoot, "handlers")
    );

    // TASKS
    mkdirp.sync(path.join(roleRoot, "tasks"));
    this.fs.copy(this.templatePath("tasks"), path.join(roleRoot, "tasks"));

    // VARS
    mkdirp.sync(path.join(roleRoot, "vars"));
    this.fs.copy(this.templatePath("vars"), path.join(roleRoot, "vars"));
  }

  writing() {

    // MOLECULE
    if (this.props.includeMolecule) {
      mkdirp.sync(path.join(roleRoot, "molecule/default/tests"));
      this.fs.copy(
        this.templatePath("molecule"),
        path.join(roleRoot, "molecule")
      );
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

    const readMeTemplate = _.template(
      this.fs.read(this.templatePath("root-files/README.md"))
    );
    this.fs.write(
      path.join(roleRoot, "README.md"),
      readMeTemplate({
        roleName: this.props.roleName,
        authorName: this.props.gitAuthorName,
        authorEmail: this.props.gitAuthorEmail
      })
    );
    const runScriptTemplate = _.template(
      this.fs.read(this.templatePath("root-files/run-test.sh"))
    );
    this.fs.write(
      path.join(roleRoot, "run-test.sh"),
      runScriptTemplate({
        roleName: this.props.roleName
      })
    );

    // META
    if (this.props.includeMeta) {
      const metaTemplate = _.template(
        this.fs.read(this.templatePath("meta/main.yml"))
      );
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
    exec(
      `chmod +x ${path.join(
        this.destinationRoot(),
        this.props.roleRoot,
        "run-test.sh"
      )}`
    );
  }

  end() {}
};
