import React, { useState } from "react";
import { Customer } from "../types";
import {
  Search,
  ChevronRight,
  PlusCircle,
  UserPlus,
  MapPin,
  Phone,
  Folder,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (id: string) => void;
  onAddCustomer: (newCust: Customer) => void;
}

export default function CustomerList({
  customers,
  onSelectCustomer,
  onAddCustomer,
}: CustomerListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // New Customer Form State
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [locationGroup, setLocationGroup] = useState("Daheim"); // Default to Daheim
  const [requiresLadder, setRequiresLadder] = useState(false);
  const [requiresInvoice, setRequiresInvoice] = useState(false);

  const filteredCustomers = customers.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      (c.companyName?.toLowerCase() || "").includes(search) ||
      c.address.toLowerCase().includes(search) ||
      (c.locationGroup?.toLowerCase() || "").includes(search)
    );
  });

  // Group customers dynamically
  const groupedCustomers = filteredCustomers.reduce(
    (acc, customer) => {
      const groupName = customer.locationGroup || "Ohne Zuordnung";
      if (!acc[groupName]) {
        acc[groupName] = [];
      }
      acc[groupName].push(customer);
      return acc;
    },
    {} as Record<string, Customer[]>,
  );

  // Sorting groups: 'Daheim', 'Regensburg', then others alphabetically
  const sortedGroupNames = Object.keys(groupedCustomers).sort((a, b) => {
    if (a === "Daheim") return -1;
    if (b === "Daheim") return 1;
    if (a === "Regensburg") return -1;
    if (b === "Regensburg") return 1;
    return a.localeCompare(b);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    const newCustomer: Customer = {
      id: `cust-${Date.now()}`,
      name: name.trim(),
      companyName: companyName.trim() || undefined,
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      notes: notes.trim(),
      locationGroup: locationGroup.trim() || "Ohne Zuordnung",
      createdAt: new Date().toISOString(),
      requiresLadder,
      requiresInvoice,
    };

    onAddCustomer(newCustomer);
    setIsAdding(false);

    // Reset Form
    setName("");
    setCompanyName("");
    setAddress("");
    setPhone("");
    setEmail("");
    setNotes("");
    setLocationGroup("Daheim");
    setRequiresLadder(false);
    setRequiresInvoice(false);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Top Search bar & Add Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            size={17}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Name, Firma oder Adresse suchen..."
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl text-sm border border-gray-150/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 transition"
          />
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          id="btn-toggle-add-customer"
          className={`flex items-center gap-1.5 px-4 rounded-xl text-sm font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all active:scale-95 ${
            isAdding
              ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
              : "bg-[#007aff] text-white hover:bg-[#0062cc]"
          }`}
        >
          {isAdding ? (
            "Abbrechen"
          ) : (
            <>
              <UserPlus size={16} />{" "}
              <span className="hidden xs:inline">Neu</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_4px_18px_rgba(0,0,0,0.04)] space-y-4 overflow-hidden"
            id="new-customer-form"
          >
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-50 pb-2">
              Neuen Kunden registrieren
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Kundenname (Vor- & Nachname) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Johann Oberhuber"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30"
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
                  placeholder="z.B. Cafe Oberhuber"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Adresse (Strasse Hausnr, PLZ Ort) *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="z.B. Ludwigstraße 12, 83646 Bad Tölz"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                  <Folder size={12} /> Gruppe / Region
                </label>
                <input
                  type="text"
                  value={locationGroup}
                  onChange={(e) => setLocationGroup(e.target.value)}
                  placeholder="z.B. Regensburg, Daheim"
                  list="group-presets"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30"
                />
                <datalist id="group-presets">
                  <option value="Daheim" />
                  <option value="Regensburg" />
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 170 1234567"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30"
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
                  placeholder="name@mail.de"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-1">
                Internes (z.B. Sprossen, Leiter nötig...)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="z.B. Leiter für 1. OG nötig. Nur Barzahlung. Katze darf nicht ausbrechen."
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#007aff] focus:ring-1 focus:ring-[#007aff]/30 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={requiresLadder}
                  onChange={(e) => setRequiresLadder(e.target.checked)}
                  className="w-4 h-4 text-[#007aff] border-gray-300 rounded focus:ring-[#007aff]"
                />
                Leiter benötigt
              </label>
              <label className="flex items-center gap-2 text-[13px] font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={requiresInvoice}
                  onChange={(e) => setRequiresInvoice(e.target.checked)}
                  className="w-4 h-4 text-[#007aff] border-gray-300 rounded focus:ring-[#007aff]"
                />
                Rechnung erforderlich
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2.5 text-sm font-semibold text-gray-500 bg-gray-150 hover:bg-gray-200 rounded-xl transition"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                id="btn-submit-new-customer"
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-[#007aff] hover:bg-[#0062cc] rounded-xl transition shadow-sm"
              >
                Kunden anlegen
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Customers List Section */}
      <div className="space-y-6" id="customers-list-item-container">
        {sortedGroupNames.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center text-gray-400 ios-shadow">
            {searchTerm
              ? "Keine Kunden zu diesem Suchbegriff gefunden."
              : "Noch keine Kunden angelegt."}
          </div>
        ) : (
          sortedGroupNames.map((group) => (
            <div key={group} className="space-y-2.5">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider pl-2 border-b border-gray-100 pb-1">
                {group}
              </h4>
              <div className="space-y-2.5">
                {groupedCustomers[group].map((customer) => (
                  <div
                    key={customer.id}
                    onClick={() => onSelectCustomer(customer.id)}
                    id={`customer-item-${customer.id}`}
                    className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-blue-100/60 shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center justify-between cursor-pointer active:bg-gray-50/70 transition-all"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-gray-900 text-[15px]">
                          {customer.name}
                        </span>
                        {customer.companyName && (
                          <span className="text-[10px] bg-[#007aff]/10 text-[#007aff] font-bold px-2 py-0.5 rounded-full">
                            {customer.companyName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate max-w-[240px]">
                          {customer.address}
                        </span>
                      </div>

                      {customer.phone && (
                        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-500 font-medium">
                          <Phone
                            size={12}
                            className="shrink-0 text-emerald-500"
                          />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-gray-300">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
