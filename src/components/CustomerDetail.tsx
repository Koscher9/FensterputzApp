import React, { useState } from "react";
import { Customer, Job } from "../types";
import {
  Phone,
  Mail,
  MapPin,
  ClipboardList,
  Copy,
  Trash2,
  Edit2,
  Check,
  ArrowLeft,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const formatDuration = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h} Std. ${m} Min.` : `${m} Min.`;
};

interface CustomerDetailProps {
  customer: Customer;
  jobs: Job[];
  onBack: () => void;
  onEditCustomer: (updated: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onStartJob: (customerId: string, templateRooms?: Job["rooms"]) => void;
  onDuplicateJob: (job: Job) => void;
}

export default function CustomerDetail({
  customer,
  jobs,
  onBack,
  onEditCustomer,
  onDeleteCustomer,
  onStartJob,
  onDuplicateJob,
}: CustomerDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(customer.name);
  const [companyName, setCompanyName] = useState(customer.companyName || "");
  const [address, setAddress] = useState(customer.address);
  const [phone, setPhone] = useState(customer.phone);
  const [email, setEmail] = useState(customer.email);
  const [notes, setNotes] = useState(customer.notes);

  const [confirmDelete, setConfirmDelete] = useState(false);

  // Get customer's jobs (sorted by date descending)
  const customerJobs = jobs
    .filter((j) => j.customerId === customer.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const totalEarned = customerJobs
    .filter((j) => j.status === "completed")
    .reduce((sum, j) => sum + j.totalPrice, 0);

  const handleSave = () => {
    onEditCustomer({
      ...customer,
      name,
      companyName: companyName.trim() || undefined,
      address,
      phone,
      email,
      notes,
    });
    setIsEditing(false);
  };

  const getGoogleMapsUrl = (addr: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          id="btn-customer-back"
          className="flex items-center gap-1.5 text-[#007aff] font-semibold py-2 text-[15px] focus:outline-none"
        >
          <ArrowLeft size={18} />
          Zurück
        </button>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                id="btn-edit-customer"
                className="p-2 text-gray-500 hover:text-[#007aff] bg-gray-100 rounded-full transition-colors"
                title="Kunde bearbeiten"
              >
                <Edit2 size={16} />
              </button>
              {confirmDelete ? (
                <button
                  onClick={() => onDeleteCustomer(customer.id)}
                  id="btn-confirm-delete-customer"
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
                >
                  Sicher?
                </button>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  id="btn-delete-customer"
                  className="p-2 text-gray-500 hover:text-red-600 bg-gray-100 rounded-full transition-colors"
                  title="Kunde löschen"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleSave}
              id="btn-save-customer"
              className="flex items-center gap-1 px-3.5 py-1.5 bg-[#007aff] text-white rounded-full text-xs font-semibold hover:bg-[#0062cc] transition"
            >
              <Check size={14} />
              Speichern
            </button>
          )}
        </div>
      </div>

      {/* Customer profile card (edit/view) */}
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="view-profile"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-2xl p-5 shadow-[0_4px_14px_rgba(0,0,0,0.03)] border border-gray-100"
            id="customer-profile-card"
          >
            <div>
              {customer.companyName && (
                <span className="inline-block text-[11px] font-bold text-[#007aff] tracking-wide uppercase mb-1 bg-[#007aff]/10 px-2.5 py-0.5 rounded-full">
                  {customer.companyName}
                </span>
              )}
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {customer.name}
              </h2>
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 gap-3 mt-4 py-3 border-y border-gray-100 text-center">
              <div>
                <span className="block text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                  Einsätze
                </span>
                <span className="text-lg font-bold text-gray-800 leading-none">
                  {customerJobs.length}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                  Umsatz gesamt
                </span>
                <span className="text-lg font-bold text-green-600 leading-none">
                  {totalEarned.toLocaleString("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
            </div>

            {/* Actions List */}
            <div className="mt-5 space-y-4">
              {/* Address with Map Link */}
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#007aff]/10 text-[#007aff] rounded-xl mt-0.5">
                  <MapPin size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    Adresse
                  </span>
                  <p className="text-[14px] text-gray-750 font-medium leading-normal break-words">
                    {customer.address}
                  </p>
                  <a
                    href={getGoogleMapsUrl(customer.address)}
                    target="_blank"
                    referrerPolicy="no-referrer"
                    id="btn-google-maps"
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-[#007aff] hover:underline mt-1"
                  >
                    In Google Maps öffnen
                  </a>
                </div>
              </div>

              {/* Phone */}
              {customer.phone && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl mt-0.5">
                    <Phone size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                      Telefon
                    </span>
                    <a
                      href={`tel:${customer.phone.replace(/\s+/g, "")}`}
                      id="link-customer-phone"
                      className="block text-[14px] text-gray-800 font-semibold hover:underline"
                    >
                      {customer.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Email */}
              {customer.email && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl mt-0.5">
                    <Mail size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                      E-Mail
                    </span>
                    <a
                      href={`mailto:${customer.email}`}
                      id="link-customer-email"
                      className="block text-[14px] text-[#007aff] hover:underline font-semibold overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {customer.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Notes */}
              {customer.notes && (
                <div className="flex items-start gap-3 pt-3 border-t border-gray-100">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl mt-0.5">
                    <ClipboardList size={16} />
                  </div>
                  <div className="flex-1">
                    <span className="block text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                      Wichtige Notizen
                    </span>
                    <p className="text-[13px] text-gray-600 mt-0.5 italic leading-relaxed whitespace-pre-line bg-amber-50/40 p-2.5 rounded-xl border border-amber-100">
                      {customer.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Primary CTA: Start Job */}
            <div className="mt-6 pt-2">
              <button
                onClick={() => onStartJob(customer.id)}
                id="btn-start-new-job"
                className="w-full flex items-center justify-center gap-1.5 bg-[#007aff] hover:bg-[#0062cc] text-white font-semibold py-3 px-4 rounded-xl text-[15px] shadow-sm active:scale-[0.98] transition-all"
              >
                <Plus size={18} />
                Neuen Auftrag starten
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="edit-profile"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-2xl p-5 shadow-[0_4px_14px_rgba(0,0,0,0.03)] border border-gray-100 space-y-4"
            id="customer-edit-form"
          >
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
              Kopfdaten bearbeiten
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Kundenname *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z.B. Maria Brandner"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Firmenname (optional)
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="z.B. Bäckerei Högl"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Adresse *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Strasse Hausnr, PLZ Ort"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="z.B. +49 171 123456"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  E-Mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@anbieter.de"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Wichtige Notizen / Infos
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Besondere Wünsche, Sprossenfenster vorhanden, Leiter nötig, etc..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition resize-none"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 text-sm font-semibold text-gray-500 bg-gray-100 rounded-xl"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 py-3 text-sm font-semibold text-white bg-[#007aff] rounded-xl shadow-sm hover:bg-[#0062cc] transition"
              >
                Änderungen sichern
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History of jobs */}
      <div className="space-y-3 mt-4" id="customer-job-history-container">
        <h3 className="text-md font-bold text-gray-800 tracking-tight flex items-center gap-1.5 pl-1">
          <ClipboardList size={18} className="text-gray-400" />
          Auftragshistorie ({customerJobs.length})
        </h3>

        {customerJobs.length === 0 ? (
          <div className="bg-gray-50/70 border border-dashed border-gray-200 rounded-2xl p-6 text-center text-gray-400 text-xs">
            Noch keine vergangenen Aufträge eingetragen. Starten Sie einen neuen
            Auftrag, um Daten aufzuzeichnen.
          </div>
        ) : (
          <div className="space-y-3">
            {customerJobs.map((job) => {
              const formattedDate = new Date(job.date).toLocaleDateString(
                "de-DE",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              );

              const totalWindows = job.rooms.reduce(
                (sum, r) => sum + r.count,
                0,
              );

              return (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[13px] font-bold text-gray-800">
                        {formattedDate}
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="inline-block text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {job.rooms.length} Räume
                        </span>
                        <span className="inline-block text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {totalWindows} Scheiben
                        </span>
                        {job.travelTime ? (
                          <span
                            className="inline-block text-[10px] font-semibold text-[#007aff] bg-blue-50 px-2 py-0.5 rounded-full"
                            title="Anfahrtszeit"
                          >
                            🚗 Anfahrt: {formatDuration(job.travelTime)}
                          </span>
                        ) : null}
                        {job.cleaningTime ? (
                          <span
                            className="inline-block text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"
                            title="Reinigungszeit"
                          >
                            🧼 Putzen: {formatDuration(job.cleaningTime)}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="block text-md font-bold text-gray-950">
                        {job.totalPrice.toLocaleString("de-DE", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </span>
                      <span className="inline-block text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mt-0.5">
                        Erledigt
                      </span>
                    </div>
                  </div>

                  {/* Summary of rooms */}
                  <div className="mt-3 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Räume & Maße:
                    </p>
                    <ul className="text-[11.5px] text-gray-650 divide-y divide-gray-150/50 max-h-24 overflow-y-auto">
                      {job.rooms.map((room) => (
                        <li key={room.id} className="py-1 flex justify-between">
                          <span className="font-semibold truncate max-w-[160px] text-gray-750">
                            {room.name}
                          </span>
                          <span className="font-mono text-gray-400">
                            {room.count}x ({room.width}×{room.height}m) à{" "}
                            {room.costPerSqM.toFixed(2)}€
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {job.imageUrl && (
                    <div className="mt-3 border border-gray-150 rounded-xl overflow-hidden bg-gray-50">
                      <img
                        src={job.imageUrl}
                        alt="Auftragsfoto"
                        className="w-full h-auto object-contain max-h-[160px]"
                      />
                    </div>
                  )}

                  {/* Use as template button */}
                  <div className="mt-3 pt-2.5 border-t border-gray-100 flex">
                    <button
                      onClick={() => onDuplicateJob(job)}
                      id={`btn-duplicate-job-${job.id}`}
                      className="w-full flex items-center justify-center gap-1.5 bg-[#007aff]/10 hover:bg-[#007aff]/20 text-[#007aff] font-bold py-2 rounded-xl text-[12.5px] transition-colors"
                    >
                      <Copy size={14} />
                      Als Vorlage für neuen Besuch nutzen
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
