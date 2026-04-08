export type Priority = 'low' | 'medium' | 'high';
export type Category = string;

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: Category;
  createdAt: Date;
  dueDate?: Date;
  userId: string;
}

export interface User {
  id: string;
  name: string;
}
