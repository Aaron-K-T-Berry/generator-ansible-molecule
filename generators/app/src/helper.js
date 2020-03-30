const { licenses } = require("../config/licenses");
const { args } = require("../config/arguments");
const opts = require("../config/options").options;

const getLicenseValue = (name) => {
  for (const item of licenses) {
    if (item.name === name) {
      return item.value;
    }
  }
};

const generateOptions = (generator) => {
  for (arg of args) {
    generator.argument(arg.name, arg.options);
  }
  for (option of opts) {
    generator.option(option.name, option.options);
  }
};

module.exports = {
  getLicenseValue,
  generateOptions
};
