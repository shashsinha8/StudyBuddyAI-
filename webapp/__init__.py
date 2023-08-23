from flask import Flask, request, jsonify
import os


def create_app():
    app = Flask(__name__)
    absolute_path = os.path.dirname(__file__)
    relative_path = "documents"
    UPLOAD_FOLDER = os.path.join(absolute_path, relative_path)
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

    from .views import views

    app.register_blueprint(views, url_prefix="/")

    return app
