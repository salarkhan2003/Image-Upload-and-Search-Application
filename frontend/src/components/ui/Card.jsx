import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'lg',
  hover = true,
  ...props 
}) => {
  const baseStyles = {
    borderRadius: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  };

  const variants = {
    default: {
      background: 'rgba(15, 33, 55, 0.8)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(192, 192, 192, 0.1)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    },
    glass: {
      background: 'rgba(15, 33, 55, 0.6)',
      backdropFilter: 'blur(30px)',
      border: '1px solid rgba(192, 192, 192, 0.15)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    },
    solid: {
      background: '#0F2137',
      border: '1px solid rgba(192, 192, 192, 0.2)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
    },
    gradient: {
      background: 'linear-gradient(135deg, rgba(15, 33, 55, 0.9) 0%, rgba(18, 18, 18, 0.9) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 240, 255, 0.2)',
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 240, 255, 0.1)',
    },
  };

  const paddingStyles = {
    none: { padding: '0' },
    sm: { padding: '12px' },
    md: { padding: '16px' },
    lg: { padding: '24px' },
    xl: { padding: '32px' },
  };

  const hoverStyles = hover ? {
    cursor: 'pointer',
  } : {};

  const cardStyle = {
    ...baseStyles,
    ...variants[variant],
    ...paddingStyles[padding],
    ...hoverStyles,
  };

  const handleMouseEnter = (e) => {
    if (hover) {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.25), 0 0 20px rgba(0, 240, 255, 0.1)';
    }
  };

  const handleMouseLeave = (e) => {
    if (hover) {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = variants[variant].boxShadow;
    }
  };

  return (
    <div
      className={`professional-card ${className}`}
      style={cardStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;