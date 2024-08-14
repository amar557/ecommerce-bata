function Sugesstion({ children }) {
  return (
    <div className="absolute -left-5 top-6  mb-2 hidden group-hover:block px-3 py-1 text-nowrap bg-gray-700 text-white text-sm rounded">
      {children}
    </div>
  );
}

export default Sugesstion;
