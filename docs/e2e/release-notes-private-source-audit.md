# Internal source notes

Used:

- #2423 fix(web): align composer geometry and sidebar motion — web UI geometry/motion fixes (public)
- #2458 fix(web): keep cold blank sessions out of recent lists — recent session lists (public)
- #2464 fix: withhold OAuth-only providers from the configurable directory — model settings (public)
- #2470 Remove the first-run beta notice and keep telemetry disabled by default — first-run onboarding (public)
- #2474 fix(web): keep older trajectory history loadable — trajectory history pagination (public)
- #2484 fix(web): reject unsupported wildcard host — web app startup safety (public)
- #2490 fix(web): show newest sessions first by default — session list ordering (public)
- #2503 feat(web): unify onboarding dialogs — onboarding flow (public)
- #2512 fix(web): add English onboarding copy — onboarding i18n (public)

Skipped:

- #2299 fix: Windows-native CI findings — CI only, internal
- #2435 docs: mark repository naming contract implemented — docs, internal
- #2436 Adopt MIT for DSH packages — licensing change, not a feat/fix/improve product change
- #2454 docs: capitalize Service Provider — docs, internal
- #2455 Link guide sidebar to development and reference — docs/website navigation, internal
- #2457 docs: refresh root README and sync Chinese counterpart — docs, internal
- #2469 docs: fix pre-release smoke test failures — docs/CI, internal
- #2473 build(release): publish the vendored framework and the native packages publicly — build/release, internal
- #2476 Release: vendor@4.0.1 & landlock@0.1.0 — release housekeeping, internal
- #2478 docs(i18n): human-polish additional Chinese READMEs — docs, internal
- #2481 docs: add localized community channels — docs, internal
- #2489 fix(release): make publication retry, space out, and skip what already landed — release tooling, internal
- #2495 release(dsh): 0.1.0-rc.1 — release housekeeping, internal
- #2498 docs: add source build prerequisite to plugin tutorial — docs, internal
- #2499 fix: static ci — CI, internal
- #2500 fix: snapshot — test snapshots, internal
- #2505 ci: split failover switch into per-platform Linux and Windows variables — CI, internal
- #2507 Release: dsh@0.1.0-rc.2 — release housekeeping, internal
- #2519 release: dsh@0.1.0-rc.5 & publish the dsh family publicly — release/availability change, not a user-visible behavior change
- #2520 docs: add link to preview paper — docs, internal
- #2521 release: dsh@0.1.0-rc.3 — release housekeeping, internal

Potential authored product update: yes
Reason: No GitHub releases exist for the range and no PR-body `## Changelog` public summaries were accessible (PR API returns 404 for this repo), so public copy was derived from PR titles and commit messages; the several user-visible web UI changes warrant maintainer confirmation of wording.
