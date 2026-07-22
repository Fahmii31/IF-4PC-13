"use client";

import React, { useState } from "react";
import { FileSpreadsheet, X } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface UsageRecord {
  date: string;
  energy: string;
  current: string;
  voltage: string;
  power: string;
  cost: string;
}

interface ExportExcelProps {
  isOpen: boolean;
  onClose: () => void;
  consumptionData: UsageRecord[];
  defaultStartDate?: string;
  defaultEndDate?: string;
}

export default function ExportExcel({
  isOpen,
  onClose,
  consumptionData,
  defaultStartDate = "2026-01-01",
  defaultEndDate = "2026-04-19",
}: ExportExcelProps) {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [dateAlertMessage, setDateAlertMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDateInvalid = endDate < startDate;

  const handleExportExcel = async () => {
    if (isDateInvalid) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    const filteredData = consumptionData.filter((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= start && recordDate <= end;
    });

    if (filteredData.length === 0) {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      const formattedStart = start.toLocaleDateString("en-US", options);
      const formattedEnd = end.toLocaleDateString("en-US", options);

      setDateAlertMessage(`Data from ${formattedStart} to ${formattedEnd} is not available.`);
      return;
    }

    setDateAlertMessage(null);

    const dateOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const headerStart = start.toLocaleDateString("en-US", dateOptions);
    const headerEnd = end.toLocaleDateString("en-US", dateOptions);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("VoltCore Report", {
      views: [{ showGridLines: true }],
    });

    worksheet.addRow(["VOLTCORE - POWER INTELLIGENCE REPORT"]);
    worksheet.addRow([`PERIOD: ${headerStart.toUpperCase()} TO ${headerEnd.toUpperCase()}`]);
    worksheet.addRow([`EXPORTED AT: ${new Date().toLocaleString("en-US")}`]);
    worksheet.addRow([]);

    ["A1:G1", "A2:G2", "A3:G3"].forEach((cellRange, idx) => {
      worksheet.mergeCells(cellRange);
      const cell = worksheet.getCell(cellRange.split(":")[0]);
      cell.alignment = { horizontal: "center", vertical: "middle" };
      if (idx === 0) {
        cell.font = { name: "Segoe UI", size: 16, bold: true, color: { argb: "1B365D" } };
      } else {
        cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "5A6A85" } };
      }
    });
    worksheet.getRow(1).height = 28;

    const headers = [
      "NO",
      "RECORD DATE",
      "ENERGY (kWh)",
      "CURRENT (A)",
      "VOLTAGE (V)",
      "POWER LOAD (W)",
      "TOTAL COST (Rp)",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.height = 26;

    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2B65A1" },
      };
      cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "FFFFFF" } };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.border = {
        top: { style: "thin", color: { argb: "CBD5E1" } },
        bottom: { style: "thin", color: { argb: "CBD5E1" } },
        left: { style: "thin", color: { argb: "CBD5E1" } },
        right: { style: "thin", color: { argb: "CBD5E1" } },
      };
    });

    filteredData.forEach((record, index) => {
      const rawCost = Number(record.cost.replace(/\./g, "").replace(",", "."));

      const dataRow = worksheet.addRow([
        index + 1,
        record.date,
        Number(record.energy),
        Number(record.current),
        Number(record.voltage),
        Number(record.power),
        rawCost,
      ]);

      dataRow.height = 22;
      const isEven = index % 2 === 0;

      dataRow.eachCell((cell, colNumber) => {
        cell.font = { name: "Segoe UI", size: 10, color: { argb: "333333" } };

        cell.border = {
          top: { style: "thin", color: { argb: "E2E8F0" } },
          bottom: { style: "thin", color: { argb: "E2E8F0" } },
          left: { style: "thin", color: { argb: "E2E8F0" } },
          right: { style: "thin", color: { argb: "E2E8F0" } },
        };

        if (isEven) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "F8FAFC" },
          };
        }

        if (colNumber === 1 || colNumber === 2) {
          cell.alignment = { horizontal: "center", vertical: "middle" };
        } else {
          cell.alignment = { horizontal: "right", vertical: "middle" };
        }

        // ENERGY
        if (colNumber === 3) {
          cell.numFmt = "0.00";
        }

        // CURRENT
        else if (colNumber === 4) {
          cell.numFmt = "0.00";
        }

        // VOLTAGE
        else if (colNumber === 5) {
          cell.numFmt = "0.00";
        }

        // POWER
        else if (colNumber === 6) {
          cell.numFmt = "0.00";
        }

        // COST
        else if (colNumber === 7) {
          cell.font = {
            name: "Segoe UI",
            size: 10,
            bold: true,
            color: { argb: "1B365D" },
          };

          cell.numFmt = '"Rp " #,##0.00';
        }
      });
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      if (column.eachCell) {
        column.eachCell((cell, rowIdx) => {
          if (rowIdx < 5) return;
          const valueLength = cell.value ? cell.value.toString().length : 0;
          if (valueLength > maxLength) maxLength = valueLength;
        });
      }
      column.width = maxLength < 14 ? 16 : maxLength + 6;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const fileBlob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(fileBlob, `VoltCore_Report_${startDate}_to_${endDate}.xlsx`);

    handleClose();
  };

  const handleClose = () => {
    setDateAlertMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 md:p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 text-green-600">
            <FileSpreadsheet size={24} />
            <h3 className="text-xl font-bold text-gray-900">Export Records</h3>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-900">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDateAlertMessage(null);
              }}
              className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500 text-gray-900 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDateAlertMessage(null);
              }}
              className={`w-full p-3 bg-gray-50 border rounded-xl outline-none focus:border-blue-500 text-gray-900 font-medium ${
                isDateInvalid ? "border-red-500" : "border-gray-100"
              }`}
            />

            {isDateInvalid && (
              <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">
                End date must be later than start date
              </p>
            )}

            {dateAlertMessage && (
              <p className="text-[11px] text-amber-600 font-bold mt-2 bg-amber-50 p-2.5 border border-amber-200 rounded-lg">
                {dateAlertMessage}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleClose}
            className="flex-1 py-3 text-sm font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            disabled={isDateInvalid}
            onClick={handleExportExcel}
            className={`flex-1 py-3 text-sm font-bold text-white rounded-xl transition-all ${
              isDateInvalid ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
