const KEY="v36.saved.v1";export const MAX_IMPORT_BYTES=1048576;const LIMIT=2000;
const str=(v,n=10000)=>typeof v==="string"?v.slice(0,n):"";const dateValue=v=>typeof v==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v+"T00:00:00Z"))&&new Date(v+"T00:00:00Z").toISOString().slice(0,10)===v?v:"";const numberValue=v=>v!==""&&v!==null&&v!==undefined&&Number.isSafeInteger(Number(v))&&Number(v)>=0&&Number(v)<=100000000?String(Number(v)):"";
function issueUrl(v){try{const u=new URL(v);if(u.hostname!=="github.com"||!/^\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/(issues|pull)\/\d+\/?$/.test(u.pathname))return "";return "https://github.com"+u.pathname.replace(/\/$/,"");}catch{return "";}}
function cleanIssue(x){if(!x||typeof x!=="object")return null;const url=issueUrl(x.url||x.html_url);if(!url)return null;return {url,title:str(x.title,500),repository:str(x.repository,300),number:Number.isSafeInteger(x.number)&&x.number>0?x.number:Number(url.match(/\/(\d+)$/)?.[1]||0),savedAt:str(x.savedAt,40)||new Date().toISOString()};}
function key(f){return JSON.stringify(Object.fromEntries(Object.entries(f||{}).sort(([a],[b])=>a.localeCompare(b))));}
function cleanSearch(x){if(!x||typeof x!=="object"||!x.filters||typeof x.filters!=="object")return null;const f=x.filters;const filters={query:str(f.query,200),language:str(f.language,50),labels:Array.isArray(f.labels)?[...new Set(f.labels.filter(v=>typeof v==="string").map(v=>v.slice(0,80)).filter(Boolean))].sort().slice(0,20):[],issueType:["issue","pr",""].includes(f.issueType)?f.issueType:"",category:str(f.category,80),createdDays:["","7","30","90","365"].includes(String(f.createdDays||""))?String(f.createdDays||""):"",updatedDays:["","7","30","90","365"].includes(String(f.updatedDays||""))?String(f.updatedDays||""):"",commitAgeDays:["","30","90","180","365"].includes(String(f.commitAgeDays||""))?String(f.commitAgeDays||""):"",createdAfter:dateValue(f.createdAfter),createdBefore:dateValue(f.createdBefore),updatedAfter:dateValue(f.updatedAfter),updatedBefore:dateValue(f.updatedBefore),commitAfter:dateValue(f.commitAfter),commitBefore:dateValue(f.commitBefore),minStars:numberValue(f.minStars),maxStars:numberValue(f.maxStars),stars:["","0-99","100-999","1000-9999","10000-"].includes(f.stars)?f.stars:"",sort:["updated","created","comments","relevance"].includes(f.sort)?f.sort:"updated"};return {id:str(x.id,100)||key(filters),name:str(x.name,100)||"Saved search",filters,savedAt:str(x.savedAt,40)||new Date().toISOString()};}
function dedupe(items,fn){const seen=new Set(),out=[];for(const x of items){const k=fn(x);if(k&&!seen.has(k)){seen.add(k);out.push(x);}}return out.slice(0,LIMIT);}
export function validateBackup(x){if(!x||typeof x!=="object"||x.version!==1||!Array.isArray(x.issues)||!Array.isArray(x.searches))throw new Error("Unsupported V36 backup format.");if(x.issues.length>LIMIT||x.searches.length>LIMIT)throw new Error("Backup contains too many items.");return {version:1,exportedAt:str(x.exportedAt,40),issues:dedupe(x.issues.map(cleanIssue).filter(Boolean, v=>v.url),item=>item.url),searches:dedupe(x.searches.map(cleanSearch).filter(Boolean),search=>key(search.filters))};}
export function loadSaved(){try{const raw=localStorage.getItem(KEY);return raw?validateBackup(JSON.parse(raw)):{version:1,issues:[],searches:[]};}catch{return {version:1,issues:[],searches:[],storageWarning:"Saved data could not be read; existing browser data was not overwritten."};}}
export function saveSaved(x){const clean=validateBackup({...x,version:1});if(typeof localStorage!=="undefined")localStorage.setItem(KEY,JSON.stringify(clean));return clean;}
export function addSavedIssue(data,issue){const x=cleanIssue({url:issue.html_url,title:issue.title,repository:issue.repository?.full_name,number:issue.number,savedAt:new Date().toISOString()});if(!x)throw new Error("Issue URL is not a valid GitHub issue URL.");return saveSaved({...data,issues:dedupe([x,...data.issues],i=>i.url)});}
export function addSavedSearch(data,filters,name){const x=cleanSearch({filters,name:name||"Saved search",id:key(filters),savedAt:new Date().toISOString()});return saveSaved({...data,searches:dedupe([x,...data.searches],i=>key(i.filters))});}
export function removeSavedIssue(data,url){return saveSaved({...data,issues:data.issues.filter(x=>x.url!==url)});}
export function removeSavedSearch(data,id){return saveSaved({...data,searches:data.searches.filter(x=>x.id!==id)});}
export function exportBackup(data){return JSON.stringify({version:1,exportedAt:new Date().toISOString(),issues:data.issues,searches:data.searches},null,2);}
export async function parseImportFile(file){
 if(!file)throw new Error("Choose a backup file first.");
 if(file.size>MAX_IMPORT_BYTES)throw new Error("Backup exceeds the 1 MB import limit.");
 const raw=JSON.parse(await file.text());
 const valid=validateBackup(raw);
 const cleanIssues=raw.issues.map(cleanIssue).filter(Boolean);
 const cleanSearches=raw.searches.map(cleanSearch).filter(Boolean);
 return {...valid,importReport:{
  acceptedIssues:valid.issues.length,rejectedIssues:raw.issues.length-cleanIssues.length,duplicateIssues:cleanIssues.length-valid.issues.length,
  acceptedSearches:valid.searches.length,rejectedSearches:raw.searches.length-cleanSearches.length,duplicateSearches:cleanSearches.length-valid.searches.length
 }};
}
export function mergeBackup(current,incoming){return saveSaved({version:1,issues:dedupe([...current.issues,...incoming.issues],x=>x.url),searches:dedupe([...current.searches,...incoming.searches],x=>key(x.filters))});}
