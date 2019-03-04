"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const mkdirp = require("mkdirp");
const path = require("path");
const _ = require("lodash");
const exec = require("child_process").exec;
const promptBuilder = require("./src/prompts").promptBuilder;
const getLicenseValue = require("./src/prompts").getLicenseValue;
const buildPackageJSON = require("./src/package-builder").buildPackageJSON;

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
		this.argument("role-name", {
			type: String,
			alias: "name",
			desc: "Name of the role",
			required: false
		});
		this.argument("driver-name", {
			type: String,
			alias: "driver",
			desc: "Driver to use for this role",
			required: false
		});
		this.argument("prefix-path", {
			type: String,
			alias: "path",
			desc:
				"Path to prefix onto the install location of the created ansible role",
			required: false
		});
		this.option("include-molecule");
		this.option("include-meta");
	}

	initializing() {}

	prompting() {
		this.log(
			yosay(
				`Welcome to the groundbreaking ${chalk.red(
					"ansible-molecule"
				)} generator!`
			)
		);

		return this.prompt(promptBuilder(this.options)).then(props => {
			this.props = props;
		});
	}

	configuring() {
		// Setting arguments into props
		if (this.options["role-name"] !== undefined)
			this.props["roleName"] = this.options["role-name"];

		// Setting options into props
		if (this.options["include-molecule"])
			this.props.includeMolecule = this.options["include-molecule"];
		if (this.options["include-meta"])
      this.props.includeMeta = this.options["include-meta"];

		if (this.options["prefix-path"] !== undefined) {
			try {
				this.props.roleRoot = path.join(this.options["prefix-path"], this.props.roleName);
			} catch (err) {
				if (this.options.debug) this.log(err);
				this.log(
					"Error encountered trying to parse prefix argument, defaulting too no prefix"
				);
				this.props.roleRoot = path.join(this.props.roleName);
			}
		} else {
			this.props.roleRoot = path.join(this.props.roleName);
		}

		const roleRoot = this.props.roleRoot;

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
		const roleRoot = this.props.roleRoot;

		const filePaths = [
			{
				mkPath: roleRoot,
				src: this.templatePath("root-files"),
				dest: roleRoot
			},
			{
				src: this.templatePath("root-files/.**"),
				dest: roleRoot
			},
			{
				mkPath: path.join(roleRoot, "defaults"),
				src: this.templatePath("defaults"),
				dest: path.join(roleRoot, "defaults")
			},
			{
				mkPath: path.join(roleRoot, "defaults"),
				src: this.templatePath("handlers"),
				dest: path.join(roleRoot, "handlers")
			},
			{
				mkPath: path.join(roleRoot, "defaults"),
				src: this.templatePath("tasks"),
				dest: path.join(roleRoot, "tasks")
			},
			{
				mkPath: path.join(roleRoot, "defaults"),
				src: this.templatePath("vars"),
				dest: path.join(roleRoot, "vars")
			}
		];

		// Copying file paths
		filePaths.forEach(item => {
			if (item.mkPath !== undefined) mkdirp.sync(item.mkPath);
			this.fs.copy(item.src, item.dest);
		});
	}

	writing() {
		const roleRoot = this.props.roleRoot;

		const templates = [
			{
				when: this.props.includeMolecule,
				mkPath: path.join(roleRoot, "molecule/default/tests"),
				tmpPath: this.templatePath("molecule/default/playbook.yml"),
				dest: path.join(roleRoot, "molecule/default/playbook.yml"),
				data: { roleName: this.props.roleName }
			},
			{
				tmpPath: this.templatePath("root-files/README.md"),
				dest: path.join(roleRoot, "README.md"),
				data: {
					roleName: this.props.roleName,
					authorName: this.props.gitAuthorName,
					authorEmail: this.props.gitAuthorEmail
				}
			},
			{
				tmpPath: this.templatePath("root-files/run-test.sh"),
				dest: path.join(roleRoot, "run-test.sh"),
				data: {
					roleName: this.props.roleName
				}
			},
			{
				when: this.props.includeMeta,
				tmpPath: this.templatePath("meta/main.yml"),
				dest: path.join(roleRoot, "meta/main.yml"),
				data: {
					authorName: this.props.gitAuthorName,
					description: this.props.description,
					metaCompany: this.props.metaCompany,
					metaLicence: getLicenseValue(this.props.license)
				}
			}
		];

		// Pre template tasks
		// MOLECULE
		if (this.props.includeMolecule) {
			this.fs.copy(
				this.templatePath("molecule"),
				path.join(roleRoot, "molecule")
			);
		}

		// Process templates
		templates.forEach(item => {
			if (item.when || item.when === undefined) {
				if (item.mkPath !== undefined) mkdirp.sync(item.mkPath);
				const template = _.template(this.fs.read(item.tmpPath));
				this.fs.write(item.dest, template(item.data));
			}
		});

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
