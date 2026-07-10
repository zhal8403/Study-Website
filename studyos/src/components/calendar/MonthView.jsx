import React from "react";
import "./Month.css";

function MonthView({ events, currentDate, onEventClick  }) 
{
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startWeekday = firstDay.getDay(); // 0 = Sunday

  const days = [];

  // Place blank cells before month starts
  for (let i = 0; i < startWeekday; i++) 
  {
    days.push(null);
  }

  // Place days
  for (let d = 1; d <= lastDay.getDate(); d++) 
  {
    days.push(new Date(year, month, d));
  }

  const getEventsForDay = (day) => 
  {
    if (!day)
    { 
      return [];
    }
    return events.filter( (e) => new Date(e.startDate).toDateString() === day.toDateString());
  };

  const monthName = currentDate.toLocaleDateString(undefined, {month: "long", year: "numeric", });

  return (
    <div>
      <div id="header" >
        <h2>{monthName}</h2>
      </div>

      <div id="week" >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
          (d) => ( <div key={d}>{d}</div> )
        )}
      </div>

      <div id="grid">
        {days.map((day, i) => 
        {
          const dayEvents = getEventsForDay(day);

          return (
            <div key={i} id="day" style={{ border: day ? "1px solid #ddd" : "none",}}>
              {day && (
                <>
                  <strong>{day.getDate()}</strong>

                  <div style={{ marginTop: 4 }}>
                    {dayEvents.slice(0, 2).map((e, idx) => (
                      <div key={idx} className="event" onClick={()=>onEventClick(e)}>
                        {e.summary}
                      </div>
                    ))}

                    {dayEvents.length > 2 && (
                      <div id="add">
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