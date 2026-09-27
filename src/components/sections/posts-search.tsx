"use client";

import { useState } from 'react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';

interface PostsSearchProps {
  onSearch?: (query: string) => void;
  onTagFilter?: (tag: string | null) => void;
}


export function PostsSearch({ onSearch, onTagFilter }: PostsSearchProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // If you want to pass tags, do it via props in future
  const tags: string[] = [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);
    onTagFilter?.(newTag);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
    onSearch?.('');
    onTagFilter?.(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mb-12 space-y-6"
    >
      {/* Search Bar */}
      <div className="relative mx-auto max-w-md">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-sm text-primary">
          &gt;
        </span>
        <Input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-8"
        />
        <Search className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Tag Filters (dynamic, if tags are provided) */}
      {tags.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-3">
          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Button>
          ))}
          {(searchQuery || selectedTag) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Active Filters */}
      {(searchQuery || selectedTag) && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            Active filters:
          </span>
          {searchQuery && (
            <Badge variant="secondary">
              Search: &quot;{searchQuery}&quot;
            </Badge>
          )}
          {selectedTag && (
            <Badge variant="secondary">
              Tag: {selectedTag}
            </Badge>
          )}
        </div>
      )}
    </motion.div>
  );
}
