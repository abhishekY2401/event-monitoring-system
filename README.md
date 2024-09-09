# Event-Monitoring-System

This project is a webhook service that processes GitHub events, stores them in a MongoDB database, and provides endpoints to fetch these events. It handles various GitHub event types such as push events, pull requests, and merge events.

## Prerequisites

Before running the project, ensure you have the following prerequisites:

1. [Python 3.8 or later](https://www.python.org/downloads/)
2. [MongoDB](https://www.mongodb.com/): This should be running online on web
3. [ngrok](https://ngrok.com/download)
4. Create a new github repository named 'actions-repo'

## Installation

1. **Clone the Repository**

   ```
   bash
   git clone https://github.com/yourusername/webhook-repo.git
   cd webhook-repo
   ```
  
2. Create a Virtual Environment

    ```
    python -m venv venv
    source venv/bin/activate  # On Windows, use venv\Scripts\activate
    ```
    
3. Install Dependencies

   ```
   pip install -r requirements.txt
   ```

## Configuration

  ### MongoDB Configuration

  Make sure your MongoDB connection settings are correctly configured in your application. If you are using a local MongoDB instance, the default connection URI 
  should be suitable and put the connection string in project's .env file

## Running the Application

1. Set Up Environment Variables

   Replace the original secrets with the placeholder in .env file to ensure our application works perfectly.

2. Run the Backend

   ```
   python run.py
   ```

3. Next start the ngrok server to receive events from github webhook

   ```
   ngrok http 8000
   ```
   
4. Now it will generate a production URL, then paste the URL in settings of actions-repo in webhook section
   and put the following endpoint to receive events from this webhook.

   ```
   {production_url_generated_by_ngrok}/webhook/receiver
   ```
   
6. Now run the frontend

   ```
   cd event-monitoring-system
   yarn run dev
   ```

## Endpoints

  - POST /webhook/receiver

    Receives GitHub events and inserts them into MongoDB.

  - GET /webhook/all-events

    Fetches all events from MongoDB.

  - GET /webhook/latest-events

    Fetches the latest events from MongoDB. Optionally, you can provide a latest_timestamp query parameter to fetch events since the specified timestamp.

## Troubleshooting

  - Ensure MongoDB is running and accessible.
  - Verify that the required Python packages are installed.
  - Check that the Flask app is correctly configured and pointing to the right entry file.
