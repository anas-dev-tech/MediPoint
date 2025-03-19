import React from "react";


const NotFoundPage = () => {
  // Set your primary color here
  const primaryColor = "blue-600"; // Change this to your desired color (e.g., red-500, green-600, etc.)

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 min-h-screen flex flex-col items-center justify-center bg-gray-50 z-100">
      <div className="text-center">
        {/* 404 Text */}
        <h1 className=" text-9xl font-bold text-primary ">404</h1>
        <p className="text-2xl font-medium text-gray-600 mt-4">
          Oops! Page not found.
        </p>
        <p className="text-lg text-gray-500 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Back to Home Button */}
        <a
          href="/"
          className={`mt-8 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-${primaryColor} hover:bg-${primaryColor}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${primaryColor}-500`}
        >
          Go back home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;