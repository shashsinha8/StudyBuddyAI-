from flask import Blueprint, render_template, request, jsonify
from dotenv import load_dotenv, dotenv_values, find_dotenv
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
import openai
import os

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

views = Blueprint("views", __name__)


@views.route("/")
def home():
    return render_template("home.html")


@views.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.get_json()
    user_message = data["message"]
    print(f"Received message: {user_message}")

    bot_response = process_user_message(user_message)
    print(f"Sending response: {bot_response}")

    return jsonify({"message": bot_response})


def process_user_message(message):
    # Build prompt template
    template = """Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up 
    an answer. Use three sentences maximum. Keep the answer as concise as possible. Always say "thanks for asking!" at the end of the answer. 
    {context}
    Question: {question}
    Helpful Answer:"""

    # get vector db and llm
    persist_directory = "docs/chroma/"
    embedding = OpenAIEmbeddings()
    vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)

    # create qa chain
    QA_CHAIN_PROMPT = PromptTemplate.from_template(template)
    qa_chain = RetrievalQA.from_chain_type(
        llm,
        retriever=vectordb.as_retriever(),
        return_source_documents=True,
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT},
    )
    result = qa_chain({"query": message})
    # print(f'{result["source_documents"][0]}\n')

    for i in result["source_documents"]:
        print(i)
        print()
        print()
    # implementing chat history
    memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
    retriever = vectordb.as_retriever()
    qa = ConversationalRetrievalChain.from_llm(llm, retriever=retriever, memory=memory)
    result = qa({"question": message})
    return result["answer"]
