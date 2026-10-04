import React from 'react';
import Hero from '../components/Hero/Hero';
import BookingForm from '../components/BookingForm/BookingForm';
import Footer from '../components/Footer/Footer';

const HomePage = () => {
    return (
        <div>
            <Hero />
            <BookingForm />
            <Footer />
        </div>
    );
};

export default HomePage;