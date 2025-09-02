import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaUsers, FaClock } from "react-icons/fa";
import { MdCurrencyPound } from "react-icons/md";
import StatusCard from "./StatusCard";
import axios from "axios";

export default function StatusCardRow() {
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("month"); // default filter
  const token = localStorage.getItem('adminjwt');

  const apiUrl = import.meta.env.VITE_API_URL;
  const fetchStats = async () => {
    try {
      // 👇 Replace with your real API endpoint
      const res = await axios.get(`${apiUrl}/admin/dashboard?filter=${filter}`, {
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`, // 🔑 pass JWT or API token
          "X-Requested-With": "XMLHttpRequest", // optional, some backends check this
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [filter]);

  if (!stats) {
    return (
      <div className="px-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-32 bg-gray-700 animate-pulse rounded"></div>
          <div className="h-8 w-24 bg-gray-700 animate-pulse rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-xl p-6 shadow-md animate-pulse"
            >
              <div className="h-5 w-24 bg-gray-700 rounded mb-4"></div>
              <div className="h-8 w-16 bg-gray-600 rounded mb-6"></div>
              <div className="h-4 w-32 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 mt-6 text-white">
      {/* 🔹 Heading */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl text-primary font-bold tracking-wide">Stats</h2>

        {/* 🔽 Filter Controls */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* 🔽 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-stretch">
        <StatusCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<FaCalendarAlt />}
          footer={<p className="text-green-400">↑ +12% from last {filter}</p>}
        />

        <StatusCard
          title="Active Therapists"
          value={stats.activeTherapists}
          icon={<FaUsers />}
          footer={<p className="text-green-400">↑ +5% from last {filter}</p>}
        />

        <StatusCard
          title="Today's Sessions"
          value={stats.todaysSessions}
          icon={<FaClock />}
          footer={<p className="text-blue-400">{stats.upcoming} upcoming</p>}
        />

        <StatusCard
          title="Revenue"
          value={stats.revenue}
          icon={<MdCurrencyPound />}
          footer={
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">vs last {filter}</span>
            </div>
          }
        />
      </div>
    </div>
  );
}
