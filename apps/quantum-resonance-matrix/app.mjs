import {amplitude,clamp,frequencyFor} from './core.mjs';
const $=id=>document.getElementById(id);
const canvas=$('field'),ctx=canvas.getContext('2d',{alpha:false});
const controls=['frequency','coupling','phase'];
const settings={frequency:1,coupling:.5,phase:0};
let running=false,frame=0,previous=0,clock=0,raf=0,audio=null,osc=null,gain=null;
const ripples=[];
const buffer=document.createElement('canvas');buffer.width=180;buffer.height=135;
const bctx=buffer.getContext('2d',{alpha:false}),pixels=bctx.createImageData(180,135);
function color(a,palette) {
  const v=clamp((a+1)/2,0,1),pulse=Math.abs(a);
  if(palette==='mono'){const g=Math.round(15+v*230);return [g,g,g];}
  if(palette==='ember')return [Math.round(30+225*v),Math.round(10+155*pulse),Math.round(35+70*(1-v))];
  return [Math.round(13+70*v),Math.round(26+214*pulse),Math.round(52+196*v)];
}
function draw(){
 const w=buffer.width,h=buffer.height,palette=$('palette').value;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
   const u=x/(w-1),v=y/(h-1);
   let a=amplitude(u,v,clock,settings);
   for(const r of ripples){const d=Math.hypot(u-r.x,v-r.y);a+=0.27*Math.sin(36*d-r.age*11)*Math.exp(-11*d)*Math.max(0,1-r.age/3);}
   const [red,green,blue]=color(clamp(a,-1,1),palette),i=(y*w+x)*4;
   pixels.data[i]=red;pixels.data[i+1]=green;pixels.data[i+2]=blue;pixels.data[i+3]=255;
 }
 bctx.putImageData(pixels,0,0);ctx.imageSmoothingEnabled=true;ctx.drawImage(buffer,0,0,canvas.width,canvas.height);
 ctx.strokeStyle='#c9fffa99';ctx.lineWidth=1;
 for(const r of ripples){const radius=r.age*75;ctx.beginPath();ctx.arc(r.x*canvas.width,r.y*canvas.height,radius,0,Math.PI*2);ctx.stroke();}
}
function step(now){
 if(!running)return;
 const dt=Math.min(.05,Math.max(0,(now-previous)/1000));previous=now;clock+=dt;
 for(let i=ripples.length-1;i>=0;i--){ripples[i].age+=dt;if(ripples[i].age>=3)ripples.splice(i,1);}
 draw();raf=requestAnimationFrame(step);
}
function stopSound(){
 if(gain){gain.gain.setTargetAtTime(0,audio.currentTime,.015);}
}
function stop(){
 running=false;cancelAnimationFrame(raf);stopSound();$('toggle').textContent='▶ Starta';$('state').textContent='PAUSAD';
}
function start(){
 if(running)return;
 running=true;previous=performance.now();$('toggle').textContent='Ⅱ Pausa';$('state').textContent='AKTIV';
 if(gain)gain.gain.setTargetAtTime(.045,audio.currentTime,.04);
 raf=requestAnimationFrame(step);
}
function place(e){
 const bounds=canvas.getBoundingClientRect();
 const x=clamp((e.clientX-bounds.left)/bounds.width,0,1);
 const y=clamp((e.clientY-bounds.top)/bounds.height,0,1);
 ripples.push({x,y,age:0});if(ripples.length>8)ripples.shift();
 if(osc&&audio)osc.frequency.setTargetAtTime(frequencyFor(x,y),audio.currentTime,.05);
 if(!running)draw();
}
let lastPointer=0;canvas.addEventListener('pointerdown',e=>{lastPointer=performance.now();place(e);canvas.setPointerCapture?.(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(e.buttons===1&&performance.now()-lastPointer>70){lastPointer=performance.now();place(e);}});
controls.forEach(id=>$(id).addEventListener('input',()=>{
 settings[id]=Number($(id).value);$(id+'-value').textContent=settings[id].toFixed(2)+(id==='frequency'?'×':'');if(!running)draw();
}));
$('palette').addEventListener('change',()=>{if(!running)draw();});
$('toggle').addEventListener('click',()=>running?stop():start());
$('reset').addEventListener('click',()=>{stop();clock=0;ripples.length=0;settings.frequency=1;settings.coupling=.5;settings.phase=0;for(const id of controls){$(id).value=settings[id];$(id+'-value').textContent=settings[id].toFixed(2)+(id==='frequency'?'×':'');}$('palette').value='aurora';draw();});
$('sound').addEventListener('click',async()=>{
 if(audio){stopSound();await audio.close();audio=null;osc=null;gain=null;$('sound').textContent='♫ Aktivera ljud';$('sound').setAttribute('aria-pressed','false');return;}
 const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext){$('sound').textContent='Ljud stöds inte';return;}
 try{audio=new AudioContext();osc=audio.createOscillator();gain=audio.createGain();osc.type='sine';osc.frequency.value=220;gain.gain.value=0;osc.connect(gain);gain.connect(audio.destination);osc.start();if(running)gain.gain.setTargetAtTime(.045,audio.currentTime,.04);$('sound').textContent='♫ Stäng av ljud';$('sound').setAttribute('aria-pressed','true');}catch(err){console.error(err);$('sound').textContent='Ljud kunde inte startas';}
});
$('save').addEventListener('click',()=>{const a=document.createElement('a');a.download='quantum-resonance-matrix.png';a.href=canvas.toDataURL('image/png');a.click();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
window.addEventListener('pagehide',()=>{stop();if(audio)audio.close();});
draw();
