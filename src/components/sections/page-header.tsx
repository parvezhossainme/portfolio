"use client";

import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

import { Badge } from '@/components/ui/badge';

type MetaItem = {
  icon: LucideIcon;
  label: string;
};

interface PageHeaderProps {
  badge: string;
  icon: LucideIcon;
  title: string;
  accent: string;
  subtitle: string;
  meta?: MetaItem[];
}

export function PageHeader({
  badge,
  icon: BadgeIcon,
  title,
  accent,
  subtitle,
  meta,
}: PageHeaderProps) {
  return (
    <div className="mb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Badge variant="outline" className="mb-6">
          <BadgeIcon className="mr-1 h-3 w-3" />
          {badge}
        </Badge>

        <h1 className="cyber-chroma mb-6 font-display text-4xl font-black tracking-widest uppercase md:text-5xl lg:text-6xl">
          {title}{' '}
          <span className="cyber-text-glow text-neon">{accent}</span>
        </h1>

        <p className="mx-auto max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {subtitle}
        </p>
      </motion.div>

      {meta && meta.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
        >
          {meta.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-primary" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
