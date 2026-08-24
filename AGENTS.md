# Git workflow

This is a single-developer project.

- Work directly on `main`.
- Do not create feature/design/dev branches unless the user explicitly requests one.
- Do not use force push.
- Before significant work, create the project's normal backup if required.
- After a completed and verified task, create a descriptive commit and push `main`.
- Use commit history / `git revert` / a known commit SHA for rollback.
- Never discard uncommitted user work with reset/clean/restore commands.
