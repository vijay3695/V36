import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const css = fs.readFileSync(new URL("../css/styles.css", import.meta.url), "utf8");

function color(label, pattern) {
  const match = css.match(pattern);
  assert.ok(match, `Could not find CSS color for ${label}`);
  return match[1].toLowerCase();
}

const palette = {
  body: color("body text", /body\{[^}]*color:(#[0-9a-f]{6})/i),
  bodyBase: color("body base background", /body\{[^}]*background:radial-gradient\([^)]*\),\s*(#[0-9a-f]{6})\s*;/i),
  bodyGlow: color("body radial-gradient color", /body\{[^}]*background:radial-gradient\([^,]+,(#[0-9a-f]{6})\s+0,/i),
  surface: color("--surface", /--surface:\s*(#[0-9a-f]{6})/i),
  muted: color("--muted", /--muted:\s*(#[0-9a-f]{6})/i),
  accent: color("--accent", /--accent:\s*(#[0-9a-f]{6})/i),
  accentInk: color("--accent-ink", /--accent-ink:\s*(#[0-9a-f]{6})/i),
  line: color("--line", /--line:\s*(#[0-9a-f]{6})/i),
  fieldLabel: color("field label", /\.field label\{[^}]*color:(#[0-9a-f]{6})/i),
  inputBackground: color("input background", /\.field input,\.field select\{[^}]*background:(#[0-9a-f]{6})/i),
  placeholder: color("input placeholder", /::placeholder\{color:(#[0-9a-f]{6})/i),
  focus: color("focus outline", /outline:3px solid (#[0-9a-f]{6})/i),
  primaryBackground: color("primary button background", /\.button-primary\{background:var\(--accent\)/i) || null,
  secondaryBackground: color("secondary button background", /\.button-secondary\{background:(#[0-9a-f]{6})/i),
  secondaryText: color("secondary button text", /\.button-secondary\{[^}]*color:(#[0-9a-f]{6})/i),
  quietText: color("quiet button text", /\.button-quiet\{[^}]*color:(#[0-9a-f]{6})/i),
  statusBackground: color("status background", /\.status\{[^}]*background:(#[0-9a-f]{6})/i),
  statusText: color("status text", /\.status\{[^}]*color:(#[0-9a-f]{6})/i),
  tagBackground: color("tag background", /\.tag\{[^}]*background:(#[0-9a-f]{6})/i),
  tagText: color("official tag text", /\.tag\{[^}]*color:(#[0-9a-f]{6})/i),
  inferredText: color("inferred tag text", /\.tag\.inferred\{[^}]*color:(#[0-9a-f]{6})/i),
  lede: color("lede text", /\.lede\{[^}]*color:(#[0-9a-f]{6})/i),
  prose: color("prose text", /\.prose\{[^}]*color:(#[0-9a-f]{6})/i),
  panelStart: color("panel gradient start", /\.panel\{background:linear-gradient\(145deg,(#[0-9a-f]{6})/i),
  panelEnd: color("panel gradient end", /\.panel\{background:linear-gradient\(145deg,#[0-9a-f]{6},(#[0-9a-f]{6})/i),
  disabledOpacity: Number(color("disabled button opacity", /\.button:disabled\{opacity:([0-9.]+)/i))
};

palette.primaryBackground = palette.accent;

function luminance(hex) {
  const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const linear = channels.map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return linear.reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
}

function contrast(foreground, background) {
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function mix(foreground, background, amount) {
  const channels = [1, 3, 5].map(i =>
    Math.round(parseInt(foreground.slice(i, i + 2), 16) * amount +
      parseInt(background.slice(i, i + 2), 16) * (1 - amount))
  );
  return "#" + channels.map(value => value.toString(16).padStart(2, "0")).join("");
}

function samples(start, end) {
  return [0, 0.25, 0.5, 0.75, 1].map(t => mix(end, start, t));
}

const bodyBackgroundSamples = samples(palette.bodyGlow, palette.bodyBase);
const panelBackgroundSamples = samples(palette.panelStart, palette.panelEnd);

function expectAa(label, foreground, backgrounds) {
  for (const background of backgrounds) {
    const ratio = contrast(foreground, background);
    assert.ok(ratio >= 4.5, `${label} contrast ${ratio.toFixed(2)}:1 on ${background}; expected at least 4.5:1`);
  }
}

test("body, muted, link and field-label text meet WCAG AA across sampled dark backgrounds", () => {
  expectAa("Body text", palette.body, [...bodyBackgroundSamples, palette.surface, ...panelBackgroundSamples]);
  expectAa("Muted text", palette.muted, [...bodyBackgroundSamples, palette.surface, ...panelBackgroundSamples]);
  expectAa("Link text", palette.accent, [...bodyBackgroundSamples, ...panelBackgroundSamples]);
  expectAa("Field labels", palette.fieldLabel, [...bodyBackgroundSamples, ...panelBackgroundSamples]);
  expectAa("Lead text", palette.lede, bodyBackgroundSamples);
});

test("status, input placeholder, buttons and prose meet WCAG AA on their actual surfaces", () => {
  expectAa("Status text", palette.statusText, [palette.statusBackground]);
  expectAa("Input placeholder", palette.placeholder, [palette.inputBackground]);
  expectAa("Primary button text", palette.accentInk, [palette.primaryBackground]);
  expectAa("Secondary button text", palette.secondaryText, [palette.secondaryBackground]);
  expectAa("Quiet button text", palette.quietText, [palette.surface, ...panelBackgroundSamples]);
  expectAa("Prose text", palette.prose, panelBackgroundSamples);
});

test("official and inferred labels meet WCAG AA and inferred labels retain a non-colour cue", () => {
  expectAa("Official label", palette.tagText, [palette.tagBackground]);
  expectAa("Inferred label", palette.inferredText, [palette.tagBackground]);
  assert.match(css, /\.tag\.inferred\{[^}]*border-style:dashed/i,
    "Inferred labels must remain distinguishable by a dashed border, not colour alone");
});

test("focus outline has at least 3:1 contrast against body, panel and input surfaces", () => {
  for (const background of [...bodyBackgroundSamples, ...panelBackgroundSamples, palette.inputBackground]) {
    const ratio = contrast(palette.focus, background);
    assert.ok(ratio >= 3, `Focus outline contrast ${ratio.toFixed(2)}:1 on ${background}; expected at least 3:1`);
  }
});

test("disabled buttons retain visible effective contrast after opacity is composited", () => {
  assert.ok(Number.isFinite(palette.disabledOpacity) && palette.disabledOpacity > 0 && palette.disabledOpacity <= 1,
    "Disabled-button opacity must be a valid value");
  for (const parentBackground of [...panelBackgroundSamples, ...bodyBackgroundSamples]) {
    const disabledPrimaryBackground = mix(palette.primaryBackground, parentBackground, palette.disabledOpacity);
    const disabledPrimaryText = mix(palette.accentInk, parentBackground, palette.disabledOpacity);
    const disabledSecondaryBackground = mix(palette.secondaryBackground, parentBackground, palette.disabledOpacity);
    const disabledSecondaryText = mix(palette.secondaryText, parentBackground, palette.disabledOpacity);
    assert.ok(contrast(disabledPrimaryText, disabledPrimaryBackground) >= 3,
      `Disabled primary control is not distinguishable enough on ${parentBackground}`);
    assert.ok(contrast(disabledSecondaryText, disabledSecondaryBackground) >= 3,
      `Disabled secondary control is not distinguishable enough on ${parentBackground}`);
  }
});

test("the focus indicator colour is defined as a visible 3px outline", () => {
  assert.match(css, /button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible\{outline:3px solid #[0-9a-f]{6};outline-offset:3px\}/i);
  assert.ok(contrast(palette.focus, palette.bodyBase) >= 3);
});
