export interface RoomEntry {
  id: string;
  name: string;
  width: number; // in meters
  height: number; // in meters
  count: number; // count of windows
  costPerSqM: number; // custom or global cost per sqm
}

export interface Job {
  id: string;
  customerId: string;
  date: string; // ISO date string (YYYY-MM-DD)
  status: "concept" | "completed" | "canceled";
  globalCostPerSqM: number; // default is 2.00 €
  rooms: RoomEntry[];
  totalPrice: number;
  travelTime?: number; // travel duration in minutes
  cleaningTime?: number; // cleaning duration in minutes
  imageUrl?: string; // Optional image for the job
}

export interface Customer {
  id: string;
  name: string;
  companyName?: string;
  address: string; // complete address, e.g., "Hauptstraße 4, 80331 München"
  phone: string;
  email: string;
  notes: string;
  locationGroup?: string; // e.g. "Regensburg", "Daheim"
  createdAt: string;
}

// Default standard rooms proposed for a new job
export const STANDARD_ROOMS = [
  "Wohnzimmer",
  "Küche",
  "Elternzimmer",
  "Kinderzimmer",
  "Bad",
  "Gang",
  "Haustür",
];
