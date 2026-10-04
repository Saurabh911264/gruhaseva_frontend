import React from 'react';
import AdminDashboard from '../components/AdminDashboard/AdminDashboard';

const AdminPage = () => {
    return (
        <div>
            <h1>ॲडमिन पृष्ठ</h1>
            <p>येथे तुम्ही बुकिंग आणि कामगार व्यवस्थापित करू शकता.</p>
            <AdminDashboard />
        </div>
    );
};

export default AdminPage;