const FRONTMATTER_BOUNDARY = '---';

function countIndent(line) {
  return (line.match(/^\s*/)?.[0] || '').length;
}

function stripQuotes(value) {
  let next = (value || '').trim();
  if ((next.startsWith('"') && next.endsWith('"')) || (next.startsWith("'") && next.endsWith("'"))) {
    next = next.slice(1, -1);
  }
  return next;
}

export function stripSpecExtension(filename = '') {
  return filename.replace(/\.md$/i, '');
}

export function splitFrontmatter(specText = '') {
  if (!specText.startsWith(`${FRONTMATTER_BOUNDARY}\n`)) {
    return { frontmatter: '', body: specText };
  }

  const closing = specText.indexOf(`\n${FRONTMATTER_BOUNDARY}\n`, FRONTMATTER_BOUNDARY.length + 1);
  if (closing === -1) {
    return { frontmatter: '', body: specText };
  }

  return {
    frontmatter: specText.slice(FRONTMATTER_BOUNDARY.length + 1, closing),
    body: specText.slice(closing + `\n${FRONTMATTER_BOUNDARY}\n`.length),
  };
}

function extractMetaLines(specText = '') {
  const { frontmatter } = splitFrontmatter(specText);
  const source = frontmatter || specText;
  const lines = source.split('\n');
  const idx = lines.findIndex((line) => /^\s*meta:\s*$/.test(line));

  if (idx === -1) {
    return [];
  }

  const metaIndent = countIndent(lines[idx]);
  const metaLines = [];

  for (let i = idx + 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim() === '') {
      metaLines.push(line);
      continue;
    }

    const indent = countIndent(line);
    if (indent <= metaIndent) {
      break;
    }

    metaLines.push(line);
  }

  return metaLines;
}

function readScalar(metaLines, key) {
  const re = new RegExp(`^\\s*${key}\\s*:\\s*(.*)$`);
  for (const line of metaLines) {
    const match = line.match(re);
    if (match) {
      return stripQuotes(match[1] || '');
    }
  }
  return '';
}

function readBlockScalar(metaLines, key) {
  for (let i = 0; i < metaLines.length; i += 1) {
    const line = metaLines[i];
    const match = line.match(new RegExp(`^\\s*${key}\\s*:\\s*(.*)$`));
    if (!match) {
      continue;
    }

    const suffix = (match[1] || '').trim();
    const baseIndent = countIndent(line);
    if (suffix && suffix !== '|' && suffix !== '>') {
      return stripQuotes(suffix);
    }

    const block = [];
    for (let j = i + 1; j < metaLines.length; j += 1) {
      const nextLine = metaLines[j];
      const indent = countIndent(nextLine);
      if (nextLine.trim() && indent <= baseIndent) {
        break;
      }
      if (!nextLine.trim()) {
        block.push('');
        continue;
      }
      block.push(nextLine.slice(baseIndent + 2));
    }

    return (suffix === '|' ? block.join('\n') : block.join(' ')).trim();
  }

  return '';
}

export function parseAgentMeta(specText = '') {
  try {
    const metaLines = extractMetaLines(specText);
    if (metaLines.length) {
      const specName = readScalar(metaLines, 'spec_name') || readScalar(metaLines, 'library_name');
      const language = readScalar(metaLines, 'language').toLowerCase();
      const purpose = readBlockScalar(metaLines, 'purpose');

      return { specName, language, purpose };
    }

    const lines = specText.split('\n');
    const title = lines[0]?.match(/^#\s+(.+)$/)?.[1]?.trim() || '';
    const snapshotLines = getH2SectionLines(lines, 'Snapshot');
    const purposeLines = getH2SectionLines(lines, 'Purpose');
    const snapshotMap = new Map();

    snapshotLines.forEach((line) => {
      const match = line.match(/^-\s+([^:]+):\s+(.+)$/);
      if (match) {
        snapshotMap.set(match[1].trim(), match[2].trim());
      }
    });

    const specName = snapshotMap.get('Spec name') || title;
    const language = (snapshotMap.get('Primary language') || '').toLowerCase();
    const purpose = purposeLines.join(' ').replace(/\s+/g, ' ').trim();

    return { specName, language, purpose };
  } catch {
    return {};
  }
}

function getH2SectionLines(lines, sectionTitle) {
  const start = lines.findIndex((line) => line.trim() === `## ${sectionTitle}`);
  if (start === -1) {
    return [];
  }

  const collected = [];
  for (let i = start + 1; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) {
      break;
    }
    collected.push(lines[i]);
  }

  while (collected.length && !collected[0].trim()) {
    collected.shift();
  }
  while (collected.length && !collected[collected.length - 1].trim()) {
    collected.pop();
  }

  return collected;
}
