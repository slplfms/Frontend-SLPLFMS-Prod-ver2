import React from 'react';
import Button from '@mui/material/Button';

interface CustomButtonProps {
    text: string;
    onClick?: () => void;
    variant?: 'text' | 'contained' | 'outlined';
    color?: 'primary' | 'secondary' | 'error' | 'inherit';
    icon?: React.ReactNode;
    iconSize?: number;
    iconMargin?: string;
    fontSize?: number;
    fontWeight?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    text,
    onClick,
    variant = 'contained',
    color = 'primary',
    icon,
    iconMargin = '5px',
    fontSize = 14,
    fontWeight = 'normal',
}) => {
    return (
        <Button
            variant={variant}
            color={color}
            onClick={onClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: fontSize,
                fontWeight: fontWeight,
            }}

        >
            {icon && (
                <span style={{ marginRight: iconMargin }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {icon}
                    </div>
                </span>
            )}
            {text}
        </Button>
    );
};

export default CustomButton;
