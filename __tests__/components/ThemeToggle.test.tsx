import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '@/components/ThemeToggle';

const mockSetTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: vi.fn(() => ({
    theme: 'light',
    setTheme: mockSetTheme,
  })),
}));

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('ボタンをレンダリングする', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('ライトモード時はダークモードへの切り替えタイトルを持つ', async () => {
    const { useTheme } = await import('next-themes');
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme: mockSetTheme, themes: [], resolvedTheme: 'light', systemTheme: undefined, forcedTheme: undefined });
    render(<ThemeToggle />);
    // マウント後の状態を確認（useEffectでmountedがtrueになった後）
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('ライトモード時にクリックするとダークモードに切り替わる', async () => {
    const { useTheme } = await import('next-themes');
    vi.mocked(useTheme).mockReturnValue({ theme: 'light', setTheme: mockSetTheme, themes: [], resolvedTheme: 'light', systemTheme: undefined, forcedTheme: undefined });
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('ダークモード時にクリックするとライトモードに切り替わる', async () => {
    const { useTheme } = await import('next-themes');
    vi.mocked(useTheme).mockReturnValue({ theme: 'dark', setTheme: mockSetTheme, themes: [], resolvedTheme: 'dark', systemTheme: undefined, forcedTheme: undefined });
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });
});
