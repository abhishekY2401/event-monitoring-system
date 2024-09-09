import { useEffect, useState } from "react";
import { fetchLatestEvents, fetchAllEvents } from "@/services/api";
import { EventTable } from "@/components/EventTable";
import { EventsChart } from "@/components/EventsChart";

export const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [latestTimestamp, setLatestTimestamp] = useState(null);

  // Append new events to existing events array
  const appendNewEvents = (newEvents) => {
    setEvents((prevEvents) => {
      const existingIds = prevEvents.map((event) => event.request_id);
      const filterNewEvents = newEvents.filter(
        (event) => !existingIds.includes(event.request_id)
      );
      return [...prevEvents, ...filterNewEvents];
    });
  };

  // Fetch events from MongoDB
  const getLatestEvents = async () => {
    try {
      const eventData = await fetchLatestEvents(latestTimestamp); // Await the promise
      if (eventData.length > 0) {
        appendNewEvents(eventData);

        // Update the latest timestamp based on the most recent event
        const latestEvent = eventData[eventData.length - 1];
        setLatestTimestamp(latestEvent.timestamp); // Set the new latest timestamp after fetching new events
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch all events on component mount
    const fetchAllEventsData = async () => {
      try {
        const allEventsData = await fetchAllEvents(); // Await the promise
        setEvents(allEventsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching all events:", error);
        setLoading(false);
      }
    };

    fetchAllEventsData(); // Call the async function
  }, []);

  // Fetch latest events every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      getLatestEvents();
    }, 15000);

    return () => clearInterval(interval); // Clear interval on component unmount
  }, [latestTimestamp]); // Dependency array includes latestTimestamp

  if (loading && events.length === 0) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Event Logging System</h1>

      <div className="mb-8">
        <EventsChart events={events} />
      </div>

      <EventTable events={events} />
    </div>
  );
};
