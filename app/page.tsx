import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold">FF</div>
          <span className="text-xl font-bold">FormFlow</span>
        </div>
        <nav className="hidden md:flex space-x-6 text-slate-600 font-medium">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <Link href="#features" className="hover:text-indigo-600">Features</Link>
          <Link href="#about" className="hover:text-indigo-600">About</Link>
          <Link href="#contact" className="hover:text-indigo-600">Contact</Link>
        </nav>
        <div className="flex space-x-4">
          <Link 
            href="/login" 
            className="text-indigo-600 font-medium px-4 py-2 hover:bg-slate-100 rounded-lg inline-block"
          >
            Login
          </Link>
          <Link 
            href="/signup" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 shadow inline-block"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 md:px-20 py-16 max-w-7xl mx-auto">
        <div className="max-w-xl">
          <h1 className="text-5xl font-extrabold tracking-tight leading-tight mb-6">
            Build Smart Forms. <br />
            <span className="text-indigo-600">Collect Responses.</span>
          </h1>
          <p className="text-slate-600 text-lg mb-8">
            Create beautiful forms, gather responses, and analyze results — all in one place.
          </p>
          <div className="flex space-x-4">
            <Link 
              href="/signup"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 shadow flex items-center space-x-2 inline-flex"
            >
              <span>Get Started</span>
              <span>→</span>
            </Link>
            <button className="border border-slate-300 px-6 py-3 rounded-lg font-medium hover:bg-slate-100">
              Learn More
            </button>
          </div>
        </div>

        {/* Feedback form box bas yahan se hata diya gaya hai, baaki sab waisa hi hai */}
        
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white border-t border-slate-200 text-center">
        <h2 className="text-2xl font-bold mb-2">Everything You Need</h2>
        <p className="text-slate-500 mb-10">Create, share and manage forms effortlessly.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm text-left">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold mb-4">⚡</div>
            <h3 className="font-bold mb-1">Dynamic Form Builder</h3>
            <p className="text-xs text-slate-500">Build forms with an easy drag-and-drop interface.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm text-left">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold mb-4">📊</div>
            <h3 className="font-bold mb-1">Response Analytics</h3>
            <p className="text-xs text-slate-500">Track submissions with beautiful analytics.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm text-left">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold mb-4">🔗</div>
            <h3 className="font-bold mb-1">Easy Sharing</h3>
            <p className="text-xs text-slate-500">Share your forms via link or embed them.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 shadow-sm text-left">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-bold mb-4">🔒</div>
            <h3 className="font-bold mb-1">Secure & Reliable</h3>
            <p className="text-xs text-slate-500">Your data is always safe and secure.</p>
          </div>
        </div>
      </section>
    </div>
  );
}