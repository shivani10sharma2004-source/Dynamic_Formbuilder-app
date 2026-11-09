import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <div className="flex justify-center items-center space-x-2 mb-2">
          <div className="bg-indigo-600 text-white text-sm font-bold px-3 py-2 rounded-lg">FF</div>
          <span className="font-extrabold text-2xl tracking-tight">FormFlow</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          Dynamic Form Builder
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Create, customize, and deploy interactive forms effortlessly. Connects securely with real-time backend and database synchronization.
        </p>
        <div className="flex justify-center space-x-4 pt-4">
          <Link
            href="/login"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition shadow-lg"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold rounded-xl transition shadow-lg"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}