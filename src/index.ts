import type { CommandInvocation, CommandResult } from '@deepseek-ai/dsh-commands';
import { createUserMessage } from '@deepseek-ai/dsh-llm';
import type { Context } from '@deepseek-ai/cordis';
import { PROMPT_SPECS, renderPrompt, type CommandName } from './prompts.js';

export const name = 'dsh-changelog';

export const PLUGIN_SOURCE = { kind: 'plugin', plugin: name } as const;

/** Deliver one ported prompt to the agent as a follow-up user message. */
export function deliverPrompt(invocation: CommandInvocation, commandName: CommandName, rawInput: string): CommandResult {
  const spec = PROMPT_SPECS.find((candidate) => candidate.name === commandName);
  if (spec === undefined) {
    return { kind: 'error', text: `Unknown changelog command: ${commandName}` };
  }
  if (invocation.signal.aborted) {
    return { kind: 'error', text: 'Cancelled before delivery.' };
  }
  invocation.agent.followup(
    createUserMessage({
      content: [{ type: 'text', text: renderPrompt(spec, rawInput) }],
      source: PLUGIN_SOURCE,
    }),
  );
  return { kind: 'success' };
}

/** Register the three ported commands on the `commands` service. */
export function registerChangelogCommands(commands: {
  register(definition: {
    name: string;
    description: string;
    input?: { hint: string };
    handler(invocation: CommandInvocation): CommandResult | Promise<CommandResult>;
  }): void;
}): void {
  for (const spec of PROMPT_SPECS) {
    commands.register({
      name: spec.name,
      description: spec.description,
      ...(spec.argumentHint ? { input: { hint: spec.argumentHint } } : {}),
      handler: (invocation: CommandInvocation) => deliverPrompt(invocation, spec.name, invocation.rawInput),
    });
  }
}

export function apply(ctx: Context): void {
  ctx.inject(['commands'], (cmdCtx) => {
    registerChangelogCommands(cmdCtx.commands);
  });
}
