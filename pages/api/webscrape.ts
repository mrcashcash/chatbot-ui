import fs from 'fs';
import { MSG_TYPE, UPLOAD_DIR } from "@/utils/app/const";
import { processingData } from "@/utils/server/llm";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
        const { inputType, inputValue1, inputValue2, inputValue3 } =
            req.body;

        console.log('Input Value 1:', inputValue1);
        console.log('Input Value 2:', inputValue2);
        console.log('Input Value 3:', inputValue3);
        console.log('inputType:', inputType);
        const query: string = inputValue1.trim();
        const query_add: string = inputValue2.trim();
        const vs_name: string = inputValue3.trim();

        // regular expression to match a webpath or link
        const webpathRegex = /^(https?:\/\/|www\.)[^ {]+(\{\*})?(\/[^ "]+)?(\?[^ "]+)?((#|\*)[^ "]+)?$/;



        // check if the input matches the webpath or link pattern
        if (webpathRegex.test(query)) {

            let answer;
            if (query.startsWith("https://github.com/") && inputType === MSG_TYPE.GITHUB_REPO) {
                console.log('Procecing GitHub Link....')
                answer = await processingData(MSG_TYPE.GITHUB_REPO, [query, query_add, vs_name]);
            } else {
                console.log('Procecing URL Link....')
                answer = await processingData(MSG_TYPE.URL, [query, query_add, vs_name]);
            }

            res.status(200).json({ answer: answer[0].pageContent });
        } else {
            res.status(400).json({ error: "Invalid input: not a webpath or link" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error })
    }
}
export default handler;
