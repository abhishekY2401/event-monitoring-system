from flask import Flask
from flask_cors import CORS
from app.webhook.routes import webhook


# Creating our flask app
def create_app():

    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

    # registering all the blueprints
    app.register_blueprint(webhook)

    return app
