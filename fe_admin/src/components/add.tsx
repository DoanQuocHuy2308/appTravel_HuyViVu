"use client";

import { Button } from "primereact/button";

interface AddButtonProps {
    label?: string;             
    onClick: () => void;       
}

export default function AddButton({ label = "Thêm mới", onClick }: AddButtonProps) {
    return (
        <Button 
            label={label} 
            icon="pi pi-plus" 
            onClick={onClick}
            className="!bg-gradient-to-r !from-[#0f766e] !via-[#0d9488] !to-[#14b8a6] 
                       hover:!from-[#0d9488] hover:!via-[#14b8a6] hover:!to-[#5eead4] 
                       border-0 text-white font-semibold rounded-2xl 
                       px-6 py-3 shadow-lg 
                       hover:scale-105 active:scale-95 
                       transition-all duration-300 flex items-center gap-2
                       hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]"
        />
    );
}
