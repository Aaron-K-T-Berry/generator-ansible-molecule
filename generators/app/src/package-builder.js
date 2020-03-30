const { pkgTemplate } = require("../config/package-json");

const buildPackageJSON = (props) => {
  const newTemplate = { ...pkgTemplate(props) };
  if (props.includeMolecule) {
    newTemplate.scripts = {
      ...newTemplate.scripts,
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

  return newTemplate;
};

module.exports = {
  buildPackageJSON
};
