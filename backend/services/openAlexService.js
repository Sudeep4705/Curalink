const axios = require("axios")

const fetchOpenAlex = async(query)=>{
    try{
        const url = "https://api.openalex.org/works"

        const response = await axios.get(url,{
            params:{
                search:query,
                "per-page":20
            }
        })
        
        const works  = response.data.results;
        const cleaned = works.map((item)=>({
            title:item.title || "No title",
            abstract:item.abstract_inverted_index
            ? Object.keys(item.abstract_inverted_index).join(" "): "No abstract",
            authors:item.authorships?.map(a=>a.author.display_name
            ) || [],
            year:item.publication_year || "NA",
            source:"OpenAlex",
            url:item.id
        }))
        return cleaned
    }
    catch(error){
        console.error("openAlex Error",error.message)
        return []
    }
}


module.exports = {fetchOpenAlex}