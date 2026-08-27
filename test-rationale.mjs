import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const models = ['qwen/qwen3.8-27b','qwen/qwen3-32b'];
for (const model of models){
  try{
    const c = await groq.chat.completions.create({
      model,
      messages:[
        {role:'system', content:'You are PNLE expert. Provide 2 sentence rationale.'},
        {role:'user', content:'Question: Normal infant birth weight doubles by? Options: {"A":"6 months","B":"1 year"} Correct: A) 6 months'}
      ],
      temperature:0.3,
      max_tokens:80
    });
    console.log(`MODEL ${model} OK:`, c.choices[0].message.content.slice(0,200));
    break;
  }catch(e){
    console.log(`MODEL ${model} FAILED:`, e.message.slice(0,400));
  }
}
