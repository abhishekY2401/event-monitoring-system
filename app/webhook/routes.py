from flask import Blueprint, json, request, jsonify
from ..extensions import collection
from .events import create_event

webhook = Blueprint('Webhook', __name__, url_prefix='/webhook')

# helper function to convert the object id into string


def convert_objectId(event):
    if "_id" in event:
        event["_id"] = str(event["_id"])

    return event


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


@webhook.route('/events', methods=['GET'])
def get_all_events():
    try:
        events = list(collection.find({}))

        # convert the ids into string, bcoz ObjectId is not json serializable
        events = [convert_objectId(event) for event in events]

        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
