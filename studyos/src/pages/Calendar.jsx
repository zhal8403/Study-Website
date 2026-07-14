import { useEffect, useState } from "react";
import { getAllCalendarEvents, getCalendars, createEvent, updateEvent, deleteEvent } from "../services/googleCalendar";

import TodayView from "../components/calendar/TodayView";
import WeekView from "../components/calendar/WeekView";
import MonthView from "../components/calendar/MonthView";

import NewEventModal from "../components/calendar/NewEventModal";

import "./Calendar.css";

function Calendar({ token }) {
    const [events, setEvents] = useState([]);
    const [view, setView] = useState("week");
    const [search, setSearch] = useState("");
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showNewEvent, setShowNewEvent] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendars, setCalendars] = useState([]);
    
    async function load() 
    {
        if (!token) 
        {
            return;
        }

        const eventList = await getAllCalendarEvents(token);

        const sorted = eventList
            .map((e) => ({ ...e, startDate: new Date(e.start?.dateTime || e.start?.date),}))
            .sort((a, b) => a.startDate - b.startDate);

        setEvents(sorted);

        const calendarList = await getCalendars(token);
        setCalendars(calendarList);
    }

    useEffect(() => 
    {
        load();
    }, [token]);

const now = currentDate;

const filteredEvents = events.filter((event) => 
{
    const start = event.startDate;

    // ---------- Time Filter ----------
    let matchesView = true;

    if (view === "today") {
        matchesView = start.toDateString() === now.toDateString();
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

    // search 
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

async function createNewEvent(data) 
{
    const event = 
    {
        summary: data.summary,
        description: data.description,
        location: data.location,
        start: 
        {
            dateTime: new Date(data.start).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: 
        {
            dateTime: new Date(data.end).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    };
    await createEvent(token, data.calendarId, event);

    await load();

    setShowNewEvent(false);
    setSelectedEvent(null);
}

async function updateExistingEvent(data)
{
    const updates = { 
        summary: data.summary,
        description: data.description,
        location: data.location,
        start: {
            dateTime: new Date(data.start).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
            dateTime: new Date(data.end).toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
    };

    await updateEvent(
        token,
        selectedEvent.calendarId,
        selectedEvent.id,
        updates
    );

    await load();

    setShowNewEvent(false);
    setSelectedEvent(null);
}

async function deleteExistingEvent() 
{
    await deleteEvent( token, selectedEvent.calendarId, selectedEvent.id);

    await load();

    setShowNewEvent(false);
    setSelectedEvent(null);
}

function changeDate(direction)
{
    const newDate = new Date(currentDate);

    if(view === "week")
    {
        newDate.setDate(newDate.getDate() + direction * 7);
    }

    if(view === "month")
    {
        newDate.setMonth(newDate.getMonth() + direction );
    }

    if(view === "today")
    {
        newDate.setDate(newDate.getDate() + direction );
    }

    setCurrentDate(newDate);
}

return (
    <div id="container">
        <h1>Calendar</h1>

        <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div id="button">
            {["today", "week", "month"].map((v) => (
                <button key={v} style={{ background: view === v ? "#2563eb" : "white", color: view === v ? "white" : "black",}} onClick={() => setView(v)} >
                    {v.toUpperCase()}
                </button>
            ))}
        </div>

        <div id="when">
            <button onClick={() => changeDate(-1)}>← Previous</button>
            <button onClick={() => setCurrentDate(new Date())}>Today</button>
            <button onClick={() => changeDate(1)}>Next →</button>
        </div>

        {view === "today" && <TodayView events={filteredEvents}  onEventClick={(event) => {setSelectedEvent(event); setShowNewEvent(true);}} currentDate={currentDate} />}
        {view === "week" && <WeekView events={filteredEvents}  onEventClick={(event) => {setSelectedEvent(event); setShowNewEvent(true);}} currentDate={currentDate} />}
        {view === "month" && <MonthView events={filteredEvents}  onEventClick={(event) => {setSelectedEvent(event); setShowNewEvent(true);}} currentDate={currentDate} />}

        {showNewEvent && (
            <NewEventModal event={selectedEvent} calendars={calendars} onClose={() => { setShowNewEvent(false); setSelectedEvent(null); }} onSave={selectedEvent ? updateExistingEvent : createNewEvent} onDelete={selectedEvent ? deleteExistingEvent : null}/>
        )}

        <button id="add" onClick={()=> { setSelectedEvent(null); setShowNewEvent(true);}}>
            +
        </button>
    </div>
    
  );
}

export default Calendar;