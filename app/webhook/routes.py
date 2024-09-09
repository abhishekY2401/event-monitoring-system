from flask import Blueprint, json, request, jsonify
from ..extensions import collection
from .events import create_event
import datetime
import logging
import pytz

webhook = Blueprint('Webhook', __name__, url_prefix='/webhook')

logging.basicConfig(level=logging.INFO,  # Adjust level as needed (DEBUG, INFO, WARNING, ERROR)
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')

logger = logging.getLogger(__name__)

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

        try:
            # Store event data into MongoDB
            collection.insert_one(event.to_dict())
            logger.info('Event inserted successfully')

        except Exception as e:
            logger.error('Error inserting event: %s', str(e))
            return jsonify({"error": "Failed to insert event"}), 500

    return jsonify({'status': 'success'}), 200


@webhook.route('/all-events', methods=['GET'])
def get_all_events():
    try:
        events = list(collection.find({}))

        # convert the ids into string, bcoz ObjectId is not json serializable
        events = [convert_objectId(event) for event in events]

        logger.info('Fetched %d events', len(events))

        return jsonify(events), 200

    except Exception as e:
        logger.error('Error fetching all events: %s', str(e))
        return jsonify({"error": str(e)}), 500


@webhook.route('/latest-events', methods=['GET'])
def get_latest_events():
    try:
        latest_timestamp = request.args.get('latest_timestamp')
        logger.info(
            'Received latest event timestamp: %s', latest_timestamp)

        if latest_timestamp:
            # Fetch new events since the last timestamp
            query = {"timestamp": {"$gt": latest_timestamp}}
            # print("newquery:", query)
            new_events = list(collection.find(query).sort("timestamp", -1))

        latest_events = [convert_objectId(event) for event in new_events]

        logger.info('Fetched %d latest events', len(latest_events))
        return jsonify(latest_events), 200

    except Exception as e:
        logger.error('Error fetching latest events: %s', str(e))
        return jsonify({"error": str(e)}), 500
