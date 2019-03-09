const gitConfig = require("git-config");
var gitConfigs = gitConfig.sync();
const licenses = require("../config/licenses").licenses;
const providers = require("../config/ci-providers").providers;

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

const promptBuilder = options => {
	// BASIC
	const basicQuestionsPrompts = [
		{
			when: options["role-name"] === undefined,
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

	// GIT
	const gitCredentialsPrompts = [
		{
			type: "text",
			name: "gitAuthorName",
			message:
				"What is your name (Will be used in  the meta file and package.json)?",
			default: gitConfigs.user.name
		},
		{
			type: "text",
			name: "gitAuthorEmail",
			message:
				"What is your email (Will be used in  the meta file and package.json)?",
			default: gitConfigs.user.email
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
			message: "Url of repo?"
		}
	];

	// MOLECULE
	const moleculePrompts = [
		{
			when: options["include-molecule"] === undefined,
			type: "confirm",
			name: "includeMolecule",
			message: "Would you like to include the molecule testing boilerplate?",
			default: true
		},
		{
			when: response => {
				return response.includeMolecule || options["driver-name"];
			},
			type: "list",
			name: "moleculeDriver",
			message: "What driver would you like molecule to use?",
			default: "docker",
			choices: [
				"azure",
				"delegated",
				"docker",
				"ec2",
				"gce",
				"lxc",
				"lxd",
				"openstack",
				"vagrant"
			]
		},
		{
			when: response => {
				return response.includeMolecule || options["include-molecule"];
			},
			type: "confirm",
			name: "includeCi",
			message: "Would you like to include a basic ci config?",
			default: true
		},
		{
			when: response => {
				return response.includeCi;
			},
			type: "list",
			name: "ciProvider",
			message: "What ci config would you like to use?",
			choices: providers.map(provider => provider.name)
		}
	];

	// META
	const metaPrompts = [
		{
			when: options["include-meta"] === undefined,
			type: "confirm",
			name: "includeMeta",
			message: "Would you like to include the meta folder?",
			default: false
		},
		{
			when: response => {
				return response.includeMeta || options["include-meta"];
			},
			type: "text",
			name: "metaCompany",
			message: "What is the company for this role?"
		}
	];

	return [
		...basicQuestionsPrompts,
		...gitCredentialsPrompts,
		...moleculePrompts,
		...metaPrompts
	];
};

module.exports = {
	licenses,
	getLicenseValue,
	promptBuilder
};
