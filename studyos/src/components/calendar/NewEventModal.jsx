import { useEffect, useState } from "react";
import "./NewEventModal.css";

function NewEventModal({ event, calendars, onClose, onSave, onDelete }) 
{
    useEffect(() => {
        setSummary(event?.summary || "");
        setDescription(event?.description || "");
        setLocation(event?.location || "");

        setCalendarId(event?.calendarId || calendars?.[0]?.id || "primary");

        setStart(event?.start?.dateTime ? event.start.dateTime.slice(0, 16) : emptyStart );
        setEnd(event?.end?.dateTime ? event.end.dateTime.slice(0, 16) : emptyEnd );
    }, [event, calendars]);

    const now = new Date();

    const emptyStart = now.toISOString().slice(0, 16);
    const emptyEnd = new Date( now.getTime() + 60 * 60 * 1000 ).toISOString().slice(0, 16);

    const [summary, setSummary] = useState(event?.summary || "");
    const [description, setDescription] = useState(event?.description || "");
    const [location, setLocation] = useState(event?.location || "");

    const [start, setStart] = useState( event?.start?.dateTime ? event.start.dateTime.slice(0, 16): emptyStart);
    const [end, setEnd] = useState(event?.end?.dateTime ? event.end.dateTime.slice(0, 16): emptyEnd);

    const [calendarId, setCalendarId] = useState( event?.calendarId || calendars?.[0]?.id || "primary");

    async function handleSave() 
    {
        const eventData =  {calendarId, summary, description, location, start, end, };

        await onSave(eventData);
        clear();
    }

    function handleCancel() 
    {
        clear();
        onClose();
    }

    function clear() 
    {
        setSummary("");
        setDescription("");
        setLocation("");
        setStart(emptyStart);
        setEnd(emptyEnd);
        setCalendarId(calendars?.[0]?.id || "primary")
    }

    function handleDelete() 
    {
        onDelete();
    }

    return (
        <div className="Overlay">
            <div className="modal">

                <h2>{event ? "Edit Event" : "New Event"}</h2>

                <input placeholder="Title" value={summary} onChange={(e) => setSummary(e.target.value)}/>

                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

                <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

                <label>Calendars</label>
                <select value={calendarId} onChange={(e)=> setCalendarId(e.target.value)}>
                    {calendars.map((calendar) => (
                        <option className="cal" key={calendar.id} value={calendar.id}>{calendar.summary}</option>
                    ))}
                </select>

                <label>Start</label>
                <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />

                <label>End</label>
                <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />

                <div className="buttons">

                    {event && (
                        <button id="delete" type="button" onClick={()=>onDelete?.()}>Delete</button>
                    )}
                    <button type="button" onClick={handleCancel}> Cancel </button>
                    <button type="button" onClick={handleSave} > {event ? "Update" : "Create"} </button>

                </div>
            </div>
        </div>
    );
}

export default NewEventModal;