"use client";

import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

interface Option {
  label: string;
  value: any;
}

interface CustomDropdownProps {
  label?: string;                  
  options: Option[];               
  placeholder?: string;            
  onChange: (value: any) => void;  
  defaultValue?: any;              
}

export default function CustomDropdown({
  label,
  options,
  placeholder = "Chọn...",
  onChange,
  defaultValue
}: CustomDropdownProps) {

  const [selected, setSelected] = useState(defaultValue || null);

  const handleChange = (e: any) => {
    setSelected(e.value);
    onChange(e.value); 
  };

  return (
    <div className="flex flex-col gap-2 w-full min-w-[140px]">
      {label && <label className="text-sm font-semibold text-[#0f766e] tracking-wide">{label}</label>}
      <Dropdown
        value={selected}
        onChange={handleChange}
        options={options}
        optionLabel="label"
        placeholder={placeholder}
        className="w-full border border-[#e2e8f0] rounded-2xl focus:border-[#0d9488] focus:ring-2 focus:ring-[#14b8a6]/30 bg-white shadow-md hover:shadow-lg transition-all duration-200 focus:shadow-[0_0_15px_rgba(20,184,166,0.3)]"
        showClear
        panelClassName="border-[#e2e8f0] shadow-lg rounded-2xl bg-white"
        dropdownIcon="pi pi-chevron-down"
        emptyMessage="Không có dữ liệu"
      />
    </div>
  );
}
