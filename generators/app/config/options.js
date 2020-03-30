const options = [
  {
    name: "role-name",
    options: {
      type: String,
      description: "Name of the new role to be created"
    },
    propName: "roleName"
  },
  {
    name: "driver-name",
    options: {
      type: String,
      description:
        "Name of the driver to be used for molecule [azure|delegated|docker|ec2|gce|lxc|lxd|openstack|vagrant]"
    },
    propName: "moleculeDriver"
  },
  {
    name: "include-molecule",
    options: {
      type: Boolean,
      description: "Skip the include molecule prompt"
    },
    propName: "includeMolecule"
  },
  {
    name: "include-meta",
    options: {
      type: Boolean,
      description: "Skip the include meta prompt"
    },
    propName: "includeMeta"
  }
];

module.exports = { options };
