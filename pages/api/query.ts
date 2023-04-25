import { OpenAIChat } from "langchain/llms/openai";
import endent from "endent";
import { NextApiRequest, NextApiResponse } from "next";
import { Document } from "langchain/document";
import { ChatBody, Message } from '@/types/chat';
import { ConversationalRetrievalQAChain, LLMChain, ChatVectorDBQAChain } from "langchain/chains";
import { DEFAULT_SYSTEM_PROMPT, DEFAULT_TEMPERATURE, OPENAI_API_HOST, OPENAI_API_KEY } from "@/utils/app/const";
import { VectorStore, processQuery } from "@/utils/server/vectorStore";
import { PromptTemplate } from "langchain/prompts";


const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
        const { messages, key, model, prompt, temperature } =
            req.body as ChatBody;
        let answer;
        const userMessage = messages[messages.length - 1];
        const messagesArray = messages.map(message => `${message.role}:${message.content}`);

        const chat_history = messages.pop()
        const query = userMessage.content.trim();
        const llm = new OpenAIChat({ modelName: model.id, openAIApiKey: OPENAI_API_KEY, temperature: temperature });
        const vs = await VectorStore.getInstance("langchain-js");
        const chain = ConversationalRetrievalQAChain.fromLLM(llm, vs.asRetriever(3));
        const followUpRes = await chain.call({
            question: query,
            chat_history: messagesArray,
        });
        res.status(200).json({ answer: followUpRes.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error })
    }
}
export default handler