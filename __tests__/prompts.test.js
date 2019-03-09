const prompts = require("../generators/app/src/prompts");

describe("prompts.js", () => {
	describe("getLicenseValue", () => {
		it("Should return the value for a given name", () => {
			const name = prompts.licenses[0].name;
			const expectedValue = prompts.licenses[0].value;
			expect(prompts.getLicenseValue(name)).toEqual(expectedValue);
		});

		it("Should return nothing when name unknown", () => {
			const name = "unknown";
			expect(prompts.getLicenseValue(name)).toBeUndefined();
		});
	});

	describe("promptBuilder", () => {
		const options = {
			"role-name": undefined,
			"include-molecule": undefined,
			"include-meta": undefined
		};

		describe("basicQuestionsPrompts options", () => {
			describe("role-name", () => {
				it("defined", () => {
					expect.assertions(2);
					const opts = { ...options, "role-name": "defined" };
					const prom = prompts.promptBuilder(opts);

					expect(prom[0].name).toEqual("roleName");
					expect(prom[0].when).toBeFalsy();
				});

				it("undefined", () => {
					expect.assertions(2);
					const opts = { ...options };
					const prom = prompts.promptBuilder(opts);

					expect(prom[0].name).toEqual("roleName");
					expect(prom[0].when).toBeTruthy();
				});
			});
		});

		describe("gitCredentialsPrompts options", () => {
			describe("gitIncludeRepoUrl", () => {
				it("true", () => {
					response = { gitIncludeRepoUrl: true };
					const prom = prompts.promptBuilder(options);
					expect(prom[6].when(response)).toEqual(response.gitIncludeRepoUrl);
				});

				it("false", () => {
					response = { gitIncludeRepoUrl: false };
					const prom = prompts.promptBuilder(options);
					expect(prom[6].when(response)).toEqual(response.gitIncludeRepoUrl);
				});
			});
		});

		describe("moleculePrompts options", () => {
      describe("include-molecule", () => {
				it("defined", () => {
					expect.assertions(2);
					const opts = { ...options, "include-molecule": "defined" };
					const prom = prompts.promptBuilder(opts);

					expect(prom[7].name).toEqual("includeMolecule");
					expect(prom[7].when).toBeFalsy();
				});
				it("undefined", () => {
					expect.assertions(2);
					const opts = { ...options };
					const prom = prompts.promptBuilder(opts);

					expect(prom[7].name).toEqual("includeMolecule");
					expect(prom[7].when).toBeTruthy();
				});
      });

			it("include-molecule defined   | includeMolecule true", () => {
				const response = { includeMolecule: true };
				const opts = { ...options, "include-molecule": "defined" };
				const prom = prompts(opts);
				expect(prom[9].when(response)).toBeTruthy();
			});

			it("include-molecule defined   | includeMolecule false", () => {
				const response = { includeMolecule: false };
				const opts = { ...options, "include-molecule": "defined" };
        const prom = prompts(opts);        
				expect(prom[9].when(response)).toBeTruthy();
			});

			it("include-molecule undefined | includeMolecule true", () => {
				const response = { includeMolecule: true };
				const opts = { ...options };
				const prom = prompts(opts);
				expect(prom[9].when(response)).toBeTruthy();
			});

			it("include-molecule undefined | includeMolecule false", () => {
				const response = { includeMolecule: false };
				const opts = { ...options };
				const prom = prompts(opts);
				expect(prom[9].when(response)).toBeFalsy();
			});
		});

		describe("metaPrompts options", () => {
      describe("include-meta", () => {
				it("defined", () => {
					expect.assertions(2);
					const opts = { ...options, "include-meta": "defined" };
					const prom = prompts(opts);
					expect(prom[11].name).toEqual("includeMeta");
					expect(prom[11].when).toBeFalsy();
				});
				it("undefined", () => {
					expect.assertions(2);
					const opts = { ...options };
					const prom = prompts.promptBuilder(opts);

					expect(prom[11].name).toEqual("includeMeta");
					expect(prom[11].when).toBeTruthy();
				});
      });
    
      it("include-meta defined   | includeMeta true", () => {
				const opts = { ...options, "include-meta": "defined" };
        const prom = prompts(opts);        
				expect(prom[11]).toBeTruthy();
			});

			it("include-meta defined   | includeMeta false", () => {
				const opts = { ...options, "include-meta": "defined" };
				const prom = prompts(opts);
				expect(prom[11]).toBeTruthy();
			});

			it("include-meta undefined | includeMeta true", () => {
				const opts = { ...options };
				const prom = prompts(opts);
				expect(prom[11]).toBeTruthy();
			});

			it("include-meta undefined | includeMeta false", () => {
				const opts = { ...options };
        const prom = prompts(opts);        
				expect(prom[11]).toBeTruthy();
			});
		});
	});
});
