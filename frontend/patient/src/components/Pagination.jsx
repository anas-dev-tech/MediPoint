
const Pagination = ({ prev, current, next, handleTraverseAppointments }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-2">
      {/* Previous Button */}
      <button
        onClick={() => handleTraverseAppointments(prev)}
        disabled={prev === -1}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {/* Current Page */}
      <button
        className="px-4 py-2 bg-primary text-white rounded-lg"
        disabled
      >
        {current}
      </button>

      {/* Next Button */}
      <button
        onClick={() => handleTraverseAppointments(next)}
        disabled={next === -1}
        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;