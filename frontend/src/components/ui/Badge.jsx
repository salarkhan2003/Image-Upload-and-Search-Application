import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 600,
    borderRadius: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  };

  const variants = {
    default: {
      background: 'rgba(15, 33, 55, 0.8)',
      color: '#C0C0C0',
      border: '1px solid rgba(192, 192, 192, 0.2)',
    },
    primary: {
      background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
      color: '#121212',
      border: 'none',
    },
    secondary: {
      background: 'rgba(192, 192, 192, 0.1)',
      color: '#C0C0C0',
      border: '1px solid rgba(192, 192, 192, 0.3)',
    },
    accent: {
      background: 'rgba(0, 240, 255, 0.1)',
      color: '#00F0FF',
      border: '1px solid rgba(0, 240, 255, 0.3)',
    },
    outline: {
      background: 'transparent',
      color: '#00F0FF',
      border: '1px solid #00F0FF',
    },
  };

  const sizes = {
    sm: {
      padding: '4px 8px',
      fontSize: '10px',
      minHeight: '20px',
    },
    md: {
      padding: '6px 12px',
      fontSize: '12px',
      minHeight: '24px',
    },
    lg: {
      padding: '8px 16px',
      fontSize: '14px',
      minHeight: '28px',
    },
  };

  const badgeStyle = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
  };

  return (
    <span
      className={`professional-badge ${className}`}
      style={badgeStyle}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;