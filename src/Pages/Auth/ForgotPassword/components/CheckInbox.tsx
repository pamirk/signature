import React from 'react';
import { Link } from 'react-router-dom';

const CheckInbox = () => {
  return (
    <div className="auth">
      <div className="auth__form auth__form--border auth__form--inbox">
        <div className="auth__title">Check your inbox</div>
        <div className="auth__description">
          If that is a valid address, we have sent an email to it to reset your password.
        </div>
        <Link to="/login" className="auth__link auth__link--center">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default CheckInbox;
