import { ProspectStatus, STATUSES } from '@/lib/types';
import { useI18n } from '@/lib/i18n';

interface StatusBadgeProps {
  status: ProspectStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useI18n();
  const config = STATUSES[status];
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.bgClass} ${config.textClass} border-current/20`}>
      {t(`status.${status}` as any)}
    </span>
  );
}
