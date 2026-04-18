const axios = require("axios");
const xml2js = require("xml2js");

const searchPubMed = async (query) => {
  try {
    const url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi";
    const response = await axios.get(url, {
      params: {
        db: "pubmed",
        term: query,
        retmax: 50,
        sort: "pub+date",
        retmode: "json",
      },
    });
    const ids = response.data.esearchresult.idlist;
    return ids;
  } catch (error) {
    console.error("Error is PubMed Search", error.message);
    return [];
  }
};

const fetchPubMedDetails = async (ids) => {
  try {
     if (!ids || ids.length === 0) return [];
    const url = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi";
    const response = await axios.get(url, {
      params: {
        db: "pubmed",
        id: ids.join(","),
        retmode: "xml",
      },
    });

    const parser = new xml2js.Parser({ explicitArray: false }); // tool that help to convert xml to json 
    const result = await parser.parseStringPromise(response.data);

 if (!result?.PubmedArticleSet?.PubmedArticle) {
  console.error("No PubMed articles found");
  return [];
}

const rawArticles = result.PubmedArticleSet.PubmedArticle;

const articles = Array.isArray(rawArticles)
  ? rawArticles
  : [rawArticles];

    const cleanedData = articles.map((item) => {
      const article = item.MedlineCitation.Article;
    
      
      let cleanedAbstract = article.Abstract?.AbstractText;

      if (Array.isArray(cleanedAbstract)) {
        cleanedAbstract = cleanedAbstract.map((a) => a._).join(" ");
        
      } else if (
        typeof cleanedAbstract === "object" &&
        cleanedAbstract !== null
      ) {
        cleanedAbstract = cleanedAbstract._;
      }
      if (!cleanedAbstract || cleanedAbstract == "undefined") {
        cleanedAbstract = "No abstract";
      }
      cleanedAbstract = String(cleanedAbstract);
     const pmid =
        item?.MedlineCitation?.PMID?._ ||
        item?.MedlineCitation?.PMID ||
        "unknown";
      return {
        title:
          typeof article.ArticleTitle === "object"
            ? article.ArticleTitle._
            : article.ArticleTitle || "No title",
        abstract: cleanedAbstract.slice(0, 1000),
        authors: Array.isArray(article.AuthorList?.Author)
          ? article.AuthorList.Author.map((a) => `${a.ForeName} ${a.LastName}`)
          : [],
        year: article.ArticleDate?.Year || "N/A",
        url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
       source: "PubMed"
      };
    });
    return cleanedData
  } catch (error) {
    console.error("Error fetching details", error.message);
    return null;
  }
};
module.exports = { searchPubMed, fetchPubMedDetails };
