import type { SVGProps } from 'react';
import { cn } from '@/lib/utils';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path
        d="M10.13 16.62a7.5 7.5 0 0 1-3.26-10.4"
        className={cn(
          'fill-transparent',
          props.className?.includes('fill-') && 'fill-inherit'
        )}
      />
      <path d="m14.24 13.73 1.9 4.49" />
    </svg>
  );
}
