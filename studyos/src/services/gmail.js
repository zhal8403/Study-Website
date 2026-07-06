export async function getEmails(accessToken)
{
    try {
        const res = await fetch(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox category:primary -label:spam -label:trash&maxResults=20",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const data = await res.json();
        const messages = data.messages || [];
        const emails = [];

        for (const message of messages)
        {
            const emailRes = await fetch(
                `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            emails.push(await emailRes.json());
        }
        return emails;
    }
    catch(err)
    {
        console.error(err);
        return [];
    }
}

export async function markAsRead(accessToken, messageId) {
    await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                removeLabelIds: ["UNREAD"],
            }),
        }
    );
}

export async function markAsUnread(accessToken, messageId) 
{
    await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                addLabelIds: ["UNREAD"],
            }),
        }
    );
    
}

export async function archiveEmail(accessToken, messageId)
{
    await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                removeLabelIds: ["INBOX"],
            }),
        }
    );
}

export async function trashEmail(accessToken, messageId) 
{
    await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );
}

export async function sendEmail(accessToken, to, subject, body) 
{
    const message = [
        `To: ${to}`,
        `Subject: ${subject}`,
        "",
        body,
    ].join("\n");

    const encoded = btoa(unescape(encodeURIComponent(message)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                raw: encoded,
            }),
        }
    );
}

export async function replyEmail(
    accessToken,
    original,
    body
) {
    const to =
        original.payload.headers.find(
            h => h.name === "From"
        )?.value;

    const subject =
        original.payload.headers.find(
            h => h.name === "Subject"
        )?.value;

    const message = [
        `To: ${to}`,
        `Subject: Re: ${subject}`,
        "",
        body,
    ].join("\n");

    const encoded = btoa(unescape(encodeURIComponent(message)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                raw: encoded,
                threadId: original.threadId,
            }),
        }
    );
}
