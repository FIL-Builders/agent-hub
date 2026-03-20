import distributionIndex from '@site/src/generated/distribution-index.json';

export const DEFAULT_SKILL = 'agent-hub';
export const DEFAULT_VERSION = '0.4.0';

export function resolveSkillContext(rawSkill, rawVersion) {
  const validSkills = new Set(distributionIndex.map((entry) => entry.project));
  const fallbackEntry =
    distributionIndex.find((entry) => entry.project === DEFAULT_SKILL && entry.version === DEFAULT_VERSION) ||
    distributionIndex[0] ||
    null;

  const requestedSkill = rawSkill && validSkills.has(rawSkill) ? rawSkill : fallbackEntry?.project || DEFAULT_SKILL;
  const entriesForSkill = distributionIndex.filter((entry) => entry.project === requestedSkill);
  const validVersions = new Set(entriesForSkill.map((entry) => entry.version));
  const requestedVersion =
    rawVersion && validVersions.has(rawVersion)
      ? rawVersion
      : (entriesForSkill[0]?.version || fallbackEntry?.version || DEFAULT_VERSION);

  const matchedEntry =
    entriesForSkill.find((entry) => entry.version === requestedVersion) ||
    fallbackEntry;

  return {
    skill: requestedSkill,
    version: requestedVersion,
    displayName: matchedEntry?.displayName || matchedEntry?.display_name || requestedSkill,
  };
}

export function buildInstallOptionsUrl(skill, version, hash = '') {
  const suffix = hash ? `#${hash}` : '';
  return `/tutorials/use-agent-hub-claude-compatible-skills?skill=${encodeURIComponent(skill)}&version=${encodeURIComponent(version)}${suffix}`;
}

export function buildInstallPrompt(skill, version, displayName) {
  return `I want you to install the Agent Hub Claude skill for ${displayName} (${skill} v${version}) in this local environment.

Use the fastest available path:
1. If the \`agent-hub\` CLI is available, run:
   agent-hub install-skill ${skill} --version ${version} --project
2. Otherwise, if this Agent Hub repo is available locally, run:
   npm run install:claude-skill -- ${skill} --version ${version} --project
3. Otherwise, download the generated bundle for ${skill} v${version} and install it manually into:
   .claude/skills/${skill}/
   Make sure \`SKILL.md\` is at the top level of that folder.

After installing:
- verify that .claude/skills/${skill}/SKILL.md exists
- verify the references files are present
- tell me exactly what you changed
- if you could not complete the install, give me the exact manual steps for this environment`;
}
