import React, { useState, useEffect } from "react";
import { Customer, Job } from "./types";
import { INITIAL_CUSTOMERS, INITIAL_JOBS } from "./initialData";
import CustomerList from "./components/CustomerList";
import CustomerDetail from "./components/CustomerDetail";
import Calculator from "./components/Calculator";
import SettingsBackup from "./components/SettingsBackup";
import Dashboard from "./components/Dashboard";
import {
  Users,
  Calculator as CalcIcon,
  Settings,
  LayoutDashboard,
  Sparkles,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Local storage initialization
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("korbinian_customers");
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("korbinian_jobs");
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [activeJob, setActiveJob] = useState<Job | null>(() => {
    const saved = localStorage.getItem("korbinian_active_job");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "customers" | "calculator" | "settings"
  >("dashboard");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );

  // Sync to local storage
  const saveCustomersToStorage = (updatedList: Customer[]) => {
    setCustomers(updatedList);
    localStorage.setItem("korbinian_customers", JSON.stringify(updatedList));
  };

  const saveJobsToStorage = (updatedList: Job[]) => {
    setJobs(updatedList);
    localStorage.setItem("korbinian_jobs", JSON.stringify(updatedList));
  };

  const saveActiveJobToStorage = (job: Job | null) => {
    setActiveJob(job);
    if (job) {
      localStorage.setItem("korbinian_active_job", JSON.stringify(job));
    } else {
      localStorage.removeItem("korbinian_active_job");
    }
  };

  // State Management Handlers
  const handleAddCustomer = (newCust: Customer) => {
    const updated = [newCust, ...customers];
    saveCustomersToStorage(updated);
  };

  const handleEditCustomer = (updatedCust: Customer) => {
    const updated = customers.map((c) =>
      c.id === updatedCust.id ? updatedCust : c,
    );
    saveCustomersToStorage(updated);
  };

  const handleDeleteCustomer = (id: string) => {
    const updatedCusts = customers.filter((c) => c.id !== id);
    // Keep internal history, or filter out
    const updatedJobs = jobs.filter((j) => j.customerId !== id);
    saveCustomersToStorage(updatedCusts);
    saveJobsToStorage(updatedJobs);
    setSelectedCustomerId(null);
  };

  const handleStartNewJob = (
    customerId: string,
    templateRooms?: Job["rooms"],
  ) => {
    const defaultRooms = templateRooms
      ? templateRooms.map((r) => ({
          ...r,
          id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        }))
      : [];

    const newJob: Job = {
      id: `job-${Date.now()}`,
      customerId,
      date: new Date().toISOString().split("T")[0],
      status: "concept",
      globalCostPerSqM: 2.0,
      rooms: defaultRooms,
      totalPrice: 0,
    };

    // Calculate total price for standard preset
    newJob.totalPrice = newJob.rooms.reduce(
      (sum, r) => sum + r.width * r.height * r.count * r.costPerSqM,
      0,
    );

    saveActiveJobToStorage(newJob);
    setActiveTab("calculator");
  };

  const handleDuplicateJob = (oldJob: Job) => {
    // Generate new room IDs and reset counts or carry over old counts
    const duplicatedRooms = oldJob.rooms.map((room) => ({
      ...room,
      id: `room-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    }));

    const newJob: Job = {
      id: `job-${Date.now()}`,
      customerId: oldJob.customerId,
      date: new Date().toISOString().split("T")[0],
      status: "concept",
      globalCostPerSqM: oldJob.globalCostPerSqM,
      rooms: duplicatedRooms,
      totalPrice: oldJob.totalPrice,
      imageUrl: oldJob.imageUrl,
    };

    saveActiveJobToStorage(newJob);
    setActiveTab("calculator");
  };

  const handleUpdateJob = (updatedJob: Job) => {
    saveActiveJobToStorage(updatedJob);
  };

  const handleSaveJob = (completedJob: Job) => {
    const existingIndex = jobs.findIndex((j) => j.id === completedJob.id);
    let updatedJobs;
    if (existingIndex >= 0) {
      updatedJobs = [...jobs];
      updatedJobs[existingIndex] = completedJob;
    } else {
      updatedJobs = [completedJob, ...jobs];
    }
    saveJobsToStorage(updatedJobs);
    saveActiveJobToStorage(null);
    setSelectedCustomerId(completedJob.customerId);
    setActiveTab("customers");
  };

  const handleEditJob = (job: Job) => {
    saveActiveJobToStorage(job);
    setActiveTab("calculator");
  };

  const handleDeleteJob = (jobId: string) => {
    if (
      confirm("Möchten Sie diese Berechnung wirklich unwiderruflich löschen?")
    ) {
      const updatedJobs = jobs.filter((j) => j.id !== jobId);
      saveJobsToStorage(updatedJobs);
    }
  };

  const handleCancelJob = () => {
    if (
      confirm(
        "Möchten Sie diesen aktuellen Entwurf wirklich verwerfen? Alle eingetragenen Maße gehen verloren.",
      )
    ) {
      saveActiveJobToStorage(null);
    }
  };

  const handleResetToDemo = () => {
    if (
      confirm(
        "Möchten Sie die App auf die bayerischen Muster-Kunden zurücksetzen? Alle Ihre aktuellen Einträge werden überschrieben.",
      )
    ) {
      saveCustomersToStorage(INITIAL_CUSTOMERS);
      saveJobsToStorage(INITIAL_JOBS);
      saveActiveJobToStorage(null);
      setSelectedCustomerId(null);
      setActiveTab("customers");
    }
  };

  const handleImportData = (
    importedCustomers: Customer[],
    importedJobs: Job[],
  ) => {
    saveCustomersToStorage(importedCustomers);
    saveJobsToStorage(importedJobs);
    saveActiveJobToStorage(null);
    setSelectedCustomerId(null);
    setActiveTab("customers");
  };

  const handleClearAllData = () => {
    saveCustomersToStorage([]);
    saveJobsToStorage([]);
    saveActiveJobToStorage(null);
    setSelectedCustomerId(null);
    setActiveTab("customers");
  };

  const getActiveCustomerName = () => {
    if (!activeJob) return "";
    const cust = customers.find((c) => c.id === activeJob.customerId);
    return cust ? cust.name : "Direkt-Kalkulator";
  };

  return (
    <div className="min-h-screen bg-[#f2f2f7] text-gray-800 font-sans flex flex-col antialiased">
      {/* iOS App Shell / Native Header */}
      <header
        className="bg-white/90 backdrop-blur-md border-b border-gray-100/80 sticky top-0 z-40 px-5 py-4 shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
        id="pwa-navigation-header"
      >
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#007aff] text-white rounded-xl ios-shadow">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-md font-extrabold text-gray-900 tracking-tight leading-none">
                Glasreinigung
              </h1>
              <p className="text-[11px] text-gray-500 font-bold tracking-wider uppercase">
                Korbinian
              </p>
            </div>
          </div>

          <AnimatePresence>
            {activeJob && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => {
                  setActiveTab("calculator");
                  setSelectedCustomerId(null);
                }}
                id="header-indicator-active-job"
                className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-850 text-xs font-bold px-3 py-1.5 rounded-full shadow-inner cursor-pointer"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="truncate max-w-[100px]">
                  {getActiveCustomerName()}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Screen Container */}
      <main className="flex-1 overflow-y-auto px-4 py-4 w-full max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Dashboard
                jobs={jobs}
                customers={customers}
                onEditJob={handleEditJob}
              />
            </motion.div>
          )}

          {activeTab === "customers" && (
            <motion.div
              key="tab-customers"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              {selectedCustomerId ? (
                (() => {
                  const customerObj = customers.find(
                    (c) => c.id === selectedCustomerId,
                  );
                  if (!customerObj) return null;
                  return (
                    <CustomerDetail
                      customer={customerObj}
                      jobs={jobs}
                      onBack={() => setSelectedCustomerId(null)}
                      onEditCustomer={handleEditCustomer}
                      onDeleteCustomer={handleDeleteCustomer}
                      onStartJob={handleStartNewJob}
                      onDuplicateJob={handleDuplicateJob}
                      onEditJob={handleEditJob}
                    />
                  );
                })()
              ) : (
                <CustomerList
                  customers={customers}
                  onSelectCustomer={(id) => setSelectedCustomerId(id)}
                  onAddCustomer={handleAddCustomer}
                />
              )}
            </motion.div>
          )}

          {activeTab === "calculator" && (
            <motion.div
              key="tab-calculator"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <Calculator
                customers={customers}
                activeJob={activeJob}
                onUpdateJob={handleUpdateJob}
                onSaveJob={handleSaveJob}
                onCancelJob={handleCancelJob}
                onSelectTab={setActiveTab}
                jobs={jobs}
                onDeleteJob={handleDeleteJob}
              />
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="tab-settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
            >
              <SettingsBackup
                customers={customers}
                jobs={jobs}
                onResetToDemo={handleResetToDemo}
                onImportData={handleImportData}
                onClearAllData={handleClearAllData}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* iOS App Shell / Native Tab Navigation */}
      <nav
        id="pwa-bottom-tab-navigation"
        className="bg-white/95 backdrop-blur-md border-t border-gray-100/85 px-3 py-3 shrink-0 pb-safe shadow-[0_-4px_14px_rgba(0,0,0,0.03)] sticky bottom-0 z-40"
      >
        <div className="max-w-xl mx-auto flex justify-around">
          {/* Dashboard Tab Button */}
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setSelectedCustomerId(null);
            }}
            id="tab-btn-dashboard"
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
              activeTab === "dashboard"
                ? "text-[#007aff]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <LayoutDashboard
              size={20}
              className={
                activeTab === "dashboard" ? "stroke-[2.5px]" : "stroke-2"
              }
            />
            <span className="text-[10px] font-bold tracking-wider">Übersicht</span>
          </button>

          {/* Customers Tab Button */}
          <button
            onClick={() => {
              setActiveTab("customers");
              setSelectedCustomerId(null);
            }}
            id="tab-btn-customers"
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
              activeTab === "customers"
                ? "text-[#007aff]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Users
              size={20}
              className={
                activeTab === "customers" ? "stroke-[2.5px]" : "stroke-2"
              }
            />
            <span className="text-[10px] font-bold tracking-wider">Kunden</span>
          </button>

          {/* Calculator Tab Button */}
          <button
            onClick={() => {
              setActiveTab("calculator");
              setSelectedCustomerId(null);
            }}
            id="tab-btn-calculator"
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all relative ${
              activeTab === "calculator"
                ? "text-[#007aff]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <CalcIcon
              size={20}
              className={
                activeTab === "calculator" ? "stroke-[2.5px]" : "stroke-2"
              }
            />
            <span className="text-[10px] font-bold tracking-wider">
              Rechner
            </span>
            {activeJob && (
              <span className="absolute top-1.5 right-4 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            )}
          </button>

          {/* Settings Tab Button */}
          <button
            onClick={() => {
              setActiveTab("settings");
              setSelectedCustomerId(null);
            }}
            id="tab-btn-settings"
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${
              activeTab === "settings"
                ? "text-[#007aff]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Settings
              size={20}
              className={
                activeTab === "settings" ? "stroke-[2.5px]" : "stroke-2"
              }
            />
            <span className="text-[10px] font-bold tracking-wider font-semibold">
              Einstellungen
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
