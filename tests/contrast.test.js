import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const css=fs.readFileSync(new URL("../css/styles.css",import.meta.url),"utf8");
function theme(name){
 const selector=name==="light"?/:root\[data-theme="light"\]\{([^}]*)\}/:/:root\{([^}]*)\}/;
 const match=css.match(selector);
 assert.ok(match, "Missing "+name+" theme token block");
 const tokens=Object.fromEntries([...match[1].matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6})/gi)].map(m=>[m[1],m[2].toLowerCase()]));
 const get=key=>{assert.ok(tokens["--"+key],"Missing --"+key+" token in "+name+" theme");return tokens["--"+key];};
 return {name,page:get("page"),glow:get("page-glow"),surface:get("surface"),raised:get("surface-raised"),input:get("surface-input"),text:get("text"),strong:get("text-strong"),muted:get("muted"),mutedStrong:get("muted-strong"),accent:get("accent"),accentHover:get("accent-hover"),accentInk:get("accent-ink"),tagBg:get("tag-bg"),tagText:get("tag-text"),focus:get("focus"),statusBg:get("status-bg"),opacity:Number((css.match(/\.button:disabled\{opacity:([0-9.]+)/)||[])[1])};
}
function luminance(hex){
 const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
 return c[0]*.2126+c[1]*.7152+c[2]*.0722;
}
function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function mix(foreground,background,opacity){
 const channels=[1,3,5].map(i=>Math.round(parseInt(foreground.slice(i,i+2),16)*opacity+parseInt(background.slice(i,i+2),16)*(1-opacity)));
 return "#"+channels.map(v=>v.toString(16).padStart(2,"0")).join("");
}
function expectAa(label,foreground,backgrounds,minimum=4.5){
 for(const background of backgrounds){const ratio=contrast(foreground,background);assert.ok(ratio>=minimum,label+" contrast "+ratio.toFixed(2)+":1 on "+background+"; expected at least "+minimum+":1");}
}
for(const name of ["dark","light"]){
 test(name+" theme text, links, labels and placeholders meet WCAG AA",()=>{
  const p=theme(name);
  expectAa(name+" body text",p.text,[p.page,p.glow,p.surface,p.raised]);
  expectAa(name+" muted text",p.muted,[p.page,p.glow,p.surface,p.raised,p.input]);
  expectAa(name+" links",p.accent,[p.page,p.glow,p.surface,p.tagBg]);
  expectAa(name+" field labels",p.mutedStrong,[p.input,p.raised]);
  expectAa(name+" input placeholders",p.muted,[p.input]);
  expectAa(name+" status text",p.mutedStrong,[p.statusBg]);
  expectAa(name+" primary button text",p.accentInk,[p.accent,p.accentHover]);
  expectAa(name+" secondary button text",p.strong,[p.raised]);
  expectAa(name+" quiet button text",p.mutedStrong,[p.surface,p.raised]);
  expectAa(name+" official label text",p.tagText,[p.tagBg]);
  expectAa(name+" inferred label text",p.accent,[p.tagBg]);
 });
 test(name+" theme focus outline meets 3:1 and disabled buttons remain distinguishable",()=>{
  const p=theme(name);
  expectAa(name+" focus outline",p.focus,[p.page,p.glow,p.surface,p.raised,p.input],3);
  assert.ok(Number.isFinite(p.opacity)&&p.opacity>=.7&&p.opacity<=1,"Disabled opacity must preserve contrast");
  for(const parent of [p.page,p.surface,p.raised]){
   const primaryBg=mix(p.accent,parent,p.opacity),primaryText=mix(p.accentInk,parent,p.opacity);
   const secondaryBg=mix(p.raised,parent,p.opacity),secondaryText=mix(p.strong,parent,p.opacity);
   assert.ok(contrast(primaryText,primaryBg)>=3,name+" disabled primary contrast is too low on "+parent);
   assert.ok(contrast(secondaryText,secondaryBg)>=3,name+" disabled secondary contrast is too low on "+parent);
  }
 });
}
test("inferred labels retain a non-colour cue",()=>{
 assert.match(css,/\.tag\.inferred\{[^}]*border-style:dashed/i,"Inferred labels must use a dashed border");
});
test("keyboard focus indicators remain explicit and reduced motion is respected",()=>{
 assert.match(css,/button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,summary:focus-visible\{outline:3px solid var\(--focus\)/i);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/i);
});
