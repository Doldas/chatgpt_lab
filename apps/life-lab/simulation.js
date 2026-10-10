"use strict";
(function (root) {
  const SIDES = {2:32,3:16,4:9,5:6};
  const choose = (n,k) => n * k;
  function neighborsForDimension(d) { return 3 ** d - 1; }
  function limits(mode,d) {
    if (mode==="conway" && d===2) return {birth:[3,3],survive:[2,3]};
    const n=neighborsForDimension(d);
    if(mode==="crystal") return {birth:[Math.ceil(n*.25),Math.ceil(n*.29)],survive:[Math.ceil(n*.18),Math.ceil(n*.34)]};
    if(mode==="bloom") return {birth:[Math.ceil(n*.14),Math.ceil(n*.24)],survive:[Math.ceil(n*.12),Math.ceil(n*.23)]};
    return {birth:[Math.ceil(n*.32),Math.ceil(n*.4)],survive:[Math.ceil(n*.22),Math.ceil(n*.43)]};
  }
  function makeOffsets(d){
    const offsets=[], current=[];
    function visit(){if(current.length===d){if(current.some(v=>v!==0))offsets.push(current.slice());return;}
      for(let v=-1;v<=1;v++){current.push(v);visit();current.pop();}
    } visit(); return offsets;
  }
  class Universe {
    constructor(d=2,mode="conway"){
      if(!Number.isInteger(d)||d<2||d>5)throw Error("Supported dimensions: 2–5");
      this.d=d; this.side=SIDES[d];this.length=this.side**d;
      this.data=new Uint8Array(this.length);this.buffer=new Uint8Array(this.length);
      this.offsets=makeOffsets(d);this.mode=mode==="conway"&&d!==2?"echo":mode;
      this.generation=0;this.population=0;
      this.strides=Array.from({length:d},(_,i)=>this.side**i);
    }
    index(coords){let n=0;for(let i=0;i<this.d;i++)n+=coords[i]*this.strides[i];return n;}
    set(coords,v){const i=this.index(coords);let next=v?1:0;if(next!==this.data[i]){this.population+=next?1:-1;this.data[i]=next;}}
    get(coords){return this.data[this.index(coords)];}
    randomize(probability=.2,rng=Math.random){this.population=0;for(let i=0;i<this.length;i++){let alive=rng()<probability?1:0;this.data[i]=alive;this.population+=alive;}this.generation=0;}
    clear(){this.data.fill(0);this.buffer.fill(0);this.generation=0;this.population=0;}
    step(){
      const s=this.side,d=this.d,strides=this.strides,offsets=this.offsets;
      const {birth,survive}=limits(this.mode,d);
      let pop=0;
      for(let idx=0;idx<this.length;idx++){
        const coords=strides.map(v=>Math.floor(idx/v)%s);
        let count=0;
        for(const off of offsets){
          let j=0;
          for(let axis=0;axis<d;axis++)j+=((coords[axis]+off[axis]+s)%s)*strides[axis];
          count+=this.data[j];
        }
        const range=this.data[idx]?survive:birth;
        const alive=count>=range[0]&&count<=range[1]?1:0;
        this.buffer[idx]=alive;pop+=alive;
      }
      [this.data,this.buffer]=[this.buffer,this.data];this.population=pop;this.generation++;
    }
  }
  const api={Universe,limits,neighborsForDimension,SIDES};
  if (typeof module!=="undefined" && module.exports) module.exports=api;
  else root.LifeLab=api;
})(typeof window!=="undefined"?window:{});
