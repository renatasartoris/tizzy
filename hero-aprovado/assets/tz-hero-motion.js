export const clamp=(x,a=0,b=1)=>Math.min(b,Math.max(a,x));
export const mix=(a,b,t)=>a+(b-a)*t;
export const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a));return t*t*(3-2*t)};
/** Gravity in a shared world; the camera follows the protagonist. Reversible with scroll. */
export function heroLayout({width:w,height:h,progress:p,exit=0,handoff=null,time=0,energy=1,fall='pluma',pointer={x:0,y:0}}){
 const mobile=w<768,e=clamp(handoff?.e||0),dock=smooth(0,1,e),release=.25;
 const speed=(fall==='pesada'?1.15:fall==='goma'?.9:1)*(.8+.2*energy),age=clamp((p-release)/.63)*speed;
 const gravity=h*(.04*age+1.05*age*age);let follow=smooth(mobile?.30:.32,mobile?.68:.79,p)*(gravity+h*(mobile?.20:.08));
 const baseX=w*(mobile?.5:.8),baseY=h*(mobile?.77:.65),wind=(Math.sin(time*.32)*w*.003+pointer.x*w*.003)*energy;
 const travel=smooth(.29,.94,p),settle=smooth(.70,.94,p),depth=smooth(.36,.87,p)*.70,packHeight=h*(mobile?.088:.10)/(1-depth);
 const required=baseY+h*.035+gravity+packHeight*.55-h*.88;follow+=Math.log1p(Math.exp(clamp((required-follow)/(h*.015),-50,50)))*h*.015;
 // The opening pose is retained. The flight begins inside the scene, behind the title.
 const arrival=smooth(.015,.17,p),far=1-arrival;
 const cameraDistance=h/(2*Math.tan(35*Math.PI/360)),distance=1.1*far;
 const startX=w*(mobile?.5:.55),startY=h*(mobile?.68:.63);
 const airship={x:mix(startX,baseX,arrival)-w*.045*smooth(.2,.6,p)+wind,y:mix(startY,baseY,arrival)-follow-exit,h:h*(mobile?.43:.69)/(1+distance),z:-cameraDistance*distance,pitch:.025*Math.sin(time*.4),yaw:.16+.035*Math.sin(time*.34),roll:0,open:smooth(.17,.28,p),visible:e<.985};
 const pose={x:baseX-w*(mobile?.04:.22)*travel+wind*(1-settle),y:baseY+h*.035+gravity-follow-exit+Math.sin(time*.62)*h*.006*settle*(1-dock),h:packHeight,pitch:(.22*Math.sin(age*5.7)+.012*Math.sin(time*.8))* (1-dock),yaw:Math.PI*2*(1-smooth(.25,.9,p))+.3*Math.PI*(energy-1)*Math.sin(Math.PI*smooth(.25,.9,p)),roll:(.24*Math.sin(age*4.9)+.012*Math.sin(time*.6))*(1-settle*.9),z:h/(2*Math.tan(35*Math.PI/360))*depth};
 const target=handoff&&e>0?handoff:pose;
 const pack={...pose,x:mix(pose.x,target.x,dock),y:mix(pose.y,target.y,dock),h:mix(pose.h,target.h,dock),pitch:mix(pose.pitch,handoff?.pitch||0,dock),yaw:pose.yaw*(1-dock),roll:pose.roll*(1-dock),z:pose.z*(1-dock),opacity:smooth(release,release+.02,p),visible:p>release};
 const velocities=[-.14,.065,-.06,.14,-.105,.03],spins=[2.7,-3.3,3.8,-2.2,3.1,-4.1];
 const secondary=velocities.map((v,i)=>{const start=.27+i*.039,t=Math.max(0,(p-start)*4.0)*speed,launchX=baseX-w*.045*smooth(.2,.6,start);return {x:launchX+w*(i%3-1)*.012+w*v*(1-Math.exp(-t*.9)),y:baseY+h*.035+h*(.035*t+(.56+i*.032)*t*t)-follow-exit,h:h*(.072+(i%3)*.009),pitch:.18+i*.12+t*(i%2?-.7:.9),yaw:.32*i+spins[i]*t*Math.pow(energy,.65),roll:(i-2.5)*.09+t*(i%2?.55:-.7),z:-h*.035+Math.sin(t*1.2+i)*h*.06*t,opacity:smooth(start,start+.018,p),visible:p>start&&t<2.8}});
 return {airship,pack,secondary,titleOpacity:1-smooth(.08,.235,p),titleY:smooth(.03,.24,p)*h*.18,titleScale:1-smooth(.02,.23,p)*.16,cloudOpacity:1-smooth(.65,.985,e),cameraFollow:follow,handed:e>=.985};
}

/** Exact damped spring, independent of frame rate; velocity survives target changes. */
export class FlightSpring {
 constructor(value=0,frequency=8,damping=10.5){this.value=value;this.velocity=0;this.frequency=frequency;this.damping=damping;}
 advance(target,dt){
  const x=this.value-target,v=this.velocity,w=this.frequency,a=this.damping/2,t=Math.max(0,dt),decay=Math.exp(-a*t);
  if(Math.abs(a-w)<1e-6){const b=v+w*x;this.value=target+(x+b*t)*decay;this.velocity=(v-w*b*t)*decay;}
  else {const d=Math.sqrt(Math.max(1e-12,w*w-a*a)),b=(v+a*x)/d,c=Math.cos(d*t),s=Math.sin(d*t);this.value=target+(x*c+b*s)*decay;this.velocity=((-a*x+b*d)*c+(-a*b-x*d)*s)*decay;}
  return this.value;
 }
}
/** Original flight forces, expressed in viewport units for stable resizing. */
export function flightForces(progress,time,pointer,energy=1,handoff=0){
 const calm=1-smooth(.65,.985,handoff),strength=Math.min(1.5,Math.max(.3,energy));
 return {x:calm*(Math.sin(progress*Math.PI*2.1)*.032+Math.sin(time*.45)*.008-pointer.x*.009)*strength,
 y:calm*(Math.sin(progress*Math.PI*3.2+1)*.012+Math.sin(time*.8)*.004)*strength,
 roll:calm*(Math.sin(progress*Math.PI*1.7+.4)*4.2+Math.sin(time*.6)*.8)*Math.PI/180*strength};
}

/** Follow native scroll without accumulating a long delay after a fast swipe. */
export class ScrollFollower extends FlightSpring {
 constructor(value=0,frequency=14){super(value,frequency,frequency*2);}
 advance(target,dt){
  target=clamp(target);const gap=target-this.value;
  if(Math.abs(gap)>.08){this.value=target-Math.sign(gap)*.08;this.velocity=0;}
  return this.value=clamp(super.advance(target,dt));
 }
}

/** Add scroll distance only to the approach; subsequent scene distances are unchanged. */
export const approachExtra=pacing=>.24*(clamp(Number(pacing)||170,100,220)/100-1);
export function storyToScroll(progress,extra=approachExtra(170)){
 const p=clamp(progress);return (p+extra*smooth(0,.24,p))/(1+extra);
}
export function scrollToStory(progress,extra=approachExtra(170)){
 const travel=clamp(progress)*(1+extra);if(travel>=.24+extra)return clamp(travel-extra);
 let lo=0,hi=.24;for(let i=0;i<20;i++){const p=(lo+hi)/2;if(p+extra*smooth(0,.24,p)<travel)lo=p;else hi=p;}
 return (lo+hi)/2;
}
