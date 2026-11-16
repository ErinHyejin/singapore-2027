const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};vm.createContext(context);
vm.runInContext(fs.readFileSync('docs/data.js','utf8'),context);
vm.runInContext(fs.readFileSync('docs/actions.js','utf8'),context);
const data=context.window.TRIP_DATA,actions=context.window.TRIP_ACTIONS;
const events=data.days.flatMap(d=>d.events),ids=Array.from(events,e=>e.id);
assert.equal(events.length,30);
assert.deepEqual(Object.keys(actions.events).sort(),ids.slice().sort(),'Every schedule event must have its own explicit scene binding');
const used=new Set(),characters=new Set();
for(const event of events){
 const binding=actions.events[event.id];assert.equal(typeof binding.asset,'string');assert(binding.reason.length>=4,'Explain the activity relationship');
 const asset=actions.assets[binding.asset];assert(asset,'Missing scene '+binding.asset);used.add(binding.asset);
 assert(/^\.\/assets\/actions\/[a-z0-9-]+\.webp$/.test(asset.src),'Self-hosted scene only');
 assert(fs.existsSync('docs/'+asset.src.slice(2)),asset.src);
 assert(asset.width>0&&asset.height>0);assert(asset.caption.length>=5);assert(asset.characters.length>0);
 assert(asset.activityTags.includes(binding.activity),'Scene must match its assigned activity');
 asset.characters.forEach(c=>characters.add(c));
}
assert(used.size>=18,'Need at least 18 different activity scenes');
assert(characters.size>=16,'Need at least 16 distinct named characters');
console.log(JSON.stringify({eventCoverage:events.length,distinctScenes:used.size,distinctCharacters:characters.size}));
