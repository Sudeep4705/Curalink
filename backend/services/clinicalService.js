    const axios = require("axios")

    const fetchClinicalTrials = async(query)=>{
        try{
            const url ="https://clinicaltrials.gov/api/v2/studies"
            const response = await axios.get(url,{
                params:{
                    "query.term":query,
                    pageSize:10
                }
            })
            // return response.data
           const studies = response.data.studies;
           if(!studies || studies.length ===0) return [] 
           const clinicaltrials = studies.map((study)=>{
            const protocol = study?.protocolSection;

            return {
                title:protocol?.identificationModule?.briefTitle || "No title",
                status:protocol?.statusModule?.overallStatus || "unknown",
                condition:protocol?.conditionsModule?.conditions?.join(", ") || "N/A",
                location:protocol?.contactsLocationsModule?.locations?.[0]?.country || "N/A"
            }
           })
        return clinicaltrials
        }

        catch(error){
            console.error("Error fetching trials:",error.message)
            return null
        }
    }


    module.exports = {fetchClinicalTrials}