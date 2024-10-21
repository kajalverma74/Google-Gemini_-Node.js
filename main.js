require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // To serve static files
const app = express();

app.use(express.json());
app.use(bodyParser.json());

// Serve static frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/content', async (req, res) => { 
    try {
        const data = req.body.question; 
        const result = await generate(data);
        console.log("Generated Result: ", result);
        res.send({
            "result": result
        });
    } catch (err) {
        res.send('Error: ' + err.message);
    }
});

const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generate = async (prompt) => {
    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.log(err);
        throw err;
    }
};

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
