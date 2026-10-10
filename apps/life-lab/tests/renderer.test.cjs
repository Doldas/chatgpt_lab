"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {hypercube,rotate,transform,project,visibleCells,draw}=require("../renderer.js");
const {Universe}=require("../simulation.js");
for(const d of [2,3,4,5]){
 test(d+"D hypercube has 2^D vertices and D*2^(D-1) edges",()=>{
  const h=hypercube(d);
  assert.equal(h.vertices.length,2**d);
  assert.equal(h.edges.length,d*2**(d-1));
  assert.ok(h.edges.every(([a,b])=>h.vertices[a].reduce((n,v,i)=>n+(v!==h.vertices[b][i]),0)===1));
 });
 test(d+"D projection stays finite",()=>{
  for(const vertex of hypercube(d).vertices){
   const p=project(vertex,{xw:.5,wv:1.2,xz:.3,yz:.4},640,640);
   assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.depth));
  }
 });
}
test("rotation preserves squared distance in XW plane",()=>{
 const v=[.2,.4,.6,.8];const before=v.reduce((s,x)=>s+x*x,0);
 rotate(v,0,3,1.23);
 const after=v.reduce((s,x)=>s+x*x,0);
 assert.ok(Math.abs(before-after)<1e-10);
});
test("3D slice filters W and V without collapsing the model",()=>{
 const u=new Universe(5,"echo");u.clear();
 const a=[1,2,3,1,2],b=[2,2,3,2,2],c=[3,2,3,1,3];
 u.set(a,1);u.set(b,1);u.set(c,1);
 assert.equal(visibleCells(u,"outside",[3,1,2]).length,3);
 assert.deepEqual(visibleCells(u,"slice",[3,1,2]),[a]);
 assert.equal(u.population,3);
});
test("canvas renderer draws without modifying simulation state",()=>{
 const u=new Universe(4,"echo");u.clear();u.set([1,2,3,4],1);
 const calls=[];const ctx={canvas:{width:640,height:640},beginPath(){},moveTo(){},lineTo(){},stroke(){},arc(){},fill(){},fillRect(){},set fillStyle(x){calls.push(x)}};
 const g=u.generation,p=u.population;
 const stats=draw(ctx,u,{mode:"outside",angles:{xw:.7}});
 assert.equal(stats.visible,1);
 assert.equal(stats.frameVertices,16);
 assert.equal(stats.frameEdges,32);
 assert.equal(u.generation,g);assert.equal(u.population,p);
});
