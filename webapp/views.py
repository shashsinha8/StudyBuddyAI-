from flask import Blueprint, render_template, request, jsonify
from dotenv import load_dotenv, dotenv_values, find_dotenv
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
    # Placeholder function - replace this with your chatbot logic

    completion = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": message}],
        temperature=0,
    )
    return completion["choices"][0]["message"]["content"]
