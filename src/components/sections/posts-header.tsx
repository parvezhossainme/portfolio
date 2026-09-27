"use client";

import { BookOpen, PenTool, Rss } from 'lucide-react';

import { PageHeader } from './page-header';

export function PostsHeader() {
  return (
    <PageHeader
      badge="Blog Posts"
      icon={PenTool}
      title="Latest"
      accent="Articles"
      subtitle="My thoughts on technology, development best practices, machine learning, and the future of software development. Articles from both Hashnode and Medium."
      meta={[
        { icon: BookOpen, label: 'Hashnode' },
        { icon: Rss, label: 'Medium' },
      ]}
    />
  );
}
