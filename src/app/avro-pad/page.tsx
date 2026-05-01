import type { Metadata } from 'next';

import { AvroPadEditor } from '@/components/sections/avro-pad-editor';

export const metadata: Metadata = {
  title: 'Avro Pad',
  description: 'Bangla typing tool with Avro phonetic input, integrated into the portfolio design.',
};

export default function AvroPadPage() {
  return (
    <main className="mx-auto h-[calc(100dvh-5rem)] w-full max-w-7xl overflow-hidden px-2 pb-2 pt-16 sm:px-3 sm:pb-3 sm:pt-18 lg:px-4 lg:pb-4 lg:pt-20">
      <AvroPadEditor />
    </main>
  );
}