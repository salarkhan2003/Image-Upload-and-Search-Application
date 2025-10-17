import React from 'react';

const GradientText = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'base',
  weight = 'bold',
  ...props 
}) => {
  const gradients = {
    primary: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
    secondary: 'linear-gradient(135deg, #C0C0C0 0%, #FFFFFF 100%)',
    accent: 'linear-gradient(135deg, #1E90FF 0%, #00F0FF 50%, #C0C0C0 100%)',
    subtle: 'linear-gradient(135deg, rgba(0, 240, 255, 0.8) 0%, rgba(30, 144, 255, 0.8) 100%)',
  };

  const sizes = {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  };

  const weights = {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  };

  const textStyle = {
    background: gradients[variant],
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: sizes[size],
    fontWeight: weights[weight],
    fontFamily: "'Inter', sans-serif",
    letterSpacing: weight === 'bold' || weight === 'extrabold' || weight === 'black' ? '-0.025em' : '0',
    lineHeight: 1.2,
    display: 'inline-block',
  };

  return (
    <span
      className={`gradient-text ${className}`}
      style={textStyle}
      {...props}
    >
      {children}
    </span>
  );
};

export default GradientText;