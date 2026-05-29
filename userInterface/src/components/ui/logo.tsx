function Logo() {
  return (
    <div className="flex items-center gap-[8px]">
      <img
        className="h-10 w-10 rounded-sm object-contain"
        src={"/src/assets/react.png"}
        alt="PetHub"
        loading="lazy"
        decoding="async"
      />
      <h2 className="text-2xl font-bold text-white">Title 1</h2>
    </div>
  );
}

export default Logo;
