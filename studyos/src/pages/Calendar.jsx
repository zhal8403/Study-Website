import { useEffect, useState } from "react";
import { getAllCalendarEvents } from "../services/googleCalendar";

import TodayView from "../components/calendar/TodayView";
import WeekView from "../components/calendar/WeekView";
import MonthView from "../components/calendar/MonthView";

function Calendar({ token }) {
    const [events, setEvents] = useState([]);
    const [view, setView] = useState("week");
    const [search, setSearch] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
        const [showNewEvent, setShowNewEvent] = useState(false);

    useEffect(() => {
        async function load() {
        if (!token) return;

        const eventList = await getAllCalendarEvents(token);

        const sorted = eventList
            .map((e) => ({
            ...e,
            startDate: new Date(e.start?.dateTime || e.start?.date),
            }))
            .sort((a, b) => a.startDate - b.startDate);

        setEvents(sorted);
    }

    load();
  }, [token]);

const now = new Date();

const filteredEvents = events.filter((event) => {
    const start = event.startDate;

    // ---------- Time Filter ----------
    let matchesView = true;

    if (view === "today") {
        matchesView =
            start.toDateString() === now.toDateString();
    }

    if (view === "week") {
        const startOfWeek = new Date(now);
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        matchesView =
            start >= startOfWeek &&
            start < endOfWeek;
    }

    if (view === "month") {
        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const endOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        matchesView =
            start >= startOfMonth &&
            start < endOfMonth;
    }

    // ---------- Search Filter ----------
    const searchText = search.toLowerCase();

    const matchesSearch =
        searchText === "" ||
        (event.summary || "")
            .toLowerCase()
            .includes(searchText) ||
        (event.description || "")
            .toLowerCase()
            .includes(searchText) ||
        (event.location || "")
            .toLowerCase()
            .includes(searchText) ||
        (event.calendarName || "")
            .toLowerCase()
            .includes(searchText);

    return matchesView && matchesSearch;
});

function createEvent(event) 
{
    setShowNewEvent(false);
}

function updateEvent(event) 
{
    setSelectedEvent(null);
}

function deleteEvent(event) 
{
    setSelectedEvent(null);
}

  return (
    <div style={{ padding: 30 }}>
        <h1>Calendar</h1>

        <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
                width: "100%",
                padding: "12px",
                borderRadius: 10,
                border: "1px solid #ccc",
                marginBottom: 20,
            }}
        />

        {/* VIEW BUTTONS */}
        <div style={{ display: "flex", gap: 10, margin: "20px 0" }}>
            {["today", "week", "month"].map((v) => (
            <button
                key={v}
                onClick={() => setView(v)}
                style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: view === v ? "#2563eb" : "white",
                color: view === v ? "white" : "black",
                cursor: "pointer",
            }}
            >
                {v.toUpperCase()}
            </button>
        ))}
    </div>

        {/* VIEWS */}
        {view === "today" && <TodayView events={filteredEvents}  onEventClick={setSelectedEvent} />}
        {view === "week" && <WeekView events={filteredEvents}  onEventClick={setSelectedEvent} />}
        {view === "month" && <MonthView events={filteredEvents}  onEventClick={setSelectedEvent} />}

        <button
            onClick={() => setShowNewEvent(true)}
            style={{
                position: "fixed",
                bottom: 30,
                right: 30,
                width: 60,
                height: 60,
                borderRadius: "50%",
                fontSize: 30,
                cursor: "pointer",
                background: "#2563eb",
                color: "white",
                border: "none",
                boxShadow: "0 4px 10px rgba(0,0,0,.2)",
            }}
        >
            +
        </button>
    </div>
    
  );
}

export default Calendar;