"use strict";

module.exports = {
  rules: {
    "omega-method-prefix": require("./rules/omega-method-prefix"),
  },
  configs: {
    recommended: {
      rules: {
        "omega-methods/omega-method-prefix": "error",
      },
    },
  },
};
