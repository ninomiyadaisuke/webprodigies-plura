import React from 'react';

const Payment = () => {
  return (
    <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
      <rect className={`  fill-[#C8CDD8] text-xl transition-all`} height="16" rx="3" width="20" x="2" y="4" />
      <path
        className={`  fill-[#70799A] text-xl transition-all`}
        clipRule="evenodd"
        d="M22 10H2V8H22V10Z"
        fillRule="evenodd"
      />
      <path
        className={`  fill-[#70799A] text-xl transition-all`}
        clipRule="evenodd"
        d="M4 15C4 14.4477 4.44772 14 5 14H11C11.5523 14 12 14.4477 12 15C12 15.5523 11.5523 16 11 16H5C4.44772 16 4 15.5523 4 15Z"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default Payment;
