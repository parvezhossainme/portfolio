"use client";

import { Code2, Github, Sparkles } from 'lucide-react';

import { PageHeader } from './page-header';

export function ProjectsHeader() {
  return (
    <PageHeader
      badge="Projects"
      icon={Code2}
      title="My"
      accent="Projects"
      subtitle="A collection of projects that showcase my skills in full-stack development, machine learning, and open source contributions. Each project represents a journey of learning and innovation."
      meta={[
        { icon: Github, label: 'Fetched from GitHub API' },
        { icon: Sparkles, label: 'Updated in real-time' },
      ]}
    />
  );
}
