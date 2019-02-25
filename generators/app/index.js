'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const path = require('path');

module.exports = class extends Generator {
  prompting() {
    
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the groundbreaking ${chalk.red('generator-ansible')} generator!`)
    );
    
    const prompts = [
      {
        type: 'text',
        name: 'roleName',
        message: 'What is the name of this role?'
      },
      {
        type: 'confirm',
        name: 'includeMeta',
        message: 'Would you like to include the meta folder?',
        default: false
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    // Role folder
    // TODO make this folder the name of the role
    const roleRoot = `./${this.props.roleName}`
    mkdirp.sync(roleRoot);

    // Defaults folder
    mkdirp.sync(path.join(roleRoot + '/defaults'));
    this.fs.copy(
      this.templatePath('defaults'),
      this.destinationPath(path.join(roleRoot, 'defaults'))
    )

    // Handlers folder
    mkdirp.sync(path.join(roleRoot + '/handlers'));
    this.fs.copy(
      this.templatePath('handlers'),
      this.destinationPath(path.join(roleRoot, 'handlers'))
    )

    // Meta folder
    if (this.props.includeMeta) {
      mkdirp.sync(path.join(roleRoot + '/meta'));
      this.fs.copy(
        this.templatePath('meta'),
        this.destinationPath(path.join(roleRoot, 'meta'))
      )
    }

    // Molecule folder
    mkdirp.sync(path.join(roleRoot + '/molecule'));
    this.fs.copy(
      this.templatePath('molecule'),
      this.destinationPath(path.join(roleRoot, 'molecule'))
    )

    // Tasks folder
    mkdirp.sync(path.join(roleRoot + '/tasks'));
    this.fs.copy(
      this.templatePath('tasks'),
      this.destinationPath(path.join(roleRoot, 'tasks'))
    )

    // Vars folder
    mkdirp.sync(path.join(roleRoot + '/vars'));
    this.fs.copy(
      this.templatePath('vars'),
      this.destinationPath(path.join(roleRoot, 'vars'))
    )

    // Loose files
    // Regular files
    this.fs.copy(
      this.templatePath('loose-files'),
      this.destinationPath(roleRoot)
    )
    // Dotfiles
    this.fs.copy(
      this.templatePath('loose-files/.*'),
      this.destinationPath(roleRoot)
    )
  }

  install() {
    // this.installDependencies();
  }
};
