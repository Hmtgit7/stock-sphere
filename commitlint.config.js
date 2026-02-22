/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // Enforce conventional commit types
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'style', // Code style / formatting (no logic change)
        'refactor', // Code refactoring
        'perf', // Performance improvement
        'test', // Adding or updating tests
        'build', // Build system or dependency changes
        'ci', // CI/CD changes
        'chore', // Maintenance tasks
        'revert', // Revert a previous commit
        'wip', // Work in progress (use sparingly)
      ],
    ],

    // Subject rules
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-max-length': [2, 'always', 100],
    'subject-min-length': [2, 'always', 3],

    // Header rules
    'header-max-length': [2, 'always', 120],

    // Body rules
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 200],

    // Footer rules
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 200],

    // Scope rules
    'scope-case': [2, 'always', 'lower-case'],

    // Type rules
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  },

  // Custom prompt messages
  prompt: {
    messages: {
      type: "Select the type of change you're committing:",
      scope: 'What is the scope of this change (e.g. component, service)?',
      subject: 'Write a short, imperative mood description of the change:\n',
      body: 'Provide a longer description of the change (optional). Use "|" to break new lines:\n',
      breaking: 'List any BREAKING CHANGES (optional):\n',
      footer: 'List any issues closed by this change (e.g. #123, #456) (optional):\n',
      confirmCommit: 'Are you sure you want to proceed with the commit above?',
    },
  },
};
