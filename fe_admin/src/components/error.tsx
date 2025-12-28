"use client";

export default function Error() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#0f766e] to-[#14b8a6] bg-clip-text text-transparent mb-4 tracking-tight">
          Oops! Something went wrong
        </h1>
        <p className="text-[#64748b] mb-8 font-medium leading-relaxed">
          We encountered an unexpected error.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-[#0f766e] to-[#14b8a6] hover:from-[#0d9488] hover:to-[#5eead4] text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
