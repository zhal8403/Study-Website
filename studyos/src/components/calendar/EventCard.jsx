export default function EventCard({ event, onClick }) 
{
    const start = new Date(event.start?.dateTime || event.start?.date);

    return (
        <div
        onClick={() => onClick(event)}
        style={{
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 10,
            marginBottom: 10,
            cursor: "pointer",
            transition: ".2s",
        }}
        >
        <strong>{event.summary}</strong>

        <br />

        <small>{event.calendarName}</small>

        <br />

        {start.toLocaleDateString()}{" "}
        {event.start?.dateTime &&
            start.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
            })}
        </div>
    );
}