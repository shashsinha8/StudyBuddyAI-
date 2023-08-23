from webapp import create_app, request, jsonify
from flask_cors import CORS

app = create_app()
if __name__ == "__main__":
    app.run(debug=True, port=5000)
