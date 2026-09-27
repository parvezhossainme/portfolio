"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X, Github, Linkedin, Globe, Coffee, Wrench, Keyboard, Link2, ChevronDown, ExternalLink, FileText, Share2, NotebookPen } from 'lucide-react';

import { siteConfig } from '@/config/site.config';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';

const iconMap = {
  github: Github,
  linkedin: Linkedin,
  globe: Globe,
  coffee: Coffee,
  wrench: Wrench,
  keyboard: Keyboard,
  link: Link2,
  fileText: FileText,
  share: Share2,
  notebook: NotebookPen,
};

export function Navbar() {
  const pathname = usePathname();
  const isToolsActive = siteConfig.tools.some(
    (tool) => !tool.external && pathname.startsWith(tool.href)
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: 1, 
        y: isVisible ? 0 : -100 
      }}
      transition={{ 
        duration: 0.6, 
        ease: 'easeOut',
        y: { duration: 0.3, ease: 'easeInOut' }
      }}
      className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
  <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 navbar-underline">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2"
          >
            <div className="cyber-chamfer-sm cyber-glow-sm flex h-8 w-8 items-center justify-center border border-primary/60 bg-primary/10">
              <span className="font-display text-sm font-bold text-primary">
                {siteConfig.author.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <span className="hidden font-display text-sm font-bold tracking-widest text-foreground uppercase sm:block">
              {siteConfig.author}
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
            {siteConfig.navigation.map((item) => (
              <motion.div
                whileHover={{ y: -3 }}
                whileFocus={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                className="inline-block"
                key={item.href}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group relative px-3 py-2 font-mono text-xs font-medium uppercase tracking-widest transition-colors hover:text-foreground/80 focus:text-foreground/80',
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-foreground/60'
                  )}
                  tabIndex={0}
                >
                  <span className="relative">
                    {item.label}
                    <motion.div
                      className="absolute left-0 right-0 -bottom-1 h-0.5 rounded group-hover:scale-x-100 group-focus:scale-x-100 scale-x-0 transition-transform"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      whileFocus={{ scaleX: 1 }}
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
                      style={{ transformOrigin: 'left', background: 'var(--navbar-underline)' }}
                    />
                  </span>
                </Link>
              </motion.div>
            ))}

            {/* Tools Dropdown */}
            <motion.div
              whileHover={{ y: -3 }}
              whileFocus={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
              className="inline-block"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      'group/trigger flex items-center gap-1 rounded px-3 py-2 font-mono text-xs font-medium uppercase tracking-widest outline-none transition-colors hover:text-foreground/80 focus-visible:text-foreground/80',
                      isToolsActive ? 'text-foreground' : 'text-foreground/60'
                    )}
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    Tools
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-data-[state=open]/trigger:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                  <DropdownMenuLabel>Tools</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {siteConfig.tools.map((tool) => {
                    const Icon = tool.icon
                      ? iconMap[tool.icon as keyof typeof iconMap]
                      : Wrench;

                    const content = (
                      <>
                        <Icon className="size-4 shrink-0" />
                        <span className="flex flex-col gap-0.5">
                          <span className="font-medium">{tool.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {tool.description}
                          </span>
                        </span>
                        {tool.external && (
                          <ExternalLink className="ml-auto size-3.5 shrink-0 opacity-60" />
                        )}
                      </>
                    );

                    return (
                      <DropdownMenuItem
                        key={tool.href}
                        asChild
                        className="items-start gap-3 py-2"
                      >
                        {tool.external ? (
                          <a href={tool.href} target="_blank" rel="noopener noreferrer">
                            {content}
                          </a>
                        ) : (
                          <Link href={tool.href}>{content}</Link>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </motion.div>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* GitHub Link */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-9 w-9 p-0"
          >
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
            >
              <Github className="h-4 w-4" />
            </Link>
          </Button>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-9 p-0"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">
                  {siteConfig.siteName}
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Navigation Links */}
                <nav className="space-y-1">
                  {siteConfig.navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center rounded-md px-3 py-2 font-mono text-xs font-medium uppercase tracking-wider transition-colors hover:bg-accent hover:text-accent-foreground',
                        pathname === item.href
                          ? 'bg-accent text-accent-foreground'
                          : 'text-foreground/60 hover:text-foreground'
                      )}
                    >
                      {item.label}
                      {pathname === item.href && (
                        <Badge variant="secondary" className="ml-auto">
                          Current
                        </Badge>
                      )}
                    </Link>
                  ))}
                </nav>

                <Separator />

                {/* Tools */}
                <div className="space-y-3">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">Tools</h3>
                  <div className="space-y-1">
                    {siteConfig.tools.map((tool) => {
                      const Icon = tool.icon
                        ? iconMap[tool.icon as keyof typeof iconMap]
                        : Wrench;

                      const content = (
                        <>
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="flex flex-col">
                            <span className="font-medium">{tool.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {tool.description}
                            </span>
                          </span>
                          {tool.external && (
                            <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 opacity-60" />
                          )}
                        </>
                      );

                      const itemClass =
                        'flex items-start gap-3 rounded-md px-3 py-2 font-mono text-xs font-medium uppercase tracking-wider text-foreground/60 transition-colors hover:bg-accent hover:text-accent-foreground';

                      return tool.external ? (
                        <a
                          key={tool.href}
                          href={tool.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className={itemClass}
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setIsOpen(false)}
                          className={itemClass}
                        >
                          {content}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Bio */}
                <div className="space-y-3">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">About</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {siteConfig.description}

                  </p>
                </div>

                <Separator />

                {/* Social Links */}
                <div className="space-y-3">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-primary">Connect</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {siteConfig.social.map((social) => {
                      const Icon = social.icon ? iconMap[social.icon as keyof typeof iconMap] : null;
                      return (
                        <Button
                          key={social.url}
                          variant="outline"
                          size="sm"
                          asChild
                          className="justify-start"
                        >
                          <Link
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {Icon && <Icon className="mr-2 h-4 w-4" />}
                            {social.label}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
