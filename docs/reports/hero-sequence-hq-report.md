# Hero Sequence HQ Report

Date/time: 2026-07-09 00:43 +05:00

## Summary

Rebuilt the first hero WebP sequence from the provided MP4 source and switched the existing canvas hero to the new HQ sequence folder. No hero design, copy, layout, header, backend, admin, forms, Prisma, consent, legal pages, or day mode code was changed.

## Backup

- Backup path: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\backups\site-before-hero-sequence-hq-20260709-0041.zip`
- Backup size: 32,896,536 bytes
- Exclusions: `node_modules`, `.next`, `dist`, `coverage`, `.env*`, `*.pem`, token/secret/key files, `site/backups`
- Note: local runtime DB file `dev.db` was also excluded because `site\prisma\dev.db` was locked by another process during the first archive attempt.

## Source Video

- Source video path: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\assets\media\0708.mp4`
- ffprobe stream resolution: `1896 x 1080`
- ffprobe stream duration: `4.033333` seconds
- ffprobe format duration: `4.040000` seconds
- Frame rate: `30/1`
- Average frame rate: `30/1`
- Source frames: `121`
- Source size: `5,846,726` bytes
- Source bitrate: `11,577,675` bps

The requested target mentioned `1920 x 1080`, but the actual MP4 stream is `1896 x 1080`. The HQ export preserves the source height and width instead of upscaling.

## Generated Sequence

- Target folder: `C:\Users\user\Desktop\ВАЙБКОД\Сайи Optimate\site\public\sequence\hero-night-hq\`
- Public URL pattern: `/sequence/hero-night-hq/frame_000.webp`
- Files created: `frame_000.webp` through `frame_120.webp`
- WebP frame count: `121`
- Frame dimensions: `1896 x 1080`
- WebP quality: `90`
- Total folder size: `24,398,556` bytes / `23.27 MiB`
- First file: `frame_000.webp`, `181,440` bytes
- Last file: `frame_120.webp`, `221,896` bytes

Old sequence reference:

- Legacy folder preserved: `site/public/sequence/hero-night/`
- Legacy count: `263`
- Legacy dimensions: `1264 x 720`
- Legacy total size: `22,530,696` bytes / `21.49 MiB`

The HQ sequence is only `1.78 MiB` larger than the legacy sequence because it uses fewer frames while preserving source resolution.

## ffmpeg Command

```powershell
ffmpeg -y -i assets\media\0708.mp4 -vf "fps=30,scale=-2:1080:flags=lanczos" -c:v libwebp -quality 90 -compression_level 6 -start_number 0 "site\public\sequence\hero-night-hq\frame_%03d.webp"
```

## Changed Files

- `site/src/components/public/scroll-sequence-hero.tsx`
  - Updated first frame URL to `/sequence/hero-night-hq/frame_000.webp`.
  - Updated generated frame URL path to `/sequence/hero-night-hq/`.
  - Updated `FRAME_COUNT` to `121`.
  - Updated frame dimensions to `1896 x 1080`.
- `site/PROJECT_MAP.md`
  - Documented `hero-night-hq` as the active sequence.
  - Documented `hero-night` as preserved legacy/fallback sequence.
  - Documented frame count, dimensions, and quality.
- `site/docs/reports/hero-sequence-hq-report.md`
  - This report.

## Checks

- `npm.cmd run lint` - passed.
- `npm.cmd run build` - passed.
- `npm.cmd run typecheck` - not run; no `typecheck` script exists in `package.json`.
- `npm.cmd run test` - not run; no `test` script exists in `package.json`.

## TODO / Manual QA

- Optional browser visual QA for `/` and `/sequence-lab/hero-night` after owner approval, because browser automation was not explicitly enabled for this task.
- If production payload budget becomes stricter, create a comparison variant at WebP quality 86 or with fewer frames. Not done now because quality 90 total size is close to the legacy sequence size.
- Keep the legacy `hero-night` folder until the owner visually accepts the HQ sequence.
