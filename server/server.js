const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.post("/ai", async (req, res) => {

    const prompt = req.body.prompt;

    try {

        const response = await fetch(
            "http://localhost:11434/api/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "llama3.2:3b",
                    prompt: prompt,
                    stream: false,
                    options: { temperature: 0.2 }
                })
            }
        );

        const data = await response.json();

        res.json({
            reply: data.response
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});


app.get("/", (req, res) => {
    res.send("StudyOS AI Server Running");
});


app.listen(3001, () => {
    console.log("AI server running on port 3001");
});