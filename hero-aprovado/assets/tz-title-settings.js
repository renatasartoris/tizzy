// Shared title controls: preview, Shopify schema and rendering use the same values.
export const titleSettings = [
 {type:'select',id:'title_case',label:'Maiúsculas e minúsculas',default:'uppercase',options:[{value:'original',label:'Como foi escrito'},{value:'uppercase',label:'TUDO EM MAIÚSCULAS'},{value:'lowercase',label:'tudo em minúsculas'}],info:'A frase da proposta possui nuvens na escrita original e em MAIÚSCULAS. Palavras novas e a versão toda em minúsculas usam a tipografia de apoio.'},
 {type:'range',id:'title_leading',label:'Espaço entre linhas',min:90,max:150,step:5,default:100,unit:'%'},
 {type:'range',id:'title_word_gap',label:'Espaço extra entre palavras',min:0,max:24,step:1,default:0,unit:'px'},
 {type:'header',content:'Título · desktop'},
 {type:'range',id:'title_x',label:'Posição horizontal — desktop',min:0,max:60,step:1,default:6,unit:'%',info:'Distância da borda esquerda. A largura disponível limita o bloco à área da cena.'},
 {type:'range',id:'title_y',label:'Posição vertical — desktop',min:5,max:65,step:1,default:13,unit:'%'},
 {type:'range',id:'title_width',label:'Largura do bloco — desktop',min:25,max:94,step:1,default:59,unit:'%'},
 {type:'range',id:'title_size',label:'Tamanho do título — desktop',min:60,max:160,step:5,default:100,unit:'%',info:'100% mantém o tamanho da proposta. O lettering se ajusta à largura para manter cada palavra inteira.'},
 {type:'select',id:'title_align',label:'Alinhamento — desktop',default:'left',options:[{value:'left',label:'À esquerda'},{value:'center',label:'Centralizado'},{value:'right',label:'À direita'}]},
 {type:'header',content:'Título · celular'},
 {type:'range',id:'title_x_mobile',label:'Posição horizontal — celular',min:0,max:25,step:1,default:7,unit:'%'},
 {type:'range',id:'title_y_mobile',label:'Posição vertical — celular',min:5,max:65,step:1,default:14,unit:'%'},
 {type:'range',id:'title_width_mobile',label:'Largura do bloco — celular',min:60,max:100,step:1,default:86,unit:'%'},
 {type:'range',id:'title_size_mobile',label:'Tamanho do título — celular',min:60,max:160,step:5,default:100,unit:'%'},
 {type:'select',id:'title_align_mobile',label:'Alinhamento — celular',default:'center',options:[{value:'left',label:'À esquerda'},{value:'center',label:'Centralizado'},{value:'right',label:'À direita'}]}
];
export function normalizeTitleSettings(settings={}) {
 return Object.fromEntries(titleSettings.filter(s=>s.id).map(s=>{
  let value=settings[s.id]??s.default;
  if(s.type==='range'){value=Number(value);value=Number.isFinite(value)?Math.max(s.min,Math.min(s.max,value)):s.default;}
  else if(!s.options.some(o=>o.value===value))value=s.default;
  return [s.id,value];
 }));
}
export function titleText(text,mode='original') {
 const value=String(text??'');return mode==='uppercase'?value.toLocaleUpperCase('pt-BR'):mode==='lowercase'?value.toLocaleLowerCase('pt-BR'):value;
}
export function titleLayout(settings={},mobile=false) {
 const s=normalizeTitleSettings(settings),suffix=mobile?'_mobile':'';
 const x=s['title_x'+suffix],width=Math.min(s['title_width'+suffix],100-x);
 return {x,y:s['title_y'+suffix],width,size:s['title_size'+suffix]/100,align:s['title_align'+suffix],leading:s.title_leading/100,gap:s.title_word_gap};
}
export function applyTitleLayout(root,settings,atlas) {
 const longest=Math.max(1,...Object.values(atlas?.words||{}).map(w=>w.w/(atlas.unit||170)));
 for(const mobile of [false,true]){
  const l=titleLayout(settings,mobile),suffix=mobile?'-mobile':'';
  for(const [key,value] of Object.entries({x:l.x+'%',y:l.y+'%',width:l.width+'%',size:l.size,align:l.align,fit:mobile?l.width/longest+'vw':`min(${l.width/longest}vw,${880*l.width/59/longest}px)`,padding:l.y+'svh',maxwidth:880*l.width/59+'px'}))root.style.setProperty('--tz-title-'+key+suffix,String(value));
 }
 const s=normalizeTitleSettings(settings);root.style.setProperty('--tz-title-leading',s.title_leading/100);root.style.setProperty('--tz-title-gap',s.title_word_gap+'px');
 root.dataset.titleCase=s.title_case;
}
