'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const path = require('path');
const _ = require('lodash');

const formateName = ( name ) => {
  name = _.kebabCase(name);
  name = name.indexOf('generator-') === 0 ? name : 'generator-' + name;
  return name;
}

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
      this.props = props;
    });
  }

  default() {
    // Create all folders needed

    // Folder root
    const roleRoot = `./${this.props.roleName}`
    mkdirp.sync(roleRoot);

    // DEFAULTS
    mkdirp.sync(path.join(roleRoot + '/defaults'));

    // HANDLERS
    mkdirp.sync(path.join(roleRoot + '/handlers'));

    // META
    if ( this.props.includeMeta) {
      mkdirp.sync(path.join(roleRoot + '/meta'));
    }

    // MOLECULE
    mkdirp.sync(path.join(roleRoot + '/molecule/default/tests'));
    const playbookTemplate = _.template(this.fs.read(this.templatePath('molecule/default/playbook.yml')))
    this.fs.write(path.join(roleRoot, 'molecule/default/playbook.yml'), playbookTemplate({
      roleName: this.props.roleName
    }))

    // TASKS
    mkdirp.sync(path.join(roleRoot + '/tasks'));

    // VARS
    mkdirp.sync(path.join(roleRoot + '/vars'));


  }

  writing() {
    // TODO WRITE THE PACKAGE.JSON
  }

  install() {
    // this.installDependencies({bower: false});
  }
};
