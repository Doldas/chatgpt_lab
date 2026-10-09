import {
  SIZES, makeWorld, ruleFor, parseCounts, formatCounts,
  neighborCount, project, updateCell, stepWorld
} from "./engine.mjs";

const $ = selector => document.querySelector(selector);
const canvas = $("#world-canvas");
const ctx = canvas.getContext("2d");
const dimensionsInput = $("#dimension");
const modeInput = $("#view-mode");
const speedInput = $("#speed");
const playButton = $("#play");
const statusElement = $("#status");
const depthRoot = $("#depth-controls");
let world = makeWorld(2, Date.now());
let depths = [];
let timer = null;
let stepsThisRun = 0;
let drawing = false;
let drawValue = true;
let previousPaint = "";

function say(message) { statusElement.textContent = message; }
function stop() {
  if(timer !== null) clearInterval(timer);
  timer = null;
  playButton.textContent = "▶ Starta loopen";
  $("#running-text").textContent = "Pausad";
  $(".live-pill").classList.remove("active");
}
function renderControls() {
  $("#dimension-value").textContent = world.dimensions+"D";
  $("#neighbor-count").textContent = neighborCount(world.dimensions).toLocaleString("sv-SE");
  $("#volume").textContent = world.side+"^"+world.dimensions;
  $("#birth-input").value = formatCounts(world.rule.birth);
  $("#survive-input").value = formatCounts(world.rule.survive);
  $("#preset-name").textContent = world.rule.name;
  $("#rule-error").textContent = "";
}
function createDepthControls() {
  depthRoot.replaceChildren();
  depths = Array(world.dimensions-2).fill(Math.floor(world.side / 2));
  for(let i=0; i<depths.length;i++) {
    const row=document.createElement("div"); row.className="depth-row";
    const axis=["Z","W","V"][i];
    const label=document.createElement("label");
    const id="depth-"+axis.toLowerCase();
    label.htmlFor=id; label.textContent=axis;
    const range=document.createElement("input");
    range.id=id; range.type="range"; range.min="0";range.max=String(world.side-1);
    range.step="1";range.value=String(depths[i]);
    const output=document.createElement("output");
    output.htmlFor=id;output.textContent=String(depths[i]);
    range.addEventListener("input",()=>{
      depths[i]=Number(range.value);
      output.textContent=range.value;
      draw();
    });
    row.append(label,range,output);
    depthRoot.append(row);
  }
}
function renderStats() {
  $("#generation").textContent=world.generation.toLocaleString("sv-SE");
  $("#population").textContent=world.cells.size.toLocaleString("sv-SE");
}
function draw() {
  const side=world.side;
  const pitch=canvas.width/side;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle="#0b1928"; ctx.fillRect(0,0,canvas.width,canvas.height);
  const mode=modeInput.value;
  const view=project(world,depths,mode);
  const maxOverlap=side**(world.dimensions-2);
  for(let y=0;y<side;y++) for(let x=0;x<side;x++) {
    const n=view[y*side+x];
    if(!n)continue;
    const intensity=Math.log1p(n)/Math.log1p(Math.max(2,maxOverlap));
    ctx.fillStyle=mode==="slice"
      ? "#65e3cb"
      : "hsla("+Math.round(185+65*intensity)+",86%,"+Math.round(43+24*intensity)+"%,.93)";
    const margin=pitch>=12?1:.4;
    ctx.fillRect(x*pitch+margin,y*pitch+margin,pitch-margin*2,pitch-margin*2);
  }
  ctx.strokeStyle="#ffffff0a";ctx.lineWidth=1;
  for(let i=1;i<side;i++) {
    const a=Math.round(i*pitch)+.5;
    ctx.beginPath();ctx.moveTo(a,0);ctx.lineTo(a,canvas.height);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,a);ctx.lineTo(canvas.width,a);ctx.stroke();
  }
  $("#view-explanation").textContent=world.dimensions===2
    ? "Du ser hela universum. Klicka och dra för att tända celler; Shift-klick tar bort."
    : mode==="slice"
      ? "Du ser XY där "+["Z","W","V"].slice(0,depths.length).map((n,i)=>n+"="+depths[i]).join(", ")+". Dra reglagen för att flytta snittet."
      : "Alla "+world.dimensions+" dimensioner summeras till XY. Ljusare färg = fler överlappande celler. Måla i skivan som reglagen väljer.";
  renderStats();
}
function dimensionChanged() {
  stop();
  const d=Number(dimensionsInput.value);
  world=makeWorld(d,Date.now());
  createDepthControls();
  renderControls();
  draw();
  say(d+"D-värld skapad. "+neighborCount(d)+" möjliga grannar per cell. Eget förvalt regelverk.");
}
function advance() {
  const result=stepWorld(world);
  if(result.limited) {
    stop();
    say("Stopp: "+result.reason);
    return false;
  }
  world=result.world;
  draw();
  if(world.cells.size===0) {
    stop();
    say("Universum blev tomt. Prova andra naturlagar eller kasta nya frön.");
    return false;
  }
  return true;
}
function start() {
  if(timer!==null){stop();say("Simuleringen pausad.");return;}
  stepsThisRun=0;
  playButton.textContent="■ Stoppa";
  $("#running-text").textContent="Simulerar";
  $(".live-pill").classList.add("active");
  say("Loopen kör. Stoppa när du vill.");
  const delay=[1250,950,650,400,240][Number(speedInput.value)-1];
  timer=setInterval(()=>{
    if(!advance())return;
    stepsThisRun++;
    if(stepsThisRun>=80){stop();say("80 generationer genomförda. Starta igen om du vill utforska mer.");}
  },delay);
}
function ruleApply() {
  try{
    const n=neighborCount(world.dimensions);
    const birth=parseCounts($("#birth-input").value,n);
    const survive=parseCounts($("#survive-input").value,n);
    stop();
    world.rule={birth,survive,name:"Ditt eget regelverk"};
    $("#preset-name").textContent=world.rule.name;
    $("#rule-error").textContent="";
    say("Nya regler tillämpade: B"+formatCounts(birth)+" / S"+formatCounts(survive)+".");
  }catch(error) {
    $("#rule-error").textContent=error.message;
  }
}
function resetRule() {
  stop();
  world.rule=ruleFor(world.dimensions);
  renderControls();
  say("Standardregler för "+world.dimensions+"D återställda.");
}
function randomize(populate) {
  stop();
  const oldRule=world.rule;
  world=makeWorld(world.dimensions,Date.now() ^ (Math.random()*0xffffffff),populate);
  world.rule=oldRule;
  draw();
  say(populate?"Nytt slumpfrö skapat. Reglerna är kvar.":"Helt tom värld. Måla celler i den valda skivan.");
}
function paintAt(event) {
  const rect=canvas.getBoundingClientRect();
  const x=Math.floor((event.clientX-rect.left)/rect.width*world.side);
  const y=Math.floor((event.clientY-rect.top)/rect.height*world.side);
  if(x<0||y<0||x>=world.side||y>=world.side)return;
  const key=x+":"+y;
  if(previousPaint===key)return;
  previousPaint=key;
  updateCell(world,[x,y,...depths],drawValue);
  draw();
}
canvas.addEventListener("contextmenu",event=>event.preventDefault());
canvas.addEventListener("pointerdown",event=>{
  if(event.pointerType==="mouse"&&event.button!==0&&event.button!==2)return;
  stop();drawing=true;
  drawValue=!(event.shiftKey||event.button===2);
  previousPaint="";
  canvas.setPointerCapture(event.pointerId);
  paintAt(event);
  say(drawValue?"Du skapar liv i vald 2D-skiva.":"Du suddar celler i vald 2D-skiva.");
});
canvas.addEventListener("pointermove",event=>{if(drawing)paintAt(event);});
for(const name of ["pointerup","pointercancel","lostpointercapture"])
  canvas.addEventListener(name,()=>{drawing=false;previousPaint="";});
dimensionsInput.addEventListener("input",dimensionChanged);
modeInput.addEventListener("change",draw);
$("#apply-rule").addEventListener("click",ruleApply);
$("#preset-rule").addEventListener("click",resetRule);
playButton.addEventListener("click",start);
$("#step").addEventListener("click",()=>{stop();if(advance())say("Ett steg framåt.");});
$("#randomize").addEventListener("click",()=>randomize(true));
$("#clear").addEventListener("click",()=>randomize(false));
speedInput.addEventListener("change",()=>{if(timer!==null){stop();start();}});
document.addEventListener("visibilitychange",()=>{
  if(document.hidden&&timer!==null){stop();say("Pausad när sidan gömdes.");}
});
window.addEventListener("pagehide",stop);
createDepthControls();
renderControls();
draw();
