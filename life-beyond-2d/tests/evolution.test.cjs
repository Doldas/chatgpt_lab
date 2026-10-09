"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {EvolvingUniverse,FAMILIES,bounds}=require("../evolution.js");
const {Universe}=require("../simulation.js");

test("evolving universe is compatible with Life simulation and visualization",()=>{
 const u=new EvolvingUniverse(2,{rng:()=>0});
 assert.ok(u instanceof Universe);
 assert.equal(u.mode,"evolving");
 assert.equal(u.length,1024);
 u.set([10,10],1);
 assert.deepEqual(u.geneAt([10,10]),{family:0,birthBias:0,surviveBias:0});
 u.clear();
 assert.equal(u.population,0);
 assert.equal(u.geneAt([10,10]),null);
});

test("lineages are inherited by new cells and evolve only when permitted",()=>{
 const u=new EvolvingUniverse(2,{mutationRate:0,rng:()=>0});
 u.clear();
 // Bloom requires two neighbors in 2D. An L-shaped parent pair
 for(const [x,y] of [[14,15],[15,14]])u.set([x,y],1);
 u.family.fill(1); // Bloom: B2/S1-2 in 2D.
 u.step();
 assert.equal(u.get([15,15]),1);
 assert.equal(u.family[u.index([15,15])],1);
 assert.equal(u.mutations,0);
});

test("forced mutation can modify the inherited birth rule",()=>{
 const u=new EvolvingUniverse(2,{mutationRate:1,rng:()=>0});
 u.clear();
 for(const [x,y] of [[14,15],[15,14]])u.set([x,y],1);
 u.family.fill(1);
 u.step();
 assert.equal(u.get([15,15]),1);
 assert.equal(u.family[u.index([15,15])],2);
 assert.ok(u.mutations>=1);
});

test("generation consistency for dimensions 2–5",()=>{
 for(const d of [2,3,4,5]){
  const u=new EvolvingUniverse(d,{mutationRate:.15,rng:()=>.15});
  u.randomize(.1,()=>.05);
  u.step();
  assert.equal(u.population,u.data.reduce((n,v)=>n+v,0));
  assert.equal(u.counts().reduce((a,b)=>a+b,0),u.population);
  for(const b of u.birthBias)assert.ok(b>=-3&&b<=3);
  for(const b of u.surviveBias)assert.ok(b>=-3&&b<=3);
  u.clear();assert.equal(u.population,0);assert.equal(u.mutations,0);
 }
});

test("genetic thresholds are dimension dependent and bounded",()=>{
 for(const d of [2,3,4,5])for(let family=0;family<FAMILIES.length;family++){
  const r=bounds(family,d,-3,3),max=3**d-1;
  assert.ok([...r.birth,...r.survive].every(v=>Number.isInteger(v)&&v>=0&&v<=max));
 }
});
