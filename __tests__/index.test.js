const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");
const fs = require("fs");

// TODO create more generic test helper functions
const assertPaths = paths => {
	for (item of paths) {
		assert.file(item);
	}
};

const assertContent = paths => {
	for (item of paths) {
		for (check of item.contains) {
			assert.fileContent(item.path, check);
		}
	}
};

const defaultPrompts = {
	// BASIC
	roleName: "test",
	description: "Role description",
	license: "MIT",

	// GIT
	gitAuthorName: "John smith",
	gitAuthorEmail: "jsmith.email.com",
	gitIncludeRepoUrl: false,

	// MOLECULE
	includeMolecule: false,

	// META
	includeMeta: false
};

const roleRoot = defaultPrompts.roleName;

describe("index.js", () => {
	describe("Generates a default project", () => {
		beforeEach(() => {
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(defaultPrompts);
		});

		it("Should copy over all files", () => {
			paths = [
				path.join(roleRoot, ".yamllint"),
				path.join(roleRoot, "defaults", "main.yml"),
				path.join(roleRoot, "handlers", "main.yml"),
				path.join(roleRoot, "tasks", "main.yml"),
				path.join(roleRoot, "vars", "main.yml"),
				path.join(roleRoot, "README.md"),
				path.join(roleRoot, "requirements.txt"),
				path.join(roleRoot, "run-test.sh")
			];
			assertPaths(paths);
		});

		it("Should have the correct content for each file", () => {
			paths = [
				{
					path: path.join(roleRoot, "README.md"),
					contains: [
						defaultPrompts.roleName,
						`Author: ${defaultPrompts.gitAuthorName}`,
						`Email: ${defaultPrompts.gitAuthorEmail}`
					]
				},
				{
					// TODO check the permissions of this file if possible
					path: path.join(roleRoot, "run-test.sh"),
					contains: [defaultPrompts.roleName]
				},
				{
					path: path.join(roleRoot, "package.json"),
					contains: [
						defaultPrompts.roleName,
						`"repository": ""`,
						defaultPrompts.description,
						defaultPrompts.gitAuthorName,
						"MIT"
					]
				}
			];
			assertContent(paths);
		});
	});

	describe("Generates a project with a repository url", () => {
		const prompts = {
			...defaultPrompts,
			gitIncludeRepoUrl: true,
			gitRepoUrl: "some-repo.com"
		};

		beforeEach(() => {
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(prompts);
		});

		it("Should add the correct line to the repository key", () => {
			assert.fileContent(
				path.join(roleRoot, "package.json"),
				`"repository": "${prompts.gitRepoUrl}"`
			);
		});
	});

	describe("Generates a project with a molecule", () => {
		const prompts = {
			...defaultPrompts,
			includeMolecule: true,
			includeCircleCi: true
		};

		beforeEach(() => {      
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(prompts);
    });

		it("Should include all molecule files", () => {
			paths = [
				path.join(roleRoot, ".circleci"),
				path.join(roleRoot, "molecule", "default", "Dockerfile.j2"),
				path.join(roleRoot, "molecule", "default", "INSTALL.rst"),
				path.join(roleRoot, "molecule", "default", "molecule.yml"),
				path.join(roleRoot, "molecule", "default", "playbook.yml"),
				path.join(roleRoot, "molecule", "default", "tests", "test_default.pyc"),
				path.join(roleRoot, "molecule", "default", "tests", "test_default.py")
			];
      
			for (item of paths) {
				assert.file(item);
			}
		});

		it("Should have the correct content for each molecule file", () => {
			paths = [
				{
					path: path.join(roleRoot, "molecule", "default", "playbook.yml"),
					contains: [`- role: ${defaultPrompts.roleName}`]
				}
			];
			assertContent(paths);
		});
	});

	describe("Generates a project with a meta folder", () => {
		prompts = { ...defaultPrompts, includeMeta: true, metaCompany: "company" };
		beforeEach(() => {
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(prompts);
		});

		it("Should copy over all meta files", () => {
			paths = [path.join(roleRoot, "meta", "main.yml")];
			assertPaths(paths);
		});

		it("Should have the correct content for each file", () => {
			paths = [
				{
					path: path.join(roleRoot, "meta", "main.yml"),
					contains: [
						`author: ${prompts.gitAuthorName}`,
						`description: ${prompts.description}`,
						`company: ${prompts.metaCompany}`,
						`license: ${prompts.license}`
					]
				}
			];
			assertPaths(paths);
		});
	});
});
