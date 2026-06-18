import React, { useRef, useState } from "react";
import { Customer, Job } from "../types";
import {
  Download,
  Upload,
  AlertTriangle,
  ShieldCheck,
  Database,
  RefreshCw,
  FileText,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SettingsBackupProps {
  customers: Customer[];
  jobs: Job[];
  onResetToDemo: () => void;
  onImportData: (customers: Customer[], jobs: Job[]) => void;
  onClearAllData: () => void;
}

export default function SettingsBackup({
  customers,
  jobs,
  onResetToDemo,
  onImportData,
  onClearAllData,
}: SettingsBackupProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{
    status: "idle" | "success" | "error";
    message: string;
  }>({
    status: "idle",
    message: "",
  });

  const [confirmClear, setConfirmClear] = useState(false);

  // Export JSON backup
  const handleExport = () => {
    try {
      const backupData = {
        version: "1.0",
        exportedAt: new Date().toISOString(),
        customers,
        jobs,
      };

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);

      const dateStr = new Date().toISOString().split("T")[0];
      downloadAnchor.setAttribute(
        "download",
        `glasreinigung-korbinian_backup_${dateStr}.json`,
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error(e);
    }
  };

  // Import JSON backup
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (data && Array.isArray(data.customers) && Array.isArray(data.jobs)) {
          onImportData(data.customers, data.jobs);
          setImportStatus({
            status: "success",
            message: `Erfolgreich geladen: ${data.customers.length} Kunden und ${data.jobs.length} Aufträge wiederhergestellt.`,
          });
        } else {
          setImportStatus({
            status: "error",
            message:
              "Ungültiges Dateiformat. Keine Kunden oder Auftragsdaten gefunden.",
          });
        }
      } catch (err) {
        setImportStatus({
          status: "error",
          message:
            "Fehler beim Lesen der Datei. Bitte stellen Sie sicher, dass es eine gültige JSON-Datei ist.",
        });
      }
    };

    reader.readAsText(file);
    // Reset file input value
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 pb-12 pt-1">
      {/* Platform Info Alert */}
      <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0 h-9 w-9 flex items-center justify-center">
          <Info size={18} />
        </div>
        <div className="text-xs space-y-1">
          <h3 className="font-bold text-blue-900">
            Über diese Anwendung (PWA)
          </h3>
          <p className="text-blue-700 leading-relaxed font-medium">
            Diese App ist für den unkomplizierten Offline-Gebrauch optimiert und
            speichert alle Kundendaten und Messungen lokal in Ihrem Safari- oder
            Chrome-Browser auf dem iPhone.
          </p>
          <p className="text-blue-500">
            Exportieren Sie regelmäßig ein Backup, um Ihre Daten bei Updates
            oder Browser-Reinigungen dauerhaft zu sichern.
          </p>
        </div>
      </div>

      {/* Backup and Restore Cards */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <Database size={18} className="text-blue-600" />
          Datensicherung & Import
        </h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Sichern Sie Ihre Kundenliste samt Kalkulationshistorie lokal auf Ihrem
          Gerät ab. Bei Verlust über den Datei-Import einfach wieder einspielen.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Export Click Button */}
          <button
            onClick={handleExport}
            id="btn-backup-export"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 hover:bg-blue-50/50 hover:text-blue-600 border border-gray-100 rounded-xl transition text-center"
          >
            <Download size={22} className="text-blue-600" />
            <div className="space-y-0.5">
              <span className="block text-xs font-bold text-gray-800">
                Backup Export
              </span>
              <span className="text-[10px] text-gray-400">
                Als .json Datei sichern
              </span>
            </div>
          </button>

          {/* Import Masked Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            id="btn-backup-import-trigger"
            className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-50 hover:bg-emerald-50/50 hover:text-emerald-700 border border-gray-100 rounded-xl transition text-center"
          >
            <Upload size={22} className="text-emerald-600" />
            <div className="space-y-0.5">
              <span className="block text-xs font-bold text-gray-800">
                Backup Import
              </span>
              <span className="text-[10px] text-gray-400">
                Daten wiederherstellen
              </span>
            </div>
          </button>
        </div>

        {/* Secret input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
          id="btn-backup-import-file-input"
        />

        {/* Status indicator message from uploads */}
        <AnimatePresence mode="wait">
          {importStatus.status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`p-3.5 rounded-xl border text-xs leading-normal flex items-start gap-2 ${
                importStatus.status === "success"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800 font-medium"
                  : "bg-red-50 border-red-100 text-red-800"
              }`}
            >
              <ShieldCheck
                size={16}
                className={
                  importStatus.status === "success"
                    ? "text-emerald-600 shrink-0 mt-0.5"
                    : "text-red-600 shrink-0 mt-0.5"
                }
              />
              <div>
                <p>{importStatus.message}</p>
                <button
                  type="button"
                  onClick={() =>
                    setImportStatus({ status: "idle", message: "" })
                  }
                  className="mt-1 underline font-bold"
                >
                  Schließen
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reset & Maintenance Tasks */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <RefreshCw size={18} className="text-gray-400" />
          Werkzeug & Datenpflege
        </h2>

        <div className="space-y-3">
          {/* Demo restore */}
          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-[200px]">
              <span className="block text-xs font-bold text-gray-800">
                Demo-Daten laden
              </span>
              <span className="block text-[10px] text-gray-400 leading-tight">
                Lädt bayerische Muster-Kunden (Bäckerei Högl, Huber) für
                Vorführzwecke.
              </span>
            </div>
            <button
              onClick={onResetToDemo}
              id="btn-restore-demos"
              className="px-3.5 py-2 text-xs font-semibold text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg shrink-0 transition"
            >
              Laden
            </button>
          </div>

          {/* Destroy completely */}
          <div className="p-3.5 bg-red-50/30 rounded-xl border border-red-100/50 flex items-center justify-between gap-4">
            <div className="space-y-0.5 max-w-[200px]">
              <span className="block text-xs font-bold text-red-700">
                Alle Daten löschen
              </span>
              <span className="block text-[10px] text-red-500/80 leading-tight">
                Löscht sämtliche lokalen Kunden und Belege unwiderruflich aus
                dem Speicher.
              </span>
            </div>

            {confirmClear ? (
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    onClearAllData();
                    setConfirmClear(false);
                  }}
                  id="btn-confirm-wipe-everything"
                  className="px-3.5 py-2 text-xs font-bold text-white bg-red-600 rounded-lg"
                >
                  WIPEN!
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  id="btn-cancel-wipe-everything"
                  className="px-2 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg"
                >
                  Abbruch
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                id="btn-init-wipe-everything"
                className="px-3.5 py-2 text-xs font-semibold text-red-600 bg-white hover:bg-red-50 border border-red-200 rounded-lg shrink-0 transition"
              >
                Zurücksetzen
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Creator Credits (Humble & Elegant) */}
      <div className="text-center text-[11px] text-gray-400 space-y-1">
        <p className="font-semibold text-gray-500">
          Mobiles Büro v2.4 (iOS-Optimiert)
        </p>
        <p>Entworfen für Korbinian Högl &mdash; Glasreinigung Korbinian</p>
      </div>
    </div>
  );
}
