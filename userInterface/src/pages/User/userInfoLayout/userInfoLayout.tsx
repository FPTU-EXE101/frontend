import { Outlet } from "react-router-dom";

const UserInfoLayout = () => {
  return (
    <div className="flex min-h-screen w-full">
      <main className="flex-1">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserInfoLayout;
