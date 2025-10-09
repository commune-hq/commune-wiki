const cache = new Map<string, string>();

export function setupNotePreviews(){
  const show = (el: HTMLElement, html: string, x: number, y: number) => {
    let card = document.getElementById('note-hover');
    if(!card){
      card = document.createElement('div');
      card.id = 'note-hover';
      card.style.position = 'fixed';
      card.style.maxWidth = '420px';
      card.style.background = 'var(--sl-color-bg, #fff)';
      card.style.boxShadow = '0 20px 60px rgba(0,0,0,.25)';
      card.style.border = '1px solid rgba(0,0,0,.08)';
      card.style.borderRadius = '10px';
      card.style.padding = '12px 14px';
      card.style.zIndex = '60';
      card.style.pointerEvents = 'none';
      document.body.appendChild(card);
    }
    card.innerHTML = html;
    card.style.left = Math.min(x+16, window.innerWidth-460) + 'px';
    card.style.top = Math.min(y+16, window.innerHeight-220) + 'px';
    card.hidden = false;
  };
  const hide = () => {
    const card = document.getElementById('note-hover');
    if (card) card.hidden = true;
  };

  document.addEventListener('mouseover', async (e) => {
    const a = (e.target as HTMLElement)?.closest?.('a[href^="/notes/"]') as HTMLAnchorElement | null;
    if(!a) return;
    const url = a.getAttribute('href')!;
    if(cache.has(url)){ show(a, cache.get(url)!, e.clientX, e.clientY); return; }
    try{
      const r = await fetch(url);
      const t = await r.text();
      const doc = new DOMParser().parseFromString(t, 'text/html');
      const main = doc.querySelector('main') ?? doc.body;
      const paras = Array.from(main.querySelectorAll('p')).slice(0,3).map(p => p.outerHTML).join('');
      const html = `<div style="font-weight:600;margin-bottom:.3rem">${doc.title?.replace(/ \|.*/,'')}</div>${paras}`;
      cache.set(url, html);
      show(a, html, e.clientX, e.clientY);
    }catch{}
  });
  document.addEventListener('mouseout', (e) => {
    const a = (e.target as HTMLElement)?.closest?.('a[href^="/notes/"]');
    if(a) setTimeout(hide, 120);
  });
}
