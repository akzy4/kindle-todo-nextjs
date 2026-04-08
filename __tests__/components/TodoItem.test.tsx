import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoItem } from '@/components/TodoItem';
import { Todo } from '@/types/todo';

const baseTodo: Todo = {
  id: 'todo_1',
  title: 'テストタスク',
  completed: false,
  priority: 'medium',
  category: '',
  createdAt: new Date('2024-01-01'),
  userId: 'user_1',
};

describe('TodoItem', () => {
  it('タイトルを表示する', () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('テストタスク')).toBeInTheDocument();
  });

  it('未完了時はテキストに取り消し線がない', () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    const title = screen.getByText('テストタスク');
    expect(title.className).not.toContain('line-through');
  });

  it('完了時はテキストに取り消し線が付く', () => {
    const completedTodo = { ...baseTodo, completed: true };
    render(<TodoItem todo={completedTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    const title = screen.getByText('テストタスク');
    expect(title.className).toContain('line-through');
  });

  it('優先度ラベルを表示する（低）', () => {
    const todo = { ...baseTodo, priority: 'low' as const };
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('低')).toBeInTheDocument();
  });

  it('優先度ラベルを表示する（中）', () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('中')).toBeInTheDocument();
  });

  it('優先度ラベルを表示する（高）', () => {
    const todo = { ...baseTodo, priority: 'high' as const };
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('高')).toBeInTheDocument();
  });

  it('カテゴリがある場合はバッジを表示する', () => {
    const todo = { ...baseTodo, category: '仕事' };
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('仕事')).toBeInTheDocument();
  });

  it('カテゴリが空の場合はバッジを表示しない', () => {
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    // カテゴリ名のバッジが存在しないことを確認
    // 優先度バッジのみ存在する
    const badges = screen.getAllByText(/^(低|中|高)$/);
    expect(badges).toHaveLength(1);
  });

  it('descriptionがある場合は表示する', () => {
    const todo = { ...baseTodo, description: '詳細説明' };
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('詳細説明')).toBeInTheDocument();
  });

  it('dueDateがある場合は表示する', () => {
    const todo = { ...baseTodo, dueDate: new Date('2024-12-31') };
    render(<TodoItem todo={todo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/期限:/)).toBeInTheDocument();
  });

  it('チェックボックスをクリックするとonToggleが呼ばれる', async () => {
    const onToggle = vi.fn();
    render(<TodoItem todo={baseTodo} onToggle={onToggle} onDelete={vi.fn()} />);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(checkbox);
    expect(onToggle).toHaveBeenCalledWith(baseTodo);
  });

  it('削除ボタンをクリックするとonDeleteが呼ばれる', async () => {
    const onDelete = vi.fn();
    render(<TodoItem todo={baseTodo} onToggle={vi.fn()} onDelete={onDelete} />);
    const deleteButton = screen.getByRole('button');
    await userEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(baseTodo.id);
  });
});
