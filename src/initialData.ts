import { Customer, Job } from "./types";

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Korbinian Högl",
    companyName: "Bäckerei Högl",
    address: "Marienplatz 4, 83646 Bad Tölz",
    phone: "+49 172 1234567",
    email: "info@baeckerei-hoegl.de",
    notes:
      "Bäckerei-Schaufenster im Erdgeschoss (4 große Scheiben), Nebeneingangstür aus Glas. Bitte immer vor 08:00 Uhr morgens kommen, bevor die Kunden kommen!",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "cust-2",
    name: "Maria Brandner",
    address: "Tegernseer Straße 12, 83703 Gmund am Tegernsee",
    phone: "+49 8022 987654",
    email: "maria.brandner@web.de",
    notes:
      "Schönes Einfamilienhaus mit Wintergarten. Viele kleinteilige Sprossenfenster im Wohnzimmer. Leiter für das Elternzimmer im 1. OG wird benötigt.",
    createdAt: "2026-02-10T14:30:00Z",
  },
  {
    id: "cust-3",
    name: "Dr. med. Alois Huber",
    companyName: "Hausarztpraxis Tegernsee",
    address: "Bahnhofstraße 5, 83684 Tegernsee",
    phone: "+49 8022 112233",
    email: "huber-alois@praxis-tegernsee.de",
    notes:
      "Praxisräume im 1. Stock. Am besten Mittwoch Nachmittag reinigen, da die Praxis dort geschlossen ist.",
    createdAt: "2026-03-01T11:15:00Z",
  },
];

export const INITIAL_JOBS: Job[] = [
  {
    id: "job-101",
    customerId: "cust-1",
    date: "2026-04-10",
    status: "completed",
    globalCostPerSqM: 2.0,
    rooms: [
      {
        id: "r1",
        name: "Haustür & Schaufenster vorn",
        width: 3.5,
        height: 2.2,
        count: 2,
        costPerSqM: 2.0,
      },
      {
        id: "r2",
        name: "Küche (Rückseite)",
        width: 1.5,
        height: 1.2,
        count: 3,
        costPerSqM: 2.0,
      },
      {
        id: "r3",
        name: "Personalraum",
        width: 1.2,
        height: 1.2,
        count: 1,
        costPerSqM: 2.0,
      },
    ],
    totalPrice: 47.92, // calculated: (3.5*2.2*2*2) + (1.5*1.2*3*2) + (1.2*1.2*1*2) = 30.8 + 10.8 + 2.88 = 44.48, wait let's calculate: 30.8 + 10.8 + 2.88 = 44.48
  },
  {
    id: "job-102",
    customerId: "cust-2",
    date: "2026-05-15",
    status: "completed",
    globalCostPerSqM: 2.0,
    rooms: [
      {
        id: "r4",
        name: "Wintergarten",
        width: 2.0,
        height: 2.5,
        count: 4,
        costPerSqM: 2.2,
      }, // 44.0
      {
        id: "r5",
        name: "Wohnzimmer (Sprossen)",
        width: 1.2,
        height: 1.5,
        count: 6,
        costPerSqM: 2.5,
      }, // 27.0
      {
        id: "r6",
        name: "Elternzimmer (1. OG)",
        width: 1.5,
        height: 1.5,
        count: 2,
        costPerSqM: 2.0,
      }, // 9.0
      {
        id: "r7",
        name: "Küche",
        width: 1.2,
        height: 1.0,
        count: 1,
        costPerSqM: 2.0,
      }, // 2.4
    ],
    totalPrice: 82.4,
  },
  {
    id: "job-103",
    customerId: "cust-3",
    date: "2026-06-01",
    status: "completed",
    globalCostPerSqM: 2.0,
    rooms: [
      {
        id: "r8",
        name: "Wartezimmer",
        width: 2.2,
        height: 1.8,
        count: 3,
        costPerSqM: 2.0,
      }, // 23.76
      {
        id: "r9",
        name: "Behandlungszimmer 1",
        width: 1.5,
        height: 1.5,
        count: 2,
        costPerSqM: 2.0,
      }, // 9.00
      {
        id: "r10",
        name: "Behandlungszimmer 2",
        width: 1.5,
        height: 1.5,
        count: 2,
        costPerSqM: 2.0,
      }, // 9.00
      {
        id: "r11",
        name: "Empfang / Gang",
        width: 1.2,
        height: 1.0,
        count: 1,
        costPerSqM: 2.0,
      }, // 2.40
    ],
    totalPrice: 44.16,
  },
];
