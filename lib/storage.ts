import { Todo, User } from '@/types/todo';

const TODOS_STORAGE_KEY = 'todos';
const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'currentUserId';

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userId = localStorage.getItem(CURRENT_USER_KEY);
  if (!userId) return null;

  const users = getAllUsers();
  return users.find((u) => u.id === userId) || null;
}

export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CURRENT_USER_KEY, user.id);
  saveUser(user);
}

export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem(USERS_STORAGE_KEY);
  return users ? JSON.parse(users) : [];
}

export function saveUser(user: User): void {
  if (typeof window === 'undefined') return;
  const users = getAllUsers();
  const existingIndex = users.findIndex((u) => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getTodos(userId: string): Todo[] {
  if (typeof window === 'undefined') return [];
  const todos = localStorage.getItem(TODOS_STORAGE_KEY);
  if (!todos) return [];

  const parsedTodos = JSON.parse(todos);
  return parsedTodos
    .filter((todo: any) => todo.userId === userId)
    .map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
    }));
}

export function saveTodo(todo: Todo): void {
  if (typeof window === 'undefined') return;
  const todos = localStorage.getItem(TODOS_STORAGE_KEY);
  const parsedTodos = todos ? JSON.parse(todos) : [];

  const existingIndex = parsedTodos.findIndex((t: any) => t.id === todo.id);
  if (existingIndex >= 0) {
    parsedTodos[existingIndex] = todo;
  } else {
    parsedTodos.push(todo);
  }

  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(parsedTodos));
}

export function deleteTodo(todoId: string): void {
  if (typeof window === 'undefined') return;
  const todos = localStorage.getItem(TODOS_STORAGE_KEY);
  if (!todos) return;

  const parsedTodos = JSON.parse(todos);
  const filteredTodos = parsedTodos.filter((t: any) => t.id !== todoId);
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(filteredTodos));
}

export function getCategories(userId: string): string[] {
  const todos = getTodos(userId);
  const categories = new Set(todos.map((t) => t.category).filter(Boolean));
  return Array.from(categories).sort();
}
