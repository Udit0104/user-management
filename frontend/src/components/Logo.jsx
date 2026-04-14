const Logo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="#6366f1"/>
    <circle cx="20" cy="14" r="5" fill="white"/>
    <path d="M10 30c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="30" cy="18" r="3.5" fill="#a5b4fc"/>
    <path d="M24 28c0-3.314 2.686-6 6-6" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="10" cy="18" r="3.5" fill="#a5b4fc"/>
    <path d="M16 28c0-3.314-2.686-6-6-6" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export default Logo;
