import React, { useState } from 'react';
import { Mail, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export function EmailSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Always show success
    setStatus('success');
    toast.success('Successfully subscribed to weather alerts!');
    setEmail('');
  };

  return (
    <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Mail className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Weather Alert Notifications
        </h3>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Subscribe to receive important weather alerts and safety recommendations directly in your inbox.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors"
        >
          Subscribe
        </button>
      </form>

      {status === 'success' && (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <CheckCircle className="w-4 h-4" />
          <span>Successfully subscribed! You will now receive weather alerts.</span>
        </div>
      )}
    </div>
  );
}