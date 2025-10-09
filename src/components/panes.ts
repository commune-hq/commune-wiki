export function setupPanes(){
  const stack = document.getElementById('pane-stack');
  if(!stack) return;

  function activateStack(on: boolean){
    stack.classList.toggle('active', on);
    document.body.classList.toggle('panes-open', on);
  }

  async function openPane(url: string){
    activateStack(true);

    const res = await fetch(url, { headers: { 'Accept':'text/html;charset=utf-8' } });
    const html = await res.text();
    const doc  = new DOMParser().parseFromString(html, 'text/html');
    const main = doc.querySelector('main') ?? doc.body;

    const pane = document.createElement('div');
    pane.className = 'pane';
    pane.innerHTML = `
      <header><strong>${doc.title?.replace(/ \|.*/,'')}</strong>
        <button class="close" aria-label="Close">×</button>
      </header>
      <div class="body"><article class="prose">${main.innerHTML}</article></div>`;

    pane.querySelector<HTMLButtonElement>('.close')!.addEventListener('click', () => {
      pane.remove();
      if(!stack.querySelector('.pane')) activateStack(false);
    });

    stack.appendChild(pane);
    stack.scrollLeft = stack.scrollWidth;

    // Limit to 3
    const panes = stack.querySelectorAll('.pane');
    if(panes.length > 3) panes[0].remove();
  }

  // Only intercept clicks inside the main article area
  document.addEventListener('click', (e) => {
    const inArticle = (e.target as HTMLElement)?.closest?.('main, article.prose');
    if (!inArticle) return;

    const a = (e.target as HTMLElement)?.closest?.('a[href^="/notes/"]') as HTMLAnchorElement | null;
    if(!a) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey) return; // allow new tab, etc.
    if (window.innerWidth < 1024) return;             // mobile → normal nav

    e.preventDefault();
    openPane(a.href);
    history.pushState({ pane: a.href }, '', a.href);
  });

  addEventListener('popstate', () => {
    const panes = stack.querySelectorAll('.pane');
    if(panes.length){
      panes[panes.length-1].remove();
      if(!stack.querySelector('.pane')) activateStack(false);
    }
  });
}
