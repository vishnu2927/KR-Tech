import React, { useState } from "react";
import { AttendanceHeatmapDay } from "../../services/pwaService";

interface AttendanceCalendarProps {
  heatmap: AttendanceHeatmapDay[];
  currentStreakDays: number;
}

export default function AttendanceCalendar({
  heatmap,
  currentStreakDays,
}: AttendanceCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<AttendanceHeatmapDay | null>(null);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>🗓️</span> September 2026 Attendance Heatmap
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified attendance recorded via Zoom & Google Meet automated duration tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-md">
            🔥 {currentStreakDays}-Day Active Streak
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-500/80 border border-emerald-400" />
          <span className="text-slate-300">Present (100%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-500/80 border border-amber-400" />
          <span className="text-slate-300">Late Arrival</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-500/80 border border-rose-400" />
          <span className="text-slate-300">Absent / Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-slate-800 border border-slate-700" />
          <span className="text-slate-400">Weekend / Rest</span>
        </div>
      </div>

      {/* Weekday Header */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-7 gap-2">
        {heatmap.map((d) => {
          let bgClass = "bg-slate-800/60 border-slate-700/60 text-slate-400";
          if (d.status === "present") {
            bgClass = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/20";
          } else if (d.status === "late") {
            bgClass = "bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm shadow-amber-500/20";
          } else if (d.status === "absent") {
            bgClass = "bg-rose-500/20 border-rose-500/50 text-rose-300";
          } else if (d.status === "weekend") {
            bgClass = "bg-slate-950/60 border-slate-800/40 text-slate-500";
          } else if (d.status === "future") {
            bgClass = "bg-slate-950/30 border-slate-800/30 text-slate-600";
          }

          return (
            <div
              key={d.day}
              onMouseEnter={() => setHoveredDay(d)}
              onMouseLeave={() => setHoveredDay(null)}
              className={`p-2 sm:p-3 rounded-2xl border text-center transition-all cursor-pointer relative group ${bgClass}`}
            >
              <span className="text-xs sm:text-sm font-bold block">{d.day}</span>
              <span className="text-[9px] uppercase font-semibold block mt-0.5 opacity-80">
                {d.status === "present"
                  ? "✓"
                  : d.status === "late"
                  ? "95m"
                  : d.status === "absent"
                  ? "✕"
                  : ""}
              </span>
            </div>
          );
        })}
      </div>

      {/* Tooltip Card for Hovered Day */}
      {hoveredDay && (
        <div className="p-4 rounded-2xl bg-slate-950 border border-purple-500/40 text-xs text-slate-300 animate-in fade-in space-y-1">
          <div className="flex items-center justify-between">
            <strong className="text-white">
              {new Date(hoveredDay.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
            </strong>
            <span className="uppercase font-bold text-[10px] text-purple-300">
              Status: {hoveredDay.status}
            </span>
          </div>
          {hoveredDay.sessionTitle ? (
            <p className="text-slate-400">
              Session: <strong className="text-slate-200">{hoveredDay.sessionTitle}</strong> ({hoveredDay.durationMinutes} minutes)
            </p>
          ) : (
            <p className="text-slate-500">No mandatory live class scheduled on this date.</p>
          )}
        </div>
      )}
    </div>
  );
}
