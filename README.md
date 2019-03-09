[![Build Status](https://travis-ci.com/Aaron-K-T-Berry/generator-ansible-molecule.svg?branch=master)](https://travis-ci.com/Aaron-K-T-Berry/generator-ansible-molecule)
[![Coverage Status](https://coveralls.io/repos/github/Aaron-K-T-Berry/generator-ansible-molecule/badge.svg?branch=master&service=github)](https://coveralls.io/github/Aaron-K-T-Berry/generator-ansible-molecule?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/Aaron-K-T-Berry/generator-ansible-molecule/badge.svg)](https://snyk.io/test/github/Aaron-K-T-Berry/generator-ansible-molecule)
[![Greenkeeper badge](https://badges.greenkeeper.io/Aaron-K-T-Berry/generator-ansible-molecule.svg)](https://greenkeeper.io/)

# Generator-Ansible-Molecule

Yeoman generator to create ansible roles with molecule testing framework including optional sample ci cd configs.

### Installation

```
npm i generator-ansible-molecule
```

### Running

```
yo ansible-molecule
```

And follow the prompts to create a new ansible role.

<!-- Some optional arguments available.

| Option               | Description                                          | Type   |
| -------------------- | ---------------------------------------------------- | ------ |
| `role-name`          | name of the role                                     | string |
| `driver-name`        | driver type to use for molecule (Currently not used) | string |
| `prefix-path`        | path from cwd to create the new role                 | string |
| `--include-molecule` | Skip include molecule prompt                         |        |
| `--include-meta`     | Skip include meta prompt                             |        |

-->

### Support

Currently this generator is being tested against the following node versions.

- Node lts

### Contributing

Feel free to post issues, and create prs with an changes, fixes or enhancements.

<!-- TODO [GIT] Look at using in built methods for default values -->
<!-- TODO [MOLECULE] Add more ci cd options aim for all free ones on github marketplace -->
<!-- TODO [MOLECULE] Implement molecule driver opts -->
<!-- TODO [MOLECULE] Add more molecule driver opts -->
<!-- TODO [MOLECULE] Cleanup optional molecule files -->
<!-- TODO [MOLECULE] Add prompts for different driver opts -->
