export default function Loading() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0f766e] mx-auto mb-4 shadow-lg"></div>
                <h1 className="text-2xl font-semibold bg-gradient-to-r from-[#0f766e] to-[#14b8a6] bg-clip-text text-transparent tracking-tight">Loading...</h1>
                <p className="text-[#64748b] mt-2 font-medium leading-relaxed">Please wait while we load your content</p>
            </div>
        </div>
    );
};
