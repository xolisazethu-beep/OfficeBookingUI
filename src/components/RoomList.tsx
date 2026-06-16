// src/components/RoomList.tsx
import type { RoomResponse } from "@/types";
import { RoomCard } from "./RoomCard";

interface RoomListProps {
  rooms: RoomResponse[];
  // selection plumbing passed straight through to each RoomCard (Part 5)
  selectedRoomId: string | null;
  onSelect: (id: string) => void;
}

export function RoomList({ rooms, selectedRoomId, onSelect }: RoomListProps) {
  // Early return for the empty state (Part 7) — no ternary wrapping the grid.
  if (rooms.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 py-16 text-center">
        <p className="text-base font-semibold text-gray-900">
          No conference rooms are free right now
        </p>
        <p className="mt-1 text-sm text-gray-500">
          Every room is booked. Check back once the next slot opens up.
        </p>
      </div>
    );
  }

  // Responsive grid: 1 col mobile, 2 tablet, 3 desktop (Part 4).
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard
          key={room.id} // stable key derived from the room's id (Part 4)
          room={room}
          isSelected={room.id === selectedRoomId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
