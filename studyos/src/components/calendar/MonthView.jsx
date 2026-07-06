import { useState } from "react";

function MonthView({ events }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First and last day of month
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekday = firstDay.getDay(); // 0 = Sunday

  // Build calendar cells
  const days = [];

  // Blank cells before month starts
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  // Actual days
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, month, d));
  }

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(
      (e) =>
        new Date(e.startDate).toDateString() === day.toDateString()
    );
  };

  const monthName = currentDate.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>{monthName}</h2>

        <div>
          <button
            onClick={() =>
              setCurrentDate(
                new Date(year, month - 1, 1)
              )
            }
          >
            ←
          </button>

          <button
            onClick={() =>
              setCurrentDate(
                new Date(year, month + 1, 1)
              )
            }
          >
            →
          </button>
        </div>
      </div>

      {/* Week labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          fontWeight: "bold",
          marginTop: 10,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
          (d) => (
            <div key={d}>{d}</div>
          )
        )}
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 10.4vw)",
          gap: 8,
          marginTop: 10,
        }}
      >
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={i}
              style={{
                border: day ? "1px solid #ddd" : "none",
                borderRadius: 10,
                minHeight: 90,
                padding: 6,
                background: "transparent",
              }}
            >
              {day && (
                <>
                  <strong>{day.getDate()}</strong>

                  <div style={{ marginTop: 4 }}>
                    {dayEvents.slice(0, 2).map((e, idx) => (
                      <div
                        key={idx}
                        style={{
                          fontSize: 11,
                          color: "white",
                          borderRadius: 6,
                          padding: "2px 4px",
                          marginTop: 2,
                          overflow: "hidden",
                          whiteSpace: "nowrap",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {e.summary}
                      </div>
                    ))}

                    {dayEvents.length > 2 && (
                      <div style={{ fontSize: 11 }}>
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MonthView;