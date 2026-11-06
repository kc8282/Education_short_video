#!/usr/bin/env python3
"""Check a film's manifest/content without claiming media acceptance."""
import argparse, json, sys
from pathlib import Path

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--project', type=Path, required=True)
    p.add_argument('--mode', choices=['plan','full'], default='plan')
    a=p.parse_args()
    errs=[]
    f=a.project/'timeline.json'
    if not f.is_file(): errs.append('missing timeline.json')
    else:
        try: d=json.loads(f.read_text(encoding='utf-8'))
        except (OSError, ValueError) as e: print(e); return 2
        for k in ('subject','KLP code','language','goal','style','director','duration','segments','boardOrder'):
            if not d.get(k): errs.append(f'timeline missing {k}')
        if d.get('language')!='zh': errs.append('default language should be explicit zh unless brief changed')
        if not 30<=float(d.get('duration',0))<=45: errs.append('duration must target 30–45 s')
        if str(d.get('director',{}).get('model','')).split('/')[-1] not in ('deepseek-v4.1-flash','deepseek-v4.1-flash-free'):
            errs.append('director not declared deepseek-v4.1-flash; record actual discovered ID, never substitute silently')
        for i,s in enumerate(d.get('segments',[]),1):
            if float(s.get('t1',0))-float(s.get('t0',0))>12.0: errs.append(f'segment {i} >12 s; split for ~10 s gate')
        for f in ('TREATMENT.md','BRIEF.md','evidence/RUN.md'):
            if not (a.project/f).is_file(): errs.append(f'missing {f}')
        if a.mode=='full':
            for f in ('film.mp4','CREDITS','FULL-GATE.md'):
                if not (a.project/f).exists(): errs.append(f'full review needs {f}')
            for f in ('FULL-GATE.md',):
                if (a.project/f).is_file() and (a.project/f).stat().st_size: errs.append('producer must leave FULL-GATE.md empty')
    print('\n'.join('FAIL: '+e for e in errs) if errs else f'plan structure OK; media approval NOT evaluated: {a.project}')
    return bool(errs)
if __name__=='__main__': sys.exit(main())
