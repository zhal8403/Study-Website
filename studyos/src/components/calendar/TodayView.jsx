function TodayView({ events }) {
  const today = new Date().toDateString();

  const todayEvents = events.filter(
    (e) => e.startDate.toDateString() === today
  );

  return (
    <div>
      <h2>Today</h2>

      {todayEvents.length === 0 && <p>No events today.</p>}

      {todayEvents.map((event, i) => (
        <details key={i} style={{ padding: 10, borderBottom: "1px solid #eee" }}>
          <summary style={{ cursor: "pointer" }}>
            <strong>{event.summary}</strong>
            <br />
            <small>
              {event.startDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </summary>

          {event.description && <p>{event.description}</p>}
        </details>
      ))}
    </div>
  );
}

export default TodayView;