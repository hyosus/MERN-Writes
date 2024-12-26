import ProfileMenu from "./ProfileMenu";

function Topbar() {
  return (
    <div className="flex items-center justify-end p-4 h-[60px] w-full text-white bg-zinc-900 rounded-lg">
      <ProfileMenu />
    </div>
  );
}

export default Topbar;
