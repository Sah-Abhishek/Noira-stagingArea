import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Plus, Bell, MapPin, User } from "lucide-react";
import AddressModal from "../Modals/AddressModal";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

export default function CustomerDashboard() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const navigate = useNavigate();

  const userjwt = localStorage.getItem("userjwt");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profile
        const res = await axios.get(`${apiUrl}/user/profile`, {
          headers: { Authorization: `Bearer ${userjwt}` },
        });
        setProfile(res.data.user);

        // Fetch bookings
        const userId = res.data.user?._id;
        if (userId) {
          const bookingsRes = await axios.get(
            `${apiUrl}/user/${userId}/bookings`,
            { headers: { Authorization: `Bearer ${userjwt}` } }
          );
          setBookings(bookingsRes.data.bookings || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    if (userjwt) fetchData();
    else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, [userjwt, isAddressModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111] text-gray-200">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111] text-red-400">
        <p>{error}</p>
      </div>
    );
  }

  const fullName = `${profile?.name?.first || ""} ${profile?.name?.last || ""}`;

  return (
    <div className="min-h-screen bg-[#111] text-gray-200 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-[#0d0d0d] rounded-2xl p-6 shadow-lg flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">User Profile</h2>

            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-primary"
              />
            ) : (
              <div className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-primary bg-[#111]">
                <User size={48} className="text-gray-400" />
              </div>
            )}

            <h2 className="mt-4 text-xl font-semibold">
              {fullName || "Unknown User"}
            </h2>

            {/* <div className={`${profile.profileComplete ? "bg-green-500" : "bg-yellow-500/70"} rounded-full text-black px-2 py-1`}> */}
            {/*   {profile.profileComplete ? <span>Profile completed</span> : <span>Profile Not Compelted</span>} */}
            {/* </div> */}

            <div className="mt-6 space-y-2 text-sm text-gray-400 text-left w-full">
              <p>
                <span className="font-medium text-gray-300">Email:</span>{" "}
                {profile?.email}
              </p>
              <p>
                <span className="font-medium text-gray-300">Phone:</span>{" "}
                {profile?.phone || "Not provided"}
              </p>
            </div>

            {/* Totals */}
            {/* <div className="mt-6 grid grid-cols-2 gap-4 w-full text-center"> */}
            {/*   <div className="bg-[#111] rounded-xl py-4"> */}
            {/*     <p className="text-lg font-bold">{bookings.length}</p> */}
            {/*     <p className="text-gray-400 text-xs">Total Bookings</p> */}
            {/*   </div> */}
            {/*   <div className="bg-[#111] rounded-xl py-4"> */}
            {/*     <p className="text-lg font-bold text-primary"> */}
            {/*       £ */}
            {/*       {bookings.reduce( */}
            {/*         (sum, b) => sum + (b.price?.amount || 0), */}
            {/*         0 */}
            {/*       )} */}
            {/*     </p> */}
            {/*     <p className="text-gray-400 text-xs">Total Spend</p> */}
            {/*   </div> */}
            {/* </div> */}

            {/* Quick Actions */}
            <div className="mt-6 w-full space-y-3">
              <button onClick={() => navigate('/user/usereditprofile')} className="flex items-center justify-center gap-2 w-full bg-[#111] hover:bg-primary/20 py-2 rounded-lg text-sm transition">
                <Edit size={16} /> Edit Profile
              </button>
              <button onClick={() => navigate('/user/allservicespage')} className="flex items-center justify-center gap-2 w-full bg-[#111] hover:bg-primary/20 py-2 rounded-lg text-sm transition">
                <Plus size={16} /> Add Booking
              </button>
              {/* <button className="flex items-center justify-center gap-2 w-full bg-[#111] hover:bg-primary/20 py-2 rounded-lg text-sm transition"> */}
              {/*   <Bell size={16} /> Send Notification */}
              {/* </button> */}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Addresses Section */}
          <div className="bg-[#0d0d0d] rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> Your Addresses
              </h3>
              <button onClick={() => setIsAddressModalOpen(true)} className="flex items-center gap-2 bg-primary/20 hover:bg-primary/30 text-primary text-sm px-3 py-1 rounded-lg transition">
                <Plus size={14} /> Add Address
              </button>
            </div>

            {profile?.allAddresses?.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {profile.allAddresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-4 bg-[#111] rounded-xl border border-gray-700 text-sm"
                  >
                    <p>
                      <span className="font-medium text-gray-300">
                        Building No:
                      </span>{" "}
                      {addr.Building_No}
                    </p>
                    <p>
                      <span className="font-medium text-gray-300">Street:</span>{" "}
                      {addr.Street}
                    </p>
                    <p>
                      <span className="font-medium text-gray-300">
                        Locality:
                      </span>{" "}
                      {addr.Locality}
                    </p>
                    <p>
                      <span className="font-medium text-gray-300">
                        PostTown:
                      </span>{" "}
                      {addr.PostTown}
                    </p>
                    <p>
                      <span className="font-medium text-gray-300">
                        Postal Code:
                      </span>{" "}
                      {addr.PostalCode}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No addresses found.</p>
            )}
          </div>

          {/* Booking History Section */}
          <div className="bg-[#0d0d0d] rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Your Bookings</h3>
            {bookings.length === 0 ? (
              <p className="text-gray-400 text-sm">No bookings found.</p>
            ) : (
              <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="p-4 bg-[#111] rounded-xl flex justify-between items-start"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-gray-200">
                        {booking.bookingCode || "BOOKING"}
                      </p>
                      <p className="text-xs text-gray-400">
                        Therapist:{" "}
                        <span className="text-gray-200">
                          {booking.therapistId?.title || "N/A"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        Service:{" "}
                        <span className="text-gray-200">
                          {booking.serviceId?.name || "N/A"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(booking.slotStart).toLocaleString()} –{" "}
                        {new Date(booking.slotEnd).toLocaleTimeString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        Status:{" "}
                        <span
                          className={`font-medium ${booking.status === "confirmed"
                            ? "text-green-400"
                            : "text-yellow-400"
                            }`}
                        >
                          {booking.status}
                        </span>{" "}
                        | Payment:{" "}
                        <span
                          className={`font-medium ${booking.paymentStatus === "paid"
                            ? "text-green-400"
                            : "text-red-400"
                            }`}
                        >
                          {booking.paymentStatus}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-semibold">
                        £{booking.price?.amount}
                      </p>
                      <p className="text-xs uppercase text-gray-400">
                        {booking.price?.currency || "GBP"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <AddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} />
      </div>
    </div>
  );
}
