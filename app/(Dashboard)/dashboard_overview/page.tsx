"use client";
import { FaArrowUp, FaBell, FaEye } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "../sideBar";
import Yakub from "../../assets/yakub.jpg";
import { Notify } from "@/app/Components/notifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input";
// Fetch user data
export const getUserData = async (token: string) => {
  const response = await fetch("https://pwk.onrender.com/api/user/get_users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Unable to fetch user data");

  return response.json();
};

export default function AdminDash(){
  const router = useRouter();
  const [showNotify, setShowNotify] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user || !user.token) {
    //   router.push("/admin/sign_in");
    }
  }, [user, router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userData", user?.token],
    queryFn: () => getUserData(user!.token),
    enabled: !!user?.token,
  });

  const userData = Array.isArray(data?.users) ? data.users : [];

  return (
    <>
      {/* Notification */}
      {showNotify && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-start z-50"
          onClick={() => setShowNotify(false)}
        >
          <div
            className="mt-20 w-[90%] md:w-[400px] bg-white rounded-xl shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <Notify />
          </div>
        </div>
      )}

      {/* MAIN LAYOUT */}
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-[250px_1fr] bg-zinc-50 font-sans dark:bg-black">
        {/* Sidebar */}
        <aside
          className="
            fixed md:relative inset-y-0 left-0 bg-white z-50
            md:w-[250px] transition-all duration-300 min-h-screen
          "
        >
          <Sidebar
            name={userData?.name || ""}
            image={userData?.image || Yakub}
          />
        </aside>

        {/* Main */}
        <main className="md:w-full md:overflow-x-hidden md:ml-0">
          {/* Header */}
          <div className="bg-white shadow-md pt-5 py-4 flex justify-between gap-8 md:justify-between items-center px-5">
            <p className="hidden md:block">Dashboard</p>
            <div className="flex gap-2 items-center">
              <Input className="ml-10 md:ml-0" placeholder="search..."/>
              <button onClick={() => setShowNotify(true)}>
              <FaBell size={20} className="text-gray-600" />
            </button>
            <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
            </div>
          </div>

          {/* Welcome */}
          <div className="flex justify-between items-center px-5 py-2 mb-5">
            <h1 className="text-xl lg:text-2xl font-semibold">
              Welcome back {userData?.preferedName || "Admin"}
            </h1>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="mt-10 text-center text-gray-400 animate-pulse">
              Fetching your data...
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-10 text-center text-red-500">
              {(error as Error).message}
            </div>
          )}

          {/* User Table */}
          {!isLoading && !error && (
            <section className="px-5 mt-10">
              <section className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg font-semibold mb-6">User Data Overview</p>

                <div className="overflow-x-auto pb-4">
                  {userData?.length === 0 ? (
                    <p className="text-gray-400 text-center py-5">
                      No user data found.
                    </p>
                  ) : (
                    <table className="min-w-full text-sm text-left border border-gray-200 rounded-lg">
                      <thead className="bg-gray-100 text-gray-700">
                        <tr>
                          <th className="px-4 py-3 font-medium">#</th>
                          <th className="px-4 py-3 font-medium">Name</th>
                          <th className="px-4 py-3 font-medium">Gender</th>
                          <th className="px-4 py-3 font-medium">LGA</th>
                          <th className="px-4 py-3 font-medium">Date Added</th>
                        </tr>
                      </thead>

                      <tbody>
                        {userData.map((u: any, i: number) => (
                          <tr
                            key={i}
                            className={`${
                              i % 2 === 0 ? "bg-white" : "bg-gray-50"
                            } border-b border-gray-100 hover:bg-gray-100`}
                          >
                            <td className="px-4 py-3">{i + 1}</td>
                            <td className="px-4 py-3 capitalize">{u.name || "N/A"}</td>
                            <td className="px-4 py-3 capitalize">{u.gender || "N/A"}</td>
                            <td className="px-4 py-3 capitalize">{u.LGA || "N/A"}</td>
                            <td className="px-4 py-3 text-gray-500">
                              {u.createdAt
                                ? new Date(u.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </section>

              {/* Recent Activities */}
              <section className="flex flex-col lg:flex-row gap-10 mt-10 pb-20">
                <div className="bg-white rounded-lg p-6 w-full lg:w-1/3 shadow">
                  <p className="text-lg font-semibold">Recent Activities</p>
                  <p className="text-sm text-gray-600 mt-1">No activity yet..</p>
                </div>
              </section>
            </section>
          )}
        </main>
      </div>
    </>
  );
};
