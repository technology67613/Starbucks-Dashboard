import React from 'react';

export const ReceiptIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M17 3H7C5.89543 3 5 3.89543 5 5V21L8 19.5L12 21.5L16 19.5L19 21V5C19 3.89543 18.1046 3 17 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9 7H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 11H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 15H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const DocumentIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const WalletIcon = ({ className, size = 24 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M3 11H21"
      stroke="currentColor"
      strokeWidth="2"
    />
    <rect x="15" y="14" width="3" height="2" rx="1" fill="currentColor" />
  </svg>
);
