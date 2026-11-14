# Sprout

A local-only Manifest V3 extension for TikTok, Instagram Reels, and YouTube Shorts. No build step, account, API key, remote assets, or network service is needed.

## Install

1. Open `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode**.
3. Choose **Load unpacked**, then select this `sprout-extension` folder.
4. Open or reload a supported feed. Open Sprout from the extensions menu.
5. Click **Test prompt on current tab** with a video visible to try both choices.

The popup includes health, growth, five SVG tree stages, skip/watch counts, enable switch, sensitivity, and comma-separated custom keywords. Settings sync between open tabs on this device. Storage updates are serialized by the service worker.

## Behavior and limits

Detection uses visible captions, descriptions, hashtags, loaded visible comments, and weighted keywords, not video/audio understanding or a mental-health assessment. A phrase can be flagged in a positive context; missing captions may prevent detection. Platform markup and navigation controls can change. Use the demo button to check a feed manually. Demo choices change your tree's real local stats.

Health starts at 200 out of 250. Skip adds 5 HP and 3 XP; watching costs 15 HP and 10 XP (clamped to zero). At zero health the tree keeps its XP and stage, and growth pauses until two skips restore it. Recovery skips restore health without XP. Health below 25% looks wilted even when it has not reached zero. Growth thresholds: 150, 450, 900, 1500 XP.

Evaluated video identifiers remain in memory for the current page session. Reloading the page allows a prompt again. Text with no match is rechecked as captions load. The extension reads page metadata on supported domains; it sends nothing off-device. Removing the extension clears its stored tree.

## Manual checks

- On each supported feed, test pause, autoplay blocking while the prompt is open, skip navigation, and watch/resume.
- Check keyboard focus, Tab cycling, and Escape (chooses Watch Anyway).
- Adjust sensitivity and keywords; confirm another tab sees updates.
- Disable Sprout: badge and any open prompt disappear and playback resumes.
- Watch until health is zero, then skip twice: skipping during recovery preserves stage and XP.
- Inspect the extension card and service worker console for errors.

Platform integration requires manual browser verification after installation; DOM heuristics cannot guarantee compatibility with every account or feed layout.

## Updating to 1.1

Replace the old extension files, click Reload on its card at chrome://extensions, then reload all open TikTok, Instagram, and YouTube tabs. Existing tree data is preserved when reloading the same installed extension. Default medium sensitivity now flags a single explicit sad, depressing, or melancholy keyword. Choose High for broader triggers. Hidden/unloaded comments and speech or text rendered inside video pixels cannot be classified.

## Version 1.2 balance

The tree artwork is larger in the dashboard and prompt. Maximum HP is 250. No skips the video and earns 5 HP and 3 XP (recovery skips earn HP only). Yes costs 15 HP and 10 XP. A new tree needs 50 rewarded skips to reach stage 2 and 500 to reach stage 5. Existing saves retain their growth stage and proportional health through a one-time migration.

## Version 1.2.1 prompt stability

A temporary loss of the active-video candidate, caption changes, and URL updates no longer dismiss the prompt. Replacement video nodes in the same card remain paused. A different card must stay active for one second with the old video off-screen before abandoning a prompt. A video is recorded as handled only after a choice is saved.

## Version 1.3 detection

Detection combines separately weighted descriptions, hashtags, music titles, accessible subtitle cues, and up to 80 unique loaded comments from the active video card or an open visible comment panel. Common emotional phrases and compound hashtags are supported. Ambiguous words/emojis are weak signals; comment contributions are capped. Check detection on this video shows score, threshold, source counts, and matched signals. No comment panels are opened automatically and no network requests are made. Unloaded comments, speech without accessible captions, and text baked into video pixels remain unavailable. English vocabulary is built in; other languages can be added as custom keywords. Live-platform verification remains necessary.

## Version 1.4 movable tree

The on-page tree is larger. Drag its Move handle to reposition it; use the Move prompt handle to reposition a video decision card. Focus a handle and press arrow keys to move 10 pixels, or Shift+arrow for 40 pixels. Widget and prompt positions are saved locally and constrained on window resize. Hide health keeps the larger tree visible. The browser toolbar popup stays anchored to the toolbar, as controlled by the browser.

## Version 1.4.1

Move bars are removed. Drag the background/tree of the floating widget or decision card as you would a window; buttons remain clickable. Focus the widget to use arrow keys. Saved positions remain supported. Music extraction includes TikTok music labels, Instagram reel audio links, and YouTube sound metadata. Explicit sad/melancholy/somber music titles pause the video for a choice even on Low sensitivity. Slowed/reverb alone does not imply sadness. This is text-based music metadata detection, not acoustic mood recognition; unlabelled melancholy audio may be missed.

## Version 1.5 tree feedback

The floating widget is tree-first with stage-specific SVG framing and compact health details underneath. Each saved No produces a growth pulse and sparkles; Yes produces a drooping shake and falling leaves. Feedback displays actual HP/XP changes, including caps and recovery, and announces stage upgrades. Tree leaf size/angle and height respond continuously to health and stage progress. Click the tree for a cosmetic bounce; dragging remains available. Reduced-motion preferences disable animation while preserving written feedback. Growth rewards and thresholds are unchanged.

## Version 1.6 richer scanning

Adds safe JSON parsing of page-embedded data, including TikTok hydration, YouTube initial player data, and Instagram media records when present. Data must match the active video ID/shortcode; no script content is executed. Captions are accumulated per video, and all already-loaded native subtitle cues are examined. Embedded descriptions, keyword lists, music labels, and loaded Instagram comment records supplement DOM scanning. Bounded traversal, script caching, and limits avoid repeatedly parsing huge pages. Indirect distress phrases and common explicit negations improve scoring. These are heuristics, not audiovisual AI: no OCR, speech recognition, or acoustic mood model is included. No additional permissions, remote requests, or API keys. Platform schema changes and missing data can still cause misses.

## Version 1.7 care view

Optional local recording, wellbeing check-ins, user-requested contact, dated factual summaries and user-reviewed text export. Open Care view from the popup. No clinician is automatically notified. See clinician/SYSTEM.md for the proposed secure inbox and acknowledgement workflow, data meaning, retention, and implementation limits.
