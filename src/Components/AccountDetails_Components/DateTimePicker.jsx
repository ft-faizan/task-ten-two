import { useState } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button.jsx";
import { Calendar } from "@/components/ui/calendar.jsx";
import { Input } from "@/components/ui/input.jsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.jsx";

import { ChevronDownIcon } from "lucide-react"

function DateTimePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)

  const selectedDate = value || new Date()

  const handleDateSelect = (date) => {
    if (!date) return

    const updated = new Date(selectedDate)
    updated.setFullYear(date.getFullYear())
    updated.setMonth(date.getMonth())
    updated.setDate(date.getDate())

    onChange(updated)
    setOpen(false)
  }

  const handleTimeChange = (e) => {
    const [hours, minutes] = e.target.value.split(":")
    const updated = new Date(selectedDate)
    updated.setHours(hours)
    updated.setMinutes(minutes)

    onChange(updated)
  }

  return (
    <div className="flex gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between w-45 dark:bg-[#27272A] dark:text-gray-300">
            {format(selectedDate, "PPP")}
            <ChevronDownIcon className="ml-2 h-4 w-20" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-white text-black dark:bg-[#27272A] dark:text-gray-300  cursor-pointer rounded-2xl " align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="dark:bg-gray-500 dark:text-white cursor-pointer"
          />
        </PopoverContent>
      </Popover>

      <Input
        type="time"
        value={format(selectedDate, "HH:mm")}
        onChange={handleTimeChange}
        className="w-35 dark:bg-[#27272A] dark:text-gray-300 "
      />
    </div>
  )
}

export default DateTimePicker;
