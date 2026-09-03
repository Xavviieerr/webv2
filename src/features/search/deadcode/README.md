# Dead Code Archive

This folder contains verified dead code from the search feature.
Files here are NOT imported or used anywhere in the active codebase.

## Why keep them?

- Preserved for reference in case they're needed in the future
- Avoids accidental deletion of potentially useful logic

## Verification date

All files verified dead on 2026-08-07 via grep across entire `src/` directory.

## Contents

### `api/word-of-day.ts`
- Was: Server-side fetch function for word-of-the-day API
- Replaced by: `useWordOfDayQuery()` RTK Query hook in `word-of-the-day.tsx`
- Reason dead: Component switched to client-side RTK Query

### `helpers/format-word-of-day.ts`
- Was: Formats raw word-of-the-day API response into display-ready object
- Reason dead: `word-of-the-day.tsx` now uses raw RTK Query data directly
