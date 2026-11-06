import {check} from '../assets/project-check.mjs';
const mode=process.argv[2]||'test';
if(mode==='test'){
 console.log('Static helpers loaded; use repo tests/verify-geometry.mjs for regression and fault injection.');
 console.log('Usage: node <skill>/scripts/verify.mjs <layout|strict|full> /absolute/path/to/generated-project');
}else{
 if(!process.argv[3])throw Error('Supply an absolute generated project path');
 const result=check(process.argv[3],mode);console.log(JSON.stringify(result,null,2));process.exitCode=result.ok?0:1;
}
