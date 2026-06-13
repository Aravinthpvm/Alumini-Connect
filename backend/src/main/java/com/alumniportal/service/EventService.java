package com.alumniportal.service;

import com.alumniportal.dto.request.EventRequest;
import com.alumniportal.model.Event;
import com.alumniportal.model.enums.EventType;
import com.alumniportal.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Event createEvent(String organizerId, String organizerType, EventRequest request) {
        Event event = new Event();
        event.setOrganizer(organizerId);
        event.setOrganizerType(organizerType);
        event.setEventTitle(request.getEventTitle());
        event.setDescription(request.getDescription());
        event.setEventType(EventType.valueOf(request.getEventType().toUpperCase()));
        if (request.getEventDate() != null) {
            event.setEventDate(LocalDateTime.parse(request.getEventDate()));
        }
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setMode(request.getMode());
        event.setVenue(request.getVenue());
        event.setMeetingLink(request.getMeetingLink());
        event.setMaxParticipants(request.getMaxParticipants());
        if (request.getRegistrationDeadline() != null) {
            event.setRegistrationDeadline(LocalDateTime.parse(request.getRegistrationDeadline()));
        }
        event.setSpeakerName(request.getSpeakerName());
        event.setSpeakerDesignation(request.getSpeakerDesignation());
        event.setTopics(request.getTopics());
        return eventRepository.save(event);
    }

    public List<Event> getAllUpcomingEvents() {
        return eventRepository.findByStatusOrderByEventDateAsc("UPCOMING");
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(String id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public Event registerForEvent(String eventId, String userId, String userType) {
        Event event = getEventById(eventId);

        if (event.getMaxParticipants() != null && event.getCurrentCount() >= event.getMaxParticipants()) {
            throw new RuntimeException("Event is full");
        }

        if ("STUDENT".equals(userType)) {
            if (!event.getRegisteredStudents().contains(userId)) {
                event.getRegisteredStudents().add(userId);
                event.setCurrentCount(event.getCurrentCount() + 1);
            }
        } else {
            if (!event.getRegisteredAlumni().contains(userId)) {
                event.getRegisteredAlumni().add(userId);
                event.setCurrentCount(event.getCurrentCount() + 1);
            }
        }
        event.setUpdatedAt(LocalDateTime.now());
        return eventRepository.save(event);
    }

    public List<Event> getOrganizerEvents(String organizerId) {
        return eventRepository.findByOrganizer(organizerId);
    }

    public Event updateEventStatus(String eventId, String status) {
        Event event = getEventById(eventId);
        event.setStatus(status);
        event.setUpdatedAt(LocalDateTime.now());
        return eventRepository.save(event);
    }
}
