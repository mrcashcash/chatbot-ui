import fs from 'fs';
import { MSG_TYPE, UPLOAD_DIR } from "@/utils/app/const";
import { processingData } from "@/utils/server/llm";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
        const { messages, key, model, googleAPIKey, googleCSEId } =
            req.body;

        const userMessage = messages[messages.length - 1];
        const query = userMessage.content.trim();

        // regular expression to match a webpath or link
        const webpathRegex = /^(https?:\/\/|www\.)[^ "]+$/;


        // check if the input matches the webpath or link pattern
        if (webpathRegex.test(query)) {

            const answer = await processingData(MSG_TYPE.URL, [query]);
            // Extract the filename from the link
            const cleanLink = query.replace(/(^\w+:|^)\/\/(www\.)?/, '');
            // Replace every / or \ in the link with a dot
            const dottedLink = cleanLink.replace(/[\/\\]/g, '.');
            const uploadDir = path.join(process.cwd(), UPLOAD_DIR);
            const filename = path.join(uploadDir, dottedLink);

            // Add the .lnk extension to the filename
            const linkFilename = `${filename}.lnk`;

            // Save the link to a file with the .lnk extension
            fs.writeFile(linkFilename, query, (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`Link saved to ${linkFilename}`);
            });
            res.status(200).json({ answer: answer[0].pageContent });
        } else {
            res.status(400).json({ error: "Invalid input: not a webpath or link" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error' })
    }
}
export default handler;
