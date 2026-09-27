"use client";

import { Github, Lock, MessageCircle } from 'lucide-react';

import { PageHeader } from './page-header';

export function ChatHeader() {
  return (
    <PageHeader
      badge="Private Chat"
      icon={MessageCircle}
      title="Let's"
      accent="Talk"
      subtitle="Have a private 1:1 conversation with me through GitHub Discussions. Sign in with your GitHub account to get started. All conversations are private and secure."
      meta={[
        { icon: Lock, label: 'Private & Secure' },
        { icon: Github, label: 'GitHub Authentication' },
      ]}
    />
  );
}
