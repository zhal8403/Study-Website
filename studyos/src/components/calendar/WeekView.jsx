function WeekView({ events }) {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const days = [...Array(7)].map((_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    return date;
  });

  return (
    <div>
      <h2>Week View</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 10,
        }}
      >
        {days.map((day, i) => {
          const dayEvents = events.filter(
            (e) => e.startDate.toDateString() === day.toDateString()
          );

          return (
            <div
              key={i}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 10,
                minHeight: 120,
              }}
            >
              <strong>
                {day.toLocaleDateString(undefined, { weekday: "short" })}
              </strong>

              <br />

              <small>{day.getDate()}</small>

              {dayEvents.map((e, idx) => (
                <div key={idx} style={{ marginTop: 6, fontSize: 12 }}>
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