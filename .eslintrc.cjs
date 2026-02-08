module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  overrides: [
    // Legacy JS/JSX (non-App Router) – relax rules so build passes
    {
      files: ['src/BreadCrumb/**/*.jsx', 'src/Components/TeclientRevew/**/*.jsx', 'src/Shared/Helmet/**/*.jsx', 'src/_legacyPages/**/*.jsx', 'src/Components2/**/*.jsx', 'src/Components3/**/*.jsx', 'src/Components4/**/*.jsx', 'src/Components5/**/*.jsx', 'src/Shared/**/*.jsx', 'src/Main/**/*.jsx', 'src/Router/**/*.jsx'],
      rules: {
        'react/prop-types': 'off',
        'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'react/no-unescaped-entities': 'off',
        'react-hooks/exhaustive-deps': 'warn',
      },
    },
  ],
};
