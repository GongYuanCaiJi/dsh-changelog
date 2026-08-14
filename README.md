# dsh-changelog

简体中文 | [English](#english)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![DSH](https://img.shields.io/badge/DSH-DeepSeek%20Harness-blue.svg)](https://github.com/deepseek-ai/deepseek-harness)
[![上游](https://img.shields.io/badge/移植自-pi--changelog-orange.svg)](https://www.npmjs.com/package/@noice-tech/pi-changelog)

> **一句话：打一句 `/unreleased` 预览未发布的改动，或 `/release-notes <版本>` 从 git 历史自动生成发布说明——公开文案和内部来源审计分开存放，敏感信息不进公开文件。**

移植自 [`@noice-tech/pi-changelog`](https://www.npmjs.com/package/@noice-tech/pi-changelog)（MIT，`1.3.0`），
三个提示词逐字保留，只把 `.pi/` 路径改成 dsh 的 `.dsh/` 约定。

## ✨ 功能

- 📝 **从 git 历史生成发布说明** —— `/release-notes <version|from..to>` 解析 GitHub Release、PR 与提交，写出公开文案
- 🔍 **预览未发布改动** —— `/unreleased` 审计最近一个 tag 以来的合并 PR，不创建 tag、release、commit 或文件
- 🎨 **仓库专属文风** —— `/setup-release-notes-style` 生成 `.dsh/release-notes-style.md`，让发布说明贴合你的产品受众与语气
- 🔒 **隐私安全** —— 公开文案排除链接、PR 号、commit 哈希、私有 URL 与内部备注；来源审计单独写进 `.dsh/tmp/`，不进公开文件
- 🧭 **来源优先级明确** —— `Public summary` → `Context` → Release body → PR title → commit message，逐级回退

## 📸 效果

在任意有真实提交历史的仓库里（示意输出，格式与上游提示词一致；以 deepseek-harness 的提交为例）：

```
> /unreleased

Unreleased preview since 0.1.0-rc.4

Release recommendation: yes
Public candidates: 10
Internal/skipped: 12
Needs cleanup: 3

## Public candidates

- 公开发布 dsh 全家桶到 npm
  Source: #2519 feat/npm-public
- 统一 Web UI 引导弹窗流程
  Source: #2503 agent/onboarding-modal-flow
- Web UI 新增英文引导文案
  Source: #2512 codex/2503-english-onboarding-copy
- …
```

## 📦 安装

本包尚未发布到 npm，用 GitHub 源安装：

```bash
dsh plugin --profile <你的 profile> add github:GongYuanCaiJi/dsh-changelog
```

安装时会通过 `prepare` 脚本自动构建 `dist/`。若 pnpm 拦下构建步骤，在 profile 的
`pnpm-workspace.yaml` 里把本包加进 `allowBuilds`。

从本地目录安装（需要先自行构建）：

```bash
git clone https://github.com/GongYuanCaiJi/dsh-changelog.git
cd dsh-changelog && npm install        # 触发 prepare，产出 dist/
dsh plugin --profile <你的 profile> add ../dsh-changelog
```

## 🚀 用法

```
/unreleased                        # 预览最近一个 tag 以来的发布候选
/release-notes 1.2.3               # 生成 1.2.3 的发布说明（写入 release-notes/1.2.3.md）
/release-notes 1.2.0..1.2.3        # 生成一个版本区间的发布说明
/setup-release-notes-style [笔记]   # 创建或精炼 .dsh/release-notes-style.md
```

- `/unreleased` 与 `/release-notes` 需要已认证的 [GitHub CLI](https://cli.github.com/)（`gh auth login`）
- `/release-notes` 会创建或覆盖其输出文件，`.dsh/tmp/` 应保持 gitignore 且不发布

<details>
<summary>移植说明（对上游 <code>@noice-tech/pi-changelog@1.3.0</code>）</summary>

**逐字保留：** 三个提示词文件（`prompts/release-notes.md`、`setup-release-notes-style.md`、`unreleased.md`）。
其中 `unreleased.md` 与上游逐字相同（`cmp` 可验）；另外两个只改了路径引用 —— 把 Pi 的状态目录约定
`.pi/` 换成 dsh 的 `.dsh/`（例如 `.dsh/tmp/pi-changelog/release-notes-sources/` 与
`.dsh/release-notes-style.md`）。**这一点你可以自己验** —— [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)
钉住了上游 tarball 的 integrity / shasum 与逐字文件的 SHA-256，附可直接复制的比对命令。

**适配层（新增，上游无对应物）：** 入口改为 Cordis namespace 形状；三个提示词注册为 `commands` 服务上的
slash 命令；命令触发时把提示词原文（`$ARGUMENTS` 替换为你的输入）经 `agent.followup` 交给 agent 执行。
`/commit` 与 `/commit-config` 属于上游打包依赖 [`@noice-tech/pi-commit`](https://www.npmjs.com/package/@noice-tech/pi-commit)
（独立包，另售），不在本移植范围内。

**已知限制：** agent 收到的提示词是英文的 —— 那是上游原文，逐字保留未做翻译。

</details>

## 🛠 开发

```bash
npm install      # 触发 prepare，产出 dist/
npm test         # 构建后跑单元测试（node --test）
```

端到端验收（用一次性 profile，用完删除）：

```bash
P=verify-$(date +%s)-$$
dsh plugin --profile "$P" add ./dsh-changelog
dsh --profile "$P"
```

## 📄 License

MIT。上游 [`@noice-tech/pi-changelog`](https://www.npmjs.com/package/@noice-tech/pi-changelog)
`Copyright (c) 2026 Noice Tech`，本移植 `Copyright (c) 2026 GongYuanCaiJi`。见 [LICENSE](./LICENSE)。

感谢 [noice-tech/noice-pi](https://github.com/noice-tech/noice-pi) 的原作者 ——
如果这个插件对你有用，**也请去给[上游仓库](https://github.com/noice-tech/noice-pi)点个 star**。

---

# English

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![DSH](https://img.shields.io/badge/DSH-DeepSeek%20Harness-blue.svg)](https://github.com/deepseek-ai/deepseek-harness)

> **One line: type `/unreleased` to preview unreleased changes, or `/release-notes <version>` to generate release notes from git history — public copy and private source audit are written separately, so sensitive details never leak into the public file.**

A port of [`@noice-tech/pi-changelog`](https://www.npmjs.com/package/@noice-tech/pi-changelog) (MIT, `1.3.0`)
to [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). The three upstream prompts are kept
verbatim; only the `.pi/` path convention was changed to dsh's `.dsh/`.

## ✨ Features

- 📝 **Release notes from git history** — `/release-notes <version|from..to>` inspects GitHub releases, PRs, and commits, then writes public copy
- 🔍 **Preview unreleased changes** — `/unreleased` audits merged PRs since the latest tag without creating tags, releases, commits, branches, or files
- 🎨 **Repo-specific voice** — `/setup-release-notes-style` writes `.dsh/release-notes-style.md` so notes match your product's audience and tone
- 🔒 **Privacy-safe** — public copy excludes links, PR numbers, commit hashes, private URLs, and internal notes; the source audit goes to `.dsh/tmp/` only
- 🧭 **Explicit source priority** — `Public summary` → `Context` → Release body → PR title → commit message

## 📸 Effect

In any repo with real commit history (illustrative output, format per the upstream prompt; example commits from deepseek-harness):

```
> /unreleased

Unreleased preview since 0.1.0-rc.4

Release recommendation: yes
Public candidates: 10
Internal/skipped: 12
Needs cleanup: 3

## Public candidates

- Publish the dsh family publicly on npm
  Source: #2519 feat/npm-public
- Unify web UI onboarding dialogs
  Source: #2503 agent/onboarding-modal-flow
- Add English onboarding copy to the web UI
  Source: #2512 codex/2503-english-onboarding-copy
- …
```

## 📦 Install

This package is not on npm yet — install from GitHub:

```bash
dsh plugin --profile <your-profile> add github:GongYuanCaiJi/dsh-changelog
```

The `prepare` script builds `dist/` during installation. If pnpm blocks the build step,
add this package to `allowBuilds` in the profile's `pnpm-workspace.yaml`.

From a local checkout (build it first):

```bash
git clone https://github.com/GongYuanCaiJi/dsh-changelog.git
cd dsh-changelog && npm install        # runs prepare, produces dist/
dsh plugin --profile <your-profile> add ../dsh-changelog
```

## 🚀 Usage

```
/unreleased                        # preview release candidates since the latest tag
/release-notes 1.2.3               # write release notes for 1.2.3 (release-notes/1.2.3.md)
/release-notes 1.2.0..1.2.3        # write release notes for a range
/setup-release-notes-style [notes] # create or refine .dsh/release-notes-style.md
```

- `/unreleased` and `/release-notes` require an authenticated [GitHub CLI](https://cli.github.com/) (`gh auth login`)
- `/release-notes` creates or overwrites its output files; keep `.dsh/tmp/` ignored and unpublished

<details>
<summary>Port notes (vs upstream <code>@noice-tech/pi-changelog@1.3.0</code>)</summary>

**Kept verbatim:** the three prompt files (`prompts/release-notes.md`, `setup-release-notes-style.md`,
`unreleased.md`). `unreleased.md` is byte-identical to upstream (verify with `cmp`); the other two change
only path references — Pi's state-dir convention `.pi/` becomes dsh's `.dsh/` (e.g.
`.dsh/tmp/pi-changelog/release-notes-sources/` and `.dsh/release-notes-style.md`). **You can verify this
yourself** — [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) pins the upstream tarball's integrity /
shasum and the byte-identical files' SHA-256, with copy-paste comparison commands.

**Adapter (new, no upstream counterpart):** Cordis namespace entry; the three prompts are registered as
slash commands on the `commands` service; invoking a command delivers the prompt text (`$ARGUMENTS`
substituted with your input) to the agent via `agent.followup`. `/commit` and `/commit-config` belong to the
upstream's bundled dependency [`@noice-tech/pi-commit`](https://www.npmjs.com/package/@noice-tech/pi-commit)
(a separate package) and are out of scope for this port.

**Known limitation:** the prompts the agent receives are in English — that is upstream text, kept verbatim
and untranslated.

</details>

## 🛠 Development

```bash
npm install      # runs prepare, produces dist/
npm test         # build + unit tests (node --test)
```

End-to-end acceptance (disposable profile, deleted after use):

```bash
P=verify-$(date +%s)-$$
dsh plugin --profile "$P" add ./dsh-changelog
dsh --profile "$P"
```

## 📄 License

MIT. Upstream [`@noice-tech/pi-changelog`](https://www.npmjs.com/package/@noice-tech/pi-changelog)
`Copyright (c) 2026 Noice Tech`; this port `Copyright (c) 2026 GongYuanCaiJi`. See [LICENSE](./LICENSE).

Thanks to the authors of [noice-tech/noice-pi](https://github.com/noice-tech/noice-pi) —
if this plugin is useful to you, **please also star the
[upstream repository](https://github.com/noice-tech/noice-pi)**.
