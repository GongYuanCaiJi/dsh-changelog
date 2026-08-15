# E2E acceptance evidence

These two files are the **actual outputs** of the acceptance run required by the ticket:

> 在一個有真實 commit 歷史的 repo 上跑，看它產出的說明對不對得上那些 commit。

- `release-notes-public.md` — the public copy written by `/release-notes`
- `release-notes-private-source-audit.md` — the private source audit written by the same command

## How they were produced (reproduce it yourself)

```bash
# target: a real repo with commit history (here: deepseek-ai/deepseek-harness, 12k+ commits)
git clone https://github.com/deepseek-ai/deepseek-harness /tmp/rn && cd /tmp/rn
git tag anchor-test HEAD~30          # local anchor so the command has a "latest tag"

P=verify-$(date +%s)-$$
dsh plugin --profile "$P" add <path-to-dsh-changelog>
dsh plugin --profile "$P" add <path-to-verify-driver>   # driver: commands.execute seam
dsh --profile "$P" --patch <driver>/patch.yml "/release-notes anchor-test..HEAD"
```

The two files land in the repo root as `release-notes/anchor-test..HEAD.md` and
`.dsh/tmp/pi-changelog/release-notes-sources/anchor-test..HEAD.md`.

## Why the output is trustworthy

- The command was dispatched through the **real `commands.execute` seam** — the same path the web UI
  uses — not a unit-test stub. The durable session log (`~/.dsh/sessions/*/*/session.jsonl.zstd`)
  records `command/run` → `command/done` (kind `success`), 28 `tool/call`+`tool/result` pairs
  (git fetch/describe/log, gh, and two `write` calls whose payloads are exactly these files).
- Every PR number in the private audit resolves to a real merge commit in `anchor-test..HEAD`
  (verified against `git log anchor-test..HEAD`).
- The public copy contains **no** GitHub links, PR numbers, commit hashes, or internal notes —
  the privacy rule from the upstream prompt.

## Scope note

`gh pr list`/`pr view` return no PR data for this target repo (PRs disabled on the public mirror),
so the agent followed the prompt's documented fallback: PR list reconstructed from merge commits,
summaries derived from PR titles and commit messages. On a repo with working gh PR access, the same
command reads PR bodies and `Public summary` directly.
