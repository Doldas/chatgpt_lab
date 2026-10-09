// Multidimension Life: framework-free, deterministic, bounded cellular automata.
export const SIZES = Object.freeze({2: 48, 3: 22, 4: 12, 5: 8});
export const MAX_LIVE = 6000;
export const MAX_VISITS = 1200000;
const DENSITIES = {2: .27, 3: .235, 4: .175, 5: .13};
const presets = {
  2: {birth:[3], survive:[2,3], name:"Conway – B3/S23"},
  3: {birth:[6,7], survive:[5,6,7,8], name:"Moln – B6,7/S5–8"},
  4: {birth:[14,15,16], survive:[12,13,14,15,16,17,18], name:"Väv – B14–16/S12–18"},
  5: {birth:[30,31,32,33,34], survive:[27,28,29,30,31,32,33,34,35,36,37,38], name:"Eko – B30–34/S27–38"}
};
const neighborCache = new Map();
const assertDimension = d => {
  if (!Number.isInteger(d) || d < 2 || d > 5) throw new RangeError("Dimensionen måste vara 2–5.");
};
export function neighborCount(dimensions) {
  assertDimension(dimensions);
  return 3 ** dimensions - 1;
}
export function ruleFor(dimensions) {
  assertDimension(dimensions);
  const p = presets[dimensions];
  return {birth:[...p.birth], survive:[...p.survive], name:p.name};
}
export function parseCounts(text, max) {
  if (typeof text !== "string" || text.length > 140 || !text.trim())
    throw new Error("Ange tal, separerade med kommatecken (t.ex. 3,5-7).");
  const values = new Set();
  for (const segment of text.split(",")) {
    const m = segment.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!m) throw new Error("Ogiltigt intervall: " + segment.trim());
    const from = Number(m[1]), to = m[2] === undefined ? from : Number(m[2]);
    if (from > to || to > max) throw new Error("Regler måste vara mellan 0 och " + max + ".");
    for (let i=from;i<=to;i++) values.add(i);
  }
  return [...values].sort((a,b)=>a-b);
}
export function formatCounts(values) {
  return values.join(",");
}
export function makeRandom(seed) {
  let state = (seed >>> 0) || 1;
  return () => {
    state ^= state << 13; state ^= state >>> 17; state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}
export function encode(coords, side) {
  let index=0, stride=1;
  for (const coordinate of coords) {
    if (!Number.isInteger(coordinate) || coordinate < 0 || coordinate >= side)
      throw new RangeError("Cellkoordinat utanför universum.");
    index += coordinate * stride;
    stride *= side;
  }
  return index;
}
export function decode(index, dimensions, side) {
  const result=[];
  for (let axis=0;axis<dimensions;axis++) {
    result.push(index % side);
    index=Math.floor(index/side);
  }
  return result;
}
export function makeWorld(dimensions=2, seed=20261009, populate=true) {
  assertDimension(dimensions);
  const side=SIZES[dimensions], cells=new Set(), random=makeRandom(seed);
  if (populate) {
    const volume=side ** dimensions;
    for (let i=0;i<volume;i++) if (random() < DENSITIES[dimensions]) cells.add(i);
  }
  return {dimensions, side, cells, rule:ruleFor(dimensions), generation:0, seed};
}
export function updateCell(world, coords, alive=true) {
  if (coords.length !== world.dimensions) throw new RangeError("Fel antal koordinater.");
  const index=encode(coords,world.side);
  if (alive) world.cells.add(index);
  else world.cells.delete(index);
}
export function neighborOffsets(dimensions) {
  assertDimension(dimensions);
  if (neighborCache.has(dimensions)) return neighborCache.get(dimensions);
  let result=[[]];
  for (let i=0;i<dimensions;i++) {
    const next=[];
    for (const old of result) for (const value of [-1,0,1]) next.push([...old,value]);
    result=next;
  }
  result=result.filter(delta=>delta.some(value=>value!==0));
  neighborCache.set(dimensions,result);
  return result;
}
export function stepWorld(world) {
  const {dimensions:d,side,cells,rule}=world;
  const offsets=neighborOffsets(d);
  if (cells.size > MAX_LIVE || cells.size*offsets.length > MAX_VISITS)
    return {world, limited:true, reason:"Arbetsgränsen nådd. Glesa ut celler eller börja om."};
  const neighborCounts=new Map();
  const strides=[1];
  for(let axis=1;axis<d;axis++) strides.push(strides[axis-1]*side);
  for(const id of cells) {
    const coords=decode(id,d,side);
    for(const delta of offsets) {
      let candidate=id;
      for(let axis=0;axis<d;axis++) {
        const target=coords[axis]+delta[axis];
        candidate += (target<0 ? side-1 : target>=side ? 1-side : delta[axis]) * strides[axis];
      }
      neighborCounts.set(candidate,(neighborCounts.get(candidate)||0)+1);
    }
  }
  const born=new Set(rule.birth), survive=new Set(rule.survive), next=new Set();
  for (const [id,count] of neighborCounts) {
    if (cells.has(id) ? survive.has(count) : born.has(count)) {
      next.add(id);
      if (next.size>MAX_LIVE) return {world,limited:true,reason:"För många levande celler för säker interaktiv körning."};
    }
  }
  if (survive.has(0)) {
    for(const id of cells) if (!neighborCounts.has(id)) next.add(id);
  }
  if (born.has(0)) {
    const volume=side**d;
    for(let id=0;id<volume;id++) {
      if (!cells.has(id) && !neighborCounts.has(id)) next.add(id);
      if (next.size>MAX_LIVE) return {world,limited:true,reason:"B0 skulle skapa för många celler."};
    }
  }
  return {world:{...world,cells:next,generation:world.generation+1},limited:false};
}
export function project(world, depths=[],mode="slice") {
  if(mode!=="slice"&&mode!=="projection") throw new Error("Okänt visningsläge.");
  if(depths.length!==world.dimensions-2) throw new Error("Fel antal skivkoordinater.");
  const pixels=new Uint16Array(world.side*world.side);
  for(const index of world.cells) {
    const c=decode(index,world.dimensions,world.side);
    if(mode==="slice" && c.slice(2).some((value,i)=>value!==depths[i])) continue;
    const at=c[1]*world.side+c[0];
    pixels[at]++;
  }
  return pixels;
}
