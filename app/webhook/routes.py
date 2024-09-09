from flask import Blueprint, json, request, jsonify
from ..extensions import collection
from .events import create_event
import datetime
import logging
from dateutil import parser as date_parser

webhook = Blueprint('Webhook', __name__, url_prefix='/webhook')

# helper function to convert the object id into string


def convert_objectId(event):
    if "_id" in event:
        event["_id"] = str(event["_id"])

    return event


@webhook.route('/receiver', methods=["POST"])
def receiver():
    if request.method == 'POST':
        if not request.is_json:
            return jsonify({'error': 'Invalid input, JSON required'}), 400

        payload = request.json
        event = create_event(request, payload)

        # Insert event data into MongoDB
        collection.insert_one(event.to_dict())

    return jsonify({'status': 'success'}), 200


@webhook.route('/all-events', methods=['GET'])
def get_all_events():
    try:
        events = list(collection.find({}))

        # convert the ids into string, bcoz ObjectId is not json serializable
        events = [convert_objectId(event) for event in events]

        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@webhook.route('/latest-events', methods=['GET'])
def get_latest_events():
    try:
        # Get latest timestamp and count from query params
        latest_action_timestamp = request.args.get('latest_timestamp')
        print(latest_action_timestamp)
        new_events = []

        # If subsequent requests, fetch events newer than the latest timestamp
        if latest_action_timestamp:
            converted_timestamp = date_parser.isoparse(
                latest_action_timestamp).astimezone(None)
            print(f"Converted timestamp: {converted_timestamp}")

            event = collection.find_one({
                {"timestamp": {"$eq": converted_timestamp}},
            })

            print(event)

            # Fetch only the new events with timestamp greater than the last known timestamp
            new_events = list(collection.find(
                {"timestamp": {"$gt": converted_timestamp}},
            ))

            print("latest_events: ", new_events)

        # Convert ObjectId into a string to avoid JSON serialization errors
        latest_events = [convert_objectId(event) for event in new_events]

        return jsonify(latest_events), 200

    except Exception as e:
        logging.exception("Error fetching events")
        return jsonify({"error": str(e)}), 500
