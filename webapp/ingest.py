from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings

from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    CharacterTextSplitter,
)
from langchain.document_loaders import PyPDFLoader
from dotenv import load_dotenv, find_dotenv
import os
import openai
import sys

# sys.path.append("../..")


_ = load_dotenv(find_dotenv())  # read local .env file
openai.api_key = os.environ["OPENAI_API_KEY"]

### CONVERTING PDF INTO CHUNKS AND THEN INTO EMBEDDINGS AND STORINGG THEM INTO CHROMA ###

# Load all the pages from the file into a variable using PyPDFLoader

loader = PyPDFLoader(
    "webapp/documents/CFA_2023-L1V5_FIXED_INCOME_DERIVATIVES_ALTERNATIVE_INVESTEMNTS_PORTFOLIO_MANAGEMENT.pdf"
)
raw_pages = loader.load()


chunk_size = 1000
chunk_overlap = 200
r_splitter = RecursiveCharacterTextSplitter(
    chunk_size=chunk_size, chunk_overlap=chunk_overlap
)
pages = r_splitter.split_documents(raw_pages)


embedding = OpenAIEmbeddings()
persist_directory = "docs/chroma/"
vectordb = Chroma.from_documents(
    documents=pages, embedding=embedding, persist_directory=persist_directory
)


### LOADING MULTIPLE FILES

# loaders = [
#     # Duplicate documents on purpose - messy data
#     PyPDFLoader("webapp/documents/l1v1.pdf"),
#     PyPDFLoader("webapp/documents/l1v2.pdf"),
#     PyPDFLoader("webapp/documents/l1v3.pdf"),
# ]
# docs = []
# for loader in loaders:
#     docs.extend(loader.load())

# # Split
# chunk_size = 1000
# chunk_overlap = 200
# r_splitter = RecursiveCharacterTextSplitter(
#     chunk_size=chunk_size, chunk_overlap=chunk_overlap
# )
# splits = r_splitter.split_documents(docs)


# embedding = OpenAIEmbeddings()
# persist_directory = "docs/chroma/"
# vectordb = Chroma.from_documents(
#     documents=splits, embedding=embedding, persist_directory=persist_directory
# )


persist_directory = "docs/chroma/"
embedding = OpenAIEmbeddings()
vectordb = Chroma(persist_directory=persist_directory, embedding_function=embedding)
print(vectordb._collection.count())
