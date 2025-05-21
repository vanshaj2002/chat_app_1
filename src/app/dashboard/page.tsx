'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Chat from '@/components/Chat/Chat';
import { FiLoader, FiAlertCircle, FiLogIn } from 'react-icons/fi';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          throw authError;
        }

        if (!session) {
          router.push('/login');
          return;
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setError('Failed to verify authentication. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();
  }, [router, supabase.auth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 rounded-lg">
          <FiLoader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">Loading your chat</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we prepare your messages</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <FiAlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Authentication Error</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiLogIn className="mr-2 h-4 w-4" />
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <main className="flex-1 overflow-hidden">
        <Chat />
      </main>
    </div>
  );
}
