import {makeWorld,makeRandom,ruleFor,parseCounts,formatCounts,stepWorld,updateCell,encode,decode,neighborCount} from "../multidimension-life/engine.mjs";
const {Universe}=window.LifeLab;
const {EvolvingUniverse,FAMILIES}=window.LifeEvolution;
const renderer=window.HypercubeRenderer;
const $=id=>document.getElementById(id);
const canvas=$("canvas"),ctx=canvas.getContext("2d");
let world,backend="custom",slices=[],running=null,steps=0,painting=false,paintValue=1,error="";
const RULES=["custom","conway","echo","bloom","crystal","evolving"];
function dimensions(){return Number($("dimensions").value);}
function currentMode(){return $("rule").value;}
function dense(){return Number($("density").value)/100;}
function isCustom(){return backend==="custom";}
function population(){return isCustom()?world.cells.size:world.population;}
function generation(){return world.generation;}
function side(){return world.side;}
function volume(){return side()**dimensions();}
function reset(){
 stop();
 const d=dimensions();$("dimension-label").textContent=d+"D";
 const rule=currentMode();
 if(rule==="conway"&&d!==2){$("rule").value="custom";}
 backend=$("rule").value;
 if(backend==="custom"){
  world=makeWorld(d,Date.now(),true);
  $("birth").value=formatCounts(world.rule.birth);
  $("survive").value=formatCounts(world.rule.survive);
 }else if(backend==="evolving"){
  world=new EvolvingUniverse(d,{mutationRate:Number($("mutation").value)/100});
  world.randomize(dense());
 }else{
  world=new Universe(d,backend);world.randomize(dense());
 }
 slices=Array.from({length:d-2},()=>Math.floor(side()/2));
 buildAxes();
 $("neighbors").textContent=neighborCount(d)+" grannar/cell";
 $("volume").textContent=volume().toLocaleString("sv")+" celler";
 $("mutation").disabled=backend!=="evolving";
 $("birth").disabled=!isCustom();$("survive").disabled=!isCustom();$("apply").disabled=!isCustom();
 $("rule").querySelector('option[value="conway"]').disabled=d!==2;
 error="";update();
}
function buildAxes(){
 const root=$("axes");root.replaceChildren();
 for(let i=0;i<slices.length;i++){
  const axis=["Z","W","V"][i],row=document.createElement("div"),label=document.createElement("label"),range=document.createElement("input"),output=document.createElement("output");
  row.className="axis-row";label.textContent=axis;label.htmlFor="axis-"+axis;
  range.type="range";range.id="axis-"+axis;range.min=0;range.max=side()-1;range.step=1;range.value=slices[i];
  output.textContent=slices[i];range.addEventListener("input",()=>{slices[i]=Number(range.value);output.textContent=range.value;draw();});
  row.append(label,range,output);root.append(row);
 }
}
function snapshot(){
 if(!isCustom())return world;
 const d=dimensions(),s=side(),data=new Uint8Array(volume()),strides=Array.from({length:d},(_,i)=>s**i);
 for(const id of world.cells)data[id]=1;
 return {d,side:s,length:data.length,data,strides,index:coords=>coords.reduce((a,v,i)=>a+v*strides[i],0),mode:"custom",generation:world.generation,population:world.cells.size};
}
function update(){
 $("generation").textContent="Generation "+generation();
 $("population").textContent=population().toLocaleString("sv")+" levande";
 const rule=currentMode();
 $("rule-info").textContent=error||(
  rule==="evolving"?"Ärvda regelpaket: "+FAMILIES.map((f,i)=>f+" "+world.counts()[i]).join(" · ")+" · mutationer "+world.mutations:
  rule==="custom"?"Egen regel: B"+formatCounts(world.rule.birth)+" / S"+formatCounts(world.rule.survive):
  rule==="conway"?"Conway – B3/S23":rule.toUpperCase()+" – dimensionsanpassade födelse- och överlevnadsgränser."
 );
 draw();
}
function drawFlat(u){
 const s=u.side,w=canvas.width/s;
 ctx.fillStyle="#07121d";ctx.fillRect(0,0,canvas.width,canvas.height);
 let shown=0;
 for(let y=0;y<s;y++)for(let x=0;x<s;x++){
  const coord=[x,y,...slices],i=u.index(coord);
  if(!u.data[i])continue;
  shown++;
  ctx.fillStyle=u.mode==="evolving"?"hsl("+[180,45,300][u.family[i]]+" 85% 68%)":"#72d8cb";
  ctx.fillRect(x*w+.4,y*w+.4,Math.max(1,w-.8),Math.max(1,w-.8));
 }
 return shown;
}
function draw(){
 if(!world)return;
 const u=snapshot(),mode=$("view").value;
 let shown=0;
 if(mode==="flat")shown=drawFlat(u);
 else{
  const angle=Number($("rotation").value)*Math.PI/180,tilt=Number($("tilt").value)*Math.PI/180;
  const result=renderer.draw(ctx,u,{mode:mode==="slice"?"slice":"outside",slices,
   angles:{xw:angle,zw:angle*.3,wv:angle*.65,xv:angle*.2,xz:tilt,yz:tilt*.7,xy:.15},
   showEdges:$("edges").checked});
  shown=result.visible;
 }
 $("visible").textContent="Synliga: "+shown.toLocaleString("sv");
}
function stop(message="Pausad"){
 if(running!==null)clearInterval(running);running=null;$("play").textContent="▶ Starta";
 $("status").textContent=message;
}
function step(){
 if(isCustom()){
  const outcome=stepWorld(world);
  if(outcome.limited){error=outcome.reason;stop("Gräns nådd");update();return false;}
  world=outcome.world;
 }else world.step();
 update();return true;
}
function play(){
 if(running!==null){stop();return;}
 error="";steps=0;$("status").textContent="Simulerar";$("play").textContent="■ Pausa";
 running=setInterval(()=>{if(!step())return;if(++steps>=80)stop("80 steg – stoppad");},1000/Number($("speed").value));
}
function apply(){
 if(!isCustom())return;
 try{
  const max=neighborCount(dimensions()),b=parseCounts($("birth").value,max),s=parseCounts($("survive").value,max);
  world.rule={birth:b,survive:s,name:"Egna regler"};error="";stop("Regler uppdaterade");update();
 }catch(e){error=e.message;stop("Ogiltiga regler");update();}
}
function clear(){
 stop();error="";
 if(isCustom()){world.cells.clear();world.generation=0;}
 else world.clear();update();
}
function randomize(){
 stop();error="";
 if(isCustom()){
  world=makeWorld(dimensions(),Date.now(),false);
  const rng=makeRandom(Date.now()+17);
  for(let i=0;i<volume();i++)if(rng()<dense())world.cells.add(i);
  apply();
 }else world.randomize(dense());
 update();
}
function paint(event,first=false){
 if($("view").value!=="flat")return;
 const rect=canvas.getBoundingClientRect(),s=side();
 const x=Math.floor((event.clientX-rect.left)/rect.width*s),y=Math.floor((event.clientY-rect.top)/rect.height*s);
 if(x<0||y<0||x>=s||y>=s)return;
 const coords=[x,y,...slices];
 if(first){
  const previous=isCustom()?world.cells.has(encode(coords,s)):!!world.get(coords);
  paintValue=previous?0:1;
 }
 if(isCustom())updateCell(world,coords,!!paintValue);
 else world.set(coords,paintValue);
 update();
}
$("dimensions").addEventListener("input",reset);
$("rule").addEventListener("change",reset);
$("apply").addEventListener("click",apply);
$("mutation").addEventListener("input",()=>{$("mutation-label").textContent=$("mutation").value+"%";if(backend==="evolving")world.mutationRate=Number($("mutation").value)/100;});
$("view").addEventListener("change",draw);
$("rotation").addEventListener("input",()=>{$("rotation-label").textContent=$("rotation").value+"°";draw();});
$("tilt").addEventListener("input",()=>{$("tilt-label").textContent=$("tilt").value+"°";draw();});
$("edges").addEventListener("change",draw);
$("density").addEventListener("input",()=>{$("density-label").textContent=$("density").value+"%";});
$("speed").addEventListener("input",()=>{$("speed-label").textContent=$("speed").value;if(running!==null){stop();play();}});
$("play").addEventListener("click",play);
$("step").addEventListener("click",()=>{stop();step();});
$("clear").addEventListener("click",clear);
$("random").addEventListener("click",randomize);
canvas.addEventListener("pointerdown",e=>{if($("view").value!=="flat"||(e.pointerType==="mouse"&&e.button!==0))return;painting=true;canvas.setPointerCapture(e.pointerId);paint(e,true);});
canvas.addEventListener("pointermove",e=>{if(painting)paint(e);});
for(const type of ["pointerup","pointercancel","lostpointercapture"])canvas.addEventListener(type,()=>painting=false);
document.addEventListener("visibilitychange",()=>{if(document.hidden)stop("Pausad: fliken dold");});
window.addEventListener("pagehide",()=>stop());
reset();
