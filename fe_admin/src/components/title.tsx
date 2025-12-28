export default function title({ title, note }: { title: string, note: string }) {
    return (
        <div className="m-3">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#0f766e] via-[#0d9488] to-[#14b8a6] bg-clip-text text-transparent drop-shadow-sm tracking-tight">{title}</h2>
            <p className="text-base text-[#64748b] font-medium mt-2 leading-relaxed">{note}</p>
        </div>
    )
};
