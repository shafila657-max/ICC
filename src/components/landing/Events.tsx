"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, Users, ArrowRight, ChevronRight } from "lucide-react";
import { Container, SectionHeading, Card, Badge, Button, Modal } from "@/components/ui";
import { EVENTS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof EVENTS)[0] | null>(null);

  return (
    <section id="events" className="section-padding bg-sand-50 relative">
      <div className="absolute inset-0 islamic-pattern-bg pointer-events-none" />
      <Container className="relative">
        <SectionHeading
          badge="Events"
          title="Upcoming Community Events"
          subtitle="Join us for inspiring gatherings, educational workshops, and community celebrations."
        />

        <div className="grid md:grid-cols-2 gap-6">
          {EVENTS.map((event, i) => (
            <Card key={event.id} hover className="group relative overflow-hidden">
              {event.is_featured && (
                <div className="absolute top-4 right-4">
                  <Badge variant="gold">⭐ Featured</Badge>
                </div>
              )}

              {/* Date Display */}
              <div className="flex gap-4">
                <div className="shrink-0 flex flex-col items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-600/20">
                  <span className="text-2xl font-bold leading-none">
                    {new Date(event.date).getDate()}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-emerald-200 mt-1">
                    {new Date(event.date).toLocaleString("en", { month: "short" })}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-sand-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-sand-500 line-clamp-2 mb-3">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="mt-4 pt-4 border-t border-sand-100 flex flex-wrap gap-4 text-sm text-sand-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  {event.time}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  {event.location}
                </div>
                {event.max_attendees && (
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-emerald-500" />
                    {event.max_attendees} spots
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </button>
                <Button size="sm" variant="primary">
                  RSVP
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-10 text-center">
          <Button variant="outline" size="md">
            View All Events
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Container>

      {/* Event Detail Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <p className="text-sand-600">{selectedEvent.description}</p>
            <div className="space-y-3 bg-sand-50 rounded-xl p-4">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span className="text-sand-700">{formatDate(selectedEvent.date)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-emerald-600" />
                <span className="text-sand-700">{selectedEvent.time}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span className="text-sand-700">{selectedEvent.location}</span>
              </div>
            </div>
            <Button className="w-full" size="lg">
              Register for This Event
            </Button>
          </div>
        )}
      </Modal>
    </section>
  );
}
