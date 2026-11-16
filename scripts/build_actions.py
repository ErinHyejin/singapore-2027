#!/usr/bin/env python3
"""Build reviewed, existing scene assets; this script never generates artwork.

Input is a LOCAL curation JSON: assets (downloaded source records) and explicit
bindings for every current event. Review character actions before running it.
No image URLs are downloaded by this build; no credentials are required.
"""
import argparse
import hashlib
import json
import re
from pathlib import Path
from PIL import Image, ImageOps

ROOT=Path(__file__).resolve().parents[1]
SCRATCH=Path('/Users/will/.hermes-runtime-t9/.hermes/profiles/choki/cache/scratch').resolve()

def build(curation_path):
    plan=json.loads(Path(curation_path).read_text())
    raw=(ROOT/'docs/data.js').read_text()
    trip=json.loads(raw[raw.index('{'):].rstrip(';\n'))
    ids={e['id'] for d in trip['days'] for e in d['events']}
    assert set(plan['events'])==ids,'Bind each real event exactly once'
    source_ids=[a['id'] for a in plan['assets']]
    assert len(source_ids)==len(set(source_ids)),'Duplicate asset ID'
    assert {b['asset'] for b in plan['events'].values()}==set(source_ids),'Ship only used, reviewed assets'
    out=ROOT/'docs/assets/actions';out.mkdir(parents=True,exist_ok=True)
    records=[];runtime={'schemaVersion':1,'assets':{},'events':plan['events']}
    for asset in plan['assets']:
        name=asset['id'];assert re.fullmatch(r'[a-z0-9-]+',name),name
        local=Path(asset['localPath']).resolve()
        assert local.is_relative_to(SCRATCH) and local.is_file(),str(local)
        assert asset['sourcePage'].startswith('https://') and asset['sourceImage'].startswith('https://')
        assert asset['characters'] and asset['activityTags'] and len(asset['actionKo'])>=5
        original=local.read_bytes();sha=hashlib.sha256(original).hexdigest()
        with Image.open(local) as source:
            original_size=list(source.size)
            image=ImageOps.exif_transpose(source).convert('RGBA' if 'A' in source.getbands() else 'RGB')
            image.thumbnail((512,384),Image.Resampling.LANCZOS)
        filename=name+'-'+sha[:8]+'.webp';target=out/filename
        record={
            'id':name,'characters':asset['characters'],'sourceCharacters':asset.get('sourceCharacters',asset['characters']),'actionKo':asset['actionKo'],
            'activityTags':asset['activityTags'],'sourcePage':asset['sourcePage'],
            'sourceImage':asset['sourceImage'],'sourceSHA256':sha,
            'originalSize':original_size,'asset':str(target.relative_to(ROOT)),
            'width':image.width,'height':image.height,
            'rightsNote':asset.get('rightsNote','Existing Disney/Pixar artwork. Public availability is not a claim of a free license or endorsement.'),
            'visualNotes':asset.get('visualNotes',''),
            'changes':'Existing original image resized proportionally, without cropping or drawing, and encoded as WebP. Source metadata retained.',
            'purpose':'Decorative activity-matched film scene; not a travel booking or character-appearance claim.'
        }
        exif=Image.Exif();exif[270]=json.dumps(record,ensure_ascii=True)
        image.save(target,format='WEBP',quality=84,method=6,exif=exif)
        Path(str(target)+'.provenance.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
        records.append(record)
        runtime['assets'][name]={
            'src':'./'+str(target.relative_to(ROOT/'docs')),
            'width':image.width,'height':image.height,'caption':asset['actionKo'],
            'characters':asset['characters'],'activityTags':asset['activityTags']}
    for event_id,binding in runtime['events'].items():
        assert binding['activity'] in runtime['assets'][binding['asset']]['activityTags'],event_id
        assert len(binding['reason'])>=4,event_id
    (ROOT/'ACTION_SOURCES.json').write_text(json.dumps({'assets':records,'events':plan['events']},ensure_ascii=False,indent=2)+'\n')
    (ROOT/'docs/actions.js').write_text('window.TRIP_ACTIONS = '+json.dumps(runtime,ensure_ascii=False,indent=2)+';\n')
    characters={c for a in records for c in a['characters']}
    return {'events':len(ids),'scenes':len(records),'characters':len(characters),'totalSceneBytes':sum((ROOT/r['asset']).stat().st_size for r in records)}

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('curation',help='Reviewed local JSON, not a public source dump')
    print(json.dumps(build(parser.parse_args().curation),ensure_ascii=False))
