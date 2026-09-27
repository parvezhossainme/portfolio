import Link from 'next/link';

const footerLinks = [
  { label: 'Sitemap', href: '/sitemap.xml' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Terms of Service', href: '/terms-of-service' },
  { label: 'Contact', href: '/contact' },
];

export function FooterSection() {
  return (
    <footer className="relative mt-20 border-t border-border/60 px-4 pt-10 pb-8 text-muted-foreground sm:px-6 sm:pb-12 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-5">
        <p className="font-mono text-[0.65rem] tracking-[0.4em] text-primary uppercase">
          {'// end_of_transmission'}
        </p>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 font-mono text-xs">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-muted-foreground uppercase tracking-wider transition-colors hover:text-primary hover:[text-shadow:0_0_8px_var(--neon)]"
                >
                  <span className="text-primary/70">&gt;</span> {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="font-mono text-xs">
          Built with{' '}
          <a href="https://nextjs.org" className="text-primary transition-colors hover:underline">
            Next.js
          </a>{' '}
          &amp;{' '}
          <a href="https://tailwindcss.com" className="text-primary transition-colors hover:underline">
            Tailwind CSS
          </a>
        </p>

        <p className="text-center font-mono text-[0.7rem] uppercase tracking-wider text-muted-foreground/70">
          &copy; 2025 Parvez Hossain. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
