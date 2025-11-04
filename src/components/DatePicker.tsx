'use client';

import { useState, useEffect } from 'react';
import { Input } from './ui/input';

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

export function DatePicker({ value, onChange, placeholder, disabled, id }: DatePickerProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (value) {
      setInputValue(value);
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <Input
      id={id}
      type="date"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleChange}
      disabled={disabled}
    />
  );
}
