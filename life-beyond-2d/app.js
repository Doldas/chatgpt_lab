"use strict";
(() => {
 const {Universe,limits,neighborsForDimension}=window.LifeLab;
 const $=id=>document.getElementById(id), canvas=$("canvas"),ctx=canvas.getContext("2d");
 let universe=new Universe(), timer=null, slices=[], painting=false, drawValue=1;
 const description={conway:"B3/S23: klassiska Conway's Game of Life. Finns bara i 2D.",echo:"Täthetsbaserade trösklar skalade med antalet grannar.",bloom:"Fler föds vid lägre grannskapstäthet, men överlever sämre.",crystal:"Högre granntrösklar gör stabila, täta strukturer möjliga."};
 function stop(){if(timer!==null)clearInterval(timer);timer=null;$("start").textContent="▶ Starta";}
 function resizeSettings(){
  const d=Number($("dimensions").value);
  $("dimension-value").textContent=d+"D";$("neighbors").textContent=neighborsForDimension(d);
  $("rule").options[0].disabled=d!==2;
  if(d!==2 && $("rule").value==="conway")$("rule").value="echo";
  universe=new Universe(d,$("rule").value);slices=Array(d-2).fill(Math.floor(universe.side/2));
  const parent=$("slices");parent.replaceChildren();
  ["Z","W","V"].slice(0,d-2).forEach((axis,i)=>{
   const label=document.createElement("label");label.htmlFor="axis-"+axis;label.textContent="Snitt längs "+axis;
   const row=document.createElement("div");row.className="axis-line";
   const minus=document.createElement("span");minus.textContent="0";
   const input=document.createElement("input");input.type="range";input.id="axis-"+axis;input.min="0";input.max=String(universe.side-1);input.value=String(slices[i]);
   const output=document.createElement("output");output.textContent=String(slices[i]);
   input.addEventListener("input",()=>{slices[i]=Number(input.value);output.textContent=input.value;render();});
   row.append(minus,input,output);parent.append(label,row);
  });
  universe.randomize(Number($("density").value)/100);updateLabels();render();
 }
 function updateLabels(){
  $("rule-description").textContent=description[$("rule").value];
  const rule=limits(universe.mode,universe.d);
  $("rule-description").textContent+=" B"+rule.birth.join("–")+" / S"+rule.survive.join("–");
  $("generation").textContent="Generation "+universe.generation;
  $("population").textContent=universe.population.toLocaleString("sv")+" levande";
  $("size").textContent=universe.side+"^"+universe.d+" = "+universe.length.toLocaleString("sv")+" celler";
  $("slice").textContent="Snitt x,y"+(slices.length?"; "+["Z","W","V"].slice(0,slices.length).map((a,i)=>a+"="+slices[i]).join(", "):"");
 }
 function render(){
  const s=universe.side,cell=canvas.width/s;
  ctx.fillStyle="#07121d";ctx.fillRect(0,0,canvas.width,canvas.height);
  for(let y=0;y<s;y++)for(let x=0;x<s;x++){
   const coords=[x,y,...slices];if(!universe.get(coords))continue;
   const hue=(universe.generation*3+x*5+y*3+universe.d*25)%360;
   ctx.fillStyle="hsl("+hue+" 72% 67%)";
   ctx.fillRect(x*cell+.6,y*cell+.6,Math.max(1,cell-1.2),Math.max(1,cell-1.2));
  }
  updateLabels();
 }
 function place(e){const r=canvas.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*universe.side),y=Math.floor((e.clientY-r.top)/r.height*universe.side);if(x>=0&&x<universe.side&&y>=0&&y<universe.side){universe.set([x,y,...slices],drawValue);render();}}
 canvas.addEventListener("pointerdown",e=>{if(e.pointerType==="mouse"&&e.button!==0)return;painting=true;canvas.setPointerCapture(e.pointerId);const r=canvas.getBoundingClientRect(),x=Math.floor((e.clientX-r.left)/r.width*universe.side),y=Math.floor((e.clientY-r.top)/r.height*universe.side);drawValue=1-universe.get([Math.max(0,Math.min(universe.side-1,x)),Math.max(0,Math.min(universe.side-1,y)),...slices]);place(e);});
 canvas.addEventListener("pointermove",e=>{if(painting)place(e);});
 for(const ev of ["pointerup","pointercancel","lostpointercapture"])canvas.addEventListener(ev,()=>painting=false);
 function oneStep(){universe.step();render();}
 $("dimensions").addEventListener("input",()=>{stop();resizeSettings();});
 $("rule").addEventListener("change",()=>{stop();universe.mode=$("rule").value;updateLabels();});
 $("density").addEventListener("input",()=>{$("density-value").textContent=$("density").value+"%";});
 $("speed").addEventListener("input",()=>{$("speed-value").textContent=$("speed").value;if(timer!==null){stop();start();}});
 function start(){if(timer!==null)return;timer=setInterval(oneStep,1000/Number($("speed").value));$("start").textContent="■ Pausa";}
 $("start").addEventListener("click",()=>timer!==null?stop():start());
 $("step").addEventListener("click",()=>{stop();oneStep();});
 $("random").addEventListener("click",()=>{stop();universe.randomize(Number($("density").value)/100);render();});
 $("clear").addEventListener("click",()=>{stop();universe.clear();render();});
 document.addEventListener("visibilitychange",()=>{if(document.hidden)stop();});
 window.addEventListener("pagehide",stop);
 resizeSettings();
})();
