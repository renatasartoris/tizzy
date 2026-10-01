/* TIZZY sections entry point. Include once in theme.liquid for first-time editor insertion. */
(()=>{
 if(window.__tzShopifySections)return;
 const modules=new Map(),mounted=new Map();
 const mount=scope=>{
  const roots=[...(scope.matches?.('[data-tz-module]')?[scope]:[]),...scope.querySelectorAll('[data-tz-module]')];
  for(const root of roots){const value=root.dataset.tzModule;if(!value)continue;const url=new URL(value,document.baseURI).href;
   if(!modules.has(url))modules.set(url,import(url).catch(e=>{modules.delete(url);throw e}));
   modules.get(url).then(module=>{if(root.isConnected){module.mount(root);mounted.set(root,module)}}).catch(e=>console.warn('[TIZZY] Texto e imagens preservados:',e.message));
  }
 };
 window.__tzShopifySections={mount};
 document.addEventListener('shopify:section:load',e=>mount(e.target));
 document.addEventListener('shopify:section:unload',e=>{for(const [root,module] of mounted)if(root===e.target||e.target.contains(root)){module.unmount?.(root);mounted.delete(root)}});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>mount(document),{once:true});else mount(document);
})();
