const minimal = {
	name: "test-role",
	version: "1.0.0",
	main: "index.js",
	repository: "",
	description: "test-description",
	author: "John smith",
	license: "MIT",
	dependencies: {},
	scripts: {
		venv: "virtualenv venv",
		"venv-activate": "source venv/bin/activate",
		requirements: "pip install -r requirements.txt"
	}
};

const repoURL = {
	name: "test-role",
	version: "1.0.0",
	main: "index.js",
	repository: "someurl.com",
	description: "test-description",
	author: "John smith",
	license: "MIT",
	dependencies: {},
	scripts: {
		venv: "virtualenv venv",
		"venv-activate": "source venv/bin/activate",
		requirements: "pip install -r requirements.txt"
	}
};

const full = {
	name: "test-role",
	version: "1.0.0",
	main: "index.js",
	repository: "",
	description: "test-description",
	author: "John smith",
	license: "MIT",
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

module.exports = {
	minimal,
	repoURL,
	full
};
