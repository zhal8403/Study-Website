import "./Week.css";

function WeekView({ events, currentDate, onEventClick }) 
{
  const startOfWeek = new Date(currentDate);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const days = [...Array(7)].map((_, i) => 
  {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  return (
    <div>
      <h2>Week View</h2>

      <div id="grid" >
        {days.map((day, i) => 
        {
          const dayEvents = events.filter( (e) => e.startDate.toDateString() === day.toDateString());

          return (
            <div key={i} id="day">
              <strong>
                {day.toLocaleDateString(undefined, { weekday: "short" })}
              </strong>

              <br />

              <small>{day.getDate()}</small>

              {dayEvents.map((e, idx) => (
                <div key={idx} className="event" onClick={()=>onEventClick(e)}>
                  • {e.summary}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeekView;