"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");
const path = require("path");
const _ = require("lodash");

const formatName = name => {
  name = _.kebabCase(name);
  name = name.indexOf("generator-") === 0 ? name : "generator-" + name;
  return name;
};

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the groundbreaking ${chalk.red(
          "generator-ansible"
        )} generator!`
      )
    );

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
        name: "metaLicense",
        message: "What is the license for this role?"
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
        name: "metaDescription",
        message: "What is the description for this role?"
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
    });
  }

  default() {
    // Folder root
    const roleRoot = `./${this.props.roleName}`;
    this.props.roleRoot = roleRoot;
    mkdirp.sync(roleRoot);
    this.fs.copy(
      // Non dotfiles
      this.templatePath("./**"),
      roleRoot
    );
    this.fs.copy(
      // Dotfiles
      this.templatePath("./.*"),
      roleRoot
    );
    const readMeTemplate = _.template(
      this.fs.read(this.templatePath("README.md"))
    );
    this.fs.write(
      path.join(roleRoot, "README.md"),
      readMeTemplate({
        roleName: this.props.roleName
      })
    );
    const runScriptTemplate = _.template(
      this.fs.read(this.templatePath("run-test.sh"))
    );
    this.fs.write(
      path.join(roleRoot, "run-test.sh"),
      runScriptTemplate({
        roleName: this.props.roleName
      })
    );

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

    // META
    if (this.props.includeMeta) {
      mkdirp.sync(path.join(roleRoot, "meta"));
      const metaTemplate = _.template(
        this.fs.read(this.templatePath("meta/main.yml"))
      );
      this.fs.write(
        path.join(roleRoot, "meta/main.yml"),
        metaTemplate({
          authorName: this.props,
          authorName: this.props.authorName,
          metaDescription: this.props.metaDescription,
          metaCompany: this.props.metaCompany,
          metaLicence: this.props.metaLicense
        })
      );
    }

    // MOLECULE
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

    // TASKS
    mkdirp.sync(path.join(roleRoot, "tasks"));
    this.fs.copy(this.templatePath("tasks"), path.join(roleRoot, "tasks"));

    // VARS
    mkdirp.sync(path.join(roleRoot, "vars"));
    this.fs.copy(this.templatePath("vars"), path.join(roleRoot, "vars"));
  }

  writing() {
    const pkgTemplate = {
      name: this.props.roleName,
      version: "1.0.0",
      main: "index.js",
      // TODO this grab this dynamically
      repository: "git@github.com:Aaron-K-T-Berry/generator-ansible.git",
      // TODO this grab this dynamically
      description: "",
      author: this.props.authorName,
      license: this.props.license,
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
    };
    this.fs.writeJSON(
      path.join(this.props.roleRoot, "package.json"),
      pkgTemplate
    );
  }

  install() {
    // this.installDependencies({ bower: false });
  }
};
