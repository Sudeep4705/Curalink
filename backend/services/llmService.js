const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateSummary = async (query, papers, trials) => {
    try {
        const prompt = `
        User Query: ${query}
        Top Papers: ${papers.map((p, i) => `${i + 1}. ${p.title}`).join("\n")}
        Clinical Trials: ${trials.map((t, i) => `${i + 1}. ${t.title} (${t.status})`).join("\n")}

Task:
You MUST return the answer in STRICT markdown format.

Rules:
- ALWAYS use "##" for section headings
- ALWAYS use "-" for bullet points
- NEVER write plain text headings
- NEVER use === or any other symbols
- Follow format EXACTLY

Format:

## Condition Overview
- Explain the condition clearly

## Research Insights
- Insight 1
- Insight 2

## Clinical Trials
- Trial 1
- Trial 2

Important:
If you do not follow markdown format, the answer is incorrect.
        `;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
        });

        return response.choices[0].message.content;

    } catch (error) {
        console.error("LLM Error:", error.message);
        return "Failed to generate summary";
    }
};

module.exports = { generateSummary };