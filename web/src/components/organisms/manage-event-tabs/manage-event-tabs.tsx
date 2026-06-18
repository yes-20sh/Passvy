import React, { useState } from 'react';
import { Users, ScanLine, Megaphone, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AttendeesTable } from '../attendees-table/attendees-table';
import { EventScanner } from '../event-scanner/event-scanner';
import { AdvertisementSetup } from '../advertisement-setup/advertisement-setup';

type TabId = 'attendees' | 'scanner' | 'promote';

export const ManageEventTabs = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId') || '';
  const [activeTab, setActiveTab] = useState<TabId>('attendees');

  const tabs = [
    { id: 'attendees' as TabId, label: 'Attendees', icon: Users },
    { id: 'scanner' as TabId, label: 'Scanner', icon: ScanLine },
    { id: 'promote' as TabId, label: 'Promote', icon: Megaphone },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-1 scrollbar-none items-center gap-3 overflow-x-auto scroll-smooth py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border p-3 px-4 transition-all duration-300 select-none hover:-translate-y-0.5 active:scale-95 ${
                isSelected
                  ? 'border-indigo-700 bg-indigo-700 text-white shadow-sm shadow-indigo-700/20'
                  : 'bg-secondary/15 border-border/80 text-muted-foreground hover:text-foreground hover:bg-secondary/30 hover:border-indigo-500/20'
              }`}
            >
              <Icon
                className={`size-4.5 ${
                  isSelected
                    ? 'text-white'
                    : 'text-indigo-600 dark:text-indigo-400'
                }`}
              />
              <span className="text-[13px] font-semibold tracking-wide">
                {tab.label}
              </span>
            </button>
          );
        })}

        <Link href={`/host/events/create?eventId=${eventId}`} className="ml-auto">
          <button className="flex shrink-0 cursor-pointer items-center gap-2.5 rounded-xl border bg-secondary/15 border-border/80 text-muted-foreground p-3 px-4 transition-all duration-300 select-none hover:-translate-y-0.5 hover:text-foreground hover:bg-secondary/30 hover:border-indigo-500/20 active:scale-95">
            <Edit3 className="size-4.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-[13px] font-semibold tracking-wide">Edit Event</span>
          </button>
        </Link>
      </div>

      {/* Tab Content */}
      <div className="w-full mt-6">

        {activeTab === 'attendees' && <AttendeesTable />}
        {activeTab === 'scanner' && <EventScanner />}
        {activeTab === 'promote' && <AdvertisementSetup />}
      </div>
    </div>
  );
};
