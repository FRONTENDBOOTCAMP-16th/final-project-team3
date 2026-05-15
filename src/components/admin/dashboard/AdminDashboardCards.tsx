import Link from 'next/link';

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

const iconToneClassMap: Record<DashboardCardTone, string> = {
  slate: 'bg-btn-basic text-text-primary ring-border',
  blue: 'bg-blue-50 text-blue-600 ring-blue-100',
  green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  amber: 'bg-amber-50 text-amber-600 ring-amber-100',
  red: 'bg-red-50 text-red-500 ring-red-100',
};

const topLineClassMap: Record<DashboardCardTone, string> = {
  slate: 'bg-btn-focus',
  blue: 'bg-blue-600',
  green: 'bg-emerald-600',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
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
  const cardClassName = cn(
    'group relative overflow-hidden rounded-3xl border border-border bg-bg-white p-6 shadow-sm transition-transform duration-200',
    config.href
      ? 'block cursor-pointer hover:-translate-y-0.5 hover:shadow-md'
      : '',
  );
  const cardContent = (
    <article className={cardClassName}>
      <div
        className={cn(
          'mb-6 inline-flex rounded-2xl p-3 ring-1',
          iconToneClassMap[config.tone],
        )}
      >
        <Icon className="size-5" />
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-text-secondary">
            {config.label}
          </p>
        </div>

        <div className="flex items-end gap-2">
          <strong className="text-4xl font-semibold tracking-tight text-text-primary">
            {numberFormatter.format(value)}
          </strong>
          <span className="pb-1 text-sm font-medium text-text-secondary">
            {config.suffix}
          </span>
        </div>
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-1',
          topLineClassMap[config.tone],
        )}
      />
    </article>
  );

  if (config.href) {
    return <Link href={config.href}>{cardContent}</Link>;
  }

  return cardContent;
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
        <h2 className="text-xl font-semibold tracking-tight text-text-primary">
          {title}
        </h2>
        <p className="text-sm text-text-secondary">{description}</p>
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
    <div className="space-y-10 px-6 pt-8 pb-8">
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
