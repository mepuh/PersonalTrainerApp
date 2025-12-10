import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { Training } from '../types';
import { getTrainings } from '../trainingApi';
import { getCustomer } from '../customerApi';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup the localizer for the calendar
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: {
        enUS,
    },
});

// Type for calendar events
type CalendarEvent = {
    id: string;
    title: string;
    start: Date;
    end: Date;
};

export default function CalendarComponent() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<View>('month');
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        // Fetch all trainings from API
        getTrainings()
            .then(data => {
                const trainings = data._embedded?.trainings || [];

                // Create array of promises to fetch customer names for each training
                const promises = trainings.map((training: Training) => {
                    // Fetch customer details for this training
                    return getCustomer(training._links.customer.href)
                        .then(customer => {
                            // Convert training start time to Date object
                            const startDate = new Date(training.date);
                            // Calculate end time by adding duration (minutes converted to Date function's milliseconds) to start time
                            const endDate = new Date(startDate.getTime() + training.duration * 60000);

                            // Return calendar event object
                            return {
                                id: training._links.self.href,
                                title: `${training.activity} - ${customer.firstname} ${customer.lastname}`,
                                start: startDate,
                                end: endDate,
                            };
                        })
                        .catch(err => {
                            // If customer fetch fails, show training without customer name
                            console.error('Error fetching customer:', err);
                            const startDate = new Date(training.date);
                            const endDate = new Date(startDate.getTime() + training.duration * 60000);

                            return {
                                id: training._links.self.href,
                                title: `${training.activity} - Unknown Customer`,
                                start: startDate,
                                end: endDate,
                            };
                        });
                });

                // Wait for all customer fetches to complete
                return Promise.all(promises);
            })
            // Set the events
            .then(calendarEvents => {
                setEvents(calendarEvents);
                setLoading(false);
            })
            // Handle any errors during the fetch process
            .catch(err => {
                console.error('Error loading trainings:', err);
                setError('Error loading trainings');
                setLoading(false);
            });
    }, []);

    // Show loading message while fetching data
    if (loading) {
        return <div style={{ padding: '20px' }}>Loading trainings...</div>;
    }

    // Show error message if something went wrong
    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    }

    // Render the calendar
    return (
        <div style={{ padding: '20px' }}>
            <div style={{ height: '600px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    // Enable the toolbar with navigation buttons
                    toolbar={true}
                    // Set which view is currently showing
                    view={currentView}
                    // Handler for when user clicks view buttons (Month, Week, Day, Agenda)
                    onView={(newView) => setCurrentView(newView)}
                    // Available views that user can switch between
                    views={['month', 'week', 'day', 'agenda']}
                    // Current date being displayed in the calendar
                    date={currentDate}
                    // Handler for when user navigates (Previous, Next, Today buttons)
                    onNavigate={(newDate) => setCurrentDate(newDate)}
                />
            </div>
        </div>
    );
}
