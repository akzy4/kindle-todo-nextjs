import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoApp } from '@/components/TodoApp';
import { Todo, User } from '@/types/todo';

const mockUser: User = { id: 'user_1', name: 'テストユーザー' };

const mockTodos: Todo[] = [
  {
    id: 'todo_1',
    title: '未完了タスク',
    completed: false,
    priority: 'high',
    category: '仕事',
    createdAt: new Date('2024-01-01'),
    userId: 'user_1',
  },
  {
    id: 'todo_2',
    title: '完了タスク',
    completed: true,
    priority: 'low',
    category: '',
    createdAt: new Date('2024-01-02'),
    userId: 'user_1',
  },
];

vi.mock('@/lib/storage', () => ({
  getCurrentUser: vi.fn(() => mockUser),
  setCurrentUser: vi.fn(),
  getAllUsers: vi.fn(() => [mockUser]),
  saveUser: vi.fn(),
  getTodos: vi.fn(() => mockTodos),
  saveTodo: vi.fn(),
  deleteTodo: vi.fn(),
  getCategories: vi.fn(() => ['仕事']),
}));

vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({ theme: 'light', setTheme: vi.fn() })),
}));

import * as storage from '@/lib/storage';

describe('TodoApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(storage.getCurrentUser).mockReturnValue(mockUser);
    vi.mocked(storage.getTodos).mockReturnValue(mockTodos);
    vi.mocked(storage.getCategories).mockReturnValue(['仕事']);
    vi.mocked(storage.getAllUsers).mockReturnValue([mockUser]);
  });

  it('「TODO リスト」見出しを表示する', async () => {
    render(<TodoApp />);
    await waitFor(() => {
      expect(screen.getByText('TODO リスト')).toBeInTheDocument();
    });
  });

  it('全タスク数を表示する', async () => {
    render(<TodoApp />);
    await waitFor(() => {
      expect(screen.getByText('全タスク')).toBeInTheDocument();
    });
  });

  it('完了タスク数を表示する', async () => {
    render(<TodoApp />);
    await waitFor(() => {
      expect(screen.getByText('完了')).toBeInTheDocument();
    });
  });

  it('未完了タスク数を表示する', async () => {
    render(<TodoApp />);
    await waitFor(() => {
      expect(screen.getByText('未完了')).toBeInTheDocument();
    });
  });

  it('TODOリストにタスクを表示する', async () => {
    render(<TodoApp />);
    await waitFor(() => {
      expect(screen.getByText('未完了タスク')).toBeInTheDocument();
      expect(screen.getByText('完了タスク')).toBeInTheDocument();
    });
  });

  it('TODOが空の場合は空状態メッセージを表示する', async () => {
    vi.mocked(storage.getTodos).mockReturnValue([]);
    render(<TodoApp />);
    await waitFor(() => {
      expect(
        screen.getByText('TODOがありません。新しいタスクを追加しましょう！')
      ).toBeInTheDocument();
    });
  });

  it('「完了を表示」ボタンで完了タスクをフィルタリングできる', async () => {
    render(<TodoApp />);
    await waitFor(() => {
      expect(screen.getByText('完了タスク')).toBeInTheDocument();
    });
    const toggleButton = screen.getByRole('button', { name: '完了を表示' });
    await userEvent.click(toggleButton);
    expect(screen.queryByText('完了タスク')).not.toBeInTheDocument();
    expect(screen.getByText('未完了タスク')).toBeInTheDocument();
  });
});
