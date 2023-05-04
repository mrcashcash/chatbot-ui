import os
import argparse
import threading
from flask import Flask, Response, request, make_response, jsonify, stream_with_context
from langchain.prompts import PromptTemplate
from langchain.callbacks.base import BaseCallbackHandler
from langchain.chat_models import ChatOpenAI
from langchain.chains import LLMChain
import openai
import queue


class StreamHandler(BaseCallbackHandler):
    def __init__(self, q):
        self.queue = q

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.queue.put(token)

    def stream(self):
        while True:
            try:
                token = self.queue.get()
                if token is None:
                    break
                yield token.encode('utf-8')
            except queue.Empty:
                # Continue waiting for tokens
                pass
        
app = Flask(__name__)
openai.api_key = os.environ.get('OPENAI_API_KEY')


@app.route('/query', methods=['GET'])
def query_from_llama_index():
    try:
        q = queue.Queue()
        my_handler = StreamHandler(q)
        chat = ChatOpenAI(temperature=0.9, 
            model_name=os.environ.get('MODEL_NAME', 'gpt-3.5-turbo'),
            verbose=True, 
            streaming=True )
        
        chat_prompt = PromptTemplate(
            input_variables=["product"],
            template="write 50 words story about {product}?",
        )
        chain = LLMChain(llm=chat, prompt=chat_prompt)

        message = request.args.get('message')

        def run_chain(message):
            try:
                resp= chain.run(message,callbacks=[my_handler])
            except Exception as e:
                q.put({"error": str(e)})
            finally:
                q.put(None)

        threading.Thread(target=run_chain, args=(message,)).start()

        return Response(my_handler.stream(), content_type='application/octet-stream')
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Chat Server")
    parser.add_argument("--debug", action="store_true", help="Enable debug mode")
    args = parser.parse_args()
    if not os.path.exists('./documents'):
        os.makedirs('./documents')
    app.run(port=int(os.environ.get('APP_PORT')), host=os.environ.get('APP_HOST'), debug=args.debug)
    
    
