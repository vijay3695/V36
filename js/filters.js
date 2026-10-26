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
function dateIsInRange(value,after,before,days,now){if(!value||!Number.isFinite(Date.parse(value)))return null;if(after||before)return withinDateRange(value,after,before,now);return !days||withinDays(value,days,now);}
export function matchesFilters(issue,f,now=Date.now()){
 const repo=issue.repository||{};const labels=Array.isArray(issue.labels)?issue.labels.map(x=>typeof x==="string"?x:x.name||""):[];const text=(String(issue.title||"")+" "+String(issue.body||"")+" "+String(repo.full_name||"")+" "+labels.join(" ")).toLowerCase();
 if(f.query&&!text.includes(f.query.trim().toLowerCase()))return false;
 if(f.language){const target=f.language.toLowerCase();if(Array.isArray(repo.languages)){if(!repo.languages.some(x=>String(x).toLowerCase()===target))return false;}else if(repo.language&&String(repo.language).toLowerCase()===target){} }
 if(Array.isArray(issue.labels)&&(f.labels||[]).some(w=>!labels.some(l=>l.toLowerCase()===w.toLowerCase())))return false;
 if(f.issueType==="issue"&&issue.pull_request)return false;if(f.issueType==="pr"&&!issue.pull_request)return false;
 if(f.category&&!( !issue.title&&!issue.body&&!Array.isArray(issue.labels) )&&!inferCategories(issue).includes(f.category))return false;
 if(dateIsInRange(issue.created_at,f.createdAfter,f.createdBefore,f.createdDays,now)===false)return false;
 if(dateIsInRange(issue.updated_at,f.updatedAfter,f.updatedBefore,f.updatedDays,now)===false)return false;
 const stars=Number.isFinite(repo.stargazers_count)?repo.stargazers_count:NaN;
 if(Number.isFinite(stars)&&f.stars){const a=f.stars.split("-");if((a[0]!==""&&stars<Number(a[0]))||(a[1]!==""&&stars>Number(a[1])))return false;}
 if(Number.isFinite(stars)&&f.minStars!==""&&f.minStars!==undefined&&stars<Number(f.minStars))return false;
 if(Number.isFinite(stars)&&f.maxStars!==""&&f.maxStars!==undefined&&stars>Number(f.maxStars))return false;
 if(dateIsInRange(repo.latestCommitDate,f.commitAfter,f.commitBefore,f.commitAgeDays,now)===false)return false;
 if(dateIsInRange(repo.pushed_at,f.pushAfter,f.pushBefore,f.pushAgeDays,now)===false)return false;
 return true;
}
export function unknownFilterReasons(issue,f){
 const repo=issue.repository||{},reasons=[];
 if(f.language&&!Array.isArray(repo.languages)&&(!repo.language||String(repo.language).toLowerCase()!==f.language.toLowerCase()))reasons.push("language metadata");
 if((f.labels||[]).length&&!Array.isArray(issue.labels))reasons.push("labels");
 if((f.createdDays||f.createdAfter||f.createdBefore)&&(!issue.created_at||!Number.isFinite(Date.parse(issue.created_at))))reasons.push("issue creation date");
 if((f.updatedDays||f.updatedAfter||f.updatedBefore)&&(!issue.updated_at||!Number.isFinite(Date.parse(issue.updated_at))))reasons.push("issue update date");
 if((f.stars||f.minStars!==""&&f.minStars!==undefined||f.maxStars!==""&&f.maxStars!==undefined)&&!Number.isFinite(repo.stargazers_count))reasons.push("repository star count");
 if((f.commitAgeDays||f.commitAfter||f.commitBefore)&&(!repo.latestCommitDate||!Number.isFinite(Date.parse(repo.latestCommitDate))))reasons.push("latest commit date");
 if((f.pushAgeDays||f.pushAfter||f.pushBefore)&&(!repo.pushed_at||!Number.isFinite(Date.parse(repo.pushed_at))))reasons.push("repository last push date");
 if(f.category&&!issue.title&&!issue.body&&!Array.isArray(issue.labels))reasons.push("category evidence");
 return reasons;
}
export function buildSearchQuery(f,now=Date.now()){
 const p=["is:open"];if(f.query)p.push(f.query.trim());
 for(const label of f.labels||[])p.push('label:"'+label.replaceAll('"',"")+'"');
 if(f.issueType==="pr")p.push("is:pr");else p.push("is:issue");
 if(f.createdAfter||f.createdBefore){if(f.createdAfter)p.push("created:>="+f.createdAfter);if(f.createdBefore)p.push("created:<="+f.createdBefore);}else if(f.createdDays)p.push("created:>="+new Date(now-Number(f.createdDays)*DAY).toISOString().slice(0,10));
 if(f.updatedAfter||f.updatedBefore){if(f.updatedAfter)p.push("updated:>="+f.updatedAfter);if(f.updatedBefore)p.push("updated:<="+f.updatedBefore);}else if(f.updatedDays)p.push("updated:>="+new Date(now-Number(f.updatedDays)*DAY).toISOString().slice(0,10));
 if(f.minStars!==""&&f.minStars!==undefined)p.push("stars:>="+f.minStars);
 if(f.maxStars!==""&&f.maxStars!==undefined)p.push("stars:<="+f.maxStars);
 if(f.stars&&!((f.minStars!==""&&f.minStars!==undefined)||(f.maxStars!==""&&f.maxStars!==undefined))){const a=f.stars.split("-");if(a[0])p.push("stars:>="+a[0]);if(a[1])p.push("stars:<="+a[1]);}
 return p.join(" ");
}
const dateValue=v=>typeof v==="string"&&validDate(v)?v:"";
const SORT_LABELS={updated:"Recently updated",created:"Recently created",comments:"Most discussed",relevance:"GitHub relevance"};
export function relatedSearchUrl(repoName,title,kind="issue"){
 const name=String(repoName||"").trim(),text=String(title||"").trim().slice(0,100);
 const query=(/^[^/\s]+\/[^/\s]+$/.test(name)?"repo:"+name+" ":"")+text;
 const params=new URLSearchParams({q:query.trim()||"is:open",type:kind==="pr"?"pullrequests":"issues"});
 return "https://github.com/search?"+params.toString();
}

