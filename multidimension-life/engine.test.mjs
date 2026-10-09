import assert from "node:assert/strict";
import {SIZES, makeWorld, updateCell, stepWorld, encode, decode, neighborCount,
  neighborOffsets, ruleFor, parseCounts, project} from "./engine.mjs";

const blinker=makeWorld(2,1,false);
for(const point of [[4,5],[5,5],[6,5]]) updateCell(blinker,point);
const b1=stepWorld(blinker);
assert.equal(b1.limited,false);
assert.deepEqual(new Set([...b1.world.cells]),new Set([[5,4],[5,5],[5,6]].map(c=>encode(c,blinker.side))));
const b2=stepWorld(b1.world);
assert.deepEqual(b2.world.cells,blinker.cells);
assert.equal(b2.world.generation,2);

for (let d=2;d<=5;d++){
  assert.equal(neighborOffsets(d).length,3**d-1);
  assert.equal(neighborCount(d),3**d-1);
  const world=makeWorld(d,2,false), c=Array(d).fill(1);
  assert.deepEqual(decode(encode(c,world.side),d,world.side),c);
  updateCell(world,c);
  world.rule={birth:[1],survive:[1],name:"test"};
  const result=stepWorld(world);
  assert.equal(result.limited,false,"dimension "+d);
  assert.equal(result.world.cells.size,3**d-1,"neighbor count dimension "+d);
  const slice=project(result.world,Array(d-2).fill(1),"slice");
  const projection=project(result.world,Array(d-2).fill(1),"projection");
  assert.equal(slice.length,SIZES[d]*SIZES[d]);
  assert.ok(projection.reduce((sum,n)=>sum+n,0)>=slice.reduce((sum,n)=>sum+n,0));
  assert.ok(ruleFor(d).birth.length);
}
assert.deepEqual(parseCounts("3, 5-7, 7",26),[3,5,6,7]);
for(const bad of ["", "3--4","-1","9-5","1000"]) assert.throws(()=>parseCounts(bad,26));
const edge=makeWorld(2,1,false);
for (const c of [[edge.side-1,0],[0,0],[1,0]]) updateCell(edge,c);
const wrapped=stepWorld(edge);
assert.ok(wrapped.world.cells.has(encode([0,edge.side-1],edge.side)),"wrap around");
const blank=makeWorld(5,1,false);
blank.rule={birth:[0],survive:[],name:"B0"};
assert.equal(stepWorld(blank).limited,true,"bounded explosion");
console.log("PASS: Conway blinker, torus, 2–5D neighbors, projections, custom rules and safety limits.");
