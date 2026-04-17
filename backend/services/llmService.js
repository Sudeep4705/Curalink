const axios = require("axios")

const generateSummary  = async(query,papers,trials)=>{
    try{
        const prompt = `
        User Query:${query}
        Top Papers:${papers.map((p,i)=>`${i+1}.${p.title}`).join("\n")}

        Clinical Trials:${trials.map((t,i)=>`${i+1}.${t.title} (${t.status})`).join("\n")}

        Task:
        1. Explain the condition briefly
        2. Summarize key research 
        3. Mention important clinical trials
        4. Keep it simple 
        `;

          const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: prompt,
      stream: false,
    });

    return response.data.response;
    }
    catch(error){
        console.error("LLM Erro:",error.message)
        return "Failed to generate summary"
    }
}

module.exports = {generateSummary}

