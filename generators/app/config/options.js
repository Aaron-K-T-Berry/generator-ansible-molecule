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
