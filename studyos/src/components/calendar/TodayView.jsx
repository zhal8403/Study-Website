import "./today.css";

function TodayView({ events, currentDate }) 
{
  const todayEvents = events.filter
  (
    (e) => e.startDate.toDateString() === currentDate.toDateString()
  );

  return (
    <div>
      <h2>Today</h2>

      {todayEvents.length === 0 && <p>No events today.</p>}

      {todayEvents.map((event, i) => 
      (
        <details key={i} id="today">
          <summary id="summary">
            <strong>{event.summary}</strong>
            <br />
            <small>
              {event.startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit",})}
            </small>
          </summary>

          {event.description && <p>{event.description}</p>}
        </details>
      ))}
    </div>
  );
}

export default TodayView;