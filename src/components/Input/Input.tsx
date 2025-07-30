import React, { useState, useEffect, ChangeEvent, forwardRef } from 'react';
import './Input.css';

type InputProps = {
    id?: string | number;
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    validate?: (value: string) => string | null;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({
    label,
    placeholder,
    type = 'text',
    required = false,
    minLength = 3,
    maxLength = 32,
    value,
    onChange,
    validate
}, ref) => {
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!touched) return;

        if (required && value.trim() === '') {
            setError('This field is required');
        } else if (minLength && value.length < minLength) {
            setError(`Must be at least ${minLength} characters`);
        } else if (maxLength && value.length > maxLength) {
            setError(`Must be no more than ${maxLength} characters`);
        } else if (validate) {
            const customError = validate(value);
            setError(customError || '');
        } else {
            setError('');
        }
    }, [value, touched, required, minLength, maxLength, validate]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        setTouched(true);
    };

    const validationStatus = error && value ? 'error' : '';
    const showError = error && value.trim().length > 0;

    return (
        <div className="validated-input">
            {label && <label className="validated-input-label">{label}</label>}
            <input
                ref={ref}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className={`validated-input-field ${validationStatus} ${showError ? 'error' : ''}`}
            />
            {error && <div className="validated-input-error">{error}</div>}
        </div>
    );
});

export default Input;
