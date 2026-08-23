# MediSmart Backend Server (Node.js & Next.js API Backup)

This directory contains the standalone **Node.js / Express backend server** and **Next.js App Router route templates** for the Smart Medication Adherence System.

---

## 🌟 Capabilities

1. **IoT Smart Pillbox Hardware Integration**:
   - Webhook endpoint (`POST /api/telemetry/lid-event`) for microcontrollers (ESP32, Nordic nRF52, Arduino) to report compartment lid opening/closing and battery telemetry.
   - Automatically matches sensor events with scheduled doses and marks them as taken in Supabase.
2. **Automated Missed Dose Escalation Cron**:
   - `adherenceScheduler.js` checks every 5 minutes for pending doses that exceeded the 30-minute grace window without pillbox lid activity.
   - Auto-generates `caregiver_alerts` and escalates to primary emergency contacts.
3. **Supabase Admin Service Role Client**:
   - Secure server-side access for clinical report generation, multi-patient doctor associations, and automated database maintenance.

---

## 🚀 How to Run the Node.js Server

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` based on `.env.example`:
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

---

## 📡 IoT Microcontroller Webhook Payload Spec

To simulate a smart pillbox lid opening, microcontrollers send:

```http
POST http://localhost:5000/api/telemetry/lid-event
Content-Type: application/json

{
  "deviceId": "BOX-MED-8492",
  "compartment": "Morning",
  "action": "open",
  "battery": 92
}
```

### Response from Server:
```json
{
  "success": true,
  "event": "DOSE_CONFIRMED",
  "medName": "Amlodipine",
  "dosage": "5mg",
  "ledCommand": "TURN_OFF_LED",
  "buzzerCommand": "PLAY_SUCCESS_CHIME"
}
```

---

## ⚡ Next.js App Router Templates

If migrating to Next.js, copy the files from `server/nextjs-api-templates/app/api/` into your Next.js project `src/app/api/` folder.
