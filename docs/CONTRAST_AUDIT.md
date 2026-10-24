# V36 Numeric Contrast Audit

**Measurement method:** WCAG relative-luminance contrast formula, calculated from the actual colour tokens in `css/styles.css`. `tests/contrast-audit.test.js` recalculates the colour pairs during each unit-test run and fails when required thresholds regress.

**Thresholds:** normal text 4.5:1 (WCAG AA); non-text component boundaries, focus indicators and status indicators 3:1 where required to identify a component/state. Disabled controls are contrast-exempt, but their composited values are reported for transparency. Values below are worst-case ratios across the backgrounds listed by the regression test.

## Text and status foregrounds

| UI component / role | Dark minimum | Light minimum | Requirement |
|---|---:|---:|---:|
| Body copy, issue descriptions and detail content | 13.34:1 | 13.23:1 | 4.5:1 |
| Headings and emphasized text | 14.48:1 | 14.27:1 | 4.5:1 |
| Muted hints, metadata and placeholders | 6.85:1 | 5.52:1 | 4.5:1 |
| Field labels and neutral status text | 10.09:1 | 8.56:1 | 4.5:1 |
| Links, eyebrow and disclosure summary | 8.27:1 | 4.69:1 | 4.5:1 |
| Primary button label | 8.70:1 | 5.19:1 | 4.5:1 |
| Secondary button label | 14.48:1 | 14.84:1 | 4.5:1 |
| Quiet button label | 10.09:1 | 8.74:1 | 4.5:1 |
| Input value text | 17.39:1 | 15.80:1 | 4.5:1 |
| Official tag label | 11.18:1 | 9.07:1 | 4.5:1 |
| Inferred category label | 7.00:1 | 4.62:1 | 4.5:1 |
| Warning status text | 11.10:1 | 8.95:1 | 4.5:1 |

## Component boundaries and focus

| UI component / role | Dark minimum | Light minimum | Requirement |
|---|---:|---:|---:|
| Panel/card/field border | 3.26:1 | 4.63:1 | 3:1 |
| Strong control border | 3.51:1 | 4.89:1 | 3:1 |
| Keyboard focus outline | 11.46:1 | 4.56:1 | 3:1 |
| Inferred tag dashed border | 7.00:1 | 4.62:1 | 3:1 |
| Warning state boundary | 4.47:1 | 3.19:1 | 3:1 |
| Error state boundary | 10.18:1 | 4.93:1 | 3:1 |
| Success state boundary | 11.52:1 | 4.67:1 | 3:1 |

## Disabled controls (opacity-composited)

The ratios include the disabled-button opacity over page, surface, and raised-surface backgrounds. Disabled controls are exempt from minimum contrast requirements.

| UI component / role | Dark minimum | Light minimum | WCAG status |
|---|---:|---:|---|
| Disabled primary button label | 5.36:1 | 3.33:1 | Exempt; measured for transparency |
| Disabled secondary button label | 8.69:1 | 6.62:1 | Exempt; measured for transparency |
| Disabled quiet button label | 6.68:1 | 4.61:1 | Exempt; measured for transparency |

## Limitations

The regression test reads the declared theme tokens, tests listed foreground/background pairs, and models disabled-button opacity. It does not sample every rendered pixel of gradients, browser-native controls, arbitrary external content, images, or user overrides. Contrast ratios do not by themselves establish full WCAG conformance or screen-reader usability.
