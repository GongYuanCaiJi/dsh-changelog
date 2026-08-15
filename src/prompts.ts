import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The three upstream prompt files, ported verbatim from
// @noice-tech/pi-changelog@1.3.0 (only `.pi/` -> `.dsh/` path refs changed).
// Each prompt file's YAML frontmatter is the Pi command metadata
// (description + argument-hint); the body is what the agent follows when
// the command runs. See THIRD_PARTY_NOTICES.md for the verbatim pin.
export const COMMAND_NAMES = ['release-notes', 'setup-release-notes-style', 'unreleased'] as const;
export type CommandName = (typeof COMMAND_NAMES)[number];

export interface PromptSpec {
  name: CommandName;
  description: string;
  argumentHint: string;
  body: string;
}

/** Parse the `---` frontmatter block; metadata values are unquoted. */
export function parsePromptFrontmatter(text: string): Omit<PromptSpec, 'name'> {
  const lines = text.split('\n');
  if (lines[0]?.trim() !== '---') {
    throw new Error('prompt file must start with a YAML frontmatter block');
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) throw new Error('prompt file frontmatter block never closes');
  const meta: Record<string, string> = {};
  for (let i = 1; i < end; i++) {
    const match = lines[i].match(/^([A-Za-z0-9-]+):\s*(.*)$/);
    if (match) meta[match[1]] = match[2].trim().replace(/^'(.*)'$/, '$1');
  }
  const body = lines.slice(end + 1).join('\n').trimStart();
  return {
    description: meta['description'] ?? '',
    argumentHint: meta['argument-hint'] ?? '',
    body,
  };
}

const PROMPTS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'prompts');

function loadPromptSync(name: CommandName): PromptSpec {
  const text = readFileSync(join(PROMPTS_DIR, `${name}.md`), 'utf8');
  const { description, argumentHint, body } = parsePromptFrontmatter(text);
  return { name, description, argumentHint, body };
}

/** All three ported prompts, loaded once at import (loud failure if missing). */
export const PROMPT_SPECS: PromptSpec[] = COMMAND_NAMES.map(loadPromptSync);

/** Substitute the command's raw input for the upstream `$ARGUMENTS` token. */
export function renderPrompt(spec: PromptSpec, rawInput: string): string {
  return spec.body.replaceAll('$ARGUMENTS', rawInput);
}
