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

Some options and arguments available.

| Arguments     | Description                          | Type   |
| ------------- | ------------------------------------ | ------ |
| `prefix-path` | path from cwd to create the new role | string |

| Options              | Description                  | Type    |
| -------------------- | ---------------------------- | ------- |
| `--role-name`        | Skip role name prompt        | string  |
| `--driver-name`      | driver to use for molecule   | string  |
| `--include-molecule` | Skip include molecule prompt | boolean |
| `--include-meta`     | Skip include meta prompt     | boolean |
   
### Support

Currently this generator is being tested against the following node versions.

- Node lts

### Contributing

Feel free to post issues, and create prs with an changes, fixes or enhancements.

<!-- TODO [CI-CD] Generate an role and test it with ansible for release builds -->