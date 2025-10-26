function SideBarSkeleton({ items = 5, width = "w-64", height = "h-6" }) {
  return (
    <ul className={`${width} p-4`}>
      {Array.from({ length: items }).map((_, i) => (
        <li key={i} className="my-4 flex items-center gap-1">
          <div
            className={`bg-gray-700 animate-pulse w-2 h-2 p-0 rounded-full`}
          />
          <div
            className={`bg-gray-700 animate-pulse ${width} ${height} rounded-md`}
          />
        </li>
      ))}
    </ul>
  );
}

export default SideBarSkeleton;
