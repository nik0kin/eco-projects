module.exports = {
  // Type check TypeScript files
  // '**/*.(ts|tsx)': () => 'cd block-pattern-designer && npx tsc --noEmit',

  // Lint & Prettify TS and JS files
  '**/*.(ts|tsx|js)': (filenames) => [
    `npx eslint ${filenames.join(' ')}`,

    `npx prettier --write ${filenames.join(' ')}`,
  ],

  // Prettify only CSS, Markdown and JSON files
  '**/*.(css|md|json)': (filenames) => `npx prettier --write ${filenames.join(' ')}`,
};
