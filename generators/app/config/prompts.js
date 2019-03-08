const gitConfig = require("git-config");
var gitConfigs = gitConfig.sync();
const licenses = require("../config/licenses").licenses;

const prompts = options => {
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
			message:
				"What is your email (Will be used in  the meta file and package.json)?"
		}
	];

	// MOLECULE
	const moleculePrompts = [
		{
			when: options["include-molecule"] === undefined,
			type: "confirm",
			name: "includeMolecule",
			message: "Would you like to include the molecule testing boilerplate?",
			default: false
		},
		{
			when: response => {
				return (
					response.includeMolecule || options["include-molecule"] !== undefined
				);
			},
			type: "confirm",
			name: "includeCircleCi",
			message:
				"Would you like to include a basic circle ci config for molecule?",
			default: true
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
	prompts
};
