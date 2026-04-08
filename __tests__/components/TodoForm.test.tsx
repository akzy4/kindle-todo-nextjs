import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoForm } from '@/components/TodoForm';

describe('TodoForm', () => {
  it('テキスト入力と送信ボタンをレンダリングする', () => {
    render(<TodoForm onSubmit={vi.fn()} categories={[]} />);
    expect(screen.getByPlaceholderText('新しいTODOを入力...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('タイトルが空の場合は送信しない', async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} categories={[]} />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('タイトルが空白のみの場合は送信しない', async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} categories={[]} />);
    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    await userEvent.type(input, '   ');
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('タイトルを入力して送信するとonSubmitが呼ばれる', async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} categories={[]} />);
    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    await userEvent.type(input, 'テストタスク');
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(onSubmit).toHaveBeenCalledWith('テストタスク', 'medium', '');
  });

  it('送信後にフォームがリセットされる', async () => {
    const onSubmit = vi.fn();
    render(<TodoForm onSubmit={onSubmit} categories={[]} />);
    const input = screen.getByPlaceholderText('新しいTODOを入力...');
    await userEvent.type(input, 'テストタスク');
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(input).toHaveValue('');
  });

  it('既存カテゴリが渡された場合はカテゴリ選択肢に表示される', async () => {
    render(<TodoForm onSubmit={vi.fn()} categories={['仕事', 'プライベート']} />);
    // カテゴリセレクトのトリガーを開く
    const selects = screen.getAllByRole('combobox');
    // 2番目のセレクト（カテゴリ）を開く
    await userEvent.click(selects[1]);
    expect(screen.getByText('仕事')).toBeInTheDocument();
    expect(screen.getByText('プライベート')).toBeInTheDocument();
  });

  it('新規カテゴリ選択肢が表示される', async () => {
    render(<TodoForm onSubmit={vi.fn()} categories={[]} />);
    const selects = screen.getAllByRole('combobox');
    await userEvent.click(selects[1]);
    expect(screen.getByText('+ 新規カテゴリ')).toBeInTheDocument();
  });
});
