import React, { useEffect, useMemo, useState } from "react";
import "../MatoshriGruhaSeva/MatoshriGruhaSeva.css";

const BOOKINGS_KEY = "matoshriBookings";
const WORKERS_KEY = "matoshriWorkers";
const COMMISSIONS_KEY = "matoshriCommissions";
const SERVICES = ["घर साफसफाई", "स्वयंपाक", "भांडी व कपडे", "पूर्णवेळ घरकाम", "एकापेक्षा जास्त कामे"];

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function escapeCsv(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState(() => readStorage(BOOKINGS_KEY, []));
  const [workers, setWorkers] = useState(() => readStorage(WORKERS_KEY, []));
  const [commissions, setCommissions] = useState(() => readStorage(COMMISSIONS_KEY, {}));
  const [authenticated, setAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [worker, setWorker] = useState({ name: "", phone: "", skill: SERVICES[0] });
  const [commission, setCommission] = useState({ bookingId: "", amount: "", value: "" });
  const [notice, setNotice] = useState("");

  useEffect(() => localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings)), [bookings]);
  useEffect(() => localStorage.setItem(WORKERS_KEY, JSON.stringify(workers)), [workers]);
  useEffect(() => localStorage.setItem(COMMISSIONS_KEY, JSON.stringify(commissions)), [commissions]);

  const pending = useMemo(() => bookings.filter((b) => ["नवीन", "स्वीकारले"].includes(b.status)).length, [bookings]);
  const totalCommission = useMemo(
    () => Object.values(commissions).reduce((sum, entry) => sum + (Number(entry.commission) || 0), 0),
    [commissions]
  );

  const login = (event) => {
    event.preventDefault();
    if (adminCode === "1234") {
      setAuthenticated(true);
      setNotice("");
    } else {
      setNotice("डेमो कोड चुकीचा आहे. 1234 वापरून पाहा.");
    }
  };

  const addWorker = (event) => {
    event.preventDefault();
    setWorkers((current) => [...current, { id: Date.now(), ...worker, name: worker.name.trim(), phone: worker.phone.trim() }]);
    setWorker({ name: "", phone: "", skill: SERVICES[0] });
    setNotice("कामगार नोंदवला गेला.");
  };

  const saveCommission = (event) => {
    event.preventDefault();
    const { bookingId, amount, value } = commission;
    if (!bookingId) { setNotice("आधी बुकिंग निवडा."); return; }
    if (Number(value) > Number(amount)) { setNotice("कमिशन कामाच्या रकमेपेक्षा जास्त असू शकत नाही."); return; }
    setCommissions((current) => ({ ...current, [bookingId]: { amount: Number(amount), commission: Number(value) } }));
    setCommission({ bookingId: "", amount: "", value: "" });
    setNotice("डेमो हिशोब जतन केला.");
  };

  const pickBooking = (booking) => {
    const saved = commissions[booking.id] || {};
    setCommission({ bookingId: String(booking.id), amount: saved.amount ?? "", value: saved.commission ?? "" });
    document.getElementById("mg-commission-card")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const exportCsv = () => {
    const rows = [
      ["ग्राहक", "मोबाईल", "पत्ता", "सेवा", "तारीख", "वेळ", "स्थिती", "कामाची रक्कम", "कमिशन"],
      ...bookings.map((b) => [b.name, b.phone, b.address, b.service, b.date, b.time, b.status, commissions[b.id]?.amount || 0, commissions[b.id]?.commission || 0]),
    ];
    const csv = "\uFEFF" + rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "matoshri-gruhseva-bookings.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <section className="mg-card mg-login">
        <h2>ॲडमिन लॉगिन</h2>
        <p className="mg-muted">डेमो डॅशबोर्ड उघडण्यासाठी नमुना कोड वापरा.</p>
        <form onSubmit={login}>
          <label htmlFor="mg-admin-code">डेमो प्रवेश कोड</label>
          <input id="mg-admin-code" type="password" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} placeholder="डेमो कोड" required />
          <button className="mg-submit" type="submit">डॅशबोर्ड उघडा</button>
        </form>
        <p className="mg-small">डेमो कोड: 1234. हा सुरक्षित उत्पादन-स्तरीय लॉगिन नाही.</p>
        {notice && <div className="mg-notice" role="alert">{notice}</div>}
      </section>
    );
  }

  return (
    <section className="mg-admin">
      <div className="mg-row mg-admin-heading">
        <div><h2>ॲडमिन डॅशबोर्ड</h2><p className="mg-muted">बुकिंग, कामगार आणि कमिशन व्यवस्थापन</p></div>
        <button className="mg-secondary" onClick={() => { setAuthenticated(false); setAdminCode(""); }}>लॉगआउट</button>
      </div>

      <div className="mg-stats">
        <div className="mg-stat"><span>एकूण बुकिंग</span><strong>{bookings.length}</strong></div>
        <div className="mg-stat"><span>प्रलंबित बुकिंग</span><strong>{pending}</strong></div>
        <div className="mg-stat"><span>कामगार</span><strong>{workers.length}</strong></div>
        <div className="mg-stat"><span>कमिशन एकूण</span><strong>₹{totalCommission}</strong></div>
      </div>

      <div className="mg-grid">
        <div className="mg-card">
          <h3>कामगार नोंदणी</h3>
          <form onSubmit={addWorker}>
            <label htmlFor="mg-worker-name">कामगाराचे नाव *</label>
            <input id="mg-worker-name" value={worker.name} onChange={(e) => setWorker({ ...worker, name: e.target.value })} required placeholder="पूर्ण नाव" />
            <label htmlFor="mg-worker-phone">मोबाईल नंबर</label>
            <input id="mg-worker-phone" value={worker.phone} onChange={(e) => setWorker({ ...worker, phone: e.target.value })} inputMode="tel" placeholder="मोबाईल नंबर" />
            <label htmlFor="mg-worker-skill">कामाचा प्रकार</label>
            <select id="mg-worker-skill" value={worker.skill} onChange={(e) => setWorker({ ...worker, skill: e.target.value })}>
              {SERVICES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button className="mg-submit" type="submit">कामगार जोडा</button>
          </form>
        </div>

        <div className="mg-card" id="mg-commission-card">
          <h3>कमिशन नोंद</h3>
          <form onSubmit={saveCommission}>
            <label htmlFor="mg-commission-booking">बुकिंग निवडा</label>
            <select id="mg-commission-booking" value={commission.bookingId} onChange={(e) => setCommission({ ...commission, bookingId: e.target.value })}>
              <option value="">बुकिंग निवडा</option>
              {bookings.map((b) => <option key={b.id} value={b.id}>{b.name} — {b.service}</option>)}
            </select>
            <label htmlFor="mg-job-amount">कामाची एकूण रक्कम (₹)</label>
            <input id="mg-job-amount" type="number" min="0" required value={commission.amount} onChange={(e) => setCommission({ ...commission, amount: e.target.value })} placeholder="उदा. 500" />
            <label htmlFor="mg-commission-amount">तुमचे कमिशन (₹)</label>
            <input id="mg-commission-amount" type="number" min="0" required value={commission.value} onChange={(e) => setCommission({ ...commission, value: e.target.value })} placeholder="उदा. 100" />
            <button className="mg-submit" type="submit">हिशोब जतन करा</button>
          </form>
        </div>
      </div>

      {notice && <div className="mg-notice" role="status">{notice}</div>}

      <div className="mg-card mg-card-spaced">
        <div className="mg-row"><h3>बुकिंग व्यवस्थापन</h3><button className="mg-secondary" onClick={exportCsv}>CSV रिपोर्ट डाउनलोड</button></div>
        <div className="mg-table-wrap">
          <table><thead><tr><th>ग्राहक</th><th>सेवा / तारीख</th><th>संपर्क</th><th>स्थिती</th><th>कारवाई</th></tr></thead>
            <tbody>{bookings.map((b) => (
              <tr key={b.id}>
                <td><b>{b.name}</b><br /><span className="mg-small">{b.address}</span></td>
                <td>{b.service}<br /><span className="mg-small">{b.date} • {b.time}</span></td>
                <td>{b.phone}</td>
                <td><span className={`mg-status ${b.status === "पूर्ण" ? "done" : b.status === "रद्द" ? "cancel" : ""}`}>{b.status || "नवीन"}</span></td>
                <td>
                  <select aria-label="बुकिंग स्थिती" value={b.status || "नवीन"} onChange={(e) => setBookings((current) => current.map((item) => item.id === b.id ? { ...item, status: e.target.value } : item))}>
                    {["नवीन", "स्वीकारले", "पूर्ण", "रद्द"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <button className="mg-secondary mg-small-button" onClick={() => pickBooking(b)}>हिशोब</button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {bookings.length === 0 && <div className="mg-empty">अजून बुकिंग नाही. ग्राहक बुकिंग फॉर्म भरल्यानंतर नोंद इथे दिसेल.</div>}
      </div>

      <div className="mg-card mg-card-spaced">
        <h3>नोंदणीकृत कामगार</h3>
        <div className="mg-table-wrap">
          <table><thead><tr><th>नाव</th><th>मोबाईल</th><th>कामाचा प्रकार</th><th>कारवाई</th></tr></thead>
            <tbody>{workers.map((w) => (
              <tr key={w.id}><td>{w.name}</td><td>{w.phone || "—"}</td><td>{w.skill}</td>
                <td><button className="mg-danger mg-small-button" onClick={() => {
                  if (window.confirm("हा कामगार डेमो यादीतून काढायचा का?")) setWorkers((current) => current.filter((item) => item.id !== w.id));
                }}>काढा</button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
        {workers.length === 0 && <div className="mg-empty">अजून कामगार नोंदवलेले नाहीत.</div>}
      </div>
      <p className="mg-small mg-card-note">या नमुन्यातील माहिती फक्त याच ब्राउझरमध्ये साठवली जाते. ऑनलाइन, अनेक मोबाईलवर समक्रमित वापरासाठी सुरक्षित सर्व्हर व डेटाबेस जोडणे आवश्यक आहे.</p>
    </section>
  );
}
