export default function DeleteEventModal({event, onClose, onDelete,}) 
{
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1001,
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: 25,
                    borderRadius: 12,
                    width: 400,
                }}
            >
                <h3>Delete Event?</h3>

                <p>
                    Delete "<strong>{event.summary}</strong>"?
                </p>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 10,
                    }}
                >
                    <button onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        onClick={() =>
                            onDelete(event)
                        }
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}