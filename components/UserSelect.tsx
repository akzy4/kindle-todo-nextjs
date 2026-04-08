'use client';

import { useState } from 'react';
import { User } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAllUsers, setCurrentUser, saveUser } from '@/lib/storage';

interface UserSelectProps {
  currentUser: User | null;
  onUserChange: (user: User) => void;
}

export function UserSelect({ currentUser, onUserChange }: UserSelectProps) {
  const [users, setUsers] = useState(getAllUsers());
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');

  const handleUserSelect = (userId: string | null) => {
    if (!userId) return;
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      onUserChange(user);
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: newUserName,
    };

    saveUser(newUser);
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    onUserChange(newUser);
    setNewUserName('');
    setIsAddingUser(false);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-gray-700">ユーザーを選択</label>

      {isAddingUser ? (
        <form onSubmit={handleAddUser} className="flex gap-2">
          <Input
            type="text"
            placeholder="ユーザー名を入力..."
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            autoFocus
          />
          <Button type="submit" size="sm">
            追加
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsAddingUser(false);
              setNewUserName('');
            }}
          >
            キャンセル
          </Button>
        </form>
      ) : (
        <div className="flex gap-2">
          <Select value={currentUser?.id || ''} onValueChange={handleUserSelect}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="ユーザーを選択...">
                {currentUser?.name}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAddingUser(true)}
          >
            + 新規ユーザー
          </Button>
        </div>
      )}
    </div>
  );
}
