// Dimensionless standing-wave superposition, not a quantum mechanics solver.
export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
export const MODES = Object.freeze([{nx:1,ny:1},{nx:2,ny:1},{nx:1,ny:3},{nx:3,ny:2}]);
export function amplitude(x, y, t, {frequency=1, coupling=0.5, phase=0, modes=MODES}={}) {
  const weights = [1, coupling, coupling * 0.75, coupling * 0.45];
  let sum = 0, norm = 0;
  for (let i=0;i<modes.length;i++) {
    const {nx,ny}=modes[i], w=weights[i] ?? 0;
    sum += w * Math.sin(Math.PI*nx*x) * Math.sin(Math.PI*ny*y) *
      Math.cos(2*Math.PI*frequency*Math.hypot(nx,ny)*t*0.18 + phase*i);
    norm += Math.abs(w);
  }
  return norm ? clamp(sum/norm,-1,1) : 0;
}
export function energy(x,y,t,params) { const a=amplitude(x,y,t,params); return a*a; }
export function frequencyFor(x,y,{base=110,span=660}={}) {
  return clamp(base + (1-y)*span + x*110, 40, 1600);
}
