const helper = require("../src/helper");

const pkgTemplate = (props) => ({
  name: props.roleName,
  version: "1.0.0",
  main: "index.js",
  repository: props.gitIncludeRepoUrl ? props.gitRepoUrl : "",
  description: props.description,
  author: props.gitAuthorName,
  license: helper.getLicenseValue(props.license),
  dependencies: {},
  scripts: {
    venv: "virtualenv venv",
    "venv-activate": "source venv/bin/activate",
    requirements: "pip install -r requirements.txt"
  }
});

module.exports = { pkgTemplate };
