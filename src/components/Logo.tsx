import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("flex items-center overflow-visible", className)}>
      <img
        src="/play8-logo.png"
        alt="Play8 Logo"
        className="h-10 w-auto"
      />
    </div>
  );
}