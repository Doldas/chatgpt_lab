"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {Universe}=require("../../life-beyond-2d/simulation.js");
const {EvolvingUniverse,bounds}=require("../evolution.js");
const {hypercube,visibleCells,draw}=require("../renderer.js");
for(let d=2;d<=5;d++){
 test("unified "+d+"D: cellular genetics and hypercube geometry",()=>{
  const e=new EvolvingUniverse(d,{rng:()=>.14,mutationRate:.1});
  e.randomize(.12,()=>.05);
  e.step();
  assert.equal(e.data.reduce((a,b)=>a+b,0),e.population);
  assert.equal(e.counts().reduce((a,b)=>a+b,0),e.population);
  const h=hypercube(d);
  assert.equal(h.vertices.length,2**d);
  assert.equal(h.edges.length,d*2**(d-1));
  const w=new Universe(d,"echo");
  w.clear();w.set(Array(d).fill(1),1);
  assert.equal(visibleCells(w,"outside",[]).length,1);
  const calls={count:0},ctx={canvas:{width:700,height:700},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fill(){calls.count++;},fillRect(){}};
  const before=w.population,stats=draw(ctx,w,{mode:"outside",angles:{xw:.6,wv:.3}});
  assert.equal(stats.visible,1);
  assert.equal(w.population,before);
 });
}
test("deterministic inherited rule threshold remains clamped",()=>{
 for(let d=2;d<=5;d++)for(let f=0;f<3;f++){
  const rule=bounds(f,d,-3,3),max=3**d-1;
  assert.ok([...rule.birth,...rule.survive].every(x=>Number.isInteger(x)&&x>=0&&x<=max));
 }
});
test("mutation rate zero never mutates descendants",()=>{
 const e=new EvolvingUniverse(2,{rng:()=>0,mutationRate:0});
 e.clear();
 for(const c of [[14,15],[15,14]])e.set(c,1);
 e.family.fill(1);
 e.step();
 assert.equal(e.get([15,15]),1);
 assert.equal(e.geneAt([15,15]).family,1);
 assert.equal(e.mutations,0);
});
