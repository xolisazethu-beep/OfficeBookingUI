// src/components/RoomCard.tsx
import type { RoomResponse } from "@/types";

// Props live in the same file as the component. Nothing is `any`.
interface RoomCardProps {
  room: RoomResponse;
  // true when this card's room id matches the currently selected id (Part 5)
  isSelected: boolean;
  // called with the room's id when the card is clicked (Part 5)
  onSelect: (id: string) => void;
}

// Named export (not default) — Part 3 requirement.
export function RoomCard({ room, isSelected, onSelect }: RoomCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(room.id)}
      aria-pressed={isSelected}
      className={[
        "w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition",
        "hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        // selected style: coloured border + ring (Part 5)
        isSelected
          ? "border-indigo-500 ring-2 ring-indigo-500"
          : "border-gray-200 ring-0",
      ].join(" ")}
    >
      {/* Heading + availability badge sit on one row, badge top-right (Part 6) */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">{room.name}</h2>

        {/* Badge ALWAYS renders — only its colour/label is conditional (Part 6) */}
        {room.isAvailable ? (
          <span className="shrink-0 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
            Available
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-800">
            Booked
          </span>
        )}
      </div>

      {/* Floor and capacity on one line, separated by a middot (Part 3) */}
      <p className="mt-2 text-sm text-gray-600">
        Floor {room.floor} · Seats {room.capacity}
      </p>

      {/*
        Next-slot line renders ONLY when the room is booked.
        We negate a boolean (!room.isAvailable) rather than using a number,
        which sidesteps the "&& with 0" rendering bug (explained in Part 6).
      */}
      {!room.isAvailable && (
        <p className="mt-3 text-xs font-medium text-red-600">Next slot: 2:00 PM</p>
      )}
    </button>
  );
}
