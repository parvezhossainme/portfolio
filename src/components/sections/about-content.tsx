"use client";

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import { siteConfig } from '@/config/site.config';

export function AboutContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-8"
    >
      <Card variant="holographic" className="overflow-hidden">
        <CardHeader className="relative z-10 flex flex-col items-center justify-center gap-4 pt-8 pb-2">
          <div className="cyber-chamfer cyber-edge cyber-glow relative h-48 w-48 overflow-hidden border-0 bg-background [--chamfer-edge:var(--neon)]">
            <Image
              src={siteConfig.author_img}
              alt={`${siteConfig.author} profile`}
              width={192}
              height={192}
              className="h-full w-full object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 z-0">
              <div className="absolute -top-16 left-1/2 h-[340px] w-[340px] -translate-x-1/2 bg-[radial-gradient(circle,color-mix(in_oklab,var(--neon)_30%,transparent),transparent_70%)] blur-2xl" />
              <div className="absolute right-0 bottom-0 h-[180px] w-[180px] bg-[radial-gradient(circle,color-mix(in_oklab,var(--neon-secondary)_25%,transparent),transparent_70%)] blur-xl" />
            </div>
          </div>
          <div className="cyber-text-glow mt-4 font-display text-2xl font-black tracking-widest text-primary uppercase">
            Parvez Hossain
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-4">
          <p className="leading-relaxed text-muted-foreground">
            Hi, I&apos;m Parvez Hossain—a passionate full-stack developer and SaaS enthusiast dedicated to building modern, scalable web applications. With a strong foundation in TypeScript, React, and Next.js, I thrive on transforming ideas into beautiful, performant products that delight users and drive business growth.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            My journey in tech began with a curiosity for how things work and a drive to solve real-world problems. Over the years, I&apos;ve collaborated with startups and global teams, delivering robust solutions in e-commerce, productivity, and developer tooling. I believe in clean code, thoughtful design, and continuous learning.
          </p>
          <p className="leading-relaxed text-muted-foreground">
            When I&apos;m not coding, you&apos;ll find me exploring new frameworks, contributing to open source, or sharing insights with the developer community. Let&apos;s connect and build something amazing together!
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
