import {storyToScroll,approachExtra} from '../assets/tz-hero-motion.js';
const originals=new Map([...document.querySelectorAll('.shopify-section')].map(e=>[e.id,e.innerHTML]));
const style=document.createElement('style');style.textContent='.qa{position:fixed;bottom:10px;left:10px;z-index:100;background:#fff6ee;padding:8px;border-radius:8px;display:flex;gap:6px;font:12px system-ui}.qa button{font:inherit;padding:6px}.qa output{min-width:80px}';document.head.append(style);
const bar=document.createElement('div');bar.className='qa';document.body.append(bar);
function button(label,action){const b=document.createElement('button');b.textContent=label;b.onclick=action;bar.append(b)}
const output=document.createElement('output');bar.append(output);
for(const [label,p] of [['Início',0],['Abertura',.22],['Queda',.43],['Sabores',1.33]])button(label,()=>{const root=document.querySelector('[data-tz-hero]'),cfg=JSON.parse(root.querySelector('[data-tz-config]').textContent);const y=root.getBoundingClientRect().top+scrollY+(root.offsetHeight-innerHeight)*storyToScroll(Math.min(p,1),approachExtra(cfg.settings.approach_pacing))+innerHeight*Math.max(0,p-1)/.33;scrollTo({top:y,behavior:'instant'})});
button('Recarregar Hero',()=>replace('shopify-section-hero-test'));
button('Recarregar Sabores',()=>replace('shopify-section-flavors-test'));
function replace(id){const wrapper=document.getElementById(id);wrapper.dispatchEvent(new CustomEvent('shopify:section:unload',{detail:{sectionId:id},bubbles:true}));wrapper.innerHTML=originals.get(id);wrapper.dispatchEvent(new CustomEvent('shopify:section:load',{detail:{sectionId:id},bubbles:true}));output.textContent='Seção recriada'}
button('Perder contexto',()=>{document.querySelector('.tz-hero-portal__gl')?.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();output.textContent='Contexto perdido'});
