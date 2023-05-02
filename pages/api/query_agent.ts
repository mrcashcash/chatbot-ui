import { OpenAIChat } from "langchain/llms/openai";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatBody } from '@/types/chat';
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OPENAI_API_KEY } from "@/utils/app/const";
import { VectorStore } from "@/utils/server/vectorStore";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { messages, key, model, prompt, temperature } =
            req.body as ChatBody;
        const userMessage = messages[messages.length - 1];
        const messagesArray = messages.map(
            (message) => `${message.role}:${message.content}`
        );

        const chat_history = messages.pop();
        const query = userMessage.content.trim();
        let firstQuestionMarkEncountered = false;
        const llm = new OpenAIChat({
            modelName: model.id,
            openAIApiKey: OPENAI_API_KEY,
            temperature: temperature,
            streaming: true,
            callbacks: [
                {
                    handleLLMNewToken(token: string) {
                        if (firstQuestionMarkEncountered) {
                            res.write(token.toString());
                        } else if (token === '?') {
                            firstQuestionMarkEncountered = true;
                            process.stdout.write(token)
                        } else {
                            process.stdout.write(token)
                        }
                    },
                },
            ],


        });
        process.stdout.write('\n')
        const vs = await VectorStore.getInstance("langchain-js");
        const chain = ConversationalRetrievalQAChain.fromLLM(
            llm,
            vs.asRetriever(3)
        );
        chain.verbose = false;
        const followUpRes = await chain.call({
            question: query,
            chat_history: messagesArray,
        });
        res.end()
        res.status(200)



    } catch (error) {
        console.error(error);
        res.status(500).send("Error: TEST AI");
    }
};
export default handler;
