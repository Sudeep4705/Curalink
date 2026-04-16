const express = require("express")
const router = express.Router()
const {searchPubMed,fetchPubMedDetails } = require("../services/pubmedService")
const { fetchClinicalTrials} = require("../services/clinicalService")

    

router.get("/search",async(req,res)=>{
    const query = req.query.q || "lung cancer"

    try{
        const ids  = await searchPubMed(query)
        const papers = await fetchPubMedDetails(ids)

        const trials = await fetchClinicalTrials(query)

        res.json({
            papers,
            trials
        })
    }catch(error){
        res.status(500).json({error:"Something went wrong"})
    }
})

module.exports = router