export function describeFilters(f={}){
 const p=[];
 if(f.query)p.push("Search: "+f.query);
 if(f.language)p.push("Language: "+f.language);
 if(f.labels?.length)p.push("Labels: "+f.labels.join(", "));
 if(f.issueType)p.push(f.issueType==="pr"?"Pull requests only":"Issues only");
 if(f.category)p.push("Category: "+f.category);
 if(f.createdAfter||f.createdBefore)p.push("Created: "+(f.createdAfter||"any")+" to "+(f.createdBefore||"any"));
 else if(f.createdDays)p.push("Created: last "+f.createdDays+" days");
 if(f.updatedAfter||f.updatedBefore)p.push("Updated: "+(f.updatedAfter||"any")+" to "+(f.updatedBefore||"any"));
 else if(f.updatedDays)p.push("Updated: last "+f.updatedDays+" days");
 if(f.commitAfter||f.commitBefore)p.push("Latest commit: "+(f.commitAfter||"any")+" to "+(f.commitBefore||"any"));
 else if(f.commitAgeDays)p.push("Latest commit: within "+f.commitAgeDays+" days");
 if(f.pushAfter||f.pushBefore)p.push("Repository push: "+(f.pushAfter||"any")+" to "+(f.pushBefore||"any"));
 else if(f.pushAgeDays)p.push("Repository push: within "+f.pushAgeDays+" days");
 if(f.minStars||f.maxStars)p.push("Stars: "+(f.minStars||"0")+"–"+(f.maxStars||"any"));
 else if(f.stars)p.push("Stars: "+f.stars);
 if(f.sort&&f.sort!=="updated")p.push("Sort: "+(SORT_LABELS[f.sort]||f.sort));
 return p.length?p.join(" · "):"No filters set";
}
const LANGUAGE_ALIASES={js:"JavaScript",javascript:"JavaScript",jsx:"JavaScript",mjs:"JavaScript",cjs:"JavaScript",ts:"TypeScript",typescript:"TypeScript",tsx:"TypeScript",py:"Python",python:"Python",golang:"Go",go:"Go",rs:"Rust",rust:"Rust",rb:"Ruby",ruby:"Ruby",yml:"YAML",yaml:"YAML",sh:"Shell",bash:"Shell",zsh:"Shell",html:"HTML",htm:"HTML",css:"CSS",csharp:"C#", "c#":"C#", "cpp":"C++", "c++":"C++", "cxx":"C++", "objective-c":"Objective-C",objc:"Objective-C",md:"Markdown",markdown:"Markdown",ipynb:"Jupyter Notebook"};
export function normalizeLanguage(value){const raw=String(value||"").trim().slice(0,50);return LANGUAGE_ALIASES[raw.toLowerCase()]||raw;}

const numberValue=v=>v!==""&&v!==null&&v!==undefined&&Number.isSafeInteger(Number(v))&&Number(v)>=0&&Number(v)<=100000000?String(Number(v)):"";
export function normalizeFilters(f={}){
 const createdAfter=dateValue(f.createdAfter),createdBefore=dateValue(f.createdBefore),updatedAfter=dateValue(f.updatedAfter),updatedBefore=dateValue(f.updatedBefore),commitAfter=dateValue(f.commitAfter),commitBefore=dateValue(f.commitBefore),pushAfter=dateValue(f.pushAfter),pushBefore=dateValue(f.pushBefore);
 const minStars=numberValue(f.minStars),maxStars=numberValue(f.maxStars);
 return {query:String(f.query||"").trim().slice(0,200),language:normalizeLanguage(f.language),labels:[...new Set((Array.isArray(f.labels)?f.labels:[]).map(x=>String(x).trim().slice(0,80)).filter(Boolean))].slice(0,20).sort(),issueType:["issue","pr"].includes(f.issueType)?f.issueType:"",category:CATEGORIES.includes(f.category)?f.category:"",createdDays:createdAfter||createdBefore?"":(["7","30","90","365"].includes(String(f.createdDays||""))?String(f.createdDays||""):""),updatedDays:updatedAfter||updatedBefore?"":(["7","30","90","365"].includes(String(f.updatedDays||""))?String(f.updatedDays||""):""),commitAgeDays:commitAfter||commitBefore?"":(["30","90","180","365"].includes(String(f.commitAgeDays||""))?String(f.commitAgeDays||""):""),pushAgeDays:pushAfter||pushBefore?"":(["30","90","180","365"].includes(String(f.pushAgeDays||""))?String(f.pushAgeDays||""):""),createdAfter,createdBefore,updatedAfter,updatedBefore,commitAfter,commitBefore,pushAfter,pushBefore,stars:minStars!==""||maxStars!==""?"":(["0-99","100-999","1000-9999","10000-"].includes(f.stars)?f.stars:""),minStars,maxStars,sort:["updated","created","comments","relevance"].includes(f.sort)?f.sort:"updated"};
}
