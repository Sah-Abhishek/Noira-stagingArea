import React, { useEffect, useState } from "react";
import axios from "axios";

import sessionIcon from "../../assets/icons/sessions.svg";
import clockIcon from "../../assets/icons/clock.svg";
import chartIcon from "../../assets/icons/chart.svg";
import pound from "../../assets/icons/pound.png";

import StatusCard from "./StatusCard.jsx";
import StatusCardsRowSkeleton from "./StatusCardsRowSkeleton.jsx";

const StatusCardsRow = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [filter, setFilter] = useState("today"); // default filter
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const therapistId = localStorage.getItem("therapistId");
  const apiUrl = import.meta.env.VITE_API_URL;
  const therapistjwt = localStorage.getItem("therapistjwt");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        let url = `${apiUrl}/therapist/dashboard/${therapistId}?filter=${filter}`;
        if (filter === "custom" && customRange.start && customRange.end) {
          url += `&start=${customRange.start}&end=${customRange.end}`;
        }

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${therapistjwt}`,
          },
        });

        console.log("This is the response for status card: ", res.data);
        setDashboardData(res.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    if (therapistId) {
      fetchDashboardData();
    }
  }, [therapistId, filter, customRange]);

  if (!dashboardData) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 gap-6 w-full">
        <StatusCardsRowSkeleton />
        <StatusCardsRowSkeleton />
        <StatusCardsRowSkeleton />
        <StatusCardsRowSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {["today", "week", "month", "custom"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm
        ${filter === type
                ? "bg-primary"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {type === "today" && "Today"}
            {type === "week" && "Week"}
            {type === "month" && "Month"}
            {type === "custom" && "Custom"}
          </button>
        ))}

        {filter === "custom" && (
          <div className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg shadow-inner">
            <input
              type="date"
              value={customRange.start}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, start: e.target.value }))
              }
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={customRange.end}
              onChange={(e) =>
                setCustomRange((prev) => ({ ...prev, end: e.target.value }))
              }
              className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        )}
      </div>
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 gap-6 w-full">
        <StatusCard
          title="Today's Sessions"
          value={dashboardData.todaysSessions ?? 0}
          color="text-yellow-400"
          icon={sessionIcon}
        />
        <StatusCard
          title="Pending Requests"
          value={dashboardData.pendingRequests ?? 0}
          color="text-yellow-500"
          icon={clockIcon}
        />
        <StatusCard
          title="This Week"
          value={dashboardData.weekSessions ?? 0}
          color="text-green-400"
          icon={chartIcon}
        />
        <StatusCard
          title="Earning"
          value={`£${dashboardData.totalRevenue?.toFixed(1) ?? "0.0"}`}
          color="text-yellow-300"
          icon={pound}
        />
      </div>
    </div>
  );
};

export default StatusCardsRow;
