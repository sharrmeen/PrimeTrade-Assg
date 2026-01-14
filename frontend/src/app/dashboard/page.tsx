'use client';

import api from '@/src/lib/api';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, LogOut, PlusCircle, LayoutList } from 'lucide-react';

interface Task {
    id: string;
    title: string;
    description?: string;
    status: string;
    ownerId: string;
    createdAt: string;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err: unknown) {
      console.error('Fetch error:', err);
      setError('Session expired or failed to load tasks.');
      localStorage.removeItem('token');
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      
      await api.post('/tasks', { 
        title: title.trim(), 
        description: description.trim() 
      });
      
      setTitle('');
      setDescription('');
      await fetchTasks(); 
    } catch (err: any) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.detail || 'Failed to create task');
    }
  };

  const deleteTask = async (id: string) => {
    const previousTasks = tasks;
    setTasks(tasks.filter(task => task.id !== id));

    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      setTasks(previousTasks); 
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3">
          <LayoutList className="text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">PrimeTrade Tasks</h1>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 font-semibold hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Create Task Form */}
      <form onSubmit={createTask} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <div className="flex flex-col gap-4">
          <input 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            placeholder="Task Title (Required)" 
            required 
          />
          <textarea 
            value={description} 
            onChange={e => setDescription(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            placeholder="Add a description (Optional)..." 
            rows={2}
          />
          <button 
            type="submit"
            disabled={!title.trim()}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200"
          >
            <PlusCircle size={20} />
            Create Task
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="grid gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="flex justify-between items-start p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-gray-800 text-lg">{task.title}</p>
                  <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full font-bold uppercase">
                    {task.status}
                  </span>
                </div>
                {task.description && (
                  <p className="text-gray-500 text-sm leading-relaxed">{task.description}</p>
                )}
              </div>
              <button 
                onClick={() => deleteTask(task.id)} 
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                aria-label="Delete Task"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">No tasks yet. Create your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}