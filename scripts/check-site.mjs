import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const pages=['index.html','about/index.html','community-relations/index.html','photography/index.html','writing/index.html','creative-media/index.html','resume/index.html','web-development/index.htm'];
const root=process.cwd(), documents=new Map(pages.map(p=>[p,fs.readFileSync(p,'utf8')]));
let references=0, scripts=0;
for(const [file,html] of documents){
 assert.equal([...html.matchAll(/<h1\b/g)].length,1,`${file}: one main heading`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,`${file}: unique IDs`);
 assert(html.includes('/assets/js/navigation.js?'),`${file}: shared navigation`);
 assert(!html.includes('cdn.tailwindcss.com'),`${file}: compiled CSS`);
 assert(html.includes('property="og:image"'),`${file}: sharing image`);
 assert(!/lorem ipsum|amandalsullivan@example|\[OfficialImagePlaceholder\]|100% Sustainable|SENIOR STAFF ASSISTANT/i.test(html),`${file}: no obsolete artifacts`);
 for(const match of html.matchAll(/<(?:img|script|link|iframe|a)\b[^>]*>/g)){
   const tag=match[0];
   if(tag.startsWith('<img')) assert(/\balt="[^"]*"/.test(tag),`${file}: image alt`);
   const attr=tag.match(/\b(?:href|src)="([^"]*)"/);if(!attr||!attr[1]||/^(https?:|mailto:|tel:|data:)/.test(attr[1])||attr[1].includes('${'))continue;
   const url=new URL(attr[1].replaceAll('&amp;','&'),`https://local.test/${file}`);
   const local=decodeURIComponent(url.pathname).slice(1);let target=local;
   if(!target||target.endsWith('/'))target+='index.html';
   assert(fs.existsSync(path.join(root,target)),`${file}: missing ${target}`);
   if(url.hash&&documents.has(target))assert(documents.get(target).includes(`id="${url.hash.slice(1)}"`),`${file}: missing anchor ${attr[1]}`);
   references++;
 }
 for(const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)){
   if(match[1].includes('application/ld+json')){JSON.parse(match[2]);continue;}
   if(match[2].trim()){new vm.Script(match[2],{filename:file});scripts++;}
 }
}
for(const file of fs.readdirSync('assets/js'))new vm.Script(fs.readFileSync('assets/js/'+file,'utf8'),{filename:file});
const photo=documents.get('photography/index.html');
assert.equal([...photo.matchAll(/data-photo-index="/g)].length,14,'14 professional photos in HTML');
const personal=[...photo.matchAll(/<a\b[^>]*class="personal-photo"[^>]*>/g)].map(m=>m[0].match(/href="([^"]+)"/)[1]);
assert.equal(personal.length,16,'16 personal photos');assert.equal(new Set(personal).size,16,'no personal duplicates');
const creative=documents.get('creative-media/index.html');
assert.equal([...creative.matchAll(/<iframe /g)].length,5,'all five videos remain');
assert(creative.includes('u5Ztnd1BA-s')&&creative.includes('281642860013007'),'requested videos preserved');
assert(documents.get('resume/index.html').includes('November 2019 – September 2025'),'master resume date');
assert(fs.existsSync('assets/documents/Amanda_Sullivan_Universal_Resume_2026.pdf'),'download PDF');
assert(fs.existsSync('sitemap.xml')&&fs.existsSync('robots.txt'),'crawl discovery');
console.log(`PASS: ${pages.length} pages, ${references} local references, ${scripts} inline scripts; 14 professional photos, 16 unique personal photos, five videos.`);
