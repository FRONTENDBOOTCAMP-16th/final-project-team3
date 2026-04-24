'use client';
import { useState } from 'react';
import Pageheader from '@/components/layout/PageHeader';

export default function CompetitionsPage() {
  const [activeTab, setActiveTab] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div>
      <Pageheader
        title="대회일정"
        description="전국 주짓수 대회 일정"
        tabs={['전체', '모집중', '모집완료']}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      블벨
    </div>
  );
}
