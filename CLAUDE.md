# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A hotel availability checker for Gen Con convention. It polls the Passkey booking portal API and alerts users when matching rooms become available. The main script is `gencon-hotel-check.py`.

## Running the Tool

```bash
# Show all options
python gencon-hotel-check.py --help

# Basic run (requires a valid Passkey portal URL with JWT token)
python gencon-hotel-check.py --url "https://book.passkey.com/entry?token=..."

# Test all configured alerts without actually searching
python gencon-hotel-check.py --url "..." --test

# Single search (no loop)
python gencon-hotel-check.py --url "..." --once
```

There are no automated tests.

## Architecture

### Authentication & API Flow

1. **Token acquisition**: User gets a URL from the Gen Con housing portal containing a JWT token (`https://book.passkey.com/entry?token=...`). This token authenticates all subsequent requests.
2. **Initialization**: Script GETs the entry URL to acquire XSRF token and session cookies via `CookieJar`.
3. **Search**: POSTs to `/event/{eventId}/owner/{ownerId}/rooms/select` with check-in/out dates, guest count, etc.
4. **Results**: GETs `/list/hotels` which returns JSON embedded in a `<script>` tag, parsed with `HTMLParser`.

### Key Hardcoded Values (update each year)

Located near the top of `gencon-hotel-check.py`:
- `firstDay`, `lastDay`, `startDay` — valid date range for the event
- `eventId`, `ownerId` — Passkey event identifiers

### Request Rate Limiting

- `MIN_REQUEST_INTERVAL = 1.0` second enforced via `threading.Lock`
- Configurable `--delay` between full search cycles (default: 5s)

### Filtering Logic (`parseResults`)

Results are filtered through multiple layers:
1. **Distance**: "connected" (skywalk), "blocks" (walking), or "miles" (excluded by default)
2. **Budget**: `--budget` sets max total price before taxes
3. **Hotel regex**: `--hotel-regex` case-insensitive match on hotel name
4. **Room regex**: `--room-regex` case-insensitive match on room type
5. **Always include**: `--always-include` regex bypasses distance filtering for matching hotels

### Alert System

Alerts fire in separate threads to avoid blocking the search loop. Alert deduplication: only fires when the set of matching hotels *changes* from the previous search.

Alert methods (each activated by a flag):
- `--popup` — Win32 dialog (Windows) or Tkinter fallback
- `--cmd CMD` — Shell command with hotel names substituted
- `--browser` — Opens Passkey housing portal in default browser
- `--email HOST FROM TO` — SMTP email
- `--pushbullet TOKEN` — Pushbullet push notification
- `--bell` — Plays `alarm.wav`/`alarm.ogg` via pygame; spacebar toggles sound on/off

### Output Format

Each result line: `timestamp | distance | price | hotel name | room type | count`
- `!` prefix = matched hotel (alert triggered)
- `.` = search cycle with no matches
- Timestamp reprinted every 72 searches

## Dependencies

No `requirements.txt` — install as needed:
- Standard library: `urllib`, `json`, `re`, `argparse`, `smtplib`, `threading`, `ssl`
- Optional: `win32api` (Windows popups), `tkinter` (cross-platform popups), `pygame` (sound), `pynput` (keyboard listener)
