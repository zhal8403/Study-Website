import { useEffect, useState } from "react";
import { getCalendars, getAllCalendarEvents } from "../services/googleCalendar";

import "./Dashboard.css";
import { generateSummary } from "../services/AI_API";

function Dashboard({ token, user }) {
    const [events, setEvents] = useState([]);
    const [calendars, setCalendars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("today");
    const [summary, setSummary] = useState("Loading AI...");

    useEffect(() => {
        async function load() {
        if (!token) return;

        setLoading(true);

        try {

            const calList = await getCalendars(token);
            setCalendars(calList);

            const eventList = await getAllCalendarEvents(token);

            const upcoming = eventList
            .filter((event) => {
                const start = new Date(
                event.start?.dateTime || event.start?.date
                );
                return start >= new Date();
            })
            .sort((a, b) => {
                const dateA = new Date(a.start?.dateTime || a.start?.date);
                const dateB = new Date(b.start?.dateTime || b.start?.date);
                return dateA - dateB;
            });

            setEvents(upcoming);
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
        }

        load();
    }, [token]);

    useEffect(() => {
        async function loadSummary() {
            if (events.length === 0) return;

            try {

                const prompt = `
                    You are StudyOS, an AI student assistant.

                    Your job is to create a daily student briefing from the user's calendar.

                    IMPORTANT RULES:
                    - Only use the events provided below.
                    - Do NOT invent holidays, assignments, tests, birthdays, or tasks.
                    - Only include events happening within the next 7 days.
                    - Pay special attention to deadlines, due dates, exams, meetings, and important tasks.
                    - If something important is coming soon, warn the student.
                    - Keep the briefing short and easy to scan.

                    Format:

                    🌅 Good Morning!
                    Give a 1-2 sentence overview of the day.

                    📅 Today's Schedule:
                    List today's events with times.

                    ⚠️ Watch Out For:
                    Mention upcoming deadlines, tests, assignments, or important events in the next 7 days.

                    🎯 Today's Focus:
                    Give 1-2 productivity suggestions based on the schedule.

                    💡 Motivation:
                    Give a short encouraging message.

                    Calendar events for the next 7 days:

                    ${events.length > 0 
                        ? events.map(e => {
                            const start = new Date(e.start?.dateTime || e.start?.date);

                            return `
                    Event: ${e.summary}
                    Date: ${start.toLocaleDateString()}
                    Time: ${start.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit"
                    })}
                    Description: ${e.description || "None"}
                    `;
                        }).join("\n")
                        : "No events scheduled for the next 7 days."
                    }

                    Generate the briefing now.
                    `;

                const response = await generateSummary(prompt);

                setSummary(response);

            } catch (err) {
                console.error(err);
                setSummary("Failed to load AI summary.");
            }
        }

        loadSummary();

    }, [events]);

    function getFilteredEvents() {
        const now = new Date();

        return events.filter((event) => {
        const eventDate = new Date(
            event.start?.dateTime || event.start?.date
        );

        switch (filter) {
            case "today":
            return eventDate.toDateString() === now.toDateString();

            case "week": {
            const weekLater = new Date();
            weekLater.setDate(now.getDate() + 7);

            return eventDate >= now && eventDate <= weekLater;
            }

            case "month": {
            const monthLater = new Date();
            monthLater.setMonth(now.getMonth() + 1);

            return eventDate >= now && eventDate <= monthLater;
            }

            default:
            return true;
        }
        });
    }

    const filteredEvents = getFilteredEvents();

    return (
        

          <div style={{ padding: "30px" }}>

        <div
            style={{
                border: "1px solid #727280",
                borderRadius: "16px",
                padding: "20px",
                marginTop: "20px",
                marginBottom: "25px",
                background: "#16162b",
            }}
        >
            <h2>🤖 AI Summary</h2>
            <p>{summary}</p>
        </div>
        
        <h1>
            Welcome{user ? `, ${user.given_name}` : ""}!
        </h1>

        <p>Here's what's coming up.</p>

        <div
            style={{
            display: "flex",
            gap: "20px",
            marginTop: "25px",
            marginBottom: "30px",
            }}
        >
            <div
            style={{
                padding: "20px",
                border: "1px solid #727280",
                borderRadius: "12px",
                minWidth: "220px",
            }}
            >
            <h3>{filteredEvents.length} Events</h3>
            <p>
                {filter === "today"
                ? "Today"
                : filter === "week"
                ? "This Week"
                : filter === "month"
                ? "This Month"
                : "All Upcoming"}
            </p>
            </div>

            <div
            style={{
                padding: "20px",
                border: "1px solid #727280",
                borderRadius: "12px",
                minWidth: "220px",
            }}
            >
            <h3>{calendars.length} Calendars</h3>
            <p>Connected</p>
            </div>
        </div>

        <div
            style={{
            display: "flex",
            gap: "15px",
            marginBottom: "25px",
            }}
        >
            <button onClick={() => setFilter("today")}>Today</button>

            <button onClick={() => setFilter("week")}> This Week </button>

            <button onClick={() => setFilter("month")}> This Month </button>

            <button onClick={() => setFilter("all")}> All </button>
        </div>

        <div
    style={{
        border: "1px solid #727280",
        borderRadius: "16px",
        padding: "20px",
        marginTop: "20px",
        height: "290px",
        width: "500px",
        display: "flex",
        flexDirection: "column",
        background: "#16162b",
    }}
>
    <h2 style={{ marginTop: 0, marginBottom: 20 }}>Upcoming Events</h2>

    <div className="upcoming-events" style={{
        overflowY: "auto",
        flex: 1,
        paddingRight: "8px",
        }}
    >
        {loading ? (
        <p>Loading Google Calendar...</p>
        ) : filteredEvents.length === 0 ? (
        <p>No events found.</p>
        ) : (
        filteredEvents.map((event, index) => {
            const start = new Date(
            event.start?.dateTime || event.start?.date
            );

            return (
            <div
                key={index}
                style={{
                border: "1px solid #727280",
                borderRadius: "12px",
                padding: "18px",
                marginBottom: "15px",
                }}
            >
                <h3>{event.summary || "(No title)"}</h3>

                <p>
                📁 <strong>{event.calendarName}</strong>
                </p>

                <p>
                    📅{" "}
                    {start.toLocaleDateString(undefined, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>

                {event.start?.dateTime && (
                <p>
                    ⏰{" "}
                    {start.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    })}
                </p>
                )}

                {event.location && (
                    <p>📍 {event.location}</p>
                )}

                {event.description && (
                <details>
                    <summary>Description</summary>
                    <p>{event.description}</p>
                </details>
                )}
            </div>
            );
        })
        )}
    </div>
    </div>
        </div>
    );
    
}

export default Dashboard;