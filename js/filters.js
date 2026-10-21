export const CATEGORIES=["Bug fix","Documentation","Tests","Feature or enhancement","Refactoring","Other/No category inferred"];
const DAY=86400000;
const validDate=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+"T00:00:00Z"))&&new Date(v+"T00:00:00Z").toISOString().slice(0,10)===v;
export function inferCategories(issue){
 const labels=(issue.labels||[]).map(x=>typeof x==="string"?x:x.name||"");const lt=labels.join(" ").toLowerCase();const text=(String(issue.title||"")+" "+String(issue.body||"")).toLowerCase();const out=[];
 const rules=[["Bug fix",/\b(bug|defect|regression|crash|broken|incorrect behavior)\b/,/\b(fix|bug|defect|regression)\b/],["Documentation",/\b(documentation|docs?|readme|typo|guide|tutorial)\b/,/\b(docs?|documentation)\b/],["Tests",/\b(test|tests|testing|coverage|unit test|integration test)\b/,/\b(test|tests|testing|coverage)\b/],["Feature or enhancement",/\b(feature|enhancement|support for|add support|request)\b/,/\b(feature|enhancement|improvement)\b/],["Refactoring",/\b(refactor|cleanup|clean up|technical debt|simplify)\b/,/\b(refactor|refactoring)\b/]];
 for(const [name,tp,lp] of rules)if(tp.test(text)||lp.test(lt))out.push(name);return out.length?out:["Other/No category inferred"];
}
export function withinDays(value,days,now=Date.now()){const date=Date.parse(value||"");return Number.isFinite(date)&&Number.isFinite(Number(days))&&date>=now-Number(days)*DAY&&date<=now;}
export function withinDateRange(value,after="",before="",now=Date.now()){
 const date=Date.parse(value||"");if(!Number.isFinite(date))return false;
 if(after&&(!validDate(after)||date<Date.parse(after+"T00:00:00Z")))return false;
 if(before&&(!validDate(before)||date>Date.parse(before+"T23:59:59.999Z")))return false;
 return date<=now;
}
function dateIsInRange(value,after,before,days,now){if(after||before)return withinDateRange(value,after,before,now);return !days||withinDays(value,days,now);}
export function matchesFilters(issue,f,now=Date.now()){
 const repo=issue.repository||{};const labels=(issue.labels||[]).map(x=>typeof x==="string"?x:x.name||"");const text=(String(issue.title||"")+" "+String(issue.body||"")+" "+String(repo.full_name||"")+" "+labels.join(" ")).toLowerCase();
 if(f.query&&!text.includes(f.query.trim().toLowerCase()))return false;
 if(f.language){const langs=Array.isArray(repo.languages)?repo.languages:[repo.language].filter(Boolean);if(!langs.some(x=>String(x).toLowerCase()===f.language.toLowerCase()))return false;}
 if((f.labels||[]).some(w=>!labels.some(l=>l.toLowerCase()===w.toLowerCase())))return false;
 if(f.issueType==="issue"&&issue.pull_request)return false;if(f.issueType==="pr"&&!issue.pull_request)return false;
 if(f.category&&!inferCategories(issue).includes(f.category))return false;
 if(!dateIsInRange(issue.created_at,f.createdAfter,f.createdBefore,f.createdDays,now))return false;
 if(!dateIsInRange(issue.updated_at,f.updatedAfter,f.updatedBefore,f.updatedDays,now))return false;
 const stars=Number(repo.stargazers_count);
 if(f.stars){const a=f.stars.split("-");if(!Number.isFinite(stars)||(a[0]!==""&&stars<Number(a[0]))||(a[1]!==""&&stars>Number(a[1])))return false;}
 if(f.minStars!==""&&f.minStars!==undefined&&(!Number.isFinite(stars)||stars<Number(f.minStars)))return false;
 if(f.maxStars!==""&&f.maxStars!==undefined&&(!Number.isFinite(stars)||stars>Number(f.maxStars)))return false;
 if(!dateIsInRange(repo.latestCommitDate,f.commitAfter,f.commitBefore,f.commitAgeDays,now))return false;
 return true;
}
export function buildSearchQuery(f,now=Date.now()){
 const p=["is:open"];if(f.query)p.push(f.query.trim());
 for(const label of f.labels||[])p.push('label:"'+label.replaceAll('"',"")+'"');
 if(f.issueType==="issue")p.push("is:issue");if(f.issueType==="pr")p.push("is:pr");
 if(f.createdAfter||f.createdBefore){if(f.createdAfter)p.push("created:>="+f.createdAfter);if(f.createdBefore)p.push("created:<="+f.createdBefore);}else if(f.createdDays)p.push("created:>="+new Date(now-Number(f.createdDays)*DAY).toISOString().slice(0,10));
 if(f.updatedAfter||f.updatedBefore){if(f.updatedAfter)p.push("updated:>="+f.updatedAfter);if(f.updatedBefore)p.push("updated:<="+f.updatedBefore);}else if(f.updatedDays)p.push("updated:>="+new Date(now-Number(f.updatedDays)*DAY).toISOString().slice(0,10));
 if(f.minStars!==""&&f.minStars!==undefined)p.push("stars:>="+f.minStars);
 if(f.maxStars!==""&&f.maxStars!==undefined)p.push("stars:<="+f.maxStars);
 if(f.stars&&!((f.minStars!==""&&f.minStars!==undefined)||(f.maxStars!==""&&f.maxStars!==undefined))){const a=f.stars.split("-");if(a[0])p.push("stars:>="+a[0]);if(a[1])p.push("stars:<="+a[1]);}
 return p.join(" ");
}
const dateValue=v=>typeof v==="string"&&validDate(v)?v:"";
const numberValue=v=>v!==""&&v!==null&&v!==undefined&&Number.isSafeInteger(Number(v))&&Number(v)>=0&&Number(v)<=100000000?String(Number(v)):"";
export function normalizeFilters(f={}){
 const createdAfter=dateValue(f.createdAfter),createdBefore=dateValue(f.createdBefore),updatedAfter=dateValue(f.updatedAfter),updatedBefore=dateValue(f.updatedBefore),commitAfter=dateValue(f.commitAfter),commitBefore=dateValue(f.commitBefore);
 const minStars=numberValue(f.minStars),maxStars=numberValue(f.maxStars);
 return {query:String(f.query||"").trim().slice(0,200),language:String(f.language||"").trim().slice(0,50),labels:[...new Set((Array.isArray(f.labels)?f.labels:[]).map(x=>String(x).trim().slice(0,80)).filter(Boolean))].slice(0,20).sort(),issueType:["issue","pr"].includes(f.issueType)?f.issueType:"",category:CATEGORIES.includes(f.category)?f.category:"",createdDays:createdAfter||createdBefore?"":(["7","30","90","365"].includes(String(f.createdDays||""))?String(f.createdDays||""):""),updatedDays:updatedAfter||updatedBefore?"":(["7","30","90","365"].includes(String(f.updatedDays||""))?String(f.updatedDays||""):""),commitAgeDays:commitAfter||commitBefore?"":(["30","90","180","365"].includes(String(f.commitAgeDays||""))?String(f.commitAgeDays||""):""),createdAfter,createdBefore,updatedAfter,updatedBefore,commitAfter,commitBefore,stars:minStars!==""||maxStars!==""?"":(["0-99","100-999","1000-9999","10000-"].includes(f.stars)?f.stars:""),minStars,maxStars,sort:["updated","created","comments","relevance"].includes(f.sort)?f.sort:"updated"};
}
