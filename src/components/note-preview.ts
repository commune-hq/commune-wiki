const cache = new Map<string, string>();

export function setupNotePreviews(){
  const show = (el: HTMLElement, html: string, x: number, y: number) => {
    let card = document.getElementById('note-hover');
    if(!card){
      card = document.createElement('div');
      card.id = 'note-hover';
      card.style.position = 'fixed';
      card.style.maxWidth = '380px';
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

    // Viewport-aware positioning with padding from edges
    const padding = 16;
    const offsetFromCursor = 16;

    // Temporarily show card to measure dimensions
    card.style.opacity = '0';
    card.hidden = false;
    const rect = card.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    card.style.opacity = '1';

    // Calculate position with intelligent edge detection
    let left = x + offsetFromCursor;
    let top = y + offsetFromCursor;

    // Check right edge overflow
    if (left + cardWidth + padding > window.innerWidth) {
      // Try positioning to the left of cursor instead
      left = x - cardWidth - offsetFromCursor;
      // If still overflows on left, clamp to right edge
      if (left < padding) {
        left = window.innerWidth - cardWidth - padding;
      }
    }

    // Check left edge overflow
    if (left < padding) {
      left = padding;
    }

    // Check bottom edge overflow
    if (top + cardHeight + padding > window.innerHeight) {
      // Position above cursor instead
      top = y - cardHeight - offsetFromCursor;
      // If still overflows on top, clamp to bottom edge
      if (top < padding) {
        top = window.innerHeight - cardHeight - padding;
      }
    }

    // Check top edge overflow
    if (top < padding) {
      top = padding;
    }

    card.style.left = left + 'px';
    card.style.top = top + 'px';
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
      const html = `<div style="font-size:1.1rem;font-weight:600;margin-bottom:.5rem;line-height:1.3">${doc.title?.replace(/ \|.*/,'')}</div><div style="font-size:0.85rem;line-height:1.5;color:var(--sl-color-text-muted,#666)">${paras}</div>`;
      cache.set(url, html);
      show(a, html, e.clientX, e.clientY);
    }catch{}
  });
  document.addEventListener('mouseout', (e) => {
    const a = (e.target as HTMLElement)?.closest?.('a[href^="/notes/"]');
    if(a) setTimeout(hide, 120);
  });
}
