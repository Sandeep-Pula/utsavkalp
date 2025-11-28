import { Injectable, signal } from '@angular/core';

export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time: string;
    location: string;
    description?: string;
    type: 'wedding' | 'corporate' | 'birthday' | 'other';
    completionPercentage?: number;
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
    // Mock Data
    private initialEvents: CalendarEvent[] = [
        {
            id: '1',
            title: 'Wedding Ceremony',
            date: '2025-11-15',
            time: '10:00',
            location: 'Grand Hall',
            description: 'Main wedding ceremony for Client A',
            type: 'wedding',
            completionPercentage: 80
        },
        {
            id: '2',
            title: 'Corporate Gala',
            date: '2025-11-20',
            time: '18:00',
            location: 'Ballroom B',
            description: 'Annual gala dinner',
            type: 'corporate',
            completionPercentage: 45
        },
        {
            id: '3',
            title: 'Birthday Bash',
            date: '2025-11-25',
            time: '19:00',
            location: 'Garden Area',
            type: 'birthday',
            completionPercentage: 10
        }
    ];
    readonly events = signal<CalendarEvent[]>(this.initialEvents);

    constructor() { }

    addEvent(newEvent: Omit<CalendarEvent, 'id'>) {
        const event: CalendarEvent = {
            ...newEvent,
            id: crypto.randomUUID()
        };
        this.events.update(current => [...current, event]);
    }

    deleteEvent(id: string) {
        this.events.update(current => current.filter(e => e.id !== id));
    }

    getEventsByDate(date: string): CalendarEvent[] {
        return this.events().filter(e => e.date === date);
    }
}
