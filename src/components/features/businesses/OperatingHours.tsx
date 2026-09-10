import React from 'react';
import { Clock } from 'lucide-react';
import { BusinessHoursItem } from '../../../api/types/admin.types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/Card';


const DAYS_MAP = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function OperatingHours({ hours }: { hours: BusinessHoursItem[] }) {
  const hoursByDay = new Map<number, BusinessHoursItem>();
  if (hours && Array.isArray(hours)) {
    hours.forEach((h) => hoursByDay.set(h.dayOfWeek, h));
  }

  return (
    <Card className="rounded-3xl border border-[#E4E8F0] shadow-sm">
      <CardHeader className="pb-4 border-b border-[#E4E8F0]/80">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5F7FF] text-[#4B49AC] border border-[#E4E8F0] shrink-0 shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4B49AC]">
              Store Availability
            </span>
            <CardTitle className="text-lg font-bold text-[#1E2238] tracking-tight">Operating Hours</CardTitle>
            <CardDescription className="text-xs text-[#6C7383]">7-day weekly schedule configured for this store</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-1.5">
          {DAYS_MAP.map((dayName, dayIndex) => {
            const item = hoursByDay.get(dayIndex);
            const isClosed = !item || item.isClosed || (!item.openTime && !item.closeTime);

            return (
              <div
                key={dayName}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#F8F9FB] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-[#D1D5DB]" />
                  <span className="font-bold text-sm text-[#1E2238] w-28">
                    {dayName}
                  </span>
                </div>

                <div>
                  {isClosed ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF0F0] px-3.5 py-1 text-xs font-bold text-[#F3797E] border border-[#F3797E]/25 shadow-2xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F3797E]" />
                      Closed
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#1E2238]">
                        <span className="rounded-xl bg-[#F5F7FF] border border-[#E4E8F0] px-3 py-1.5 shadow-2xs">
                          {item?.openTime || '—'}
                        </span>
                        <span className="text-xs font-bold text-[#98A2B3] font-sans px-1">to</span>
                        <span className="rounded-xl bg-[#F5F7FF] border border-[#E4E8F0] px-3 py-1.5 shadow-2xs">
                          {item?.closeTime || '—'}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-500/20 ml-2 shadow-2xs">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Open
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

