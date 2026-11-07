/* Ethereum identicons generated only from public addresses. */
(function(root){
  const cache=new Map();
  function dataUri(address){
    if(typeof address!=='string'||!/^0x[0-9a-fA-F]{40}$/.test(address))throw Error('Adresse publique invalide.');
    const seed=address.toLowerCase();
    if(!cache.has(seed)){
      const rectangles=[],context={fillStyle:'',fillRect(x,y,w,h){rectangles.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${this.fillStyle}"/>`);}};
      const canvas={width:0,height:0,getContext:()=>context};
      root.blockies.render({seed,size:8,scale:4},canvas);
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" shape-rendering="crispEdges">${rectangles.join('')}</svg>`;
      cache.set(seed,'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg));
      if(cache.size>4000)cache.delete(cache.keys().next().value);
    }
    return cache.get(seed);
  }
  root.Blockies={dataUri,clear:()=>cache.clear()};
})(globalThis);
