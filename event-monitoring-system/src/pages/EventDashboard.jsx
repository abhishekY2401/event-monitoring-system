import { useEffect, useState } from "react";
import { fetchEvents } from "@/services/api";
import { EventTable } from "@/components/EventTable";
import { EventsChart } from "@/components/EventsChart";

export const EventDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // append the new evenets to existing events array
  const appendNewEvents = (newEvents) => {
    setEvents((prevEvents) => {
        const existingIds = prevEvents.map((event) => event.request_id)
        const filterNewEvents = newEvents.filter(
            (event) => !existingIds.includes(event.request_id) 
        )
        return [...prevEvents, ...filterNewEvents];
    })
  }

  // Fetch events from MongoDB
  const getEvents = async () => {
    try {
        setLoading(true);
        const eventData = await fetchEvents();
        appendNewEvents(eventData);
        setEvents(eventData);
        setLoading(false);
    } catch (error) {
        console.error("Error fetching events:", error);
        setLoading(false);
    }
  };

  // Fetch every 15 seconds
  useEffect(() => {
    getEvents(); // component is mounted for the first time

    // Set interval to fetch every 15 seconds
    const interval = setInterval(() => {
      getEvents();
    }, 20000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []); // Dependency array ensures useEffect runs only once on mount

  if (loading && events.length === 0) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Event Monitoring System</h1>
      
      <div className="mb-8">
        <EventsChart events={events} />
      </div>
      
      <EventTable events={events} />
    </div>
  );
};
