"use client";

import { User } from 'lucide-react';

import { PageHeader } from './page-header';

export function AboutHeader() {
  return (
    <PageHeader
      badge="About Me"
      icon={User}
      title="Parvez"
      accent="Hossain"
      subtitle="Full Stack Developer passionate about creating innovative solutions that bridge the gap between complex technology and user-friendly experiences."
    />
  );
}
