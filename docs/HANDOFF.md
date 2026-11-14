# Teammate handoff

## Two separate applications

The extension is loaded unpacked from extension/. The clinician demo is served/opened from clinician-demo/. The demo uses fictional fixtures and does not receive actual extension state. Do not mistake a demo acknowledgement for contact with a real clinician.

## Current verification

JavaScript parsing and focused simulated checks have been run throughout development for classification, metadata isolation, caption accumulation, HP/XP balance, save migration, prompt persistence, drag wiring, feedback, consent gates and retention. These checks were interactive development checks; a retained automated test suite has not yet been added.

The clinician site was browser-tested for selection, search, acknowledgement and missing-data views. The real TikTok/Reels/Shorts integrations have not received complete end-to-end browser verification. Platform markup changes remain the main compatibility risk.

## Suggested next tasks

1. Verify detection, pause/resume and navigation on all three platforms; use Check detection on this video to inspect extraction counts.
2. Add repeatable DOM fixtures and a small regression suite before changing feed adapters.
3. Validate caption/metadata association during SPA navigation and recycled video elements.
4. Keep real data out of the clinician demo. Implement live sharing only after defining consent, access, retention, delivery receipts and clinician coverage.

## Local history

This repository starts from the completed project snapshot. It does not include the earlier chat's incremental edits or the separate, unpublished Sites repository history.
