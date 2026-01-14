'use client';

import { useState } from 'react'; import { useRouter } from 'next/navigation'; import api from '@/src/lib/api'; import { ShieldCheck, User, Mail, Lock, UserPlus } from 'lucide-react';

export default function AuthPage() { const [isLogin, setIsLogin] = useState(true); const [form, setForm] = useState({ email: '', password: '', name: '', role: 'USER' }); const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); try { const endpoint = isLogin ? '/auth/login' : '/auth/register'; const res = await api.post(endpoint, form);

  if (isLogin) {
    document.cookie = `token=${res.data.access_token}; path=/; max-age=3600; SameSite=Strict`;
    localStorage.setItem('token', res.data.access_token);
    
    const payload = JSON.parse(atob(res.data.access_token.split('.')[1]));
    localStorage.setItem('userRole', payload.role);
    localStorage.setItem('userId', payload.sub);
    
    router.push('/dashboard');
  } else {
    alert("Registration successful! Please login.");
    setIsLogin(true);
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} catch (err: any) {
  alert(err.response?.data?.detail || "Authentication failed");
}
};

return ( <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4"> <div className="w-full max-w-md"> <div className="text-center mb-8"> <h1 className="text-4xl font-extrabold text-blue-600 mb-2">PrimeTrade</h1> <p className="text-gray-500"></p> </div>

    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        {isLogin ? <User className="text-blue-500" /> : <UserPlus className="text-blue-500" />}
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>

      {!isLogin && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <div className="relative">
            <input 
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
              placeholder="John Doe" 
              onChange={e => setForm({...form, name: e.target.value})} 
              required
            />
          </div>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input 
            className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            type="email" 
            placeholder="name@company.com" 
            required
            onChange={e => setForm({...form, email: e.target.value})} 
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
          <input 
            className="w-full p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            type="password" 
            placeholder="••••••••" 
            required
            onChange={e => setForm({...form, password: e.target.value})} 
          />
        </div>
      </div>

      {!isLogin && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select User Role</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setForm({...form, role: 'USER'})}
              className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                form.role === 'USER' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <User size={20} className="mb-1" />
              <span className="text-xs font-bold">USER</span>
            </button>
            <button
              type="button"
              onClick={() => setForm({...form, role: 'ADMIN'})}
              className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                form.role === 'ADMIN' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <ShieldCheck size={20} className="mb-1" />
              <span className="text-xs font-bold">ADMIN</span>
            </button>
          </div>
        </div>
      )}

      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95">
        {isLogin ? 'Sign In' : 'Create Account'}
      </button>

      <p className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "New to PrimeTrade?" : "Already have an account?"}
        <button 
          type="button"
          className="ml-1 text-blue-600 font-bold hover:underline" 
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register now" : "Login here"}
        </button>
      </p>
    </form>
  </div>
</div>
); }