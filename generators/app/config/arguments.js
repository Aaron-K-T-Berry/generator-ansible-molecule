const args = [
  {
    name: "path-prefix",
    options: {
      type: String,
      alias: "path",
      desc: "path to prefix to add to all files paths generated by the generator",
      required: false
    }
  }
];

module.exports = { args };
