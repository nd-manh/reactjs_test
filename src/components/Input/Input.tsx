import React, { useState, useEffect, ChangeEvent } from 'react';
import './Input.css';

type InputProps = {
    label?: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    errorMessage?: string;
    value: string;
    onChange: (value: string) => void;
};

const Input: React.FC<InputProps> = ({
    label,
    placeholder,
    type = 'text',
    required = false,
    minLength = 3,
    maxLength = 32,
    errorMessage,
    value,
    onChange,
}) => {
    const [touched, setTouched] = useState(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (!touched) return;

        if (required && value.trim() === '') {
            setError('');
        } else if (value.length < minLength) {
            setError(`Must be at least ${minLength} characters`);
        } else if (value.length > maxLength) {
            setError(`Must be no more than ${maxLength} characters`);
        } else {
            setError('');
        }
    }, [value, touched, required, minLength, maxLength]);

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
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                className={`validated-input-field ${validationStatus} ${showError ? 'error' : ''}`}
            />
            {error && <div className="validated-input-error">{error}</div>}
        </div>
    );
};

export default Input;
