export async function generateSummary(prompt) {
    try {
        const response = await fetch(
            "http://localhost:3001/ai",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: prompt,
                }),
            }
        );

        const data = await response.json();

        return data.reply;

    } catch (error) {
        console.error("AI Error:", error);
        throw error;
    }
}