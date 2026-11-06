import assert from 'node:assert/strict';
import fs from 'node:fs';
// Fake film bytes are only for rejecting mock evidence, not distribution or validating MP4.
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { audit, overlaps } from '../.agents/skills/chalkboard/assets/subject-audit.mjs';
import { projectBox, segmentTime } from '../.agents/skills/chalkboard/assets/layout-driver.mjs';
const safeSubject={id:'concept',kind:'subject',x:260,y:240,width:1400,height:500};
const safeLabel={id:'label',kind:'text',x:1160,y:60,width:660,height:82};
assert.equal(audit([safeSubject,safeLabel]).ok,true,'default safe layout');
for(const spec of [
 {desc:'text crossing subject',e:{id:'bad',kind:'text',x:260,y:400,width:250,height:80}},
 {desc:'text on frame edge',e:{id:'bad',kind:'text',x:0,y:0,width:250,height:30}},
 {desc:'text overlapping text',e:safeLabel},
 {desc:'subject too small',e:{id:'concept',kind:'subject',x:260,y:240,width:1400,height:200},remove:true},
]) {
 const elems=spec.remove?[spec.e,safeLabel]:[safeSubject,safeLabel,spec.e];
 assert.equal(audit(elems).ok,false,spec.desc);
}
assert(overlaps({x:9,y:9,width:5,height:5},{x:0,y:0,width:10,height:10}),'a and b ordering symmetric');
assert(!overlaps({x:0,y:0,width:10,height:10},{x:10,y:0,width:5,height:5}),'touching bounds allowed');
assert.equal(segmentTime(10,{t0:0,t1:10}).local,10,'one-frame in-range clip includes duration endpoint');
assert.deepEqual(projectBox({x:30,y:40,width:50,height:60},{cx:20,cy:20,zoom:2}),{x:20,y:40,width:100,height:60*2});
for(const slug of ['chalkboard','isometric-picture-book']) {
 const base=fs.mkdtempSync(path.join(os.tmpdir(),slug+'-'));
 const p=path.join(base,'project');
 const cli=`.agents/skills/${slug}/scripts/new_project.py`;
 execFileSync('python3',[cli,p,'--subject','unseen physics','--klp','provided-verified-intent','--goal','invariant water molecule during phase change'],{stdio:'pipe'});
 const d=JSON.parse(fs.readFileSync(path.join(p,'timeline.json'),'utf8'));
 assert.equal(d.subject,'unseen physics',slug+' uses intake subject');
 assert.equal(d['KLP code'],'provided-verified-intent',slug+' KLP');
 assert.equal(d.geometry.subject.implemented,false);
 for(const [mode,good] of [['layout',true],['strict',false],['render',false],['full',false]]) {
  let out='',code=0;
  try{out=execFileSync('node',['scripts/verify-project.mjs',mode],{cwd:p,encoding:'utf8'});}catch(e){out=e.stdout;code=e.status;}
  assert.equal(code,good?0:1,`${slug} ${mode}: ${out}`);
  const j=JSON.parse(out);assert.equal(j.mediaAccepted,false);
 }
 assert.throws(()=>execFileSync('python3',[cli,p,'--subject','x','--klp','x','--goal','x'],{stdio:'pipe'}), 'nonempty path protection');
}
console.log('PASS geometry rejects + intake + fresh scaffolds + placeholder refuses rendering; NOT a media approval');
