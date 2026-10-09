"use strict";
(function(root){
  const core=typeof module!=="undefined"&&module.exports?require("../life-beyond-2d/simulation.js"):root.LifeLab;
  const {Universe,limits,neighborsForDimension}=core;
  const FAMILIES=["echo","bloom","crystal"];
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function bounds(family,d,birthBias=0,surviveBias=0){
    const n=neighborsForDimension(d);
    const mode=FAMILIES[family];
    if(!mode)throw Error("Unknown lineage");
    const base=limits(mode,d);
    const shift=(v,b)=>v.map(x=>clamp(x+b,0,n));
    return {birth:shift(base.birth,birthBias),survive:shift(base.survive,surviveBias)};
  }
  // A genotype consists of a rule family and two local integer threshold offsets.
  class EvolvingUniverse extends Universe{
    constructor(d=2,{mutationRate=.04,rng=Math.random}={}){
      super(d,"echo");
      this.mode="evolving";
      this.rng=rng;
      this.mutationRate=clamp(mutationRate,0,1);
      this.family=new Uint8Array(this.length);
      this.birthBias=new Int8Array(this.length);
      this.surviveBias=new Int8Array(this.length);
      this.nextFamily=new Uint8Array(this.length);
      this.nextBirthBias=new Int8Array(this.length);
      this.nextSurviveBias=new Int8Array(this.length);
      this.mutations=0;
    }
    seedGene(i){
      this.family[i]=Math.floor(this.rng()*FAMILIES.length);
      this.birthBias[i]=0;this.surviveBias[i]=0;
    }
    set(coords,value){
      const i=this.index(coords),was=this.data[i];
      super.set(coords,value);
      if(value&&!was)this.seedGene(i);
      if(!value){this.family[i]=0;this.birthBias[i]=0;this.surviveBias[i]=0;}
    }
    randomize(probability=.2,rng=this.rng){
      super.randomize(probability,rng);
      this.mutations=0;
      this.family.fill(0);this.birthBias.fill(0);this.surviveBias.fill(0);
      for(let i=0;i<this.length;i++)if(this.data[i])this.seedGene(i);
    }
    clear(){
      super.clear();this.family.fill(0);this.birthBias.fill(0);this.surviveBias.fill(0);
      this.nextFamily.fill(0);this.nextBirthBias.fill(0);this.nextSurviveBias.fill(0);
      this.mutations=0;
    }
    geneAt(coords){
      const i=this.index(coords);
      return this.data[i]?{family:this.family[i],birthBias:this.birthBias[i],surviveBias:this.surviveBias[i]}:null;
    }
    counts(){
      const c=[0,0,0];
      for(let i=0;i<this.length;i++)if(this.data[i])c[this.family[i]]++;
      return c;
    }
    step(){
      const d=this.d,s=this.side,strides=this.strides;
      let population=0;
      this.nextFamily.fill(0);this.nextBirthBias.fill(0);this.nextSurviveBias.fill(0);
      for(let idx=0;idx<this.length;idx++){
        const coords=strides.map(st=>Math.floor(idx/st)%s);
        let count=0, parent=-1;
        // Parents selected by reservoir sampling over living neighbors.
        for(const offset of this.offsets){
          let j=0;
          for(let axis=0;axis<d;axis++)j+=((coords[axis]+offset[axis]+s)%s)*strides[axis];
          if(this.data[j]){
            count++;
            if(this.rng()*count<1)parent=j;
          }
        }
        const wasAlive=this.data[idx]===1;
        const source=wasAlive?idx:parent;
        if(source<0)continue;
        const family=this.family[source],birthBias=this.birthBias[source],surviveBias=this.surviveBias[source];
        const rule=bounds(family,d,birthBias,surviveBias);
        const range=wasAlive?rule.survive:rule.birth;
        if(count<range[0]||count>range[1])continue;
        this.buffer[idx]=1;
        population++;
        let f=family,b=birthBias,t=surviveBias;
        // Offspring inherit the parent's genome and may mutate one trait.
        if(!wasAlive&&this.rng()<this.mutationRate){
          const kind=Math.floor(this.rng()*3);
          if(kind===0)f=(f+1+Math.floor(this.rng()*2))%FAMILIES.length;
          else if(kind===1)b=clamp(b+(this.rng()<.5?-1:1),-3,3);
          else t=clamp(t+(this.rng()<.5?-1:1),-3,3);
          this.mutations++;
        }
        this.nextFamily[idx]=f;
        this.nextBirthBias[idx]=b;
        this.nextSurviveBias[idx]=t;
      }
      [this.data,this.buffer]=[this.buffer,this.data];
      // Explicitly zero the old buffer before next generation: dead cells must not linger.
      this.buffer.fill(0);
      [this.family,this.nextFamily]=[this.nextFamily,this.family];
      [this.birthBias,this.nextBirthBias]=[this.nextBirthBias,this.birthBias];
      [this.surviveBias,this.nextSurviveBias]=[this.nextSurviveBias,this.surviveBias];
      this.population=population;this.generation++;
    }
  }
  const api={EvolvingUniverse,FAMILIES,bounds};
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  else root.LifeEvolution=api;
})(typeof window!=="undefined"?window:{});
