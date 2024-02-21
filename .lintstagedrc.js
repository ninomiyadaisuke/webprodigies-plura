const path = require('path');

// ESLint コマンドを構築する関数
const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`;

module.exports = {
  // 秘密情報が含まれる可能性のある特定のファイルタイプに secretlint を適用
  '*.env': ['secretlint --maskSecrets'],
  // Prettier を適用するファイルタイプを指定
  '*.{js,cjs,mjs,json,ts,tsx,css}': ['prettier --write'],
  // TypeScript ファイルに対して tsc と ESLint を実行
  '*.{ts,tsx}': [() => 'tsc --noEmit', buildEslintCommand, 'markuplint'],
};
