export function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 border-b border-[var(--color-border)]">
      <div className="container-x flex items-center justify-between h-16">
        <a href="#top" className="flex items-center gap-2 font-bold text-lg">
          <span className="gradient-text">Paraná</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-ink-soft)]">
          <a href="/#producto" className="hover:text-[var(--color-brand)]">Producto</a>
          <a href="/#caso" className="hover:text-[var(--color-brand)]">Caso real</a>
          <a href="/#precios" className="hover:text-[var(--color-brand)]">Precios</a>
          <a href="/blog" className="hover:text-[var(--color-brand)]">Blog</a>
          <a href="/contacto" className="hover:text-[var(--color-brand)]">Contacto</a>
        </nav>
        <a href="/#waitlist" className="btn-primary text-sm">
          Sumate a la lista
        </a>
      </div>
    </header>
  );
}
