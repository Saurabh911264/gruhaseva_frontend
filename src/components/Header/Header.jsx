import React from 'react';
import './Header.css'; // Assuming you will create a CSS file for styling

const Header = () => {
    return (
        <header className="header">
            <div className="logo">
                <img src="/assets/logo.svg" alt="मातोश्री गृहसेवा" />
            </div>
            <nav className="navigation">
                <ul>
                    <li><a href="/">मुख्यपृष्ठ</a></li>
                    <li><a href="/admin">ॲडमिन डॅशबोर्ड</a></li>
                    <li><a href="/services">सेवा</a></li>
                    <li><a href="/contact">संपर्क</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;