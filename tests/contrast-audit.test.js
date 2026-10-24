import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const css=fs.readFileSync(new URL("../css/styles.css",import.meta.url),"utf8");
function theme(name){
 const m=css.match(name==="light"?/:root\[data-theme="light"\]\{([^}]*)\}/:/:root\{([^}]*)\}/);
 assert.ok(m,"Missing "+name+" theme");
 const t=Object.fromEntries([...m[1].matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6})/gi)].map(x=>[x[1].slice(2),x[2].toLowerCase()]));
 const get=k=>{assert.ok(t[k],"Missing token "+k);return t[k];};
 return {page:get("page"),glow:get("page-glow"),surface:get("surface"),raised:get("surface-raised"),input:get("surface-input"),text:get("text"),strong:get("text-strong"),muted:get("muted"),mutedStrong:get("muted-strong"),line:get("line"),lineStrong:get("line-strong"),accent:get("accent"),accentHover:get("accent-hover"),accentInk:get("accent-ink"),tagBg:get("tag-bg"),tagText:get("tag-text"),focus:get("focus"),warningBg:get("warning-bg"),warningText:get("warning-text"),statusBg:get("status-bg"),error:get("error"),success:get("success"),opacity:Number((css.match(/\.button:disabled\{opacity:([0-9.]+)/)||[])[1])};
}
function luminance(h){const c=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
function ratio(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
function composite(f,b,o){return "#"+[1,3,5].map(i=>Math.round(parseInt(f.slice(i,i+2),16)*o+parseInt(b.slice(i,i+2),16)*(1-o)).toString(16).padStart(2,"0")).join("");}
function check(label,fg,bgs,min,name){const rs=bgs.map(bg=>ratio(fg,bg));const worst=Math.min(...rs);assert.ok(worst>=min,name+" "+label+" "+worst.toFixed(2)+":1 < "+min+":1");console.log("[contrast] "+name+" | "+label+" | minimum "+worst.toFixed(2)+":1");}
for(const name of ["dark","light"]){
 test(name+" theme text and semantic message contrast",()=>{
  const p=theme(name),surfaces=[p.page,p.glow,p.surface,p.raised,p.input];
  for(const row of [
   ["body copy and issue descriptions",p.text,surfaces,4.5],
   ["headings and emphasized text",p.strong,surfaces,4.5],
   ["muted hints metadata and placeholders",p.muted,surfaces,4.5],
   ["field labels and neutral status text",p.mutedStrong,[p.input,p.raised,p.surface,p.statusBg],4.5],
   ["links eyebrow and disclosure summary",p.accent,[p.page,p.glow,p.surface],4.5],
   ["primary button label",p.accentInk,[p.accent,p.accentHover],4.5],
   ["secondary button label",p.strong,[p.raised],4.5],
   ["quiet button label",p.mutedStrong,[p.surface,p.raised],4.5],
   ["input value text",p.strong,[p.input],4.5],
   ["official tag text",p.tagText,[p.tagBg],4.5],
   ["inferred category text",p.accent,[p.tagBg],4.5],
   ["warning status text",p.warningText,[p.warningBg],4.5]
  ]) check(row[0],row[1],row[2],row[3],name);
  check("error status indicator",p.error,[p.statusBg],3,name);
  check("success status indicator",p.success,[p.statusBg],3,name);
 });
 test(name+" theme component boundaries focus and disabled controls",()=>{
  const p=theme(name),surfaces=[p.page,p.glow,p.surface,p.raised,p.input,p.statusBg,p.tagBg];
  check("panel card field border",p.line,surfaces,3,name);
  check("strong control border",p.lineStrong,[p.input,p.raised,p.surface],3,name);
  check("keyboard focus outline",p.focus,[p.page,p.glow,p.surface,p.raised,p.input],3,name);
  check("inferred tag dashed border",p.accent,[p.tagBg],3,name);
  check("warning border","#b58105",[p.warningBg],3,name);
  check("error border",p.error,[p.statusBg],3,name);
  check("success border",p.success,[p.statusBg],3,name);
  assert.match(css,/\.tag\.inferred\{[^}]*border-style:dashed[^}]*border-color:var\(--accent\)/i);
  assert.ok(p.opacity>=.7&&p.opacity<=1,"Disabled opacity must be explicitly defined");
  for(const parent of [p.page,p.surface,p.raised])for(const row of [["disabled primary",p.accentInk,p.accent],["disabled secondary",p.strong,p.raised],["disabled quiet",p.mutedStrong,p.surface]]){const r=ratio(composite(row[1],parent,p.opacity),composite(row[2],parent,p.opacity));assert.ok(r>=3,name+" "+row[0]+" contrast below 3:1");console.log("[contrast] "+name+" | "+row[0]+" | "+r.toFixed(2)+":1");}
 });
}
