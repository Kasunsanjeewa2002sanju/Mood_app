export function ThemeScript() {
  const script = `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(!s&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.documentElement.classList.add('dark')}catch(e){}})()`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
