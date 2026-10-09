"use strict";
(function(root){
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function rotate(v,i,j,a){if(i>=v.length||j>=v.length)return;const c=Math.cos(a),s=Math.sin(a),x=v[i],y=v[j];v[i]=c*x-s*y;v[j]=s*x+c*y;}
  function transform(input,angles={}){
    const v=input.slice();
    rotate(v,0,3,angles.xw||0);
    rotate(v,2,3,angles.zw||0);
    rotate(v,3,4,angles.wv||0);
    rotate(v,0,4,angles.xv||0);
    rotate(v,0,2,angles.xz||0);
    rotate(v,1,2,angles.yz||0);
    rotate(v,0,1,angles.xy||0);
    // Collapse extra dimensions with bounded perspective, preserving 3D coordinates.
    for(let k=v.length-1;k>=3;k--){
      const f=3.5/(3.5-v[k]*.65);
      for(let j=0;j<k;j++)v[j]*=f;
    }
    return [v[0]||0,v[1]||0,v[2]||0];
  }
  function project(coords,angles,width,height){
    const [x,y,z]=transform(coords,angles);
    const perspective=4.5/(5-z*.65);
    const scale=Math.min(width,height)*.32;
    return {x:width/2+(x*.90+z*.22)*perspective*scale,
            y:height/2-(y*.90-z*.16)*perspective*scale,
            depth:z,scale:perspective};
  }
  function hypercube(d){
    if(!Number.isInteger(d)||d<2||d>5)throw Error("dimension must be 2–5");
    const vertices=Array.from({length:2**d},(_,bits)=>Array.from({length:d},(_,axis)=>(bits&(1<<axis))?1:-1));
    const edges=[];
    for(let bits=0;bits<vertices.length;bits++)for(let axis=0;axis<d;axis++){
      const other=bits^(1<<axis);
      if(bits<other)edges.push([bits,other,axis]);
    }
    return {vertices,edges};
  }
  function normalized(coords,side){return coords.map(v=>side===1?0:(2*v/(side-1)-1));}
  function visibleCells(universe,mode,slices){
    const result=[],stride=universe.strides;
    for(let index=0;index<universe.length;index++){
      if(!universe.data[index])continue;
      const coords=stride.map(st=>Math.floor(index/st)%universe.side);
      if(mode==="slice" && coords.slice(3).some((v,i)=>v!==(slices[i+1]??Math.floor(universe.side/2))))continue;
      result.push(coords);
    }
    return result;
  }
  function draw(ctx,universe,{mode="outside",angles={},slices=[],showEdges=true}={}){
    const {width,height}=ctx.canvas,d=universe.d;
    ctx.fillStyle="#07121d";ctx.fillRect(0,0,width,height);
    const shape=hypercube(mode==="slice"?Math.min(d,3):d);
    // The frame in Slice mode is a 3D cube; Outside shows the D-dimensional hypercube.
    if(showEdges){
      const projected=shape.vertices.map(v=>project(v,angles,width,height));
      for(const [a,b,axis] of shape.edges){
        const p=projected[a],q=projected[b];
        ctx.strokeStyle=axis>=3?"rgba(249,169,97,.72)":"rgba(109,209,229,.46)";
        ctx.lineWidth=axis>=3?1.6:1;
        ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
      }
    }
    const cells=visibleCells(universe,mode,slices);
    const projected=cells.map(coords=>{
      const v=normalized(mode==="slice"?coords.slice(0,Math.min(d,3)):coords,universe.side);
      const p=project(v,angles,width,height);
      return {p,coords};
    }).sort((a,b)=>a.p.depth-b.p.depth);
    const radius=clamp(12/universe.side,1.25,4.5);
    for(const {p,coords} of projected){
      const w=d>=4?coords[3]/Math.max(1,universe.side-1):0;
      const v=d>=5?coords[4]/Math.max(1,universe.side-1):0;
      const hue=Math.round(180+165*w);
      ctx.globalAlpha=d>=5?(0.45+0.55*v):0.86;
      ctx.fillStyle="hsl("+hue+" 85% 68%)";
      ctx.beginPath();ctx.arc(p.x,p.y,radius*p.scale,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
    return {visible:cells.length,total:universe.population,frameVertices:shape.vertices.length,frameEdges:shape.edges.length};
  }
  const api={rotate,transform,project,hypercube,visibleCells,draw};
  if(typeof module!=="undefined"&&module.exports)module.exports=api;
  else root.HypercubeRenderer=api;
})(typeof window!=="undefined"?window:{});
