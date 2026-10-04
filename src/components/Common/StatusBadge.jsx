import React from 'react';

const StatusBadge = ({ status }) => {
    let badgeClass = '';
    let badgeText = '';

    switch (status) {
        case 'नवीन':
            badgeClass = 'badge-new';
            badgeText = 'नवीन';
            break;
        case 'स्वीकारले':
            badgeClass = 'badge-accepted';
            badgeText = 'स्वीकारले';
            break;
        case 'पूर्ण':
            badgeClass = 'badge-completed';
            badgeText = 'पूर्ण';
            break;
        case 'रद्द':
            badgeClass = 'badge-cancelled';
            badgeText = 'रद्द';
            break;
        default:
            badgeClass = 'badge-default';
            badgeText = 'अज्ञात';
    }

    return (
        <span className={`status-badge ${badgeClass}`}>
            {badgeText}
        </span>
    );
};

export default StatusBadge;