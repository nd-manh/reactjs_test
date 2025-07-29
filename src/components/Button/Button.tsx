// components/Button/Button.tsx
import React from 'react';
import Spinner from '../Spinner/Spinner';
import './Button.css'; // Optional styling

type ButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
};

const Button: React.FC<ButtonProps> = ({
    onClick,
    disabled = false,
    loading = false,
    children,
    type = 'button',
    className = '',
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            type={type}
            className={`action-btn ${className}`}
        >
            {loading ? <Spinner /> : children}
        </button>
    );
};

export default Button;
