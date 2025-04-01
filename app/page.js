'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter(); // Initialize useRouter hook

  const handleGetStarted = () => {
    router.push('/chat'); // Navigate to the Chat page
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white text-center p-8">
      <div className="w-full max-w-lg bg-gray-900 p-8 rounded-xl shadow-xl">
        {/* Header */}
        <h1 className="text-5xl font-bold text-blue-400 mb-6">Welcome to NGK Buddy</h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-8">
          Your Personalized AI Assistant, powered by cutting-edge technology.
        </p>

        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 text-sm text-gray-400">
        <p>&copy; 2025 NGK Buddy. All Rights Reserved.</p>
      </div>
    </div>
  );
}