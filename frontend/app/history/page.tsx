"use client";

import React, { useState, useEffect } from "react";
import { Calendar, FileSpreadsheet, ChevronDown } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import Notifications from "@/components/Notifications";
import ExportExcel from "@/components/ExportExcel";
import { useAuth } from "@/hooks/useAuth";

interface UsageRecord {
  date: string;
  energy: string;
  current: string;
  voltage: string;
  power: string;
  cost: string;
}

interface BackendHistoryItem {
  tanggal: string;
  total_kwh: string | number;
  arus_ampere: string | number;
  tegangan_volt: string | number;
  daya_watt: string | number;
  total_biaya: string | number;
}

export default function HistoryPage() {
  const { user } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [visibleRecords, setVisibleRecords] = useState(8);

  const [consumptionData, setConsumptionData] = useState<UsageRecord[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoryData = async () => {
      try {
        setApiError(null);

        const res = await fetch("http://localhost:8000/api/history/daily", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          setApiError(`Backend bermasalah! Status Code: ${res.status}.`);
          return;
        }

        const data: BackendHistoryItem[] = await res.json();

        // MAPPING DATA
        const mappedData: UsageRecord[] = data.map((item: BackendHistoryItem) => {
          const formattedDate = item.tanggal
            ? new Date(item.tanggal).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "N/A";

          return {
            date: formattedDate,
            energy: Number(item.total_kwh ?? 0).toFixed(2),
            current: Number(item.arus_ampere ?? 0).toFixed(2),
            voltage: Number(item.tegangan_volt ?? 0).toFixed(2),
            power: Number(item.daya_watt ?? 0).toFixed(2),
            cost: Number(item.total_biaya ?? 0).toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          };
        });

        setConsumptionData(mappedData);
      } catch {
        setApiError("Failed to fetch history data");
      }
    };

    fetchHistoryData();
  }, []);

  const handleLoadMore = () => {
    setVisibleRecords((prev) => prev + 5);
  };

  return (
    <>
      <MainLayout
        title="History & Analysis"
        user={user}
        onNotificationClick={() => setIsNotificationOpen(true)}
      >
        <div className="p-4 md:p-8 flex-1 space-y-8">
          {apiError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-bold shadow-sm">
              ⚠️ {apiError}
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-4 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800">Consumption Records</h3>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-1">
                  Daily energy usage history since January 2026
                </p>
              </div>

              <button
                onClick={() => setShowExportModal(true)}
                className="flex items-center justify-center gap-2 px-4 md:px-6 py-2.5 bg-[#1D6F42] text-white rounded-lg text-xs font-bold hover:bg-[#165533] transition-all shadow-lg shadow-green-900/10"
              >
                <FileSpreadsheet size={18} />
                Export Excel
              </button>
            </div>

            <div className="px-4 md:px-8 pb-4 overflow-x-auto custom-scrollbar">
              <table className="w-full text-left min-w-[600px]">
                <thead className="text-[10px] uppercase tracking-[0.2em] text-gray-300 font-bold border-b border-gray-50">
                  <tr>
                    <th className="py-5 text-left">RECORD DATE</th>
                    <th className="py-5 text-center">ENERGY (KWH)</th>
                    <th className="py-5 text-center">CURRENT (A)</th>
                    <th className="py-5 text-center">VOLTAGE (V)</th>
                    <th className="py-5 text-center">POWER (W)</th>
                    <th className="py-5 text-right">COST (RP)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {consumptionData.length === 0 && !apiError ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-xs text-gray-400 font-medium"
                      >
                        No historical data found.
                      </td>
                    </tr>
                  ) : (
                    consumptionData.slice(0, visibleRecords).map((record, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition">
                        <td className="py-6 flex items-center gap-4">
                          <div className="p-2.5 bg-slate-50 text-blue-600 rounded-lg border border-gray-100 shrink-0">
                            <Calendar size={18} />
                          </div>
                          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                            {record.date}
                          </span>
                        </td>
                        <td className="py-6 text-center text-sm font-bold text-black">
                          {record.energy}
                        </td>
                        <td className="py-6 text-center text-sm font-bold text-black">
                          {record.current}
                        </td>
                        <td className="py-6 text-center text-sm font-bold text-black">
                          {record.voltage}
                        </td>
                        <td className="py-6 text-center text-sm font-bold text-black">
                          {record.power}
                        </td>
                        <td className="py-6 text-right text-sm font-bold text-blue-600 whitespace-nowrap">
                          Rp {record.cost}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {visibleRecords < consumptionData.length && (
              <div className="p-8 pt-4 flex justify-center border-t border-gray-50">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 px-8 py-3 bg-gray-50 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-xs font-bold transition-all border border-gray-100"
                >
                  LOAD MORE RECORDS
                  <ChevronDown size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </MainLayout>

      <Notifications isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

      <ExportExcel
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        consumptionData={consumptionData}
        defaultStartDate=""
        defaultEndDate=""
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
