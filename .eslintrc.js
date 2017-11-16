module.exports = {
    "parser": "babel-eslint",
    "env": {
      "browser": true,
      "node": true,
      "mocha": true
    },
    "extends": "airbnb",
    "rules": {
      "react/jsx-no-target-blank": 0,
      "react/no-unescaped-entities": 0,
      "import/no-unresolved": 0,
      "import/no-extraneous-dependencies": 0,
      "react/no-array-index-key": 0,
      "import/prefer-default-export": 0,
      "import/extensions": 0,
      "jsx-a11y/label-has-for": 0,
      "guard-for-in": ["warn"],
      "no-restricted-syntax": ["warn"],
      "object-curly-newline": ["off"],
      "padded-blocks": ["off"],
      "react/jsx-closing-bracket-location": ["off"],
      "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
      "react/jsx-space-before-closing": ["off"],
      "react/prefer-stateless-function": ["off"],
      "no-underscore-dangle": ["error", { "allowAfterThis": true }],
      "react/jsx-no-bind": 0,
      "react/no-multi-comp": 0,
      "no-plusplus": 0,
      "no-shadow": 0,
      "react/sort-comp": ["warn"],
      "class-methods-use-this": ["warn"],
      "linebreak-style": 0,
      "function-paren-newline": ["off"],
      "jsx-a11y/click-events-have-key-events": ["off"],
      "jsx-a11y/no-static-element-interactions": ["off"],
      "jsx-a11y/no-noninteractive-element-interactions": ["off"],
      "jsx-a11y/anchor-is-valid": ["off"],
      "import/no-named-as-default": ["off"]
    },
    "globals": {
      "testHelper": true,
      "memoryDB": true
    }
};