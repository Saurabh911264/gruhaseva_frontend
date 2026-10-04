import { useEffect, useMemo, useState } from "react";
import "./styles/global.css";
import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import BookingForm from './components/BookingForm/BookingForm';
import Footer from './components/Footer/Footer';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './pages/AdminPage';

const DEMO_CODE = "1234";

const defaultWorkers = [
  { id: 1, name: "संजय भुसारी", phone: "9876543210", skill: "घर साफसफाई" },
  { id: 2, name: "किरण पवार", phone: "9090909090", skill: "स्वयंपाक" }
];

const getInitialState = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

function App() {
  const [view, setView] = useState("customer");
  const [bookings, setBookings] = useState(() =>
    getInitialState("matoshriBookings", [])
  );
  const [workers, setWorkers] = useState(() =>
    getInitialState("matoshriWorkers", defaultWorkers)
  );
  const [commissions, setCommissions] = useState(() =>
    getInitialState("matoshriCommissions", {})
  );
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminCode, setAdminCode] = useState("");

  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    address: "",
    service: "",
    date: "",
    time: "",
    frequency: "एकदाच",
    notes: ""
  });

  const [workerForm, setWorkerForm] = useState({
    name: "",
    phone: "",
    skill: "घर साफसफाई"
  });

  const [commissionForm, setCommissionForm] = useState({
    bookingId: "",
    jobAmount: "",
    commissionAmount: ""
  });

  const [bookingMessage, setBookingMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("matoshriBookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem("matoshriWorkers", JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem("matoshriCommissions", JSON.stringify(commissions));
  }, [commissions]);

  const totalCommission = useMemo(
    () =>
      Object.values(commissions).reduce(
        (sum, item) => sum + (Number(item.commission) || 0),
        0
      ),
    [commissions]
  );

  const pendingBookings = bookings.filter(
    (b) => b.status === "नवीन" || b.status === "स्वीकारले"
  ).length;

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkerChange = (e) => {
    const { name, value } = e.target;
    setWorkerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCommissionChange = (e) => {
    const { name, value } = e.target;
    setCommissionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const newBooking = {
      id: Date.now(),
      name: bookingForm.name.trim(),
      phone: bookingForm.phone.trim(),
      address: bookingForm.address.trim(),
      service: bookingForm.service,
      date: bookingForm.date,
      time: bookingForm.time,
      frequency: bookingForm.frequency,
      notes: bookingForm.notes.trim(),
      status: "नवीन"
    };

    setBookings((prev) => [newBooking, ...prev]);
    setBookingForm({
      name: "",
      phone: "",
      address: "",
      service: "",
      date: "",
      time: "",
      frequency: "एकदाच",
      notes: ""
    });
    setBookingMessage(
      "डेमो बुकिंग नोंदली गेली! ॲडमिन डॅशबोर्डमध्ये ती पाहता येईल."
    );
  };

  const handleWorkerSubmit = (e) => {
    e.preventDefault();
    if (!workerForm.name.trim()) return;

    const newWorker = {
      id: Date.now(),
      name: workerForm.name.trim(),
      phone: workerForm.phone.trim(),
      skill: workerForm.skill
    };

    setWorkers((prev) => [newWorker, ...prev]);
    setWorkerForm({
      name: "",
      phone: "",
      skill: "घर साफसफाई"
    });
  };

  const handleCommissionSubmit = (e) => {
    e.preventDefault();
    const { bookingId, jobAmount, commissionAmount } = commissionForm;

    if (!bookingId) {
      alert("आधी बुकिंग निवडा.");
      return;
    }

    const amount = Number(jobAmount);
    const commission = Number(commissionAmount);

    if (!amount || !commission) {
      alert("कामाची रक्कम आणि कमिशन भरा.");
      return;
    }

    if (commission > amount) {
      alert("कमिशन कामाच्या रकमेपेक्षा जास्त असू शकत नाही.");
      return;
    }

    setCommissions((prev) => ({
      ...prev,
      [bookingId]: {
        amount,
        commission
      }
    }));

    setCommissionForm({
      bookingId: "",
      jobAmount: "",
      commissionAmount: ""
    });

    alert("डेमो हिशोब जतन केला.");
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (adminCode === DEMO_CODE) {
      setAdminLoggedIn(true);
      setAdminCode("");
      return;
    }

    alert("डेमो कोड चुकीचा आहे. 1234 वापरून पाहा.");
  };

  const setBookingStatus = (id, status) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const removeWorker = (id) => {
    if (window.confirm("हा कामगार डेमो यादीतून काढायचा का?")) {
      setWorkers((prev) => prev.filter((worker) => worker.id !== id));
    }
  };

  const pickBooking = (id) => {
    const booking = bookings.find((item) => item.id === id);
    const existing = commissions[id];

    setCommissionForm({
      bookingId: String(id),
      jobAmount: existing?.amount ? String(existing.amount) : "",
      commissionAmount: existing?.commission ? String(existing.commission) : ""
    });

    const bookingSelect = document.getElementById("commissionBooking");
    if (bookingSelect) {
      bookingSelect.value = String(id);
    }
  };

  const exportCSV = () => {
    const rows = [
      [
        "ग्राहक",
        "मोबाईल",
        "पत्ता",
        "सेवा",
        "तारीख",
        "वेळ",
        "स्थिती",
        "कामाची रक्कम",
        "कमिशन"
      ],
      ...bookings.map((b) => [
        b.name,
        b.phone,
        b.address,
        b.service,
        b.date,
        b.time,
        b.status,
        commissions[b.id]?.amount || 0,
        commissions[b.id]?.commission || 0
      ])
    ];

    const csv =
      "\uFEFF" +
      rows
        .map((r) =>
          r
            .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\r\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "matoshri-gruhseva-bookings.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<BookingForm />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;