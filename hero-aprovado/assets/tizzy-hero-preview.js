import {applyTitleLayout,titleText} from './tz-title-settings.js';
import {clamp,mix,smooth,heroLayout,FlightSpring,ScrollFollower,flightForces,approachExtra,storyToScroll,scrollToStory} from './tz-hero-motion.js';
const instances=new Map(), scripts=new Map();
function classic(url,ready){
 if(ready())return Promise.resolve();
 if(!scripts.has(url))scripts.set(url,new Promise((resolve,reject)=>{
  const s=document.createElement('script');s.src=url;s.async=true;s.onload=()=>ready()?resolve():reject(new Error('Biblioteca indisponível'));s.onerror=()=>reject(new Error('Biblioteca não carregou'));document.head.append(s);
 }).catch(e=>{scripts.delete(url);throw e}));
 return scripts.get(url);
}
function disposeScene(scene){
 const geometries=new Set(),materials=new Set(),textures=new Set();
 scene?.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of [].concat(o.material||[])){materials.add(m);for(const v of Object.values(m))if(v?.isTexture)textures.add(v)}});
 for(const t of textures)t.dispose();for(const m of materials)m.dispose();for(const g of geometries)g.dispose();
}
class Hero {
 constructor(root){
  this.root=root;this.cfg=JSON.parse(root.querySelector('[data-tz-config]').textContent);const palettes=[['#2e7bc4','#5aa3e0','#a8d2f2'],['#0c3e77','#8fbee8','#ffb073'],['#12518f','#79b4e4','#ffc46b'],['#0a4a86','#93c7ec','#ffa24c'],['#1478c8','#8fc0e0','#ff9e2c'],['#2a86d6','#9fbfde','#f98f63'],['#3e8fd6','#a9c7df','#f5c46a']];(palettes[Number(this.cfg.palette)]||palettes[1]).forEach((c,i)=>root.style.setProperty('--tz-sky'+(i+1),c));this.abort=new AbortController();this.signal=this.abort.signal;this.destroyed=false;
  this.reduce=matchMedia('(prefers-reduced-motion: reduce)');this.fine=matchMedia('(hover:hover) and (pointer:fine)');this.pointer={x:0,y:0,tx:0,ty:0};this.particles=[];this.models=new Map();this.loadControllers=new Set();this.clock=0;this.flight={x:new FlightSpring(),y:new FlightSpring(),roll:new FlightSpring(0,7,10)};this.inView=true;this.last=0;this.mode='loading';this.fps=[];this.quality=0;
  this.sticky=root.querySelector('.tz-hero__sticky');this.benefits=root.querySelector('[data-tz-benefits]');this.journey=[...root.querySelectorAll('[data-tz-seek]')];this.loading=root.querySelector('[data-tz-loading]');this.bindDestination();this.copy=root.querySelector('[data-tz-copy]');this.parallax=root.querySelector('[data-tz-parallax]');this.clouds=[...root.querySelectorAll('[data-tz-cloud]')];this.buttons=[...root.querySelectorAll('[data-tz-benefit]')];this.note=root.querySelector('[data-tz-note]');this.noteHome=this.note.parentElement;this.poster=root.querySelector('[data-tz-poster]');
  this.cfg.mode=this.cfg.mode==='static'?'static':'3d';this.settings={...this.cfg.settings};this.applySettings();this.loadCloudType();for(const event of ['shopify:section:load','shopify:section:reorder','shopify:section:unload'])this.on(document,event,()=>{this.bindDestination();this.measure();this.wake()});this.buttons.forEach(b=>{const im=b.querySelector('img');this.on(im,'error',()=>{im.hidden=true})});this.on(window,'message',e=>{
 if(e.origin!==location.origin||e.source!==window.parent||e.data?.type!=='tz-preview-settings')return;
 const updates=e.data.settings;if(!updates||typeof updates!=='object')return;
 const previous=this.cfg.mode;
 for(const [key,value] of Object.entries(updates))if(Object.hasOwn(this.settings,key)&&!key.endsWith('_url')&&key!=='destination_selector')this.settings[key]=value;
 this.cfg.mode=this.settings.render_mode==='static'?'static':'3d';this.applySettings();
 if(previous!==this.cfg.mode)this.setMotion();this.wake();
 window.parent.postMessage({type:'tz-preview-applied',title:this.root.dataset.titleStatus,mode:this.root.dataset.mode},location.origin);
});this.bindBenefits();this.on(this.reduce,'change',()=>this.setMotion());this.setMotion();
 }
 bindDestination(){
  const selector=this.cfg.destinationSelector||'#tz-launch';
  try{this.next=document.querySelector(selector)}catch{this.next=null}
  this.stage=this.next?.querySelector('.tz-stage');this.landingPoster=this.next?.querySelector('.tz-landing-poster');
 }
 applySettings(){
  const t=this.settings,c=this.cfg,r=this.root;
  this.approachExtra=approachExtra(t.approach_pacing);
  const palettes=[['#116ab7','#7ec7f4','#dcefff'],['#133e78','#9ebcd3','#ffa66a'],['#4d829a','#d7c8a1','#f7c46a'],['#4d7eaf','#edc6ac','#ff9b5f'],['#324e81','#ce9862','#fca437'],['#705785','#dc9a9d','#ff9a8a'],['#526f96','#ead6aa','#ffd778']];
  const colors=[...(palettes[Number(t.ceu)]||palettes[1])];colors[2]=({'Laranja':'#ff8a3d','Mel':'#ffc46b','Coral':'#f98f63','Azul claro':'#a8d2f2'})[t.horizonte]||colors[2];colors.forEach((v,i)=>r.style.setProperty('--tz-sky'+(i+1),v));r.style.setProperty('--tz-halo',Number(t.halo)/100);r.style.setProperty('--tz-horizon',t.horizonte==='Automático'?'72%':'53%');

  c.energy=Number(t.energia)/100;c.cloudScale=Number(t.escalaNuvens)/100;c.cloudOpacity=({'Esparso':.55,'Equilibrado':.85,'Encoberto':1.1})[t.nuvens]*clamp(Number(t.cloud_opacity??70)/70,0,1.5);c.parallax=Number(t.parallax??135)/100;r.dataset.title=t.gelatina;r.style.setProperty('--tz-sway',Number(t.balanco)/100);r.style.setProperty('--tz-sway-duration',(5.2-Number(t.balanco)/100*2.6)+'s');
  const keys=['texTopo','texGrande','texBaixa','texCinco','texSeis','texBruma'];this.clouds.forEach((im,i)=>{const n=t[keys[i]],url=c.cloudTextures?.[n];if(url&&im.dataset.texture!==n){im.src=url;im.dataset.texture=n;}});
  applyTitleLayout(r,t,this.cloudTypeConfig().atlas);const renderedTitle=titleText(t.titulo,t.title_case);const title=r.querySelector('h1');if(title.dataset.text!==renderedTitle){title.dataset.text=renderedTitle;title.replaceChildren(...renderedTitle.split(/\s+/).flatMap((v,i)=>{const word=document.createElement('span');word.className='tz-hero__word';word.textContent=v;return i?[document.createTextNode(' '),word]:[word]}));}this.words=[...title.querySelectorAll('.tz-hero__word')];this.loadCloudType();this.decorateCloudType();this.statusTitle();r.querySelector('.tz-hero__eyebrow').textContent=t.eyebrow;
  this.buttons.forEach((b,i)=>{c.tags[i]={label:t['tag'+(i+1)],note:t['nota'+(i+1)]};b.querySelector('strong').textContent=c.tags[i].label;b.querySelector('em').textContent=c.tags[i].note;b.setAttribute('aria-label',c.tags[i].label+': '+c.tags[i].note)});
  r.querySelectorAll('.tz-hero__track-group').forEach(g=>{g.replaceChildren(...String(t.ticker).split(',').map(v=>{const el=document.createElement('span');el.textContent=v.trim()+' ✦';return el}))});
  if(this.scrollSpring){this.scrollSpring.frequency=clamp(Number(t.scroll_response)||14,8,24);this.scrollSpring.damping=this.scrollSpring.frequency*2;}
  this.measure();
  if(this.sky)this.sky.material.uniforms.sky.value.set(colors[1]);if(this.activeBenefit){this.renderNote(this.activeBenefit);this.placeNote(this.activeBenefit)}
 }
 on(target,type,fn,options={}){target.addEventListener(type,fn,{...options,signal:this.signal});}
 closeNote(restoreFocus=false){clearTimeout(this.noteTimer);const trigger=this.activeBenefit;this.note.hidden=true;this.activeBenefit=null;this.buttons.forEach(b=>b.setAttribute('aria-expanded','false'));if(this.noteHome?.isConnected)this.noteHome.append(this.note);if(restoreFocus&&trigger?.isConnected)trigger.focus({preventScroll:true});}
 renderNote(btn){
  const i=this.buttons.indexOf(btn),tag=this.cfg.tags[i];if(!tag)return;
  this.note.querySelector('[data-tz-note-title]').textContent=tag.label;
  this.note.querySelector('[data-tz-note-copy]').textContent=tag.note;
  const image=this.note.querySelector('[data-tz-note-image]');image.src=btn.querySelector('img').src;image.hidden=btn.querySelector('img').hidden;
  this.note.style.setProperty('--tz-note-accent',['#d8b442','#a04079','#7baf30','#7baf30'][i]);
 }
 cloudTypeConfig(){
  const upper=this.settings.title_case==='uppercase';
  return {key:upper?'uppercase':'original',url:upper?this.cfg.cloudLetteringUpper:this.cfg.cloudLettering,atlas:upper?this.cfg.cloudWordsUpper:this.cfg.cloudWords};
 }
 loadCloudType(){
  const {key,url,atlas}=this.cloudTypeConfig();if(!url||!atlas)return;
  this.cloudTypes??=new Map();if(this.cloudTypes.has(key))return;
  const image=new Image(),entry={image,state:'loading'};this.cloudTypes.set(key,entry);
  this.on(image,'load',()=>{if(this.destroyed)return;entry.state='ready';this.decorateCloudType();this.statusTitle();this.wake()});
  this.on(image,'error',()=>{if(this.destroyed)return;entry.state='error';this.decorateCloudType();this.statusTitle();this.wake()});image.src=url;
 }
 decorateCloudType(){
  const {key,atlas:a}=this.cloudTypeConfig(),entry=this.cloudTypes?.get(key);
  const supported=!!a&&!!this.words?.length&&this.words.every(w=>a.words[w.textContent]);this.root.dataset.cloudText=supported?'supported':'custom';
  if(entry?.state==='ready'){
   this.root.dataset.cloudLettering='ready';this.root.style.setProperty('--tz-lettering-url',`url("${entry.image.src}")`);
   this.root.style.setProperty('--tz-lettering-size',`${a.width/a.unit}em ${a.height/a.unit}em`);
  }else this.root.removeAttribute('data-cloud-lettering');
  this.words?.forEach(w=>{delete w.dataset.cloudWord;const m=a?.words[w.textContent];if(!m)return;w.dataset.cloudWord='true';const unit=a.unit;w.style.setProperty('--cloud-w',m.w/unit+'em');w.style.setProperty('--cloud-h',m.h/unit+'em');w.style.setProperty('--cloud-x',-m.x/unit+'em');w.style.setProperty('--cloud-y',-m.y/unit+'em');w.style.setProperty('--cloud-top',(1.05-m.baseline/unit)+'em');});
 }
 statusTitle(){
  const cloud=this.settings.gelatina==='nuvem',supported=this.root.dataset.cloudText==='supported',state=this.cloudTypes?.get(this.cloudTypeConfig().key)?.state;
  const text=!cloud?'Tipografia de apoio · posição e tamanho editáveis.':!supported?'Tipografia de apoio ativa: estas palavras não correspondem ao lettering de nuvens.':state==='loading'?'Carregando lettering de nuvens…':state!=='ready'?'Tipografia de apoio ativa: o lettering de nuvens não carregou.':this.settings.title_case==='uppercase'?'Nuvens em MAIÚSCULAS · posição e tamanho editáveis.':'Lettering de nuvens · posição e tamanho editáveis.';
  this.root.dataset.titleStatus=text;
 }
 seek(progress,focusIndex=null){
  const y=this.root.getBoundingClientRect().top+scrollY+Math.max(1,this.root.offsetHeight-this.h)*storyToScroll(Math.min(progress,1),this.approachExtra)+this.h*Math.max(0,progress-1)/.33;
  this.closeNote();window.scrollTo({top:y,behavior:this.reduce.matches?'instant':'smooth'});
  if(focusIndex!==null){clearTimeout(this.focusTimer);this.focusTimer=setTimeout(()=>{this.buttons[focusIndex]?.focus({preventScroll:true});this.wake()},550);}
 }
 bindBenefits(){
  this.on(this.note.querySelector('[data-tz-note-close]'),'click',()=>{this.closeNote(true);this.wake()});
  this.on(document,'pointerdown',e=>{if(this.activeBenefit&&!this.note.contains(e.target)&&!this.activeBenefit.contains(e.target)){this.closeNote();this.wake()}});
  this.journey.forEach(b=>this.on(b,'click',()=>this.seek(Number(b.dataset.tzSeek))));
  this.buttons.forEach((btn,i)=>{
   btn.setAttribute('aria-expanded','false');
   this.on(btn,'click',()=>{
    if(this.activeBenefit===btn){this.closeNote();return;}
    this.closeNote();this.activeBenefit=btn;btn.setAttribute('aria-expanded','true');
    this.renderNote(btn);document.body.append(this.note);this.note.hidden=false;this.placeNote(btn);this.note.querySelector('[data-tz-note-close]').focus({preventScroll:true});
    if(!this.reduce.matches)this.burst(btn,i);
   });
   this.on(btn,'focus',()=>{this.focusedBenefit=btn;this.wake()});
   this.on(btn,'blur',()=>{this.focusedBenefit=null;this.wake()});
   this.on(btn,'keydown',e=>{if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();const n=(i+(e.key==='ArrowRight'||e.key==='ArrowDown'?1:3))%4;this.mode==='static'?this.buttons[n].focus({preventScroll:false}):this.seek(.24+n*.205,n)}});
  });
  this.on(document,'keydown',e=>{if(e.key==='Escape'&&this.activeBenefit){e.preventDefault();this.closeNote(true);this.wake()}});
 }
 placeNote(btn){
  const r=btn.getBoundingClientRect(),nw=this.note.offsetWidth,nh=this.note.offsetHeight;
  const left=clamp(r.left+(r.width-nw)/2,16,Math.max(16,innerWidth-nw-16));
  let top=r.bottom+16;this.note.dataset.side='below';
  if(top+nh>innerHeight-66){top=r.top-nh-16;this.note.dataset.side='above';}
  this.note.style.left=left+'px';this.note.style.top=clamp(top,16,Math.max(16,innerHeight-nh-66))+'px';this.note.style.bottom='auto';
 }

 setMotion(){
  if(this.reduce.matches||this.cfg.mode==='static'){
   this.closeNote();this.loading&&(this.loading.hidden=true);this.root.dataset.mode='static';this.root.removeAttribute('data-enhanced');this.portal?.remove();this.portal=null;cancelAnimationFrame(this.raf);this.raf=0;this.releaseGL();this.boxFrames?.destroy();this.spinFrames?.destroy();this.boxFrames=null;this.spinFrames=null;this.particles=[];this.copy.style.cssText='';this.parallax.style.cssText='';this.clouds.forEach(c=>c.style.cssText='');this.root.querySelector('[data-tz-benefits]').style.cssText='';this.buttons.forEach(b=>{b.style.cssText='';b.tabIndex=0});this.mode='static';this.status('Composição estática');return;
  }
  if(this.portal)return;
  this.mode='loading';this.root.dataset.mode=this.mode;if(this.loading){this.loading.hidden=false;this.loading.textContent='Preparando o voo…';}this.createPortal();this.measure();
  
  
  if(!this.motionBound){
   this.motionBound=true;this.on(window,'scroll',()=>this.wake(),{passive:true});this.on(window,'resize',()=>{this.measure();this.wake()},{passive:true});this.on(document,'visibilitychange',()=>{this.last=0;if(!document.hidden)this.wake();else{cancelAnimationFrame(this.raf);this.raf=0}});
   this.on(this.root,'pointermove',e=>{if(!this.fine.matches)return;this.pointer.tx=(e.clientX/this.w-.5)*2;this.pointer.ty=(e.clientY/this.h-.5)*2;this.wake()},{passive:true});this.on(this.root,'pointerleave',()=>{this.pointer.tx=0;this.pointer.ty=0;this.wake()});
   this.observer=new IntersectionObserver(([e])=>{this.inView=e.isIntersecting;if(this.inView)this.wake()}, {rootMargin:'100% 0px'});this.observer.observe(this.root);
  }
  this.wake();this.startGL();
  
 }
 createPortal(){const portal=document.createElement('div');portal.className='tz-hero-portal';portal.setAttribute('aria-hidden','true');portal.dataset.tzOwner=this.root.id;const canvas=document.createElement('canvas');canvas.className='tz-hero-portal__gl';canvas.hidden=true;portal.append(canvas);this.gl=canvas;this.portal=portal;document.body.append(portal);}
 measure(){this.w=innerWidth;this.h=innerHeight;const base=clamp(Number(this.settings?.scroll_length)||560,400,800)+(this.w<768?40:0);this.root.style.setProperty('--tz-scroll-length',(100+(base-100)*(1+(this.approachExtra||0)))+'svh');if(this.renderer){this.setResolution();this.renderer.setSize(this.w,this.h,false);this.distance=this.h/(2*Math.tan(this.THREE.MathUtils.degToRad(35)/2));this.camera.aspect=this.w/this.h;this.camera.position.z=this.distance;this.camera.updateProjectionMatrix();}}

 setResolution(){if(!this.renderer)return;const cap=this.fine.matches?1.5:1.25;const budget=Math.sqrt(2000000/Math.max(1,this.w*this.h));this.pixelRatio=Math.max(.7,Math.min(devicePixelRatio,cap,budget)*(this.quality===2?.6:this.quality===1?.8:1));this.renderer.setPixelRatio(this.pixelRatio);this.renderer.transmissionResolutionScale=this.fine.matches?.75:.5;this.root.dataset.quality=this.quality===0?'alta':this.quality===1?'equilibrada':'leve';}
 wake(){if(!this.raf&&!this.destroyed&&this.portal&&!document.hidden)this.raf=requestAnimationFrame(t=>this.frame(t));}
 status(text){this.root.dataset.sceneStatus=text;this.root.dispatchEvent(new CustomEvent('tizzy:status',{bubbles:true,detail:{text}}))}
 async startGL(){
  if(this.glStarting===this.gl||this.renderer)return;const canvas=this.gl;this.glStarting=canvas;this.status('Carregando caixa, balões e embalagens 3D…');
  try{
   if(!this.cfg.airshipGLB||!this.cfg.packGLB){this.fail3D('Configure as URLs GLB da caixa com balões e da embalagem no editor Shopify.');return;}const [THREE,{GLTFLoader}]=await Promise.all([import('./tz-three.js'),import('./tz-GLTFLoader.js')]);
   if(this.destroyed||this.reduce.matches||canvas!==this.gl)return;
   this.THREE=THREE;this.loader=new GLTFLoader();this.renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
   this.setResolution();this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.NeutralToneMapping;this.renderer.toneMappingExposure=1;
   this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(35,this.w/this.h,1,10000);this.measure();
   this.environment=this.makeEnvironment();this.scene.environment=this.environment.texture;this.scene.environmentIntensity=.65;
   this.scene.add(new THREE.HemisphereLight(0xeaf5ff,0xffd0a9,1.1));const key=new THREE.DirectionalLight(0xfff6e9,2.8);key.position.set(-500,600,900);this.scene.add(key);const rim=new THREE.DirectionalLight(0xe7f3ff,1.2);rim.position.set(400,50,-300);this.scene.add(rim);
   this.on(canvas,'webglcontextlost',e=>{e.preventDefault();this.fail3D('O contexto 3D foi interrompido. Recarregue a página para restaurar a cena.')});
   const [airship,pack]=await Promise.all([this.loadModel(this.cfg.airshipGLB),this.loadModel(this.cfg.packGLB)]);
   if(!airship||!pack||this.destroyed||this.reduce.matches||canvas!==this.gl||!this.renderer){disposeScene(airship);disposeScene(pack);return;}
   this.airship=airship;this.airship.userData.height=new THREE.Box3().setFromObject(airship).getSize(new THREE.Vector3()).y;
   this.airship.traverse(o=>{if(o.isMesh){o.frustumCulled=false;[].concat(o.material).forEach(m=>{m.envMapIntensity=.65;if(o.name.includes('Label')){m.polygonOffset=true;m.polygonOffsetFactor=-1;m.roughness=.8;}if(o.name==='TZ_Box')m.side=THREE.DoubleSide})}});this.scene.add(airship);this.balloons=airship.getObjectByName('TZ_Balloons');this.flaps=[];airship.traverse(o=>{if(o.morphTargetInfluences)this.flaps.push(o)});
   this.packModel=this.normalize(pack);this.scene.add(this.packModel);this.secondaryModels=Array.from({length:6},()=>{const clone=this.packModel.clone(true);this.scene.add(clone);return clone});
   if(this.loading)this.loading.textContent='Finalizando a cena…';
   await this.renderer.compileAsync(this.scene,this.camera);
   if(this.destroyed||this.reduce.matches||canvas!==this.gl||!this.renderer)return;
   if(this.loading)this.loading.hidden=true;
   this.mode='3d';this.root.dataset.mode='3d';this.root.dataset.enhanced='true';this.gl.hidden=false;this.flightStart=this.clock;this.status('3D real · caixa, balões e embalagens');this.wake();
  }catch(error){if(!this.signal.aborted&&canvas===this.gl&&!this.reduce.matches)this.fail3D('Não foi possível carregar o 3D: '+error.message)}
  finally{if(this.glStarting===canvas)this.glStarting=null}
 }
 fail3D(message){this.cfg.mode='static';this.setMotion();this.status(message);}
 poseModel(model,pose){const factor=(this.distance-(pose.z||0))/this.distance;model.position.set((pose.x-this.w/2)*factor,(this.h/2-pose.y)*factor,pose.z||0);model.scale.setScalar(pose.h/model.userData.height*factor);model.rotation.set(pose.pitch||0,pose.yaw||0,-(pose.roll||0),'YXZ');}
 renderScene(layout,slot,next){
  if(!this.renderer||!this.airship||!this.packModel)return;
  const balloons=this.balloons;if(balloons){balloons.rotation.z=Math.sin(this.clock*.37)*.012;balloons.rotation.y=Math.sin(this.clock*.29)*.018;}const a=layout.airship;this.airship.visible=a.visible&&a.y+a.h>-100&&a.y-a.h<this.h+100;this.poseModel(this.airship,a);this.flaps.forEach(o=>{o.morphTargetInfluences[0]=a.open});
  const handed=(slot?.e||0)>=.985&&next?.dataset.glReady==='true';this.root.dataset.handoff=handed?'complete':slot?.e>0?'transition':'hero';this.packModel.visible=layout.pack.visible&&!handed;this.poseModel(this.packModel,layout.pack);
  this.secondaryModels.forEach((model,i)=>{const pose=layout.secondary[i];model.visible=pose.visible&&pose.y-pose.h<this.h+50;this.poseModel(model,pose)});
 }

 makeEnvironment(){
  const T=this.THREE,w=256,h=128,data=new Float32Array(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const strip=Math.exp(-Math.pow((x-w*.2)/(w*.07),2))*Math.exp(-Math.pow((y-h*.4)/(h*.3),2));const v=.5+strip*4;const i=(y*w+x)*4;data[i]=v;data[i+1]=v*.98;data[i+2]=v*.93;data[i+3]=1}
  const tex=new T.DataTexture(data,w,h,T.RGBAFormat,T.FloatType);tex.mapping=T.EquirectangularReflectionMapping;tex.needsUpdate=true;const pm=new T.PMREMGenerator(this.renderer);const env=pm.fromEquirectangular(tex);tex.dispose();pm.dispose();return env;
 }
 async loadModel(url){
  const ctrl=new AbortController(),stop=()=>ctrl.abort();this.loadControllers.add(ctrl);this.signal.addEventListener('abort',stop,{once:true});const timer=setTimeout(stop,30000);
  try{const r=await fetch(url,{signal:ctrl.signal});if(!r.ok)throw new Error(r.status);let bytes;const total=Number(r.headers.get('content-length'));if(this.mode==='loading'&&r.body&&total>0){const reader=r.body.getReader(),chunks=[];let received=0;while(true){const {done,value}=await reader.read();if(done)break;chunks.push(value);received+=value.length;this.loadProgress??=new Map();this.loadProgress.set(url,Math.min(1,received/total));const percent=Math.round([...this.loadProgress.values()].reduce((a,b)=>a+b,0)/2*100);if(this.loading)this.loading.textContent='Preparando o voo · '+percent+'%';}bytes=new Uint8Array(received);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}bytes=bytes.buffer;}else bytes=await r.arrayBuffer();const gltf=await this.loader.parseAsync(bytes,new URL('.',new URL(url,document.baseURI)).href);if(this.destroyed||!this.renderer){disposeScene(gltf.scene);return null}return gltf.scene;}
  finally{clearTimeout(timer);this.loadControllers.delete(ctrl);this.signal.removeEventListener('abort',stop)}
 }
 normalize(model){const T=this.THREE,b=new T.Box3().setFromObject(model),size=b.getSize(new T.Vector3()),center=b.getCenter(new T.Vector3());model.position.sub(center);const holder=new T.Group();holder.add(model);holder.userData.height=size.y;return holder;}
 positionModel(model,x,y,h,angle=0,spin=0){const sc=h/model.userData.height;model.position.set(x-this.w/2,this.h/2-y,0);model.scale.setScalar(sc);model.rotation.set(0,spin,angle);model.traverse(o=>{if(o.isMesh&&o.material?.transmission>0)o.material.attenuationDistance=.32*sc});}
 async burst(btn,index){
  if(!this.portal||this.destroyed||this.reduce.matches)return;const r=btn.getBoundingClientRect(),x=r.left+r.width/2,y=r.top;const shapes=[0,1,2,3,4,5];
  let model=null;const asset=this.cfg.gummies[index%6];
  if(this.renderer&&asset?.glb){
   if(!this.models.has(asset.glb))this.models.set(asset.glb,this.loadModel(asset.glb).then(m=>{if(!m)return null;this.configureGummy(m,asset.color);return m}).catch(()=>null));
   model=await this.models.get(asset.glb);if(this.destroyed||this.reduce.matches||!this.portal)return;
  }
  const n=this.fine.matches?6:3;
  for(let i=0;i<n;i++){
   const p={age:0,x,y,vx:(i-(n-1)/2)*70,vy:-160-i%2*70,spin:0,rotation:0,size:36+i%3*8,life:1.6};
   if(model&&this.renderer){p.mesh=this.normalize(model.clone(true));this.scene.add(p.mesh)}
   else{const im=document.createElement('img');im.src=this.cfg.gummies[shapes[(i+index)%6]].image;im.alt='';im.className='tz-hero-portal__burst';this.portal.append(im);p.el=im}
   this.particles.push(p);
  }
  this.wake();
 }
 configureGummy(model,color){
  const T=this.THREE;model.traverse(o=>{if(o.isMesh){const old=o.material;o.material=new T.MeshPhysicalMaterial({color:this.quality?color:0xffffff,normalMap:old.normalMap,normalScale:new T.Vector2(.6,.6),roughnessMap:old.roughnessMap,roughness:.35,metalness:0,transmission:this.quality?0:.95,thickness:.18,ior:1.43,clearcoat:.35,clearcoatRoughness:.16,attenuationColor:color,attenuationDistance:.32});old.dispose();}});
 }
 async initGSAP(){
  try{await classic(this.cfg.gsap,()=>!!window.gsap);await classic(this.cfg.scrollTrigger,()=>!!window.ScrollTrigger);if(this.destroyed)return;
   this.gsap=window.gsap;this.gsap.registerPlugin(window.ScrollTrigger);this.ctx=this.gsap.context(()=>{
    this.trigger=window.ScrollTrigger.create({trigger:this.root,start:'top bottom',end:'bottom top',onUpdate:()=>this.wake()});
   },this.root);
  }catch(e){console.warn('[TIZZY hero] Movimento básico ativo:',e.message)}
 }
 frame(now,still=false){
  this.raf=0;if(this.destroyed||!this.portal||document.hidden)return;
  const dt=still?0:this.last?Math.min((now-this.last)/1000,.05):1/60;const raw=this.last?now-this.last:0;this.last=now;this.clock+=dt;
  const rect=this.root.getBoundingClientRect(),p=scrollToStory(clamp(-rect.top/Math.max(1,rect.height-this.h)),this.approachExtra),exit=Math.max(0,-rect.top-(rect.height-this.h));const next=this.next?.isConnected?this.next:null,stage=next?this.stage:null;const fallback=stage?{e:clamp(1-stage.getBoundingClientRect().top/this.h),x:this.w*(this.w<768?.5:.68),y:stage.getBoundingClientRect().top+this.h*.5,h:this.h*.48}:null;const target=(next?.isConnected?window.__tzSlot:null)||fallback;const slot=target&&Number.isFinite(target.x)&&Number.isFinite(target.y)&&Number.isFinite(target.h)&&target.h>0?target:null;
  const landingPoster=this.landingPoster;if(landingPoster&&this.renderer)landingPoster.hidden=true;
  const awaitingSlot=slot?.e>=.985&&next?.dataset.glReady!=='true';const active=rect.top<this.h&&(rect.bottom>-this.h||awaitingSlot)&&(exit<this.h||slot?.e>0&&slot?.e<.985||awaitingSlot);
  this.portal.hidden=!active;if(!active){this.last=0;return;}
  const smoothing=1-Math.exp(-dt*5);this.pointer.x=mix(this.pointer.x,this.pointer.tx,smoothing);this.pointer.y=mix(this.pointer.y,this.pointer.ty,smoothing);
  this.scrollSpring??=new ScrollFollower(p,Number(this.settings.scroll_response)||14);this.progress=this.scrollSpring.advance(p,dt);const animatedP=mix(this.progress,p,smooth(0,.35,slot?.e||0));
  const layout=heroLayout({width:this.w,height:this.h,progress:animatedP,exit,handoff:slot,time:this.clock,energy:this.cfg.energy||1,fall:this.settings.queda,pointer:this.pointer});
  const force=flightForces(animatedP,this.clock,this.pointer,this.cfg.energy||1,slot?.e||0);
  const drift={x:this.flight.x.advance(force.x,dt)*this.w,y:this.flight.y.advance(force.y,dt)*this.h,roll:this.flight.roll.advance(force.roll,dt)};
  layout.airship.x+=drift.x;layout.airship.y+=drift.y;layout.airship.roll=drift.roll;
  // The initial flight also moves in time, as in the original intro, rather than waiting for wheel steps.
  const intro=1-smooth(0,6.5,Math.max(0,this.clock-(this.flightStart??this.clock)));
  const cameraDistance=this.distance??this.h/(2*Math.tan(35*Math.PI/360));
  const approach=1-smooth(.015,.17,animatedP),factor=1-layout.airship.z/cameraDistance;
  const introDepth=.6*intro*approach;layout.airship.h*=factor/(factor+introDepth);layout.airship.z-=cameraDistance*introDepth;
  // Every pack emerges from the moving box before joining its original falling path.
  const release=1-smooth(.25,.47,animatedP);layout.pack.x+=drift.x*release;layout.pack.y+=drift.y*release;
  layout.secondary.forEach((pose,i)=>{const start=.27+i*.039,release=1-smooth(start,start+.16,animatedP);pose.x+=drift.x*release;pose.y+=drift.y*release});
  this.layout=layout;this.root.dataset.progress=animatedP.toFixed(4);
  // One canvas changes stacking context; no duplicate product or WebGL renderer.
  const back=animatedP<.225&&!this.particles.length;
  const parent=back?this.sticky:document.body;
  if(this.portal.parentElement!==parent)parent.append(this.portal);
  this.portal.dataset.depth=back?'back':'front';
  this.gl.style.filter=back?`blur(${(1-smooth(.02,.19,animatedP))*.7}px)`:'none';
  this.gl.style.opacity=back?String(.80+.20*smooth(.02,.19,animatedP)):'1';
  this.copy.style.opacity=layout.titleOpacity<.04?0:layout.titleOpacity;this.copy.style.transform=`translate3d(0,${layout.titleY}px,0) scale(${layout.titleScale})`;this.parallax.style.transform=`translate3d(${-this.pointer.x*32*(this.cfg.parallax??1)}px,${-this.pointer.y*22*(this.cfg.parallax??1)}px,0)`;
  this.words?.forEach((word,i)=>{const sway=Number(this.settings.balanco)/100,phase=this.clock*.48+i*1.13,depth=.5+(i%3)*.3;word.style.transform=`translate3d(${Math.sin(phase*.7)*sway*3-this.pointer.x*depth*5}px,${Math.sin(phase)*sway*8-this.pointer.y*depth*7-smooth(.025+i*.005,.22+i*.005,animatedP)*i*2}px,0) rotate(${Math.sin(phase+1)*sway*.6}deg)`});
  this.clouds.forEach((c,i)=>{const sign=i%2?-1:1,depth=[.3,.55,1.1,1.4,.18,.75][i],strength=this.cfg.parallax??1;c.style.transform=`translate3d(${Math.sin(this.clock*.07+i)*14-this.pointer.x*depth*30*strength+Math.sin(animatedP*2+i)*animatedP*22}px,${-animatedP*this.h*depth*.18*strength-this.pointer.y*depth*19}px,0) scale(${sign*this.cfg.cloudScale*(this.settings.nuvens==='Encoberto'?1.2:1)},${this.cfg.cloudScale})`;c.style.opacity=([.68,.72,.86,.8,.24,.3][i])*layout.cloudOpacity*this.cfg.cloudOpacity;});
  this.root.style.setProperty('--tz-scene-progress',animatedP);const nearest=this.journey.reduce((best,b,i)=>Number(b.dataset.tzSeek)<=animatedP+.02?i:best,0);this.journey.forEach((b,i)=>{if(i===nearest)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
  const benefits=this.benefits;benefits.style.opacity=1;benefits.style.visibility='visible';
  this.buttons.forEach((btn,i)=>{const center=.24+i*.205,start=center-.16,enter=smooth(start,start+.12,animatedP),leave=smooth(center+.04,center+.17,animatedP),naturalAlpha=enter*(1-leave),retained=(this.focusedBenefit===btn&&btn.matches(':focus-visible')||this.activeBenefit===btn)&&exit===0;const alpha=retained?1:naturalAlpha;btn.style.opacity=alpha;btn.style.visibility=alpha<.02?'hidden':'visible';btn.tabIndex=alpha<.1?-1:0;btn.style.transform=`translate3d(${Math.sin(this.clock*.13+i)*4-this.pointer.x*6}px,${clamp(center-animatedP,-.2,.2)*this.h*.23-this.pointer.y*8}px,0)`;btn.style.filter='none';});

  if(this.activeBenefit){const i=this.buttons.indexOf(this.activeBenefit);if(Math.abs(animatedP-(.24+i*.205))>.22||exit>0)this.closeNote();else this.placeNote(this.activeBenefit);}
  this.renderScene(layout,slot,next);
  this.particles=this.particles.filter(v=>{v.age+=dt;if(v.age>v.life){if(v.mesh)this.scene?.remove(v.mesh);v.el?.remove();return false}v.vy+=460*dt;v.x+=v.vx*dt;v.y+=v.vy*dt;v.spin+=dt*3;v.rotation+=dt*.7;if(v.mesh&&this.renderer)this.positionModel(v.mesh,v.x,v.y,v.size, v.rotation,v.spin);else if(v.el){v.el.style.transform=`translate3d(${v.x}px,${v.y}px,0) rotate(${v.spin}rad)`;v.el.style.opacity=clamp((v.life-v.age)*3)}return true});
  if(this.renderer){this.renderer.render(this.scene,this.camera);if(raw>0&&raw<1000){this.fps.push(raw);if(this.fps.length>=120){const average=this.fps.reduce((a,b)=>a+b)/this.fps.length;this.root.dataset.fps=String(Math.round(1000/average));this.root.dataset.drawCalls=String(this.renderer.info.render.calls);this.root.dataset.dpr=this.pixelRatio.toFixed(2);if(average>(this.fine.matches?25:36)&&this.quality<2){this.quality++;this.setResolution();this.measure();}this.fps=[]}}}
  
  if(this.inView||awaitingSlot||this.particles.length||slot?.e>0&&slot?.e<.985)this.wake();

 }
 releaseGL(){if(this.landingPoster)this.landingPoster.hidden=false;this.glStarting=null;this.loadControllers.forEach(c=>c.abort());this.loadControllers.clear();this.airship=null;this.balloons=null;this.flaps=[];if(this.scene)disposeScene(this.scene);for(const v of this.models.values())Promise.resolve(v).then(m=>disposeScene(m));this.models.clear();this.environment?.dispose();this.renderer?.dispose();this.renderer=null;this.scene=null;this.packModel=null;this.secondaryModels=null;this.environment=null;if(this.gl)this.gl.hidden=true;this.particles=this.particles.filter(p=>!p.mesh);}
 destroy(){this.note.remove();this.destroyed=true;this.abort.abort();cancelAnimationFrame(this.raf);clearTimeout(this.noteTimer);this.observer?.disconnect();this.trigger?.kill();this.ctx?.revert();this.boxFrames?.destroy();this.spinFrames?.destroy();this.releaseGL();this.portal?.remove();clearTimeout(this.focusTimer);this.cloudTypes?.forEach(entry=>{entry.image.src=''});this.cloudTypes?.clear();this.poster.onload=null;if(this.stillImage)this.stillImage.onload=null;this.root.removeAttribute('data-enhanced');}
}
export function mount(scope=document){
 const roots=[...(scope.matches?.('[data-tz-hero]')?[scope]:[]),...scope.querySelectorAll('[data-tz-hero]')];
 for(const root of roots){if(!root.isConnected)continue;const old=instances.get(root.id);if(old?.root===root)continue;if(old)old.destroy();
  try{const h=new Hero(root);instances.set(root.id,h);h.initGSAP()}catch(e){console.warn('[TIZZY hero] Composição estática mantida:',e.message)}
 }
}
export function unmount(scope){for(const [id,h] of instances)if(scope===h.root||scope.contains(h.root)){h.destroy();instances.delete(id)}}
// The shared Shopify entry point owns mounting and unloading. Importing this module for GSAP has no side effects.

export async function loadAnimationLibraries(cfg){await classic(cfg.gsap,()=>!!window.gsap);await classic(cfg.scrollTrigger,()=>!!window.ScrollTrigger);return {gsap:window.gsap,ScrollTrigger:window.ScrollTrigger};}
