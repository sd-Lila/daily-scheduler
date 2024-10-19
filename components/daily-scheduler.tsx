'use client'

import React, { useState, useEffect } from 'react'
import { Trash2, Edit2, Check, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface Event {
  id: number
  time: string
  description: string
  completed: boolean
}

export function DailySchedulerComponent() {
  const [events, setEvents] = useState<Event[]>([])
  const [newEvent, setNewEvent] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    const now = new Date()
    setSelectedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`)
  }, [])

  const addEvent = () => {
    if (newEvent.trim() === '') return
    const time = selectedTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setEvents([...events, { id: Date.now(), time, description: newEvent, completed: false }])
    setNewEvent('')
    // 刷新时间选择器为当前时间
    const now = new Date()
    setSelectedTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`)
  }

  const deleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id))
  }

  const toggleComplete = (id: number) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ))
  }

  const startEditing = (id: number, description: string) => {
    setEditingId(id)
    setNewEvent(description)
  }

  const saveEdit = () => {
    if (editingId === null) return
    setEvents(events.map(event => 
      event.id === editingId ? { ...event, description: newEvent } : event
    ))
    setEditingId(null)
    setNewEvent('')
  }

  const getEventPosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return (hours * 60 + minutes) / (24 * 60) * 100
  }

  const timelineHours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left column - Timeline */}
      <div className="w-full md:w-1/2 p-4 bg-white shadow-md overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4">Timeline</h2>
        <div className="relative h-[calc(100vh-8rem)]">
          {/* Vertical colorful axis */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>
          
          {/* Hour markers */}
          {timelineHours.map(hour => (
            <div key={hour} className="absolute left-1/2 transform -translate-x-1/2" style={{ top: `${(hour / 24) * 100}%` }}>
              <div className="w-3 h-0.5 bg-gray-300"></div>
              <span className="absolute left-4 text-xs text-gray-500">{hour}:00</span>
            </div>
          ))}

          {/* Events */}
          {events.sort((a, b) => a.time.localeCompare(b.time)).map((event, index) => (
            <div 
              key={event.id} 
              className={`absolute ${index % 2 === 0 ? 'left-0' : 'right-0'} w-[calc(50%-24px)] p-2 bg-gray-50 rounded-lg shadow text-sm`}
              style={{ top: `${getEventPosition(event.time)}%` }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{event.time}</span>
                <div className="flex items-center space-x-1">
                  <Checkbox
                    checked={event.completed}
                    onCheckedChange={() => toggleComplete(event.id)}
                    className="h-3 w-3"
                  />
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => startEditing(event.id, event.description)}>
                    <Edit2 className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => deleteEvent(event.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <p className={`mt-1 ${event.completed ? 'line-through text-gray-500' : ''}`}>
                {event.description}
              </p>
              <div className={`absolute top-1/2 ${index % 2 === 0 ? 'right-[-24px]' : 'left-[-24px]'} w-[24px] h-px bg-gray-300`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column - Event Input */}
      <div className="w-full md:w-1/2 p-4">
        <h2 className="text-2xl font-bold mb-4">Add Event</h2>
        <div className="flex items-center space-x-2 mb-4">
          <Input
            type="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-32"
          />
          <Input
            type="text"
            placeholder="Enter event description"
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={editingId !== null ? saveEdit : addEvent}>
            {editingId !== null ? <Check className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {editingId !== null ? 'Save' : 'Add'}
          </Button>
        </div>
      </div>
    </div>
  )
}