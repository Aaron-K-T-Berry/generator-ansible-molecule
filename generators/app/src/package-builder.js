const getLicenseValue = require("./prompts").getLicenseValue;

const buildPackageJSON = props => {
	let pkgTemplate = {
		name: props.roleName,
		version: "1.0.0",
		main: "index.js",
		repository: props.gitIncludeRepoUrl ? props.gitRepoUrl : "",
		description: props.description,
		author: props.gitAuthorName,
		license: getLicenseValue(props.license),
		dependencies: {},
		scripts: {
			venv: "virtualenv venv",
			"venv-activate": "source venv/bin/activate",
			requirements: "pip install -r requirements.txt"
		}
	};

	if (props.includeMolecule) {
		pkgTemplate.scripts = {
			...pkgTemplate.scripts,
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

	return pkgTemplate;
};

module.exports = {
	buildPackageJSON
};
