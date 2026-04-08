'use client';

import { Todo, Priority } from '@/types/todo';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => void;
  onDelete: (todoId: string) => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const priorityLabels: Record<Priority, string> = {
  low: '低',
  medium: '中',
  high: '高',
};

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo)}
        className="h-5 w-5"
      />

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium text-sm ${
            todo.completed
              ? 'line-through text-gray-400'
              : 'text-gray-900'
          }`}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="text-xs text-gray-500 mt-1">{todo.description}</p>
        )}
        {todo.dueDate && (
          <p className="text-xs text-gray-500 mt-1">
            期限: {new Date(todo.dueDate).toLocaleDateString('ja-JP')}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {todo.category && (
          <Badge variant="outline" className="text-xs">
            {todo.category}
          </Badge>
        )}
        <Badge className={`text-xs font-semibold ${priorityColors[todo.priority]}`}>
          {priorityLabels[todo.priority]}
        </Badge>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(todo.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
