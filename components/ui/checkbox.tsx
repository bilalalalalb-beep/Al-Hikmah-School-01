"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, id, ...props }, ref) => {
    return (
      <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <div className={cn(
          "w-5 h-5 border-2 rounded flex items-center justify-center transition-colors",
          checked 
            ? "bg-teal-600 border-teal-600 text-white" 
            : "bg-white border-slate-300 peer-hover:border-teal-500",
          className
        )}>
          {checked && <Check className="w-3.5 h-3.5" />}
        </div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
