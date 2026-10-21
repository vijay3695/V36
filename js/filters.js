export const CATEGORIES=["Bug fix","Documentation","Tests","Feature or enhancement","Refactoring","Other/No category inferred"];
export function inferCategories(issue){
 const labels=(issue.labels||[]).map(x=>typeof x==="string"?x:x.name||"");const lt=labels.join(" ").toLowerCase();const text=(String(issue.title||"")+" "+String(issue.body||"")).toLowerCase();const out=[];
 const rules=[["Bug fix",/\b(bug|defect|regression|crash|broken|incorrect behavior)\b/,/\b(fix|bug|defect|regression)\b/],["Documentation",/\b(documentation|docs?|readme|typo|guide|tutorial)\b/,/\b(docs?|documentation)\b/],["Tests",/\b(test|tests|testing|coverage|unit test|integration test)\b/,/\b(test|tests|testing|coverage)\b/],["Feature or enhancement",/\b(feature|enhancement|support for|add support|request)\b/,/\b(feature|enhancement|improvement)\b/],["Refactoring",/\b(refactor|cleanup|clean up|technical debt|simplify)\b/,/\b(refactor|refactoring)\b/]];
 for(const [name,tp,lp] of rules)if(tp.test(text)||lp.test(lt))out.push(name);return out.length?out:["Other/No category inferred"];
}
export function withinDays(value,days,now=Date.now()){const date=Date.parse(value||"");return Number.isFinite(date)&&Number.isFinite(Number(days))&&date>=now-Number(days)*86400000&&date<=now;}
export function matchesFilters(issue,f,now=Date.now()){
 const repo=issue.repository||{};const labels=(issue.labels||[]).map(x=>typeof x==="string"?x:x.name||"");const text=(String(issue.title||"")+" "+String(issue.body||"")+" "+String(repo.full_name||"")+" "+labels.join(" ")).toLowerCase();
 if(f.query&&!text.includes(f.query.trim().toLowerCase()))return false;
 if(f.language&&(repo.language||"").toLowerCase()!==f.language.toLowerCase())return false;
 if((f.labels||[]).some(w=>!labels.some(l=>l.toLowerCase()===w.toLowerCase())))return false;
 if(f.issueType==="issue"&&issue.pull_request)return false;if(f.issueType==="pr"&&!issue.pull_request)return false;
 if(f.category&&!inferCategories(issue).includes(f.category))return false;
 if(f.createdDays&&!withinDays(issue.created_at,f.createdDays,now))return false;
 if(f.updatedDays&&!withinDays(issue.updated_at,f.updatedDays,now))return false;
 if(f.stars){const a=f.stars.split("-");const n=Number(repo.stargazers_count);if(!Number.isFinite(n)||(a[0]!==""&&n<Number(a[0]))||(a[1]!==""&&n>Number(a[1])))return false;}
 if(f.commitAgeDays&&(!repo.latestCommitDate||!withinDays(repo.latestCommitDate,f.commitAgeDays,now)))return false;return true;
}
export function buildSearchQuery(f){
 const p=["is:open"];if(f.query)p.push(f.query.trim());if(f.language)p.push("language:"+f.language.trim());
 for(const label of f.labels||[])p.push('label:"'+label.replaceAll('"',"")+'"');
 if(f.issueType==="issue")p.push("is:issue");if(f.issueType==="pr")p.push("is:pr");
 if(f.createdDays)p.push("created:>="+new Date(Date.now()-Number(f.createdDays)*86400000).toISOString().slice(0,10));
 if(f.updatedDays)p.push("updated:>="+new Date(Date.now()-Number(f.updatedDays)*86400000).toISOString().slice(0,10));
 if(f.stars){const a=f.stars.split("-");if(a[0])p.push("stars:>="+a[0]);if(a[1])p.push("stars:<="+a[1]);}return p.join(" ");
}
export function normalizeFilters(f){return {query:String(f.query||"").trim(),language:String(f.language||"").trim(),labels:[...new Set((f.labels||[]).map(x=>String(x).trim()).filter(Boolean))].sort(),issueType:["issue","pr"].includes(f.issueType)?f.issueType:"",category:CATEGORIES.includes(f.category)?f.category:"",createdDays:["7","30","90","365"].includes(String(f.createdDays||""))?String(f.createdDays||""):"",updatedDays:["7","30","90","365"].includes(String(f.updatedDays||""))?String(f.updatedDays||""):"",commitAgeDays:["30","90","180","365"].includes(String(f.commitAgeDays||""))?String(f.commitAgeDays||""):"",stars:["0-99","100-999","1000-9999","10000-"].includes(f.stars)?f.stars:"",sort:["updated","created","comments"].includes(f.sort)?f.sort:"updated"};}
