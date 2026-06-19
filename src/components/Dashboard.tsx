import React, { useState, useMemo } from "react";
import { Job, Customer } from "../types";
import { Euro, Clock, TrendingUp, ChevronDown, ClipboardList } from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  jobs: Job[];
  customers: Customer[];
  onEditJob?: (job: Job) => void;
}

const formatDuration = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export default function Dashboard({ jobs, customers, onEditJob }: DashboardProps) {
  // Extract all unique months from jobs
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    jobs.filter(j => j.status === "completed").forEach((j) => {
      const dateStr = j.date.substring(0, 7); // "YYYY-MM"
      months.add(dateStr);
    });
    
    // Always include current month even if no jobs
    const currentMonthStr = new Date().toISOString().substring(0, 7);
    months.add(currentMonthStr);

    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [jobs]);

  const [selectedMonth, setSelectedMonth] = useState<string>(availableMonths[0]);

  // Filter jobs by selected month
  const monthJobs = useMemo(() => {
    return jobs.filter(
      (j) => j.status === "completed" && j.date.substring(0, 7) === selectedMonth
    ).sort((a, b) => b.date.localeCompare(a.date));
  }, [jobs, selectedMonth]);

  // Calculate statistics
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalMinutes = 0;

    monthJobs.forEach((j) => {
      totalRevenue += (j.receivedPrice ?? j.agreedPrice ?? j.totalPrice);
      totalMinutes += (j.cleaningTime || 0) + (j.travelTime || 0);
    });

    const totalHours = totalMinutes / 60;
    const hourlyRate = totalHours > 0 ? totalRevenue / totalHours : 0;

    return {
      revenue: totalRevenue,
      minutes: totalMinutes,
      hours: totalHours,
      hourlyRate,
    };
  }, [monthJobs]);

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Month Selector */}
      <div className="flex items-center justify-between mt-2">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        <div className="relative">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="appearance-none bg-gray-100/80 hover:bg-gray-200/80 text-gray-800 font-bold py-2 pl-4 pr-10 rounded-xl text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#007aff]/30"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m}>
                {formatMonthLabel(m)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4">
        {/* Revenue Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#007aff] to-[#005bb5] rounded-3xl p-5 text-white shadow-[0_8px_20px_rgba(0,122,255,0.25)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Euro size={80} strokeWidth={1} />
          </div>
          <div className="relative z-10">
            <span className="block text-sm font-semibold text-blue-100 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Euro size={16} /> Umsatz diesen Monat
            </span>
            <span className="block text-4xl font-extrabold tracking-tight">
              {stats.revenue.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
            </span>
          </div>
        </motion.div>

        {/* 2-Column Stats */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
          >
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Clock size={14} className="text-amber-500" /> Arbeitszeit
            </span>
            <span className="block text-2xl font-bold text-gray-800 tracking-tight">
              {formatDuration(stats.minutes)}
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-5 border border-gray-100 shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
          >
            <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-500" /> Stundenlohn
            </span>
            <span className="block text-2xl font-bold text-gray-800 tracking-tight">
              {stats.hourlyRate.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}<span className="text-sm font-medium text-gray-400">/h</span>
            </span>
          </motion.div>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="pt-4">
        <h3 className="text-sm font-bold text-gray-800 tracking-tight mb-3 flex items-center gap-1.5 pl-1">
          <ClipboardList size={16} className="text-gray-400" />
          Letzte Aufträge im {formatMonthLabel(selectedMonth).split(" ")[0]}
        </h3>
        
        {monthJobs.length === 0 ? (
          <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-400 text-xs font-medium">
            Keine Aufträge in diesem Monat gefunden.
          </div>
        ) : (
          <div className="space-y-3">
            {monthJobs.slice(0, 5).map((job, idx) => {
              const customer = customers.find(c => c.id === job.customerId);
              const formattedDate = new Date(job.date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              });
              
              const revenue = job.receivedPrice ?? job.agreedPrice ?? job.totalPrice;

              return (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + (idx * 0.05) }}
                  key={job.id} 
                  className="bg-white rounded-2xl p-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => onEditJob && onEditJob(job)}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <h4 className="text-[14px] font-bold text-gray-900 truncate">
                      {customer?.name || "Unbekannter Kunde"}
                    </h4>
                    <span className="text-[12px] font-medium text-gray-500">
                      {formattedDate}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="block text-[15px] font-bold text-[#34c759]">
                      {revenue.toLocaleString("de-DE", { style: "currency", currency: "EUR" })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
