import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseStyles = `
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    outline: none;
    focus:outline-none;
  `;

  const variants = {
    primary: `
      background: linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%);
      color: #121212;
      box-shadow: 0 4px 12px rgba(0, 240, 255, 0.3);
      
      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 240, 255, 0.4);
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
      }
    `,
    secondary: `
      background: rgba(15, 33, 55, 0.8);
      color: #FFFFFF;
      border: 1px solid rgba(192, 192, 192, 0.3);
      backdrop-filter: blur(10px);
      
      &:hover:not(:disabled) {
        background: rgba(15, 33, 55, 0.95);
        border-color: #00F0FF;
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.2);
      }
    `,
    outline: `
      background: transparent;
      color: #00F0FF;
      border: 2px solid #00F0FF;
      
      &:hover:not(:disabled) {
        background: #00F0FF;
        color: #121212;
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
      }
    `,
    ghost: `
      background: transparent;
      color: #C0C0C0;
      border: none;
      
      &:hover:not(:disabled) {
        background: rgba(192, 192, 192, 0.1);
        color: #FFFFFF;
      }
    `,
  };

  const sizes = {
    sm: 'padding: 8px 16px; font-size: 12px; min-height: 32px;',
    md: 'padding: 12px 24px; font-size: 14px; min-height: 44px;',
    lg: 'padding: 16px 32px; font-size: 16px; min-height: 52px;',
    xl: 'padding: 20px 40px; font-size: 18px; min-height: 60px;',
  };

  const disabledStyles = `
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
    }
  `;

  const buttonClass = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${disabledStyles}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      type={type}
      className={buttonClass}
      disabled={disabled}
      onClick={onClick}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        border: variant === 'outline' ? '2px solid #00F0FF' : variant === 'secondary' ? '1px solid rgba(192, 192, 192, 0.3)' : 'none',
        borderRadius: '12px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        outline: 'none',
        opacity: disabled ? 0.5 : 1,
        ...getVariantStyles(variant),
        ...getSizeStyles(size),
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-2px)';
          if (variant === 'primary') {
            e.target.style.boxShadow = '0 8px 24px rgba(0, 240, 255, 0.4)';
          } else if (variant === 'secondary') {
            e.target.style.background = 'rgba(15, 33, 55, 0.95)';
            e.target.style.borderColor = '#00F0FF';
            e.target.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.2)';
          } else if (variant === 'outline') {
            e.target.style.background = '#00F0FF';
            e.target.style.color = '#121212';
            e.target.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.3)';
          } else if (variant === 'ghost') {
            e.target.style.background = 'rgba(192, 192, 192, 0.1)';
            e.target.style.color = '#FFFFFF';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          Object.assign(e.target.style, getVariantStyles(variant), getSizeStyles(size));
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

function getVariantStyles(variant) {
  switch (variant) {
    case 'primary':
      return {
        background: 'linear-gradient(135deg, #00F0FF 0%, #1E90FF 100%)',
        color: '#121212',
        boxShadow: '0 4px 12px rgba(0, 240, 255, 0.3)',
      };
    case 'secondary':
      return {
        background: 'rgba(15, 33, 55, 0.8)',
        color: '#FFFFFF',
        backdropFilter: 'blur(10px)',
      };
    case 'outline':
      return {
        background: 'transparent',
        color: '#00F0FF',
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: '#C0C0C0',
      };
    default:
      return {};
  }
}

function getSizeStyles(size) {
  switch (size) {
    case 'sm':
      return { padding: '8px 16px', fontSize: '12px', minHeight: '32px' };
    case 'md':
      return { padding: '12px 24px', fontSize: '14px', minHeight: '44px' };
    case 'lg':
      return { padding: '16px 32px', fontSize: '16px', minHeight: '52px' };
    case 'xl':
      return { padding: '20px 40px', fontSize: '18px', minHeight: '60px' };
    default:
      return {};
  }
}

export default Button;