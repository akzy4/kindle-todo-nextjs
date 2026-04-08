import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserSelect } from '@/components/UserSelect';
import { User } from '@/types/todo';

vi.mock('@/lib/storage', () => ({
  getAllUsers: vi.fn(() => [
    { id: 'user_1', name: 'ユーザー1' },
    { id: 'user_2', name: 'ユーザー2' },
  ]),
  setCurrentUser: vi.fn(),
  saveUser: vi.fn(),
}));

const currentUser: User = { id: 'user_1', name: 'ユーザー1' };

describe('UserSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('「ユーザーを選択」ラベルを表示する', () => {
    render(<UserSelect currentUser={currentUser} onUserChange={vi.fn()} />);
    expect(screen.getByText('ユーザーを選択')).toBeInTheDocument();
  });

  it('現在のユーザー名を表示する', () => {
    render(<UserSelect currentUser={currentUser} onUserChange={vi.fn()} />);
    expect(screen.getByText('ユーザー1')).toBeInTheDocument();
  });

  it('「新規ユーザー」ボタンを表示する', () => {
    render(<UserSelect currentUser={currentUser} onUserChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: '+ 新規ユーザー' })).toBeInTheDocument();
  });

  it('「新規ユーザー」ボタンをクリックするとフォームが表示される', async () => {
    render(<UserSelect currentUser={currentUser} onUserChange={vi.fn()} />);
    const addButton = screen.getByRole('button', { name: '+ 新規ユーザー' });
    await userEvent.click(addButton);
    expect(screen.getByPlaceholderText('ユーザー名を入力...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('キャンセルボタンをクリックするとフォームが閉じる', async () => {
    render(<UserSelect currentUser={currentUser} onUserChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '+ 新規ユーザー' }));
    await userEvent.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(screen.queryByPlaceholderText('ユーザー名を入力...')).not.toBeInTheDocument();
  });

  it('ユーザー名が空の場合は新規ユーザーを追加しない', async () => {
    const { saveUser } = await import('@/lib/storage');
    render(<UserSelect currentUser={currentUser} onUserChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '+ 新規ユーザー' }));
    await userEvent.click(screen.getByRole('button', { name: '追加' }));
    expect(saveUser).not.toHaveBeenCalled();
  });

  it('新規ユーザーを追加するとonUserChangeが呼ばれる', async () => {
    const onUserChange = vi.fn();
    render(<UserSelect currentUser={currentUser} onUserChange={onUserChange} />);
    await userEvent.click(screen.getByRole('button', { name: '+ 新規ユーザー' }));
    const input = screen.getByPlaceholderText('ユーザー名を入力...');
    await userEvent.type(input, '新しいユーザー');
    await userEvent.click(screen.getByRole('button', { name: '追加' }));
    expect(onUserChange).toHaveBeenCalledWith(
      expect.objectContaining({ name: '新しいユーザー' })
    );
  });

  it('新規ユーザー追加後にフォームが閉じる', async () => {
    render(<UserSelect currentUser={currentUser} onUserChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: '+ 新規ユーザー' }));
    const input = screen.getByPlaceholderText('ユーザー名を入力...');
    await userEvent.type(input, '新しいユーザー');
    await userEvent.click(screen.getByRole('button', { name: '追加' }));
    expect(screen.queryByPlaceholderText('ユーザー名を入力...')).not.toBeInTheDocument();
  });
});
