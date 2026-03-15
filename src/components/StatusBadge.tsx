import { ProspectStatus, STATUSES } from '@/lib/types';

interface StatusBadgeProps {
  status: ProspectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUSES[status];
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.bgClass} ${config.textClass} border-current/20`}>
      {config.label}
    </span>
  );
}
