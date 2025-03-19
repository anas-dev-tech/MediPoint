import React, { useState, useEffect } from 'react';

const DoctorNotification = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Function to handle redirection for doctors
  const handleDoctorRedirect = (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    window.location.href = 'https://medipoint.decodaai.com/d/'; // Redirect to the doctor portal
  };

  // Automatically hide the notification after 10 seconds (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000); 

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  if (!isVisible) return null; // Don't render if the notification is hidden

  return (
    <div className="fixed bottom-8 left-4 z-50">
      <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm">
        <p className="text-gray-700 text-sm">
          Are you a doctor?{' '}
          <a
            href="#"
            onClick={handleDoctorRedirect}
            className="text-primary font-bold hover:underline"
          >
            Click here
          </a>
          .
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default DoctorNotification;