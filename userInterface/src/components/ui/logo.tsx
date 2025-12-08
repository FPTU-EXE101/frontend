function Logo() {
  return (
    <div className="flex items-center gap-[8px]">
      <img
        className="w-[40px] rounded-sm"
        src={"/src/assets/react.png"}
        alt=""
      />
      <h2 className="text-2xl font-bold text-white">Title 1</h2>
    </div>
  );
}

export default Logo;
