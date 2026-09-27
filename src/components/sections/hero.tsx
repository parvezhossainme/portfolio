"use client";

import { motion } from 'motion/react';
import { siteConfig } from '@/config/site.config';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TypingMotion } from './TypingMotion';
import { ArrowRight, Zap, MapPin, Cpu, Radio } from 'lucide-react';

const roles = [
  'Full Stack Developer',
  'SaaS Builder',
  'ML & AI Explorer',
  'Open Source Contributor',
];

const hudLines = [
  { icon: MapPin, label: 'LOCATION', value: 'Bangladesh / Remote' },
  { icon: Cpu, label: 'STACK', value: 'TypeScript · React · Next.js' },
  { icon: Radio, label: 'STATUS', value: 'AVAILABLE FOR WORK' },
];

export function HeroSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative z-10 flex min-h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-neon-tertiary/5 select-none" />
      <div className="cyber-grid cyber-grid-fade pointer-events-none absolute inset-0 select-none" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-scan bg-primary/50 shadow-[0_0_20px_var(--neon)]" />
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-40 w-40 rounded-full bg-primary/10 blur-3xl select-none sm:h-64 sm:w-64" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-40 w-40 rounded-full bg-neon-secondary/10 blur-3xl select-none sm:h-64 sm:w-64" />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 py-24 sm:px-6 lg:grid-cols-5 lg:gap-8 lg:px-8">
        {/* Main column (60%) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="space-y-8 lg:col-span-3"
        >
          <p className="cyber-cursor font-mono text-xs tracking-[0.35em] text-primary uppercase">
            System online
          </p>

          <h1 className="font-display text-5xl leading-[0.95] font-black tracking-widest uppercase sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="cyber-glitch block text-foreground">Parvez</span>
            <span className="cyber-text-glow block text-primary">Hossain</span>
          </h1>

          <div className="flex min-h-8 items-center gap-2 font-mono text-base text-muted-foreground sm:text-lg">
            <span className="text-primary">&gt;</span>
            <TypingMotion roles={roles} className="text-foreground" />
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {siteConfig.description}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4"
          >
            <Button asChild size="lg" variant="glitch" className="w-full sm:w-auto">
              <Link href="/projects">
                <Zap className="h-4 w-4" />
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href={siteConfig.links.email}>
                Get in Touch
                <ArrowRight className="h-4 w-4 transition-transform group-hover/button:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* HUD panel (40%) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
          className="lg:col-span-2"
        >
          <div className="cyber-chamfer cyber-edge cyber-glow-sm [--chamfer-edge:color-mix(in_oklab,var(--neon)_30%,transparent)] bg-muted/20 p-6 backdrop-blur-sm">
            <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-3">
              <span className="font-mono text-[0.65rem] tracking-[0.3em] text-primary uppercase">
                operator_hud
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[0.65rem] text-muted-foreground">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" />
                live
              </span>
            </div>

            <dl className="space-y-4">
              {hudLines.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <dt className="font-mono text-[0.6rem] tracking-[0.3em] text-muted-foreground uppercase">
                      {label}
                    </dt>
                    <dd className="truncate font-mono text-sm text-foreground">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
