export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-12 bg-white">
      <div className="container-x flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-[var(--color-ink-soft)]">
        <div className="flex items-center gap-2">
          <span className="gradient-text font-bold text-lg">Paraná</span>
          <span>·</span>
          <span>Rosario, Argentina</span>
        </div>
        <div className="flex gap-6 flex-wrap justify-center">
          <a href="/#producto" className="hover:text-[var(--color-brand)]">Producto</a>
          <a href="/#precios" className="hover:text-[var(--color-brand)]">Precios</a>
          <a href="/blog" className="hover:text-[var(--color-brand)]">Blog</a>
          <a href="/contacto" className="hover:text-[var(--color-brand)]">Contacto</a>
        </div>
        <div>© 2026 Paraná. Todos los derechos reservados.</div>
      </div>
    </footer>
  );
}
