import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  COMMAND_NAMES,
  PROMPT_SPECS,
  parsePromptFrontmatter,
  renderPrompt,
} from '../dist/prompts.js';
import { deliverPrompt, PLUGIN_SOURCE, registerChangelogCommands } from '../dist/index.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// ---------- seam: prompt files are the ported artifact ----------

test('all three upstream prompt files ship with no .pi/ refs left', () => {
  for (const name of COMMAND_NAMES) {
    const text = readFileSync(join(ROOT, 'prompts', `${name}.md`), 'utf8');
    assert.equal(text.includes('.pi/'), false, `${name}.md still references .pi/`);
  }
});

test('path refs were rewritten .pi/ -> .dsh/ exactly', () => {
  const releaseNotes = readFileSync(join(ROOT, 'prompts', 'release-notes.md'), 'utf8');
  assert.ok(releaseNotes.includes('.dsh/tmp/pi-changelog/release-notes-sources/<slug>.md'));
  assert.ok(releaseNotes.includes('.dsh/release-notes-style.md'));
  const style = readFileSync(join(ROOT, 'prompts', 'setup-release-notes-style.md'), 'utf8');
  assert.ok(style.includes('.dsh/release-notes-style.md'));
});

test('frontmatter parses to the upstream command metadata', () => {
  const releaseNotes = PROMPT_SPECS.find((spec) => spec.name === 'release-notes');
  assert.ok(releaseNotes);
  assert.equal(releaseNotes.description, 'generate public release notes/social copy from a GitHub release or release range');
  assert.equal(releaseNotes.argumentHint, '<version | from..to>');

  const style = PROMPT_SPECS.find((spec) => spec.name === 'setup-release-notes-style');
  assert.ok(style);
  assert.equal(style.description, 'create or refine repo-specific release notes voice and formatting guidance');
  assert.equal(style.argumentHint, '[product/audience/channel notes]');

  const unreleased = PROMPT_SPECS.find((spec) => spec.name === 'unreleased');
  assert.ok(unreleased);
  assert.equal(unreleased.description, 'preview unreleased changelog candidates since the latest git tag');
  assert.equal(unreleased.argumentHint, '');
});

test('frontmatter block is not delivered as prompt content', () => {
  const spec = PROMPT_SPECS.find((candidate) => candidate.name === 'release-notes');
  assert.ok(spec);
  assert.equal(spec.body.includes('description:'), false);
  assert.equal(spec.body.includes('argument-hint:'), false);
  assert.ok(spec.body.includes('Generate public release notes'));
});

// ---------- seam: $ARGUMENTS substitution ----------

test('$ARGUMENTS is replaced with the raw command input', () => {
  const spec = PROMPT_SPECS.find((candidate) => candidate.name === 'release-notes');
  assert.ok(spec);
  const rendered = renderPrompt(spec, '1.2.3');
  assert.equal(rendered.includes('$ARGUMENTS'), false);
  assert.ok(rendered.includes('`1.2.3`'));
});

test('empty raw input substitutes to an empty token', () => {
  const spec = PROMPT_SPECS.find((candidate) => candidate.name === 'unreleased');
  assert.ok(spec);
  const rendered = renderPrompt(spec, '');
  assert.equal(rendered.includes('$ARGUMENTS'), false);
});

test('unrecognized frontmatter shape fails loudly', () => {
  assert.throws(() => parsePromptFrontmatter('no frontmatter here'), /frontmatter/);
});

// ---------- seam: command registration metadata ----------

test('exactly the three upstream commands are registered with metadata', () => {
  const registered = [];
  registerChangelogCommands({
    register(definition) {
      registered.push(definition);
    },
  });
  assert.deepEqual(
    registered.map((definition) => definition.name),
    ['release-notes', 'setup-release-notes-style', 'unreleased'],
  );
  const releaseNotes = registered.find((definition) => definition.name === 'release-notes');
  assert.equal(releaseNotes.description, 'generate public release notes/social copy from a GitHub release or release range');
  assert.equal(releaseNotes.input.hint, '<version | from..to>');
  const unreleased = registered.find((definition) => definition.name === 'unreleased');
  assert.equal(unreleased.input, undefined);
});

// ---------- seam: handler delivers the rendered prompt to the agent ----------

function stubInvocation(rawInput) {
  const delivered = [];
  const agent = {
    followup(message) {
      delivered.push(message);
    },
  };
  return {
    agent,
    delivered,
    invocation: {
      agent,
      commandId: 'test-command',
      rawInput,
      signal: new AbortController().signal,
    },
  };
}

test('handler delivers the rendered prompt body to the agent via followup', async () => {
  const { delivered, invocation } = stubInvocation('2.0.0');
  const result = await deliverPrompt(invocation, 'release-notes', invocation.rawInput);
  assert.equal(result.kind, 'success');
  assert.equal(delivered.length, 1);
  const message = delivered[0];
  assert.deepEqual(message.source, PLUGIN_SOURCE);
  const text = message.content[0].text;
  // The prompt body is present (not the raw input alone) ...
  assert.ok(text.includes('Generate public release notes'));
  // ... and the raw input was substituted for $ARGUMENTS (not forgotten).
  assert.ok(text.includes('`2.0.0`'));
});

test('handler delivers the unreleased prompt without an argument', async () => {
  const { delivered, invocation } = stubInvocation('');
  const result = await deliverPrompt(invocation, 'unreleased', invocation.rawInput);
  assert.equal(result.kind, 'success');
  assert.equal(delivered.length, 1);
  assert.ok(delivered[0].content[0].text.includes('Preview what would go into a new release'));
});

test('unknown command name returns an error result and delivers nothing', async () => {
  const { delivered, invocation } = stubInvocation('x');
  const result = await deliverPrompt(invocation, 'does-not-exist', invocation.rawInput);
  assert.equal(result.kind, 'error');
  assert.equal(delivered.length, 0);
});
