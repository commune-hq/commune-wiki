export function setupPanes(){
  const stack = document.getElementById('pane-stack');
  if(!stack) return;

  async function openPane(url: string){
    const res = await fetch(url);
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const main = doc.querySelector('main') ?? doc.body;
    const pane = document.createElement('div');
    pane.className = 'pane';
    pane.innerHTML = `<header><strong>${doc.title?.replace(/ \|.*/,'')}</strong>
      <button class="close" aria-label="Close">×</button></header><div class="body">${main.innerHTML}</div>`;
    pane.querySelector('.close')!.addEventListener('click', () => pane.remove());
    stack.appendChild(pane);
    stack.scrollLeft = stack.scrollWidth;
    // limit
    const panes = stack.querySelectorAll('.pane');
    if(panes.length > 3) panes[0].remove();
  }

  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement)?.closest?.('a[href^="/notes/"]') as HTMLAnchorElement | null;
    if(!a) return;
    if (window.innerWidth < 1024) return; // mobile: let it navigate
    e.preventDefault();
    openPane(a.href);
    history.pushState({ pane: a.href }, '', a.href);
  });

  addEventListener('popstate', (e) => {
    // simple: close a pane on back, ignore forward for now
    const panes = stack.querySelectorAll('.pane');
    if(panes.length) panes[panes.length-1].remove();
  });
}
