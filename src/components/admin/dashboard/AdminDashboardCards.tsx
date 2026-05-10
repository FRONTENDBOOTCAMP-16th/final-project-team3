import { cn } from '@/lib/utils';

import { ALERT_METRICS, OVERVIEW_METRICS } from './constants';
import type {
  AdminDashboardData,
  DashboardCardTone,
  DashboardMetricConfig,
} from './types';

interface AdminDashboardCardsProps {
  data: AdminDashboardData;
}

const toneClassMap: Record<DashboardCardTone, string> = {
  slate: 'bg-zinc-900 text-white ring-zinc-900/10',
  blue: 'bg-blue-600 text-white ring-blue-600/10',
  green: 'bg-emerald-600 text-white ring-emerald-600/10',
  amber: 'bg-amber-500 text-white ring-amber-500/10',
  red: 'bg-red-500 text-white ring-red-500/10',
};

const cardAccentClassMap: Record<DashboardCardTone, string> = {
  slate: 'bg-zinc-100 text-zinc-700',
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-500',
};

const numberFormatter = new Intl.NumberFormat('ko-KR');

function DashboardMetricCard({
  config,
  value,
}: {
  config: DashboardMetricConfig;
  value: number;
}) {
  const Icon = config.icon;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
      <div
        className={cn(
          'mb-6 inline-flex rounded-2xl p-3 ring-1',
          cardAccentClassMap[config.tone],
          toneClassMap[config.tone].split(' ')[2],
        )}
      >
        <Icon className="size-5" />
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-500">{config.label}</p>
          <p className="text-xs text-zinc-400">{config.description}</p>
        </div>

        <div className="flex items-end gap-2">
          <strong className="text-4xl font-semibold tracking-tight text-zinc-950">
            {numberFormatter.format(value)}
          </strong>
          <span className="pb-1 text-sm font-medium text-zinc-500">
            {config.suffix}
          </span>
        </div>
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-1',
          toneClassMap[config.tone].split(' ')[0],
        )}
      />
    </article>
  );
}

function DashboardSection({
  title,
  description,
  metrics,
  data,
  columnsClassName,
}: {
  title: string;
  description: string;
  metrics: readonly DashboardMetricConfig[];
  data: AdminDashboardData;
  columnsClassName: string;
}) {
  return (
    <section className="space-y-5">
      <div className="space-y-1 px-1">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
          {title}
        </h2>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>

      <div className={cn('grid gap-4', columnsClassName)}>
        {metrics.map((metric) => (
          <DashboardMetricCard
            key={metric.key}
            config={metric}
            value={data[metric.key]}
          />
        ))}
      </div>
    </section>
  );
}

export default function AdminDashboardCards({
  data,
}: AdminDashboardCardsProps) {
  return (
    <div className="space-y-10 px-6 pb-8">
      <DashboardSection
        title="전체 통계"
        description="서비스의 핵심 지표를 한눈에 확인할 수 있습니다."
        metrics={OVERVIEW_METRICS}
        data={data}
        columnsClassName="md:grid-cols-2 xl:grid-cols-4"
      />

      <DashboardSection
        title="알림"
        description="지금 바로 확인이 필요한 운영 항목입니다."
        metrics={ALERT_METRICS}
        data={data}
        columnsClassName="md:grid-cols-2"
      />
    </div>
  );
}
