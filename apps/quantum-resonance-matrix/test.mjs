import assert from 'node:assert/strict';
import {test} from 'node:test';
import {amplitude,energy,frequencyFor,MODES} from './core.mjs';
test('four standing-wave modes',()=>assert.equal(MODES.length,4));
test('zero boundary amplitude',()=>{for(const n of [0,.3,.8,1]){assert.ok(Math.abs(amplitude(0,n,1))<1e-12);assert.ok(Math.abs(amplitude(1,n,1))<1e-12);assert.ok(Math.abs(amplitude(n,0,1))<1e-12);}});
test('bounded and deterministic',()=>{for(let i=0;i<=10;i++)for(let j=0;j<=10;j++){const a=amplitude(i/10,j/10,.5);assert.equal(a,amplitude(i/10,j/10,.5));assert.ok(Number.isFinite(a)&&Math.abs(a)<=1);assert.ok(energy(i/10,j/10,.5)>=0);}});
test('frequency stays in audio range',()=>{assert.equal(frequencyFor(0,1),110);assert.ok(frequencyFor(1,0)<=1600);});
