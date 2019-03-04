"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");
const path = require("path");
const _ = require("lodash");
const exec = require("child_process").exec;
const p = require("./src/prompts");
const getLicenseValue = require("./src/prompts").getLicenseValue;
const buildPackageJSON = require("./src/package-builder").buildPackageJSON;

module.exports = class extends Generator {
	initializing() {}

	prompting() {
		this.log(
			yosay(
				`Welcome to the groundbreaking ${chalk.red(
					"ansible-molecule"
				)} generator!`
			)
		);
		const prompts = p.allPrompts;

		return this.prompt(prompts).then(props => {
			this.props = props;
			const roleRoot = `./${this.props.roleName}`;
			this.props.roleRoot = roleRoot;
		});
	}

	configuring() {
		const roleRoot = `./${this.props.roleName}`;

		// CIRCLECI
		if (this.props.includeCircleCi) {
			mkdirp.sync(path.join(roleRoot, ".circleci"));
			this.fs.copy(
				this.templatePath(".circleci"),
				path.join(roleRoot, ".circleci")
			);
		}
	}

	default() {
		// Folder root
		const roleRoot = `./${this.props.roleName}`;
		this.props.roleRoot = roleRoot;

		const dirPaths = [
			roleRoot,
			path.join(roleRoot, "defaults"),
			path.join(roleRoot, "handlers"),
			path.join(roleRoot, "tasks"),
			path.join(roleRoot, "vars")
		];

		// Copying files
		const filePaths = [
			{
				src: this.templatePath("root-files"),
				dest: roleRoot
			},
			{
				src: this.templatePath("root-files/.**"),
				dest: roleRoot
			},
			{
				src: this.templatePath("defaults"),
				dest: path.join(roleRoot, "defaults")
			},

			{
				src: this.templatePath("handlers"),
				dest: path.join(roleRoot, "handlers")
			},
			{
				src: this.templatePath("tasks"),
				dest: path.join(roleRoot, "tasks")
			},
			{
				src: this.templatePath("vars"),
				dest: path.join(roleRoot, "vars")
			}
		];

		// Creating dirs paths
		dirPaths.forEach(item => {
			mkdirp.sync(item);
		});

		// Copying file paths
		filePaths.forEach(item => {
			this.fs.copy(item.src, item.dest);
		});
	}

	writing() {
		const roleRoot = `./${this.props.roleName}`;

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

		this.fs.writeJSON(
			path.join(roleRoot, "package.json"),
			buildPackageJSON(this.props)
		);
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

	end() {
		this.log(
			yosay(
				`All done! Created a new role called ${chalk.red(this.props.roleName)}!`
			)
		);
	}
};
