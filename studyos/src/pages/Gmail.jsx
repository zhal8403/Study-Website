import { useEffect, useState } from "react";
import { getEmails, markAsRead, markAsUnread, } from "../services/gmail";

async function loadEmails()
{
    const data = await getEmails(token);
    setEmails(data);
}

function Gmail({token})
{
    const [emails, setEmails] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all | unread
    const [selectedEmail, setSelectedEmail] = useState(null);

    useEffect(() => {
        async function load() 
        {
            if(!token)
            {
                return;
            }
            const data = await getEmails(token);
            setEmails(data);
        }
        load();
    },[token]);

    const filteredEmails = emails.filter((email) =>
    {
        const subject =
            email.payload?.headers?.find(h => h.name === "Subject")?.value || "";

        const from =
            email.payload?.headers?.find(h => h.name === "From")?.value || "";

        const snippet = email.snippet || "";

        const matchesSearch =
            subject.toLowerCase().includes(search.toLowerCase()) ||
            from.toLowerCase().includes(search.toLowerCase()) ||
            snippet.toLowerCase().includes(search.toLowerCase());

        const unread = email.labelIds?.includes("UNREAD");

        if (filter === "unread") {
            return matchesSearch && unread;
        }

        return matchesSearch;
    });

    return(
        <div style={{ padding: 30 }}>

            <h1>Gmail</h1>

            <div
                    style={{
                        display: "flex",
                        gap: 10,
                        marginBottom: 20,
                    }}
                >
                    <input
                        type="text"
                        placeholder="Search emails..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            padding: 10,
                            borderRadius: 8,
                            border: "1px solid #ccc",
                        }}
                    />

                    <button
                        onClick={() => setFilter("all")}
                        style={{
                            background: filter === "all" ? "#2563eb" : "white",
                            color: filter === "all" ? "white" : "black",
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            padding: "0 15px",
                        }}
                    >
                        Show All
                    </button>

                    <button
                        onClick={() => setFilter("unread")}
                        style={{
                            background: filter === "unread" ? "#2563eb" : "white",
                            color: filter === "unread" ? "white" : "black",
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            padding: "0 15px",
                        }}
                    >
                        Unread
                    </button>
                </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "350px 1fr",
                    gap: 25,
                }}
            >

                {/* Inbox */}

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: 12,
                        overflowY: "auto",
                        maxHeight: "69vh",
                    }}
                >

                    {filteredEmails.map((email) => {

                        const unread = email.labelIds?.includes("UNREAD");

                        const subject =
                            email.payload?.headers?.find(
                                h => h.name === "Subject"
                            )?.value || "(No Subject)";

                        const from =
                            email.payload?.headers?.find(
                                h => h.name === "From"
                            )?.value || "";

                        return (

                            <div
                                key={email.id}
                                onClick={async () => {
                                    setSelectedEmail(email);

                                    if (email.labelIds?.includes("UNREAD")) 
                                    {
                                        await markAsRead(token, email.id);

                                        email.labelIds = email.labelIds.filter(
                                            label => label !== "UNREAD"
                                        );

                                        setEmails([...emails]);
                                    }
                                }}
                                style={{
                                    padding: 15,
                                    borderBottom: "1px solid #eee",
                                    cursor: "pointer",
                                }}
                            >

                                <strong>{subject}</strong>

                                <br />

                                <small>{from}</small>

                            </div>

                        );

                    })}

                </div>

                {/* Viewer */}

                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: 12,
                        padding: 20,
                    }}
                >

                    {!selectedEmail ? (

                        <p>Select an email.</p>

                    ) : (

                        <>
                            <h2>
                                {
                                    selectedEmail.payload?.headers?.find(
                                        h => h.name === "Subject"
                                    )?.value
                                }
                            </h2>

                            <p>
                                <strong>From:</strong>{" "}
                                {
                                    selectedEmail.payload?.headers?.find(
                                        h => h.name === "From"
                                    )?.value
                                }
                            </p>

                            <br></br>

                            <pre
                                style={{
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {selectedEmail.snippet}
                            </pre>

                        </>
                    )}

                </div>

            </div>

        </div>

    );

}

export default Gmail;