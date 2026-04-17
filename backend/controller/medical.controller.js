const {searchPubMed,fetchPubMedDetails } = require("../services/pubmedService")
const { fetchClinicalTrials} = require("../services/clinicalService")
const { fetchOpenAlex } = require("../services/openAlexService");
const {generateSummary } =require("../services/llmService")

module.exports.medicalController = async(req,res)=>{
    const query = req.query.q || "lung cancer"
        let finalquery = query;
        if(query.split(" ").length===1){
            finalquery = `${query} medical research`
        }
    try{
        const ids  = await searchPubMed(finalquery)
        const papers = await fetchPubMedDetails(ids)
        const openAlexPapers = await fetchOpenAlex(finalquery)
        const trials = await fetchClinicalTrials(finalquery)

    // combine 
    const allpapers = [...papers,...openAlexPapers]
    const keywords = query.toLowerCase().split(" ");

    const scoreData = allpapers.map((paper) => {
      let score = 0;

      const title = paper.title.toLowerCase();
      const abstract = paper.abstract.toLowerCase();

      keywords.forEach((word) => {
        if (title.includes(word)) score += 2;
        if (abstract.includes(word)) score += 1;
      });
      if (paper.year === "2026") score += 2;
      else if (paper.year === "2025") score += 1;
      return {
        ...paper,
        score,
      };
    });
    const sorted = scoreData.sort((a, b) => b.score - a.score);
    const topPapers = sorted.slice(0, 8);
    const summary = await generateSummary(finalquery,topPapers,trials)

        res.json({
            summary,
            papers:topPapers,
            trials:trials
        })
    }catch(error){
        res.status(500).json("search error",error)
    }
} 