import "dotenv/config";

const openAiResponse = async(message) =>{

const api_Url = "https://api.groq.com/openai/v1/chat/completions"
const options = {
            method : "POST",
            headers : {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${process.env.API_KEY}`
        },
        body:JSON.stringify({
            model : "openai/gpt-oss-20b",
            messages : 
            [{
                role : "user",
                content : message
            }]
        })
    }

    try {
        let response =  await fetch(api_Url,options);
        let JsonRes = await response.json();
        console.log(JsonRes.choices[0].message.content)
        // res.send(JsonRes.choices[0].message.content);
        return(JsonRes.choices[0].message.content);

    } catch (error) {
        console.log("Error in Ai Resoponse : ",error)
    }

}

export default openAiResponse;