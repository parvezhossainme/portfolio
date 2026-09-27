"use client";
import Image from 'next/image';

import { BetterAuthSignIn } from './better-auth-signin';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useSession } from '@/lib/auth-client';



export type Message = {
  sender: 'user' | 'me';
  name: string;
  avatar: string;
  content: string;
  time: string;
};

export function ChatInterface() {
  const { data } = useSession();
  const user = data?.user?.name || null;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/chat?user=${user}`)
      .then(res => res.json())
      .then(data => setMessages(data.messages || []));
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    setLoading(true);
    const newMsg: Message = {
      sender: 'user',
      name: 'You',
      avatar: '/avatar-user.png',
      content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, message: newMsg }),
    });
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card variant="holographic">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary uppercase">
              <MessageCircle className="h-5 w-5" />
              Chat Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!user && (
              <BetterAuthSignIn />
            )}
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={
                    msg.sender === 'me'
                      ? 'flex justify-end'
                      : 'flex justify-start'
                  }
                >
                  <div className="flex max-w-[70%] items-end gap-2">
                    {msg.sender === 'user' && (
                      <Image src={msg.avatar} alt={msg.name} width={32} height={32} className="h-8 w-8 rounded-full border border-primary/40 object-cover" />

                    )}
                    <div
                      className={
                        msg.sender === 'me'
                          ? 'cyber-chamfer-sm bg-primary px-4 py-2 text-primary-foreground'
                          : 'cyber-chamfer-sm bg-muted px-4 py-2 text-foreground'
                      }
                    >
                      <div className="mb-1 font-mono text-[0.65rem] font-semibold tracking-wider uppercase">
                        {msg.name} <span className="text-muted-foreground">{msg.time}</span>
                      </div>
                      <div className="text-sm leading-relaxed">{msg.content}</div>
                    </div>
                    {msg.sender === 'me' && (
                      <Image src={msg.avatar} alt={msg.name} width={32} height={32} className="h-8 w-8 rounded-full border border-primary/40 object-cover" />

                    )}
                  </div>
                </div>
              ))}
            </div>
            {user && (
              <div className="mt-4 flex gap-2">
                <Input
                  type="text"
                  className="flex-1"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={loading}
                />
                <Button size="sm" onClick={handleSend} disabled={loading || !input.trim()}>
                  Send
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-center"
      >
        <Card variant="default" className="inline-block p-6">
          <CardContent className="space-y-3 p-0">
            <h3 className="font-display text-base font-bold uppercase tracking-wide">Prefer email instead?</h3>
            <p className="text-sm text-muted-foreground">
              You can also reach out to me directly via email for more formal inquiries.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="mailto:parvezhossainme@gmail.com">
                Send Email
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
