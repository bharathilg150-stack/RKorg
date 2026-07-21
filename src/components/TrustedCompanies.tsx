import React from 'react';

export default function TrustedCompanies() {
  // Array of 36 high-fidelity, original brand color SVGs
  const companies = [
    {
      name: 'Google',
      svg: (
        <svg viewBox="0 0 24 24" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      )
    },
    {
      name: 'Microsoft',
      svg: (
        <svg viewBox="0 0 23 23" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="11" height="11" fill="#F25022"/>
          <rect x="12" y="0" width="11" height="11" fill="#7FBA00"/>
          <rect x="0" y="12" width="11" height="11" fill="#00A4EF"/>
          <rect x="12" y="12" width="11" height="11" fill="#FFB900"/>
        </svg>
      )
    },
    {
      name: 'Amazon',
      svg: (
        <svg viewBox="0 0 100 30" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.4 12c0 2.2-1 3.5-3 3.5c-1.5 0-2.5-.9-2.5-2.6V8.2c0-2 .8-3.4 2.8-3.4c1.8 0 2.7 1 2.7 3v4.2zm.2-7.2c-.8-.8-1.9-1.2-3.4-1.2c-3.5 0-5.4 2.2-5.4 5.3v3.7c0 3.2 2.2 5.2 5.5 5.2c1.7 0 3-.5 3.7-1.4v1c0 1.9-1 3-3 3c-1.7 0-2.8-.8-3.2-2.1l-4.2.5c.7 2.9 3.2 4.4 7.4 4.4c4.6 0 7.2-2.4 7.2-6.8V4.8h-4.6zM32.8 17.5V7.4c0-1.8-1-2.8-2.8-2.8c-1.6 0-2.8.9-3.3 2.1V4.8h-4.5v12.7h4.5V11c0-1.5.8-2.4 2-2.4c1.2 0 1.8.8 1.8 2.2v6.7h4.5zM45.6 3.6c4.2 0 7.4 3.2 7.4 7c0 3.9-3.2 7-7.4 7s-7.4-3.1-7.4-7c0-3.8 3.2-7 7.4-7zm0 10.6c1.9 0 3-1.6 3-3.6s-1.1-3.6-3-3.6s-3 1.6-3 3.6s1.1 3.6 3 3.6z" fill="#000000"/>
          <path d="M5.5 4.8H1l6.2 12.7h4.8L18.2 4.8h-4.5l-4 9.2l-4.2-9.2z" fill="#000000"/>
          <path d="M60.4 17.5V7.4c0-1.8-1-2.8-2.8-2.8c-1.6 0-2.8.9-3.3 2.1V4.8h-4.5v12.7h4.5V11c0-1.5.8-2.4 2-2.4c1.2 0 1.8.8 1.8 2.2v6.7h4.5z" fill="#000000"/>
          <path d="M2.5 21c15.2 6.5 35.8 9.5 51.5 4.3c2.5-.8 1.2-3.8-1.2-3c-13.8 4.2-31.5 1.8-44.5-3.8c-2.3-1-4.2 1.5-5.8 2.5z" fill="#FF9900"/>
          <path d="M51.8 19.3c-1.2 1-1.3 2.5-.2 3.4l3.5 2.7c1.3 1 2.8-.1 2.3-1.6l-2-6c-.5-1.5-2.4-1.5-2.8.1l-.8 1.4z" fill="#FF9900"/>
        </svg>
      )
    },
    {
      name: 'Apple',
      svg: (
        <svg viewBox="0 0 170 170" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.36-6.14-3.62-2.92-7.58-7.75-11.88-14.5-8.91-14.23-14.54-28.79-16.89-43.68-2.34-14.88-1.12-28.16 3.69-39.84 4.81-11.68 12.06-18.4 21.75-20.14 5.35-.95 11.05.51 17.11 4.38 6.05 3.87 10.33 5.19 12.83 3.97 2.39-1.14 6.13-2.73 11.22-4.79 5.1-2.05 9.77-2.83 14.03-2.34 15.01 1.74 25.86 8.5 32.55 20.27-13.84 8.35-20.4 19.34-19.69 32.94.71 10.51 5.06 19.06 13.01 25.64 8.04 6.58 17.16 10.12 27.38 10.63-2.07 6.1-4.78 12.18-8.13 18.22zM120.3 35.25c0-8.66 3.03-16.14 9.1-22.44 6.07-6.3 13.41-9.67 22.05-10.11.13 1 .21 1.87.21 2.61 0 8.3-3.13 15.75-9.39 22.35-6.26 6.61-13.62 10.14-22.09 10.59-.22-.88-.33-1.89-.33-3z" fill="#000000"/>
        </svg>
      )
    },
    {
      name: 'Meta',
      svg: (
        <svg viewBox="0 0 24 24" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.82 5.001c-1.802 0-3.522.876-4.58 2.316a5.7 5.7 0 00-4.58-2.316C3.214 5.001.43 7.424.032 10.655a6.471 6.471 0 001.761 4.887C2.981 16.822 4.7 17.7 6.66 17.7c1.802 0 3.522-.876 4.58-2.316a5.7 5.7 0 004.58 2.316c3.447 0 6.23-2.423 6.629-5.654a6.472 6.472 0 00-1.761-4.887c-1.188-1.28-2.908-2.158-4.868-2.158zm-9.16 10.74c-1.398 0-2.617-.618-3.353-1.638a4.57 4.57 0 01-1.208-3.385c.237-2.072 1.947-3.58 4.195-3.58s3.957 1.508 4.194 3.58a4.57 4.57 0 01-1.208 3.385c-.736 1.02-1.955 1.638-3.353 1.638zm9.16 0c-1.398 0-2.617-.618-3.353-1.638a4.57 4.57 0 01-1.208-3.385c.237-2.072 1.947-3.58 4.195-3.58s3.957 1.508 4.194 3.58a4.57 4.57 0 01-1.208 3.385c-.736 1.02-1.955 1.638-3.353 1.638z" fill="#0064E0" />
        </svg>
      )
    },
    {
      name: 'Netflix',
      svg: (
        <svg viewBox="0 0 111 30" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.3 0L3.6 16.5V0H0v26h3.4V11.2L10.5 26h3.5V0zM26.2 13h-6.1v4.8h6.9v3.4h-6.9v4.8h7.4V26H16.7V0h10v3.4h-6.6V9.6h6.1zM38.8 3.4H33V11h5.3v3.4H33V26h-3.4V0h9.2zM48 22.6h4.5V26H41.3V0h3.4v22.6zM59.4 0v26H56V0zM75.2 0l-5 9.4L65.3 0h-3.8l6.8 12.3L61.3 26h3.8l5.1-10l5.1 10h3.8L72.2 12.3 79 0zM90.8 11.2l3-11.2h3.5v26h-3.4V14.8l-3.3 11.2h-2.5l-3.3-11.2V26h-3.4V0h3.5z" fill="#E50914" />
        </svg>
      )
    },
    {
      name: 'Adobe',
      svg: (
        <svg viewBox="0 0 100 100" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <polygon points="62.3,16 93.3,16 93.3,84" fill="#FF0000"/>
          <polygon points="37.7,16 6.7,16 6.7,84" fill="#FF0000"/>
          <polygon points="50,44.7 67.8,84 54.4,84 50,72.4 43.1,72.4 36.6,84 25.1,84" fill="#FF0000"/>
        </svg>
      )
    },
    {
      name: 'Oracle',
      svg: (
        <svg viewBox="0 0 230 30" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path d="M43.7 15c0 8.3-6.7 15-15 15s-15-6.7-15-15s6.7-15 15-15s15 6.7 15 15zm-8.2 0c0-3.8-3-6.8-6.8-6.8s-6.8 3-6.8 6.8s3 6.8 6.8 6.8s6.8-3 6.8-6.8zm23.5-14.7h7.2v11.7c0 3.2 1.9 4.8 4.8 4.8c3 0 4.8-1.6 4.8-4.8V.3H103v11.7c0 3.2 1.9 4.8 4.8 4.8c3 0 4.8-1.6 4.8-4.8V.3h7.2v11.8c0 7.7-4.8 11.4-12 11.4c-4.8 0-9.2-2.1-11-6.1c-1.8 4-6.2 6.1-11 6.1c-7.2 0-12-3.7-12-11.4V.3zm85.7 14.7c0 8.3-6.7 15-15 15s-15-6.7-15-15s6.7-15 15-15s15 6.7 15 15zm-8.2 0c0-3.8-3-6.8-6.8-6.8s-6.8 3-6.8 6.8s3 6.8 6.8 6.8s6.8-3 6.8-6.8zm41.2-14.7h7.2v22.8H210V18.1h-16.3V.3zm-51.5 8h15.2c0-3-2.5-5.5-5.5-5.5s-5.5 2.5-5.5 5.5zm15.2 6.8c0 3.1-2.5 5.6-5.6 5.6s-5.6-2.5-5.6-5.6V15h11.2zm-18.4-11.3V.3h25.6v6.5h-18.4v4.8h18.4v6.5h-18.4V23H222v6.8H187.3V.3z" fill="#F80000" />
        </svg>
      )
    },
    {
      name: 'IBM',
      svg: (
        <svg viewBox="0 0 100 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <g fill="#006699">
            <rect y="0" width="30" height="3" />
            <rect y="5" width="30" height="3" />
            <rect y="10" width="30" height="3" />
            <rect y="15" width="30" height="3" />
            <rect y="20" width="30" height="3" />
            <rect y="25" width="30" height="3" />
            <rect y="30" width="30" height="3" />
            <rect y="35" width="30" height="3" />
            {/* Middle cutouts */}
            <rect x="35" y="0" width="28" height="3" />
            <rect x="35" y="5" width="28" height="3" />
            <rect x="35" y="10" width="28" height="3" />
            <rect x="35" y="15" width="28" height="3" />
            <rect x="35" y="20" width="28" height="3" />
            <rect x="35" y="25" width="28" height="3" />
            <rect x="35" y="30" width="28" height="3" />
            <rect x="35" y="35" width="28" height="3" />
            {/* End cutouts */}
            <rect x="70" y="0" width="30" height="3" />
            <rect x="70" y="5" width="30" height="3" />
            <rect x="70" y="10" width="30" height="3" />
            <rect x="70" y="15" width="30" height="3" />
            <rect x="70" y="20" width="30" height="3" />
            <rect x="70" y="25" width="30" height="3" />
            <rect x="70" y="30" width="30" height="3" />
            <rect x="70" y="35" width="30" height="3" />
          </g>
        </svg>
      )
    },
    {
      name: 'Intel',
      svg: (
        <svg viewBox="0 0 512 128" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path d="M72 16h40v16H72zm0 32h40v64H72zm64-32h32l24 40 24-40h32v96h-32V64l-24 40h-4l-24-40v48h-32zm144 0h64v24h-32v12h32v24h-32v12h32v24h-64zm96 0h32v72h32v24h-64z" fill="#0071C5" />
          <path d="M32 32h24c8 0 16 8 16 16s-8 16-16 16H32v32H0V16h32zm0 16v16h24V48z" fill="#0071C5"/>
        </svg>
      )
    },
    {
      name: 'Cisco',
      svg: (
        <svg viewBox="0 0 100 60" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <g fill="#13A5C5">
            <rect x="6" y="25" width="4" height="15" rx="2" />
            <rect x="18" y="15" width="4" height="25" rx="2" />
            <rect x="30" y="15" width="4" height="25" rx="2" />
            <rect x="42" y="5" width="4" height="35" rx="2" />
            <rect x="54" y="5" width="4" height="35" rx="2" />
            <rect x="66" y="15" width="4" height="25" rx="2" />
            <rect x="78" y="15" width="4" height="25" rx="2" />
            <rect x="90" y="25" width="4" height="15" rx="2" />
          </g>
          <text x="50%" y="55" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" fill="#049FD9">CISCO</text>
        </svg>
      )
    },
    {
      name: 'Dell Technologies',
      svg: (
        <svg viewBox="0 0 100 100" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" stroke="#0076CE" strokeWidth="6" fill="none" />
          <text x="50" y="59" fontSize="24" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" fill="#0076CE">DELL</text>
        </svg>
      )
    },
    {
      name: 'HP',
      svg: (
        <svg viewBox="0 0 100 100" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="45" fill="#0096D6" />
          <text x="48" y="68" fontSize="56" fontWeight="bold" fontStyle="italic" fontFamily="serif" textAnchor="middle" fill="#FFFFFF">hp</text>
        </svg>
      )
    },
    {
      name: 'Salesforce',
      svg: (
        <svg viewBox="0 0 24 16" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.1 5.3c-.6-.7-1.3-1.2-2.1-1.4c-.6-.7-1.4-1.2-2.3-1.4c-1.8-.4-3.7.1-5.1 1.2c-.7-.4-1.4-.6-2.2-.6c-2.3 0-4.3 1.6-4.7 3.9C1.1 7.2 0 8.7 0 10.5c0 2.2 1.8 4 4 4h14.5c3 0 5.5-2.5 5.5-5.5c0-1.8-1-3.4-2.5-4.1c.1-.4.1-.8.1-1.2c0-1.2-.4-2.4-1.2-3.3c.7.4 1.3 1 1.7 1.7-.1.4-.1.8-.1 1.2z" fill="#00A1E0" />
        </svg>
      )
    },
    {
      name: 'NVIDIA',
      svg: (
        <svg viewBox="0 0 100 100" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 50c0-22.1-17.9-40-40-40S10 27.9 10 50s17.9 40 40 40h40V50z" fill="none" stroke="#76B900" strokeWidth="8" />
          <path d="M74 50c0-13.3-10.7-24-24-24S26 36.7 26 50s10.7 24 24 24h24V50z" fill="none" stroke="#76B900" strokeWidth="8" />
          <circle cx="50" cy="50" r="10" fill="#76B900" />
        </svg>
      )
    },
    {
      name: 'Accenture',
      svg: (
        <svg viewBox="0 0 160 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="10" y="28" fontSize="22" fontWeight="900" fontFamily="sans-serif" fill="#000000">accenture</text>
          <path d="M125 10 L140 20 L125 30" fill="none" stroke="#A100FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      name: 'Infosys',
      svg: (
        <svg viewBox="0 0 120 30" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="22" fontSize="24" fontWeight="bold" fontFamily="sans-serif" fill="#007CC3" letterSpacing="1">Infosys</text>
        </svg>
      )
    },
    {
      name: 'TCS',
      svg: (
        <svg viewBox="0 0 100 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="25" fontSize="22" fontWeight="900" fontFamily="sans-serif" fill="#002C6C" letterSpacing="1.5">TCS</text>
          <path d="M70 10 C80 15, 80 25, 70 30" fill="none" stroke="#FF9900" strokeWidth="4" />
        </svg>
      )
    },
    {
      name: 'Wipro',
      svg: (
        <svg viewBox="0 0 100 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="12" fill="none" stroke="#003366" strokeWidth="3" />
          <circle cx="20" cy="20" r="8" fill="none" stroke="#F97316" strokeWidth="2" />
          <circle cx="20" cy="20" r="4" fill="#34A853" />
          <text x="42" y="27" fontSize="20" fontWeight="bold" fontFamily="sans-serif" fill="#003366">wipro</text>
        </svg>
      )
    },
    {
      name: 'HCLTech',
      svg: (
        <svg viewBox="0 0 140 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="26" fontSize="21" fontWeight="bold" fontFamily="sans-serif" fill="#0056B3" letterSpacing="0.5">HCLTech</text>
        </svg>
      )
    },
    {
      name: 'Tech Mahindra',
      svg: (
        <svg viewBox="0 0 160 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="18" fontSize="13" fontWeight="bold" fontFamily="sans-serif" fill="#D2232A">Tech</text>
          <text x="5" y="32" fontSize="13" fontWeight="900" fontFamily="sans-serif" fill="#D2232A" letterSpacing="1">Mahindra</text>
        </svg>
      )
    },
    {
      name: 'Capgemini',
      svg: (
        <svg viewBox="0 0 160 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20 Q20 10, 30 20 T50 20" fill="none" stroke="#0070AD" strokeWidth="4" />
          <text x="55" y="26" fontSize="18" fontWeight="bold" fontFamily="sans-serif" fill="#0070AD">Capgemini</text>
        </svg>
      )
    },
    {
      name: 'Cognizant',
      svg: (
        <svg viewBox="0 0 160 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="26" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#0033A0">Cognizant</text>
          <path d="M115 15 C120 10, 125 10, 130 15 L125 25" fill="none" stroke="#487A7B" strokeWidth="3" />
        </svg>
      )
    },
    {
      name: 'Deloitte',
      svg: (
        <svg viewBox="0 0 120 30" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="22" fontSize="22" fontWeight="bold" fontFamily="sans-serif" fill="#000000">Deloitte</text>
          <circle cx="102" cy="20" r="3" fill="#86BC25" />
        </svg>
      )
    },
    {
      name: 'EY',
      svg: (
        <svg viewBox="0 0 60 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="28" fontSize="26" fontWeight="bold" fontFamily="sans-serif" fill="#000000">EY</text>
          <polygon points="45,10 55,20 45,30" fill="#FFE600" />
        </svg>
      )
    },
    {
      name: 'KPMG',
      svg: (
        <svg viewBox="0 0 100 30" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="24" fontSize="24" fontWeight="bold" fontFamily="sans-serif" fill="#00338D" letterSpacing="1">KPMG</text>
        </svg>
      )
    },
    {
      name: 'PwC',
      svg: (
        <svg viewBox="0 0 80 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="28" fontSize="28" fontWeight="bold" fontFamily="serif" fill="#DC143C">pwc</text>
        </svg>
      )
    },
    {
      name: 'Siemens',
      svg: (
        <svg viewBox="0 0 140 30" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="23" fontSize="21" fontWeight="bold" fontFamily="sans-serif" fill="#00797A" letterSpacing="1.5">SIEMENS</text>
        </svg>
      )
    },
    {
      name: 'Bosch',
      svg: (
        <svg viewBox="0 0 100 30" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="25" y="22" fontSize="21" fontWeight="bold" fontFamily="sans-serif" fill="#1A1A1A" letterSpacing="0.5">BOSCH</text>
          <circle cx="12" cy="16" r="7" stroke="#E21A22" strokeWidth="2" fill="none" />
          <line x1="12" y1="9" x2="12" y2="23" stroke="#E21A22" strokeWidth="2" />
        </svg>
      )
    },
    {
      name: 'Samsung',
      svg: (
        <svg viewBox="0 0 140 35" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="70" cy="17" rx="65" ry="15" fill="#074A9B" />
          <text x="70" y="24" fontSize="18" fontWeight="black" fontFamily="sans-serif" textAnchor="middle" fill="#FFFFFF" letterSpacing="1.5">SAMSUNG</text>
        </svg>
      )
    },
    {
      name: 'Sony',
      svg: (
        <svg viewBox="0 0 120 30" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="24" fontSize="26" fontWeight="bold" fontFamily="serif" fill="#000000" letterSpacing="3">SONY</text>
        </svg>
      )
    },
    {
      name: 'PayPal',
      svg: (
        <svg viewBox="0 0 100 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="28" fontSize="22" fontWeight="bold" fontFamily="sans-serif" fill="#003087" fontStyle="italic">Pay<tspan fill="#0079C1">Pal</tspan></text>
        </svg>
      )
    },
    {
      name: 'eBay',
      svg: (
        <svg viewBox="0 0 80 40" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="28" fontSize="32" fontWeight="bold" fontFamily="sans-serif">
            <tspan fill="#E53238">e</tspan>
            <tspan fill="#0064D2">b</tspan>
            <tspan fill="#F5AF02">a</tspan>
            <tspan fill="#86B817">y</tspan>
          </text>
        </svg>
      )
    },
    {
      name: 'Uber',
      svg: (
        <svg viewBox="0 0 80 30" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <text x="5" y="24" fontSize="26" fontWeight="900" fontFamily="sans-serif" fill="#000000" letterSpacing="0.5">Uber</text>
        </svg>
      )
    },
    {
      name: 'Airbnb',
      svg: (
        <svg viewBox="0 0 120 35" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 5 C12 5, 8 12, 16 28 C24 12, 20 5, 16 5 Z" fill="none" stroke="#FF5A5F" strokeWidth="4" />
          <circle cx="16" cy="14" r="3" fill="#FF5A5F" />
          <text x="38" y="25" fontSize="20" fontWeight="bold" fontFamily="sans-serif" fill="#FF5A5F">airbnb</text>
        </svg>
      )
    },
    {
      name: 'Spotify',
      svg: (
        <svg viewBox="0 0 120 35" className="h-8 w-auto inline-block align-middle" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="17" r="14" fill="#1ED760" />
          <path d="M10 12 Q18 9, 26 12 M11 17 Q18 14, 25 17 M13 22 Q18 20, 23 22" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <text x="38" y="25" fontSize="19" fontWeight="bold" fontFamily="sans-serif" fill="#000000">Spotify</text>
        </svg>
      )
    }
  ];

  // We duplicate the logos array to achieve a completely continuous loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section id="trusted-partners" className="relative bg-white py-20 border-t border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 mb-12">
        <h2 className="text-xl sm:text-2xl font-black text-[#0A2C66] tracking-tight">
          Trusted by Leading Companies
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-semibold uppercase tracking-wider">
          Connecting exceptional talent with the world's most innovative organizations.
        </p>
      </div>

      {/* Masked Marquee Wrapper with fading left/right borders */}
      <div className="relative w-full marquee-mask">
        <div className="flex w-max flex-nowrap gap-16 py-4 animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
          {duplicatedCompanies.map((comp, idx) => (
            <div
              key={`${comp.name}-${idx}`}
              className="flex items-center justify-center shrink-0 opacity-70 hover:opacity-100 hover:scale-108 transition-all duration-300 ease-out cursor-pointer h-10 select-none px-2"
              title={comp.name}
            >
              {comp.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
