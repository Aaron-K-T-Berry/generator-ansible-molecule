const builder = require("../generators/app/src/package-builder");
const pkgExamples = require("./__data__/pkg-examples");

describe("package-builder.js", () => {
	describe("buildPackageJSON", () => {
		const defaultProps = {
			roleName: "test-role",
			description: "test-description",
			gitAuthorName: "John smith",
			license: "MIT"
		};
		const optionalProps = {
			gitIncludeRepoUrl: undefined,
			gitRepoUrl: undefined,
      includeMolecule: undefined,
		};

		it("Should return a minimum package.json", () => {
			const props = { ...defaultProps };
			const pkg = builder.buildPackageJSON(props);
			expect(pkg).toEqual(pkgExamples.minimal);
		});

		it("Should return a minimal package.json with repository url (gitIncludeRepoUrl defined)", () => {
			const props = {
				...defaultProps,
				gitIncludeRepoUrl: true,
				gitRepoUrl: "someurl.com"
			};
			const pkg = builder.buildPackageJSON(props);
			expect(pkg).toEqual(pkgExamples.repoURL);
    });
    
    it("Should return a full package.json with all molecule scripts (includeMolecule defined)", () => {
			const props = {
				...defaultProps,
				includeMolecule: true,
			};
      const pkg = builder.buildPackageJSON(props);      
			expect(pkg).toEqual(pkgExamples.full);
		});
	});
});
