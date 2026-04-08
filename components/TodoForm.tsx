'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Priority } from '@/types/todo';

interface TodoFormProps {
  onSubmit: (title: string, priority: Priority, category: string) => void;
  categories: string[];
}

export function TodoForm({ onSubmit, categories }: TodoFormProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalCategory = newCategory || category;
    onSubmit(title, priority, finalCategory);
    setTitle('');
    setPriority('medium');
    setCategory('');
    setNewCategory('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="新しいTODOを入力..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">優先度: 低</SelectItem>
            <SelectItem value="medium">優先度: 中</SelectItem>
            <SelectItem value="high">優先度: 高</SelectItem>
          </SelectContent>
        </Select>

        {newCategory ? (
          <Input
            type="text"
            placeholder="新しいカテゴリ..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onBlur={() => {
              if (!newCategory.trim()) {
                setNewCategory('');
              }
            }}
            autoFocus
          />
        ) : (
          <Select
            value={category === '__new__' ? '__new__' : category}
            onValueChange={(value) => {
              if (value === '__new__') {
                setNewCategory('');
              } else {
                setCategory(value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="カテゴリを選択..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">カテゴリなし</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
              <SelectItem value="__new__">+ 新規カテゴリ</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </form>
  );
}
