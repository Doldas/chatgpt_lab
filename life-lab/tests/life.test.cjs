const test=require('node:test');
const assert=require('node:assert/strict');
const {Universe,neighborsForDimension,SIDES}=require('../simulation.js');

test('dimensions 2 to 5 have correct grid sizes and Moore neighbors',()=>{
 for(let d=2;d<=5;d++){
  const u=new Universe(d,'echo');
  assert.equal(u.length,SIDES[d]**d);
  assert.equal(u.offsets.length,3**d-1);
  assert.equal(neighborsForDimension(d),3**d-1);
 }
});

test('conway oscillator blinker cycles every two steps',()=>{
 const u=new Universe(2,'conway');
 for(let y=14;y<=16;y++)u.set([15,y],1);
 u.step();
 assert.equal(u.population,3);
 for(let x=14;x<=16;x++)assert.equal(u.get([x,15]),1);
 u.step();
 assert.equal(u.population,3);
 for(let y=14;y<=16;y++)assert.equal(u.get([15,y]),1);
});

test('coordinate mapping is unique across all dimensions',()=>{
 for(let d=2;d<=5;d++){
  const u=new Universe(d);
  const all=new Set();
  for(let index=0;index<u.length;index++){
   const coords=u.strides.map(s=>Math.floor(index/s)%u.side);
   const roundTrip=u.index(coords);
   assert.equal(roundTrip,index);
   all.add(roundTrip);
  }
  assert.equal(all.size,u.length);
 }
});

test('clear and step keep binary data and consistent population',()=>{
 const u=new Universe(5,'bloom');
 u.randomize(.11,()=>.05);
 assert.equal(u.population,u.length);
 for(let step=0;step<2;step++){
  u.step();
  let actual=0;
  for(const cell of u.data){assert.ok(cell===0||cell===1);actual+=cell;}
  assert.equal(u.population,actual);
 }
 u.clear();assert.equal(u.population,0);assert.equal(u.generation,0);
});

test('Conway selection in higher dimensions falls back to Echo',()=>{
 assert.equal(new Universe(4,'conway').mode,'echo');
});
