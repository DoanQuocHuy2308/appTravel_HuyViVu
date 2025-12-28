export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-[#0f766e] to-[#14b8a6] bg-clip-text text-transparent mb-4 tracking-tight">404</h1>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#0d9488] to-[#0f766e] bg-clip-text text-transparent mb-4 tracking-wide">Page Not Found</h2>
                <p className="text-[#64748b] mb-8 font-medium leading-relaxed">The page you're looking for doesn't exist.</p>
                <a 
                    href="/"
                    className="bg-gradient-to-r from-[#0f766e] to-[#14b8a6] hover:from-[#0d9488] hover:to-[#5eead4] text-white px-6 py-3 rounded-2xl font-medium transition-all duration-200 inline-block shadow-lg hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
                >
                    Go Home
                </a>
            </div>
        </div>
    );
};
