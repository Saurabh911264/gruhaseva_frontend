import React, { useState } from "react";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import "../MatoshriGruhaSeva/MatoshriGruhaSeva.css";
import "../Footer/Footer.css";
const SERVICES = [
  { icon: "🧹", name: "घर साफसफाई", description: "घराची नियमित स्वच्छता" },
  { icon: "🍲", name: "स्वयंपाक", description: "घरगुती जेवण बनवणे" },
  { icon: "🧺", name: "भांडी व कपडे", description: "दैनंदिन घरकाम" },
  { icon: "🏠", name: "पूर्णवेळ घरकाम", description: "गरजेनुसार कामाची व्यवस्था" },
];

const STORAGE_KEY = "matoshriBookings";

const readBookings = () => {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

export default function BookingForm() {
  const [view, setView] = useState("customer");
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "", phone: "", address: "", service: "", date: "",
    time: "", frequency: "एकदाच", notes: ""
  });

  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString().slice(0, 10);

  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const chooseService = (service) => {
    setSelectedService(service);
    setForm((current) => ({ ...current, service }));
  };

  const submit = (event) => {
    event.preventDefault();
    const booking = {
      id: Date.now(),
      ...form,
      name: form.name.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      notes: form.notes.trim(),
      status: "नवीन",
    };
    const bookings = readBookings();
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    setForm({ name: "", phone: "", address: "", service: "", date: "", time: "", frequency: "एकदाच", notes: "" });
    setSelectedService("");
    setMessage("डेमो बुकिंग नोंदली गेली! ॲडमिन डॅशबोर्डमध्ये ती पाहता येईल. ही विनंती प्रत्यक्ष पाठवली गेलेली नाही.");
  };

  return (
    <main className="mg-wrap">
      <header className="mg-hero">
        <div className="mg-brand">
          <div className="mg-logo">🏡</div>
          <div>
            <h1>मातोश्री गृहसेवा</h1>
            <p>वाशिम • घरकामासाठी विश्वासार्ह सेवा</p>
          </div>
        </div>
        <span className="mg-pill">ग्राहक बुकिंग + ॲडमिन डॅशबोर्ड</span>
      </header>

      <nav className="mg-tabs" aria-label="मुख्य मेनू">
        <button className={view === "customer" ? "active" : ""} onClick={() => setView("customer")}>ग्राहक बुकिंग</button>
        <button className={view === "admin" ? "active" : ""} onClick={() => setView("admin")}>ॲडमिन डॅशबोर्ड</button>
      </nav>

      {view === "customer" ? (
        <section className="mg-grid">
          <div className="mg-card">
            <h2>तुम्हाला कोणती सेवा हवी आहे?</h2>
            <p className="mg-muted">सेवा निवडा आणि बुकिंगसाठी माहिती भरा.</p>
            <div className="mg-service-grid">
              {SERVICES.map((service) => (
                <button type="button" key={service.name}
                  className={`mg-service ${selectedService === service.name ? "selected" : ""}`}
                  onClick={() => chooseService(service.name)}>
                  <b>{service.icon} {service.name}</b>
                  <small>{service.description}</small>
                </button>
              ))}
            </div>
            <div className="mg-notice">बुकिंग मिळाल्यावर सेवा आणि किंमत फोनवर निश्चित केली जाईल.</div>
          </div>

          <div className="mg-card">
            <h2>बुकिंग फॉर्म</h2>
            <form onSubmit={submit}>
              <div className="mg-formgrid">
                <div>
                  <label htmlFor="mg-name">ग्राहकाचे पूर्ण नाव *</label>
                  <input id="mg-name" name="name" value={form.name} onChange={update} required placeholder="तुमचे नाव" />
                </div>
                <div>
                  <label htmlFor="mg-phone">मोबाईल नंबर *</label>
                  <input id="mg-phone" name="phone" value={form.phone} onChange={update} required inputMode="tel"
                    pattern="[0-9 +()-]{10,16}" title="कृपया वैध मोबाईल नंबर भरा" placeholder="मोबाईल नंबर" />
                </div>
                <div className="mg-full">
                  <label htmlFor="mg-address">पूर्ण पत्ता, वाशिम *</label>
                  <textarea id="mg-address" name="address" value={form.address} onChange={update} required placeholder="घर क्रमांक, परिसर, जवळची खूण" />
                </div>
                <div>
                  <label htmlFor="mg-service">सेवा निवडा *</label>
                  <select id="mg-service" name="service" value={form.service} onChange={(e) => { update(e); setSelectedService(e.target.value); }} required>
                    <option value="">सेवा निवडा</option>
                    {SERVICES.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="mg-date">सेवेची तारीख *</label>
                  <input id="mg-date" name="date" type="date" min={minDate} value={form.date} onChange={update} required />
                </div>
                <div>
                  <label htmlFor="mg-time">सोयीची वेळ *</label>
                  <select id="mg-time" name="time" value={form.time} onChange={update} required>
                    <option value="">वेळ निवडा</option>
                    <option>सकाळी ७ ते १०</option>
                    <option>सकाळी १० ते दुपारी १</option>
                    <option>दुपारी १ ते ४</option>
                    <option>सायंकाळी ४ ते ७</option>
                    <option>वेळ ठरवायची आहे</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="mg-frequency">सेवेची वारंवारता</label>
                  <select id="mg-frequency" name="frequency" value={form.frequency} onChange={update}>
                    <option>एकदाच</option>
                    <option>दररोज</option>
                    <option>आठवड्यातून काही दिवस</option>
                    <option>महिन्याची व्यवस्था</option>
                  </select>
                </div>
                <div className="mg-full">
                  <label htmlFor="mg-notes">अतिरिक्त माहिती (ऐच्छिक)</label>
                  <textarea id="mg-notes" name="notes" value={form.notes} onChange={update} placeholder="कामाची वेळ, घराचा आकार किंवा इतर सूचना" />
                </div>
              </div>
              <button className="mg-submit" type="submit">बुकिंग विनंती पाठवा</button>
              <p className="mg-small">हा सध्या नमुना आहे. ऑनलाइन पाठवलेली विनंती प्रत्यक्ष कार्यालयात जात नाही.</p>
            </form>
            {message && <div className="mg-notice" role="status">{message}</div>}
          </div>
        </section>
      ) : <AdminDashboard />}

      <footer className="mg-footer">
        मातोश्री गृहसेवा • वाशिम, महाराष्ट्र<br />
        बुकिंगचा नमुना — प्रत्यक्ष सेवा सुरू होण्यापूर्वी संपर्क व किंमत निश्चित करा.
      </footer>
    </main>
  );
}
