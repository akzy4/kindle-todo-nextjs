'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Todo, Priority, User } from '@/types/todo';
import {
  getTodos,
  saveTodo,
  deleteTodo,
  getCurrentUser,
  setCurrentUser,
  getAllUsers,
  getCategories,
} from '@/lib/storage';
import { TodoForm } from './TodoForm';
import { TodoItem } from './TodoItem';
import { UserSelect } from './UserSelect';

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | 'all'>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user on mount
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: `ユーザー${getAllUsers().length + 1}`,
      };
      setCurrentUser(newUser);
      setCurrentUserState(newUser);
    } else {
      setCurrentUserState(user);
    }
    setIsLoading(false);
  }, []);

  // Load todos when user changes
  useEffect(() => {
    if (!currentUser) return;
    const loadedTodos = getTodos(currentUser.id);
    setTodos(loadedTodos);
    setCategories(getCategories(currentUser.id));
  }, [currentUser]);

  const handleAddTodo = (title: string, priority: Priority, category: string) => {
    if (!currentUser) return;

    const newTodo: Todo = {
      id: `todo_${Date.now()}`,
      title,
      completed: false,
      priority,
      category,
      createdAt: new Date(),
      userId: currentUser.id,
    };

    saveTodo(newTodo);
    setTodos([...todos, newTodo]);
    setCategories(getCategories(currentUser.id));
  };

  const handleToggleTodo = (todo: Todo) => {
    const updated = { ...todo, completed: !todo.completed };
    saveTodo(updated);
    setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
  };

  const handleDeleteTodo = (todoId: string) => {
    deleteTodo(todoId);
    setTodos(todos.filter((t) => t.id !== todoId));
    if (currentUser) {
      setCategories(getCategories(currentUser.id));
    }
  };

  const handleUserChange = (user: User) => {
    setCurrentUser(user);
    setCurrentUserState(user);
  };

  const filteredTodos = todos.filter((todo) => {
    if (!showCompleted && todo.completed) return false;
    if (filterCategory && todo.category !== filterCategory) return false;
    if (filterPriority !== 'all' && todo.priority !== filterPriority) return false;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter((t) => t.completed).length,
    remaining: todos.filter((t) => !t.completed).length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">TODO リスト</h1>
          <p className="text-gray-600">タスクを管理して、生産性を上げよう</p>
        </div>

        {/* User Select */}
        <Card className="p-6 mb-6">
          <UserSelect currentUser={currentUser} onUserChange={handleUserChange} />
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            <p className="text-xs text-gray-600 mt-1">全タスク</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            <p className="text-xs text-gray-600 mt-1">完了</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.remaining}</p>
            <p className="text-xs text-gray-600 mt-1">未完了</p>
          </Card>
        </div>

        {/* Add Todo Form */}
        <Card className="p-6 mb-6">
          <TodoForm onSubmit={handleAddTodo} categories={categories} />
        </Card>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="全カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全カテゴリ</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterPriority}
            onValueChange={(value) => setFilterPriority(value as Priority | 'all')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全優先度</SelectItem>
              <SelectItem value="high">優先度: 高</SelectItem>
              <SelectItem value="medium">優先度: 中</SelectItem>
              <SelectItem value="low">優先度: 低</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showCompleted ? 'default' : 'outline'}
            onClick={() => setShowCompleted(!showCompleted)}
            className="w-full"
          >
            {showCompleted ? '完了を表示' : '完了を非表示'}
          </Button>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">
                {todos.length === 0
                  ? 'TODOがありません。新しいタスクを追加しましょう！'
                  : 'フィルター条件に合うタスクがありません。'}
              </p>
            </Card>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
