const schema=await (await fetch(new URL('./tweaks-schema.json?v=1',import.meta.url))).json();
const frame=document.querySelector('#scene'),panel=document.querySelector('#tweaksPanel'),toggle=document.querySelector('#toggleTweaks'),controls=document.querySelector('#controls'),status=document.querySelector('#tweaksStatus');
const defaults=Object.fromEntries(schema.filter(s=>s.id).map(s=>[s.id,s.default]));let values={...defaults};
const storageKey='tizzy-approved-preview-tweaks-v1';
function normalize(input){const result={...defaults};for(const s of schema){if(!s.id||!Object.hasOwn(input,s.id))continue;const v=input[s.id];if(s.type==='range'){const n=Number(v);if(Number.isFinite(n))result[s.id]=Math.min(s.max,Math.max(s.min,Math.round((n-s.min)/s.step)*s.step+s.min));}else if(s.type==='select'){if(s.options.some(o=>o.value===v))result[s.id]=v;}else if(s.type==='checkbox')result[s.id]=!!v;else if(typeof v==='string')result[s.id]=v;}return result;}
try{values=normalize(JSON.parse(localStorage.getItem(storageKey)||'{}'));}catch{}
let pending=0;
function publish(){cancelAnimationFrame(pending);pending=requestAnimationFrame(()=>{try{localStorage.setItem(storageKey,JSON.stringify(values));}catch{}frame.contentWindow?.postMessage({type:'tz-preview-settings',settings:values},location.origin);});}
function setOpen(open){panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open)document.querySelector('#closeTweaks').focus();else toggle.focus();}
toggle.onclick=()=>setOpen(panel.hidden);document.querySelector('#closeTweaks').onclick=()=>setOpen(false);panel.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
const inputs=new Map();let group=controls;
for(const s of schema){if(s.type==='header'){const d=document.createElement('details');d.open=['Textos','Título','Título · desktop'].includes(s.content);const heading=document.createElement('summary');heading.textContent=s.content;d.append(heading);controls.append(d);group=d;continue;}
 const label=document.createElement('label');label.textContent=s.label;const input=document.createElement(s.type==='select'?'select':s.type==='textarea'?'textarea':'input');input.id='tweak-'+s.id;label.htmlFor=input.id;
 if(s.type==='select')for(const o of s.options){const option=document.createElement('option');option.value=o.value;option.textContent=o.label;input.append(option);}else if(input.tagName==='INPUT'){input.type=s.type==='range'?'range':s.type==='checkbox'?'checkbox':'text';if(s.type==='range'){input.min=s.min;input.max=s.max;input.step=s.step;}}
 const output=document.createElement('output');const sync=()=>{input.value=values[s.id]??'';input.checked=!!values[s.id];if(s.type==='range')output.textContent=input.value+' '+(s.unit||'');};sync();inputs.set(s.id,sync);
 input.addEventListener('input',()=>{values[s.id]=s.type==='range'?Number(input.value):s.type==='checkbox'?input.checked:input.value;sync();publish();});label.append(input,output);if(s.info){const help=document.createElement('small');help.textContent=s.info;label.append(help);}group.append(label);
}
document.querySelector('#resetTweaks').onclick=()=>{values={...defaults};inputs.forEach(sync=>sync());publish();};
// Retry only until the section module is ready; the child acknowledges each application.
let retry;function sendWhenReady(){clearInterval(retry);publish();retry=setInterval(publish,300);setTimeout(()=>clearInterval(retry),10000);}
frame.addEventListener('load',sendWhenReady);sendWhenReady();
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==frame.contentWindow||e.data?.type!=='tz-preview-applied')return;clearInterval(retry);status.textContent=e.data.title||'Ajustes aplicados à prévia.';});
