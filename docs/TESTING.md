# Manual verification

## Extension

- Load extension/ unpacked; inspect extension-card and service-worker errors.
- Check Test prompt on current tab with a visible short-form video on each platform.
- Verify playback pauses and stays paused while the choice is pending.
- No: skip advances to the next video; tree feedback shows actual HP/XP change.
- Yes: resumes playback, loses HP/XP, and shows deterioration feedback.
- Verify a brief metadata/visibility change does not dismiss a pending prompt.
- Drag the widget/card without triggering buttons; resize the window and verify position clamping.
- Check detection diagnostics for description, hashtags, music and loaded comments. A lack of loaded text is not a negative classification.
- Try multiple tabs; updates should serialize and sync on the same device.
- Open Care view; consent should initially be off. Check future-only recording, stopping consent, check-ins, local contact request and report export. No actual notification is sent.

## Clinician demo

- Open clinician-demo/index.html or serve it locally.
- Search by name and ID; test empty results and request/no-data filters.
- Select profiles; confirm tree, counts, self-report and chart update.
- Switch 7/14 day range. Latest chart value should match profile HP.
- Acknowledge a fictional request; pending count should decrease. Continue through attempt/closure.
- Check Robin Lane: absent data must not be presented as reassuring.
- Export a fictional summary, reset demo, and try a narrow screen and keyboard navigation.
