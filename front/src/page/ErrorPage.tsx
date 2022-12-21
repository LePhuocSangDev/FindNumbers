import React from "react";

function ErrorPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-700 mb-4">Error</h1>
        <p className="text-xl text-gray-700 mb-8">
          Sorry, something went wrong. Please try again later.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-full bg-blue-500 text-white focus:outline-none hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default ErrorPage;
