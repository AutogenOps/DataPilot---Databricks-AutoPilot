import { Database } from 'lucide-react';

type DataPilotMarkProps = {
  className?: string;
};

export default function DataPilotMark({ className = '' }: DataPilotMarkProps) {
  return (
    <span
      aria-label="DataPilot"
      className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-accent-cyan to-accent-azure text-bg-primary shadow-[0_0_14px_rgba(0,212,255,0.22)] ${className}`}
    >
      <Database className="h-[62%] w-[62%]" strokeWidth={2.4} />
    </span>
  );
}
