
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search templates...", className = "mb-4" }: SearchBarProps) {
  return (
    <Input 
      placeholder={placeholder} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  );
}
