# Umsetzungsplan: Glasreinigung Korbinian - Kalkulator & Kundenkartei

Dieser Umsetzungsplan beschreibt die Entwicklung der mobilen Web-App für das Fensterreinigungs-Unternehmen **Glasreinigung Korbinian**. Die App ist für die mobile Nutzung auf dem iPhone optimiert und dient als Ersatz für die Numbers-Tabelle.

---

## 1. Architektur- & Datenmodell (TypeScript)

Die Daten werden offline-first im Client gespeichert (`localStorage`) und können über eine eingebaute Export-/Import-Funktion gesichert werden. Dies ist ideal, da Fensterreiniger oft in Gebieten oder Gebäuden mit schlechtem Empfang arbeiten.

### Datenklassen in `/src/types.ts`:

- **Kunde (Customer):**
  - `id`: string (UUID)
  - `name`: string (Vorname, Nachname / Firma)
  - `address`: string (Strasse, Hausnummer, PLZ, Ort)
  - `phone`: string
  - `email`: string
  - `notes`: string (Spezielle Hinweise wie "Leiter mitbringen", "Katze im Garten")
  - `createdAt`: string

- **Auftrag (Job):**
  - `id`: string
  - `customerId`: string (Verknüpfung zum Kunden)
  - `date`: string (Besuchsdatum)
  - `status`: 'concept' | 'completed' | 'canceled'
  - `globalCostPerSqM`: number (Standard: 2.00 €)
  - `rooms`: RaumEintrag[] (Die kalkulierten Räume des Auftrags)
  - `totalPrice`: number

- **RaumEintrag (RoomEntry):**
  - `id`: string
  - `name`: string (z.B. "Wohnzimmer", "Küche")
  - `width`: number (Breite in Metern)
  - `height`: number (Höhe in Metern)
  - `count`: number (Anzahl Scheiben/Fenster)
  - `costPerSqM`: number (Kosten pro qm für diesen spezifischen Raum)

---

## 2. Benutzeroberfläche & iOS-Look (Tailwind CSS)

Die Schnittstelle wird im minimalistischen, eleganten **iOS-Systemlook (Apple Design Guidelines)** gestaltet:
- **Vibrationen & Feedback:** Intuitive Animationen mit `motion/react` für weiche Übergänge.
- **Header:** Fixierter oberer Balken mit dem Firmennamen und schnellen Status-Anzeigen.
- **Navigation:** Tab-Bar am unteren Bildschirmrand:
  1. 👤 **Kunden** (Kundenliste mit Suchfunktion, Details, Historie, Google Maps Verlinkung)
  2. 🧮 **Rechner (Aktiver Auftrag)** (Die Kalkulations-Fläche mit iOS-optimierten Raum-Karten)
  3. ⚙️ **Einstellungen & Backup** (Export/Import der gesamten Daten als JSON)

---

## 3. UI-Komponenten (Modulare Struktur)

Um die Übersichtlichkeit zu bewahren, spalten wir die Anwendung in mehrere Komponenten auf:

1. `/src/types.ts`: Zentrale Datenmodelle und Schnittstellen.
2. `/src/components/CustomerList.tsx`: Suche, schnelles Filtern und Neuanlage von Kunden.
3. `/src/components/CustomerDetail.tsx`: Anzeige der Kundendaten, Google-Maps-Button, Historie vergangener Aufträge und Option zum Duplizieren eines alten Auftrags.
4. `/src/components/Calculator.tsx`: Die aktive Kalkulationsfläche mit iOS-Raumkarten.
5. `/src/components/RoomCard.tsx`: Die fingerfreundliche Karte für jeden Raum. Bei Klick öffnet sich das Inline-Eingabefeld oder ein iOS-Modal für exakte Eingaben ohne Excel-Gefummel.
6. `/src/components/SettingsBackup.tsx`: Verwaltung der Datenpflege (Demo-Daten laden, JSON exportieren, JSON importieren).

---

## 4. Berechnungs- & Nutzugslogiken

- **Echtzeit-Berechnung:** Jede Änderung an Breite, Höhe oder Anzahl berechnet sofort `Breite * Höhe * Anzahl * Kosten_pro_qm` und aktualisiert den Echtzeit-Endpreis.
- **Räume löschen & editieren:** Ein einfacher Klick auf "Löschen" entfernt den Raum aus dem aktiven Auftrag. Ein "Anzahl auf 0"-Button setzt das Fensterlimit auf Null, falls der Kunde das Fenster an dem Tag überspringen will.
- **Duplizier-Funktion:** Aus der Historie eines Kunden kann ein beliebiger alter Auftrag dupliziert werden. Dadurch wird ein neuer Auftrag im Kalender-Modus erstellt, der mit genau denselben Raumdaten vorbefüllt ist – ideal, wenn sich im Vergleich zum Vorjahr nichts geändert hat!
