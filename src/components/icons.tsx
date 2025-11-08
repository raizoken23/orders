import type { SVGProps } from 'react'

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="ScopeSheet Pro Logo"
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.8787 4.00002L7.12132 4.00001C5.41472 4 4 5.41472 4 7.12132V16.8787C4 18.5853 5.41472 20 7.12132 20H16.8787C18.5853 20 20 18.5853 20 16.8787V7.12132C20 5.41472 18.5853 4 16.8787 4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 8.5C15 7.67157 14.3284 7 13.5 7H10.5C9.67157 7 9 7.67157 9 8.5V9.5C9 10.3284 9.67157 11 10.5 11H13.5C14.3284 11 15 11.6716 15 12.5V13.5C15 14.3284 14.3284 15 13.5 15H10.5C9.67157 15 9 15.6716 9 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
