const path = require("path");
const helpers = require("yeoman-test");
const assert = require("yeoman-assert");
const fs = require("fs");

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
		it("Should copy over all files", () => {
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(defaultPrompts)
				.then(() => {
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
		});

		it("Should have the correct content for each file", () => {
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(defaultPrompts)
				.then(() => {
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
	});

	describe("Generates a project with a repository url", () => {
		it("Should add the correct line to the repository key", () => {
			const prompts = {
				...defaultPrompts,
				gitIncludeRepoUrl: true,
				gitRepoUrl: "some-repo.com"
			};
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(prompts)
				.then(() => {
					assert.fileContent(
						path.join(roleRoot, "package.json"),
						`"repository": "${prompts.gitRepoUrl}"`
					);
				});
		});
	});

	describe("Generates a project with a molecule", () => {
		it("Should include all molecule files", () => {
			const prompts = {
				...defaultPrompts,
				includeMolecule: true,
				includeCi: true,
				ciProvider: "circleCi"
			};
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(prompts)
				.then(() => {
					paths = [
						path.join(roleRoot, ".circleci"),
						path.join(roleRoot, "molecule", "default", "Dockerfile.j2"),
						path.join(roleRoot, "molecule", "default", "INSTALL.rst"),
						path.join(roleRoot, "molecule", "default", "molecule.yml"),
						path.join(roleRoot, "molecule", "default", "playbook.yml"),
						path.join(
							roleRoot,
							"molecule",
							"default",
							"tests",
							"test_default.pyc"
						),
						path.join(
							roleRoot,
							"molecule",
							"default",
							"tests",
							"test_default.py"
						)
					];
					assertPaths(paths);
				});
		});

		it("Should have the correct content for each molecule file", () => {
			const prompts = {
				...defaultPrompts,
				includeMolecule: true,
				includeCi: true,
				ciProvider: "circleCi"
			};
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(prompts)
				.then(() => {
					paths = [
						{
							path: path.join(roleRoot, "molecule", "default", "playbook.yml"),
							contains: [`- role: ${defaultPrompts.roleName}`]
						}
					];
					assertContent(paths);
				});
		});

		describe("Generate a role with the correct ci provider", () => {
			it("Should include a ci file for circleci", () => {
				const prompts = {
					...defaultPrompts,
					includeMolecule: true,
					includeCi: true,
					ciProvider: "circleCi"
				};

				return helpers
					.run(path.join(__dirname, "../generators/app"))
					.withPrompts(prompts)
					.then(() => {
						paths = [path.join(roleRoot, ".circleci", "config.yml")];
						assertPaths(paths);
					});
			});
			it("Should include a ci file for travis", () => {
				const prompts = {
					...defaultPrompts,
					includeMolecule: true,
					includeCi: true,
					ciProvider: "travis"
				};

				return helpers
					.run(path.join(__dirname, "../generators/app"))
					.withPrompts(prompts)
					.then(() => {
            paths = [path.join(roleRoot, ".travis.yml")];
            expect(fs.lstatSync(path.join(roleRoot, ".travis.yml")).isFile()).toBeTruthy()            
          });
			});
		});
	});

	describe("Generates a project with a meta folder", () => {
		it("Should copy over all meta files", () => {
			const prompts = {
				...defaultPrompts,
				includeMeta: true,
				metaCompany: "company"
			};

			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(prompts)
				.then(() => {
					paths = [path.join(roleRoot, "meta", "main.yml")];
					assertPaths(paths);
				});
		});

		it("Should have the correct content for each file", () => {
			const prompts = {
				...defaultPrompts,
				includeMeta: true,
				metaCompany: "company"
			};
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(prompts)
				.then(() => {
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
					assertContent(paths);
				});
		});
	});

	describe("Generate a project using options and arguments", () => {
		it("Generates a project with the correct files", () => {
			const prompts = {
				...defaultPrompts,
				includeCi: true,
				ciProvider: "circleCi"
			};

			opts = {
				"role-name": "test1234",
        "include-molecule": true,
        "driver-name": "docker",
				"include-meta": true
			};
			args = ["./testDir"];
			return helpers
				.run(path.join(__dirname, "../generators/app"))
				.withPrompts(prompts)
				.withOptions(opts)
				.withArguments(args)
				.then(() => {
					const prefix = path.join(`./`, args[0], opts["role-name"]);
					paths = [
						path.join(prefix, ".circleci"),
						path.join(prefix, "molecule", "default", "Dockerfile.j2"),
						path.join(prefix, "molecule", "default", "INSTALL.rst"),
						path.join(prefix, "molecule", "default", "molecule.yml"),
						path.join(prefix, "molecule", "default", "playbook.yml"),
						path.join(prefix, "molecule/default/tests", "test_default.pyc"),
						path.join(prefix, "molecule/default/tests", "test_default.py"),
						path.join(prefix, "meta", "main.yml")
					];
					assertPaths(paths);
				});

			// TODO check content of files
		});
	});
});
