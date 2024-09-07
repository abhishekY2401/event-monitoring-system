from flask import Blueprint, json, request, jsonify
from ..extensions import collection
from .events import create_event

webhook = Blueprint('Webhook', __name__, url_prefix='/webhook')


@webhook.route('/receiver', methods=["POST"])
def receiver():
    if request.method == 'POST':
        # GET THE GITHUB HEADERS EVENT
        if not request.is_json:
            return jsonify({'error': 'Invalid input, JSON required'}), 400

        payload = request.json
        event = create_event(request, payload)

        # Insert event data into MongoDB
        collection.insert_one(event.to_dict())

    return jsonify({'status': 'success'}), 200
