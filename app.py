from webapp import create_app, request, jsonify
from flask_cors import CORS

# github token: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
app = create_app()
if __name__ == "__main__":
    app.run(debug=True, port=5000)
