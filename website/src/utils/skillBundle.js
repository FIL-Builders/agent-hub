export function buildSkillBundleUrl(project, version, file = 'SKILL.md') {
  return `/distributions/claude/${project}/${version}/${file}`;
}

export function buildSkillManifestUrl(project, version) {
  return buildSkillBundleUrl(project, version, 'manifest.json');
}

export function normalizeSkillFile(file = '') {
  return file.replace(/^\/+/, '');
}

export function isMarkdownFile(file = '') {
  return /\.md$/i.test(file);
}

export function isJsonFile(file = '') {
  return /\.json$/i.test(file);
}
