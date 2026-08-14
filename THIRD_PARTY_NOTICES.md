# Third-party notices

## @noice-tech/pi-changelog

This package is a port of `@noice-tech/pi-changelog`. The upstream source is used under the MIT License.

| | |
|---|---|
| Package | [`@noice-tech/pi-changelog@1.3.0`](https://www.npmjs.com/package/@noice-tech/pi-changelog) |
| Repository | [noice-tech/noice-pi](https://github.com/noice-tech/noice-pi/tree/main/packages/changelog) |
| License | MIT |
| Tarball | `https://registry.npmjs.org/@noice-tech/pi-changelog/-/pi-changelog-1.3.0.tgz` |
| Integrity | `sha512-VlFlusFKsTRsZcGCLa7dokPEe0FtxAzHAQZhBdzSC5w64ULJu5DO9y2tPOT9YJuUwtDzA5Q37BUgHtOnnmiZ9Q==` |
| shasum | `fa445010b711bedf7aa90336401d9e386cd4e56e` |
| gitHead | not published in the registry metadata for this package |

### The port: which files are byte-identical

Three upstream prompt files are ported. `prompts/unreleased.md` is **byte-identical** to
upstream. The other two differ **only** in the documented `.pi/` → `.dsh/` path rewrites
(the dsh harness state directory convention; see the port notes in README).

### Verifying the verbatim claim yourself

Fetch the pinned upstream tarball and compare:

```bash
curl -sL https://registry.npmjs.org/@noice-tech/pi-changelog/-/pi-changelog-1.3.0.tgz | tar xz

# byte-identical
cmp package/prompts/unreleased.md              prompts/unreleased.md                && echo "unreleased.md OK"

# exactly the .pi/ -> .dsh/ rewrites, nothing else
diff -u package/prompts/release-notes.md       prompts/release-notes.md             | grep -E '^[+-]' | grep -v '^[+-][+-]' | grep -vc '\.pi/'   # expect 0
diff -u package/prompts/setup-release-notes-style.md prompts/setup-release-notes-style.md | grep -E '^[+-]' | grep -v '^[+-][+-]' | grep -vc '\.pi/' # expect 0
```

Expected SHA-256 of the three shipped files:

```
1c9e12fd9193b4d57930d6e335a9a3e7f5a3d108765c66394c4447b7ae81c196  prompts/release-notes.md
c72d3e10216c85ef81afb238b18d75d67d0ad754341cb91c25acb376da2ac53a  prompts/setup-release-notes-style.md
e75efc8c979ded47ee371aacd375c1e1bfa2d0c01c60d37c25e7458b9781a1d0  prompts/unreleased.md
```

Upstream SHA-256 of the same three files:

```
d5cd044c244b9d2af4ec90b78830b75517ce1da7119538ce23b8d1c619e1e3f9  package/prompts/release-notes.md
a589d107ba93a1cbe95cc47ae1151a75608d093fbd709dc11ac5659f1124fdbd  package/prompts/setup-release-notes-style.md
e75efc8c979ded47ee371aacd375c1e1bfa2d0c01c60d37c25e7458b9781a1d0  package/prompts/unreleased.md
```

The `src/` adapter (command registration and prompt delivery) is new code written for
the dsh harness; it has no upstream counterpart.
