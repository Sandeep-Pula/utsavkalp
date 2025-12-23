import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, addDoc, deleteDoc, updateDoc, doc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time: string;
    location: string;
    description?: string;
    type: string;
    completionPercentage?: number;
    planType?: string;
    checklist?: { label: string; completed: boolean }[];
}

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private firestore = inject(Firestore);
    private eventsCollection = collection(this.firestore, 'events');

    // Real-time signal from Firestore
    readonly events = toSignal(
        collectionData(this.eventsCollection, { idField: 'id' }) as Observable<CalendarEvent[]>,
        { initialValue: [] }
    );

    constructor() { }

    addEvent(newEvent: Omit<CalendarEvent, 'id'>) {
        return addDoc(this.eventsCollection, newEvent);
    }

    deleteEvent(id: string) {
        const docRef = doc(this.firestore, `events/${id}`);
        deleteDoc(docRef);
    }

    updateEvent(id: string, data: Partial<CalendarEvent>) {
        const docRef = doc(this.firestore, `events/${id}`);
        updateDoc(docRef, data);
    }

    getEventsByDate(date: string): CalendarEvent[] {
        return this.events().filter(e => e.date === date);
    }
}
