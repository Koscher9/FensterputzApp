import React, { useState, useEffect } from "react";
import { Customer, Job, RoomEntry, STANDARD_ROOMS } from "../types";
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  User,
  Save,
  Trash,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  AlertCircle,
  Euro,
  Calendar,
  RefreshCw,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Pre-defined rooms with standard default sizes & count for high velocity entry
const ROOM_PRESETS: {
  [key: string]: { width: number; height: number; count: number };
} = {
  Wohnzimmer: { width: 0, height: 0, count: 1 },
  Schlafzimmer: { width: 0, height: 0, count: 1 },
  Esszimmer: { width: 0, height: 0, count: 1 },
  Küche: { width: 0, height: 0, count: 1 },
  Bad: { width: 0, height: 0, count: 1 },
  Flur: { width: 0, height: 0, count: 1 },
  Haustür: { width: 0, height: 0, count: 1 },
  "Balkon/Terrasse": { width: 0, height: 0, count: 1 },
};

const formatDuration = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h} Std. ${m} Min.` : `${m} Min.`;
};

interface RoomEditSectionProps {
  room: RoomEntry;
  globalCostPerSqM: number;
  onUpdate: (updates: Partial<RoomEntry>) => void;
  onDelete: () => void;
}

function RoomEditSection({
  room,
  globalCostPerSqM,
  onUpdate,
  onDelete,
}: RoomEditSectionProps) {
  const [widthInput, setWidthInput] = useState(
    room.width === 0 ? "" : room.width.toString(),
  );
  const [heightInput, setHeightInput] = useState(
    room.height === 0 ? "" : room.height.toString(),
  );
  const [costInput, setCostInput] = useState(room.costPerSqM.toString());

  useEffect(() => {
    setWidthInput(room.width === 0 ? "" : room.width.toString());
  }, [room.width]);

  useEffect(() => {
    setHeightInput(room.height === 0 ? "" : room.height.toString());
  }, [room.height]);

  useEffect(() => {
    setCostInput(room.costPerSqM.toString());
  }, [room.costPerSqM]);

  const changeWidth = (val: string) => {
    setWidthInput(val);
    const cleaned = val.replace(",", ".");
    const parsed = parseFloat(cleaned);
    onUpdate({ width: isNaN(parsed) ? 0 : parsed });
  };

  const changeHeight = (val: string) => {
    setHeightInput(val);
    const cleaned = val.replace(",", ".");
    const parsed = parseFloat(cleaned);
    onUpdate({ height: isNaN(parsed) ? 0 : parsed });
  };

  const changeCost = (val: string) => {
    setCostInput(val);
    const cleaned = val.replace(",", ".");
    const parsed = parseFloat(cleaned);
    onUpdate({ costPerSqM: isNaN(parsed) ? 0 : parsed });
  };

  return (
    <div className="bg-gray-50/70 border-t border-gray-100 p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Width */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
            Fenster-Breite (m)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={widthInput}
              onChange={(e) => changeWidth(e.target.value)}
              placeholder="0.00"
              className="w-full text-center bg-white border border-gray-200 rounded-xl py-2.5 font-bold text-gray-850 focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition font-mono text-sm shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 font-mono">
              m
            </span>
          </div>
        </div>

        {/* Height */}
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
            Fenster-Höhe (m)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={heightInput}
              onChange={(e) => changeHeight(e.target.value)}
              placeholder="0.00"
              className="w-full text-center bg-white border border-gray-200 rounded-xl py-2.5 font-bold text-gray-855 focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition font-mono text-sm shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 font-mono">
              m
            </span>
          </div>
        </div>
      </div>

      {/* Inline specific price per sqm override */}
      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
            Spezifischer qm-Preis (€)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="decimal"
              value={costInput}
              onChange={(e) => changeCost(e.target.value)}
              placeholder="2.00"
              className="w-full bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-gray-855 focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
              €/m²
            </span>
          </div>
        </div>

        {/* Quick standard buttons */}
        <div className="flex gap-1.5 pt-4 justify-end">
          <button
            type="button"
            onClick={() => onUpdate({ costPerSqM: globalCostPerSqM })}
            className="text-[10px] font-semibold text-gray-500 hover:text-[#007aff] bg-white border border-gray-100 rounded-lg px-2.5 py-1.5 transition-colors shadow-sm"
          >
            Standard ({globalCostPerSqM.toFixed(2)}€)
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="text-white bg-red-500 hover:bg-red-600 rounded-lg p-2.5 flex items-center justify-center transition-colors shadow-sm"
            title="Raum entfernen"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Slide triggers */}
      <div className="flex justify-between items-center bg-[#007aff]/5 p-2.5 rounded-xl border border-gray-150">
        <span className="text-[11px] font-semibold text-[#007aff] flex items-center gap-1">
          <AlertCircle size={12} /> Tipp: Anzahl '0' setzt Zimmer aus.
        </span>
        <button
          type="button"
          onClick={() => onUpdate({ count: 0 })}
          className="text-[11px] font-bold text-[#007aff] bg-white border border-gray-150 px-3 py-1 rounded-lg active:bg-gray-100/50 transition-colors shadow-sm"
        >
          Raum heute auslassen
        </button>
      </div>
    </div>
  );
}

interface CalculatorProps {
  customers: Customer[];
  activeJob: Job | null;
  onUpdateJob: (updated: Job) => void;
  onSaveJob: (completedJob: Job) => void;
  onCancelJob: () => void;
  onSelectTab: (tab: "customers" | "calculator" | "settings") => void;
  jobs: Job[];
  onDeleteJob: (id: string) => void;
}

export default function Calculator({
  customers,
  activeJob,
  onUpdateJob,
  onSaveJob,
  onCancelJob,
  onSelectTab,
  jobs,
  onDeleteJob,
}: CalculatorProps) {
  const [selectedCustomerIdInSelector, setSelectedCustomerIdInSelector] =
    useState("");
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);
  const [customRoomName, setCustomRoomName] = useState("");

  // Find related customer for the active job
  const activeCustomer = activeJob
    ? customers.find((c) => c.id === activeJob.customerId)
    : null;

  // Real-time pricing formula
  const getRoomPrice = (room: RoomEntry) => {
    return room.width * room.height * room.count * room.costPerSqM;
  };

  const getJobTotalPrice = (rooms: RoomEntry[]) => {
    return rooms.reduce((sum, room) => sum + getRoomPrice(room), 0);
  };

  // Start new job with selected customer from dropdown or direct custom creation
  const handleStartNewJobSelf = () => {
    const custId = selectedCustomerIdInSelector || "cust-walkin";
    const newJob: Job = {
      id: `job-${Date.now()}`,
      customerId: custId,
      date: new Date().toISOString().split("T")[0],
      status: "concept",
      globalCostPerSqM: 2.0,
      rooms: [
        // Populate with standard presets
        {
          id: "rem-1",
          name: "Wohnzimmer",
          width: 1.5,
          height: 1.4,
          count: 2,
          costPerSqM: 2.0,
        },
        {
          id: "rem-2",
          name: "Küche",
          width: 1.2,
          height: 1.0,
          count: 1,
          costPerSqM: 2.0,
        },
        {
          id: "rem-3",
          name: "Elternzimmer",
          width: 1.5,
          height: 1.3,
          count: 2,
          costPerSqM: 2.0,
        },
        {
          id: "rem-4",
          name: "Bad",
          width: 0.8,
          height: 0.8,
          count: 1,
          costPerSqM: 2.0,
        },
      ],
      totalPrice: 0,
    };
    newJob.totalPrice = getJobTotalPrice(newJob.rooms);
    onUpdateJob(newJob);
  };

  if (!activeJob) {
    const savedDirectJobs = jobs.filter((j) => j.customerId === "cust-walkin");
    return (
      <div className="space-y-6 pb-12 pt-4">
        {/* State if no active job is selected */}
        <div className="bg-white rounded-2xl p-6 border border-gray-150/80 shadow-[0_4px_18px_rgba(0,0,0,0.04)] text-center max-w-md mx-auto space-y-4">
          <div className="p-4 bg-[#007aff]/10 text-[#007aff] rounded-full w-14 h-14 flex items-center justify-center mx-auto shadow-inner">
            <Sparkles size={26} />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
              Kalkulator bereit
            </h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
              Starten Sie eine neue Kalkulation direkt beim Kunden auf der
              Baustelle oder weisen Sie sie einem Stammkunden zu.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-left">
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                Kunde auswählen:
              </label>
              <select
                value={selectedCustomerIdInSelector}
                onChange={(e) =>
                  setSelectedCustomerIdInSelector(e.target.value)
                }
                id="select-customer-rechner"
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 bg-white font-medium"
              >
                <option value="">
                  -- Direkt-Kalkulation (Eilmeldung / Ohne Stammkunde) --
                </option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStartNewJobSelf}
              id="btn-initiate-rechner-job"
              className="w-full flex items-center justify-center gap-2 bg-[#007aff] hover:bg-[#0062cc] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-sm active:scale-[0.98]"
            >
              <Plus size={18} />
              Rechner laden & starten
            </button>
          </div>

          <p className="text-[11px] text-gray-400">
            Oder wählen Sie einen Kunden im Reiter{" "}
            <button
              onClick={() => onSelectTab("customers")}
              className="text-[#007aff] font-bold hover:underline"
            >
              Kunden
            </button>{" "}
            aus, um historische Belege als Kopiervorlage zu nutzen.
          </p>
        </div>

        {/* Saved Direct Calculations list */}
        {savedDirectJobs.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-gray-150/80 shadow-[0_4px_18px_rgba(0,0,0,0.04)] max-w-md mx-auto space-y-3">
            <div className="border-b border-gray-100 pb-2">
              <h3 className="text-sm font-black text-gray-950 flex items-center gap-1.5 pl-0.5">
                <Sparkles size={16} className="text-[#007aff]" />
                Gespeicherte Direkt-Berechnungen ({savedDirectJobs.length})
              </h3>
            </div>
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 select-none">
              {savedDirectJobs.map((job) => {
                const totalWindows = job.rooms.reduce(
                  (sum, r) => sum + r.count,
                  0,
                );
                const formattedDate = new Date(job.date).toLocaleDateString(
                  "de-DE",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  },
                );
                return (
                  <div
                    key={job.id}
                    className="p-3 bg-gray-50 border border-gray-155 rounded-xl space-y-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)] text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-extrabold text-gray-900 block">
                          {formattedDate}
                        </span>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] text-gray-550 font-bold bg-white border border-gray-150 px-1.5 py-0.5 rounded-md">
                            {job.rooms.length} Räume
                          </span>
                          <span className="text-[10px] text-gray-550 font-bold bg-white border border-gray-150 px-1.5 py-0.5 rounded-md">
                            {totalWindows} Scheiben
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <span className="block text-sm font-black text-[#007aff]">
                          {job.totalPrice.toLocaleString("de-DE", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </span>
                        <button
                          onClick={() => onDeleteJob(job.id)}
                          className="p-1 px-1.5 text-red-500 hover:bg-red-50 rounded-lg transition active:scale-90"
                          title="Löschen"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Room overview list */}
                    <div className="bg-white p-2 rounded-xl border border-gray-150 text-[11px] text-gray-650 max-h-16 overflow-y-auto font-medium">
                      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5">
                        {job.rooms.map((r) => (
                          <div key={r.id} className="truncate">
                            <span className="font-semibold text-gray-800">
                              {r.name}
                            </span>
                            : {r.count}x
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action button */}
                    <button
                      onClick={() => {
                        // Load as active calculation template
                        const duplicatedRooms = job.rooms.map((room) => ({
                          ...room,
                          id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
                        }));
                        onUpdateJob({
                          id: `job-${Date.now()}`,
                          customerId: "cust-walkin",
                          date: new Date().toISOString().split("T")[0],
                          status: "concept",
                          globalCostPerSqM: job.globalCostPerSqM,
                          rooms: duplicatedRooms,
                          totalPrice: job.totalPrice,
                          travelTime: job.travelTime,
                          cleaningTime: job.cleaningTime,
                          imageUrl: job.imageUrl,
                        });
                      }}
                      className="w-full text-center py-2 bg-[#007aff]/10 hover:bg-[#007aff]/15 text-[#007aff] font-bold text-xs rounded-xl transition"
                    >
                      Als Kopiervorlage in Rechner laden
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Handle room values changes
  const handleUpdateRoom = (roomId: string, updates: Partial<RoomEntry>) => {
    const updatedRooms = activeJob.rooms.map((room) => {
      if (room.id === roomId) {
        const r = { ...room, ...updates };
        return r;
      }
      return room;
    });

    const updatedJob: Job = {
      ...activeJob,
      rooms: updatedRooms,
      totalPrice: getJobTotalPrice(updatedRooms),
    };
    onUpdateJob(updatedJob);
  };

  // Delete Room from Job
  const handleDeleteRoom = (roomId: string) => {
    const updatedRooms = activeJob.rooms.filter((room) => room.id !== roomId);
    const updatedJob: Job = {
      ...activeJob,
      rooms: updatedRooms,
      totalPrice: getJobTotalPrice(updatedRooms),
    };
    onUpdateJob(updatedJob);
    if (editingRoomId === roomId) {
      setEditingRoomId(null);
    }
  };

  // Add Room from quick adds or custom name
  const handleAddRoom = (
    name: string,
    presetWidth?: number,
    presetHeight?: number,
    presetCount?: number,
  ) => {
    const finalName = name.trim();
    if (!finalName) return;

    // Check if preset exists
    const preset = ROOM_PRESETS[finalName];
    const width = presetWidth ?? preset?.width ?? 0;
    const height = presetHeight ?? preset?.height ?? 0;
    const count = presetCount ?? preset?.count ?? 1;

    const newRoom: RoomEntry = {
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: finalName,
      width,
      height,
      count,
      costPerSqM: activeJob.globalCostPerSqM,
    };

    const updatedRooms = [...activeJob.rooms, newRoom];
    onUpdateJob({
      ...activeJob,
      rooms: updatedRooms,
      totalPrice: getJobTotalPrice(updatedRooms),
    });
    setCustomRoomName("");
    // Open editor for newly added custom rooms so they can quickly enter correct sizes
    if (!preset) {
      setEditingRoomId(newRoom.id);
    }
  };

  // Bulk update global sqm price
  const handleUpdateGlobalCost = (newCost: number) => {
    // Also update all rooms that are using the default previous global rate
    const updatedRooms = activeJob.rooms.map((room) => {
      // If room was sharing the previous global price, update it
      if (room.costPerSqM === activeJob.globalCostPerSqM) {
        return { ...room, costPerSqM: newCost };
      }
      return room;
    });

    onUpdateJob({
      ...activeJob,
      globalCostPerSqM: newCost,
      rooms: updatedRooms,
      totalPrice: getJobTotalPrice(updatedRooms),
    });
  };

  // Change date
  const handleChangeDate = (newDate: string) => {
    onUpdateJob({
      ...activeJob,
      date: newDate,
    });
  };

  const handleUpdateTravelTime = (val: number) => {
    onUpdateJob({
      ...activeJob,
      travelTime: val,
    });
  };

  const handleUpdateCleaningTime = (val: number) => {
    onUpdateJob({
      ...activeJob,
      cleaningTime: val,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateJob({
          ...activeJob,
          imageUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateAgreedPrice = (val: string) => {
    const cleaned = val.replace(",", ".");
    const parsed = parseFloat(cleaned);
    onUpdateJob({
      ...activeJob,
      agreedPrice: isNaN(parsed) || val === "" ? undefined : parsed,
    });
  };

  const handleUpdateReceivedPrice = (val: string) => {
    const cleaned = val.replace(",", ".");
    const parsed = parseFloat(cleaned);
    onUpdateJob({
      ...activeJob,
      receivedPrice: isNaN(parsed) || val === "" ? undefined : parsed,
    });
  };

  // Form submit (finish job)
  const handleFinishJob = () => {
    onSaveJob({
      ...activeJob,
      status: "completed",
    });
  };

  return (
    <div className="space-y-4 pb-16">
      {/* Current Job Banner (Customer Info + Price) */}
      <div className="bg-white rounded-2xl p-4 shadow-[0_4px_14px_rgba(0,0,0,0.03)] border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block">
              Aktiver Auftrag
            </span>
            <h2 className="font-extrabold text-gray-900 text-lg leading-tight truncate">
              {activeCustomer ? activeCustomer.name : "Direkt-Rechner"}
            </h2>
            {activeCustomer && activeCustomer.companyName && (
              <p className="text-[12px] font-bold text-[#007aff] truncate">
                {activeCustomer.companyName}
              </p>
            )}
            {activeCustomer && (
              <p className="text-[11px] text-gray-400 truncate mt-0.5">
                {activeCustomer.address}
              </p>
            )}
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium">
              Rechnungsbetrag
            </span>
            <span
              id="job-total-sum-badge"
              className="text-xl font-black text-[#007aff] leading-none"
            >
              {activeJob.totalPrice.toLocaleString("de-DE", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
          </div>
        </div>

        {/* Global Settings row */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Calendar size={11} /> Besuchsdatum
            </label>
            <input
              type="date"
              value={activeJob.date}
              onChange={(e) => handleChangeDate(e.target.value)}
              className="w-full text-xs bg-gray-50 border border-gray-100/50 font-bold px-2 py-1.5 rounded-lg text-gray-700 focus:outline-none focus:border-[#007aff]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Euro size={11} /> Standard qm-Preis
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={activeJob.globalCostPerSqM}
                onChange={(e) =>
                  handleUpdateGlobalCost(parseFloat(e.target.value) || 2.0)
                }
                className="w-full text-xs bg-gray-50 border border-gray-100/50 font-black pl-2 pr-6 py-1.5 rounded-lg text-gray-855 focus:outline-none focus:border-[#007aff]"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400">
                €
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              🚗 Anfahrt
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={activeJob.travelTime || ""}
                onChange={(e) =>
                  handleUpdateTravelTime(parseInt(e.target.value) || 0)
                }
                className="w-full text-xs bg-gray-50 border border-gray-100/50 font-bold pr-10 pl-2 py-1.5 rounded-lg text-gray-850 focus:outline-none focus:border-[#007aff]"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
                Min
              </span>
            </div>
            {activeJob.travelTime ? (
              <span className="text-[10px] text-[#007aff] font-bold block mt-0.5 whitespace-nowrap">
                = {formatDuration(activeJob.travelTime)}
              </span>
            ) : null}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              🧼 Putzzeit
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={activeJob.cleaningTime || ""}
                onChange={(e) =>
                  handleUpdateCleaningTime(parseInt(e.target.value) || 0)
                }
                className="w-full text-xs bg-gray-55 border border-gray-100/50 font-bold pr-10 pl-2 py-1.5 rounded-lg text-gray-850 focus:outline-none focus:border-[#007aff]"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">
                Min
              </span>
            </div>
            {activeJob.cleaningTime ? (
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5 whitespace-nowrap">
                = {formatDuration(activeJob.cleaningTime)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Main List of Rooms */}
      <div className="space-y-3" id="calculator-room-cards-container">
        <div className="flex items-center justify-between pl-1">
          <h3 className="text-sm font-bold text-gray-800 tracking-tight">
            Räume im aktuellen Auftrag ({activeJob.rooms.length})
          </h3>
          <span className="text-[11px] text-gray-400 italic">
            Antippen zum Bearbeiten
          </span>
        </div>

        {activeJob.rooms.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400 text-xs border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
            Noch keine Räume hinzugefügt. Nutze die Schnell-Auswahl unten.
          </div>
        ) : (
          <div className="space-y-2.5">
            {activeJob.rooms.map((room) => {
              const isEditing = editingRoomId === room.id;
              const roomSqM = room.width * room.height;
              const totalRoomCost = getRoomPrice(room);

              return (
                <div
                  key={room.id}
                  id={`room-card-${room.id}`}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.02)] ${
                    isEditing
                      ? "border-[#007aff] ring-2 ring-[#007aff]/10"
                      : room.count === 0
                        ? "border-gray-200 opacity-60"
                        : "border-gray-150 hover:border-gray-300"
                  }`}
                >
                  {/* Card Header (Tap to toggle edit) */}
                  <div
                    onClick={() => setEditingRoomId(isEditing ? null : room.id)}
                    className="p-4 flex items-center justify-between cursor-pointer select-none active:bg-gray-50/50"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-800 text-[15px] truncate">
                          {room.name}
                        </span>
                        {room.costPerSqM !== activeJob.globalCostPerSqM && (
                          <span className="text-[9px] bg-amber-50 text-amber-600 font-bold px-1.5 py-0.5 rounded">
                            Sondertarif: {room.costPerSqM.toFixed(2)}€
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-xs font-medium text-gray-400">
                        <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded">
                          {room.width.toFixed(2)}m × {room.height.toFixed(2)}m
                        </span>
                        <span>=</span>
                        <span className="font-semibold text-gray-600">
                          {roomSqM.toFixed(2)} m²
                        </span>
                      </div>
                    </div>

                    {/* Counter and pricing widget */}
                    <div
                      className="flex items-center gap-3 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Interactive Counter right on the card (Extreme Mobile UX) */}
                      <div className="flex items-center bg-gray-100 rounded-xl p-0.5">
                        <button
                          onClick={() =>
                            handleUpdateRoom(room.id, {
                              count: Math.max(0, room.count - 1),
                            })
                          }
                          id={`btn-dec-count-${room.id}`}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-600 bg-white rounded-lg shadow-sm active:scale-90"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-extrabold text-gray-800">
                          {room.count}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateRoom(room.id, { count: room.count + 1 })
                          }
                          id={`btn-inc-count-${room.id}`}
                          className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-600 bg-white rounded-lg shadow-sm active:scale-90"
                        >
                          +
                        </button>
                      </div>

                      {/* Room Cost */}
                      <div className="text-right w-16">
                        <span className="block text-xs font-bold text-gray-900 leading-none">
                          {totalRoomCost.toLocaleString("de-DE", {
                            style: "currency",
                            currency: "EUR",
                          })}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          {room.count === 0 ? "übersprungen" : "Fenster"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* expanded finger-friendly form */}
                  <AnimatePresence>
                    {isEditing && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="overflow-hidden"
                      >
                        <RoomEditSection
                          room={room}
                          globalCostPerSqM={activeJob.globalCostPerSqM}
                          onUpdate={(updates) =>
                            handleUpdateRoom(room.id, updates)
                          }
                          onDelete={() => handleDeleteRoom(room.id)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* QUICK ADD PRESSETS PANEL */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3 shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1">
          Räume schnell hinzufügen:
        </h3>
        {/* Preset tap badges */}
        <div className="flex flex-wrap gap-2">
          {Object.keys(ROOM_PRESETS).map((pName) => {
            const pre = ROOM_PRESETS[pName];
            return (
              <button
                key={pName}
                onClick={() => handleAddRoom(pName)}
                id={`btn-add-preset-${pName}`}
                className="flex items-center gap-1 bg-gray-50 hover:bg-[#007aff]/10 hover:text-[#007aff] border border-gray-150 text-gray-750 font-bold text-xs px-3 py-2 rounded-xl transition-colors active:scale-95 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
              >
                <Plus size={12} className="text-[#007aff] shrink-0" />
                {pName}
                <span className="text-[10px] text-gray-400 font-mono font-normal block pl-1">
                  ({pre.width}x{pre.height}m)
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Room Entry Input */}
        <div className="pt-2 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={customRoomName}
            onChange={(e) => setCustomRoomName(e.target.value)}
            placeholder="Anderen/Eigener Raumname..."
            className="flex-1 px-3.5 py-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs font-semibold focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition"
          />
          <button
            onClick={() => handleAddRoom(customRoomName)}
            id="btn-add-custom-room"
            className="bg-[#007aff] hover:bg-[#0062cc] text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shrink-0 shadow-sm transition active:scale-95"
          >
            <Plus size={14} /> Hinzufügen
          </button>
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
          <Camera size={14} /> Erinnerungsfoto (Optional)
        </h3>

        {activeJob.imageUrl ? (
          <div className="relative rounded-xl overflow-hidden border border-gray-150">
            <img
              src={activeJob.imageUrl}
              alt="Auftragsfoto"
              className="w-full h-auto object-contain max-h-[250px] bg-gray-50"
            />
            <button
              onClick={() => onUpdateJob({ ...activeJob, imageUrl: undefined })}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg active:scale-90 transition shadow-md hover:bg-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50 hover:bg-gray-50 transition">
              <Camera size={24} className="mb-2 text-[#007aff]" />
              <span className="text-xs font-bold text-gray-600">
                Auf Foto tippen & auswählen
              </span>
              <span className="text-[10px] text-gray-400 text-center mt-1">
                Hilft als Kopiervorlage beim nächsten Mal
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Pricing Input Section */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.02)] space-y-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
          <Euro size={14} /> Rechnungsbeträge
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
              Ausgemachtes Geld (inkl. Anfahrt)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={activeJob.agreedPrice !== undefined ? activeJob.agreedPrice.toString() : ""}
                onChange={(e) => handleUpdateAgreedPrice(e.target.value)}
                placeholder="z.B. 120.00"
                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 rounded-xl border border-gray-100 text-sm font-semibold focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                €
              </span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
              Wirklich bekommenes Geld (inkl. Trinkgeld)
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={activeJob.receivedPrice !== undefined ? activeJob.receivedPrice.toString() : ""}
                onChange={(e) => handleUpdateReceivedPrice(e.target.value)}
                placeholder="z.B. 130.00"
                className="w-full pl-3 pr-8 py-2.5 bg-gray-50 rounded-xl border border-gray-100 text-sm font-semibold focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                €
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer (Save, Reset/Delete) */}
      <div className="pt-2 grid grid-cols-2 gap-3">
        <button
          onClick={onCancelJob}
          id="btn-cancel-job-rechner"
          className="py-3.5 text-xs font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl text-center shadow-sm active:scale-95 transition-all"
        >
          Auftrag verwerfen
        </button>
        <button
          onClick={handleFinishJob}
          id="btn-complete-job-rechner"
          disabled={activeJob.rooms.length === 0}
          className="py-3.5 text-xs font-bold text-white bg-[#34c759] disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-[#28a745] rounded-xl text-center shadow-[0_4px_12px_rgba(52,199,89,0.2)] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
        >
          <Save size={15} />
          Auftrag abschließen
        </button>
      </div>
    </div>
  );
}
