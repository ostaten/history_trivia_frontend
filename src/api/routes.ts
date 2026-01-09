// frontend/src/api/chronokwizApi.ts
import axios, { type AxiosResponse } from 'axios';
import type { LandmarkDataStructure } from '../models/types';
import type { KwizEventsPayload } from './types';

export async function getTriviaEvents(query: {
  category?: string;
  type?: string;
  difficulty?: string;
}) {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/trivia`,
    {
      params: query,
      withCredentials: true
    }
  );
  return response.data;
}

export async function getChronokwizOfTheDay(query: {
  category?: string;
  type?: string;
  difficulty?: string;
}): Promise<AxiosResponse> {
  return axios.get(`${import.meta.env.VITE_API_BASE_URL}/chronokwiz/get`, {
    params: query,
    withCredentials: true
  });
}

export async function markEventSeen(eventId: number) {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/events/seen`,
    { eventId },
    { withCredentials: true }
  );
  return response.data;
}

export async function addEvents(events: any[]) {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/events/add`,
    { events }
  );
  return response.data;
}
