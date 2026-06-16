// src/types/index.ts
//
// These interfaces mirror the Conference Booking API's DTO contracts exactly.
// They are the single source of truth the whole frontend compiles against.
// If the backend renames a field, every consumer of these types fails to
// compile until it is fixed — that compile-time failure is the goal.

/**
 * Mirrors API/Models/BookingType.cs.
 * The API serialises this enum as STRINGS, not integers, so we model it as a
 * string-literal union (never `string`).
 *
 * ⚠️ PLACEHOLDER VALUES — open API/Models/BookingType.cs in the backend repo
 * and replace these with the exact five names the enum declares. The shape
 * (a five-member union of string literals) is what matters; the spellings must
 * match the backend character-for-character.
 */
export type BookingType =
  | "Standard"
  | "Workshop"
  | "Interview"
  | "Maintenance"
  | "Private";

/**
 * Mirrors API/DTOs/RoomResponse.cs.
 * `id` is a C# Guid, serialised as a lowercase hyphenated 36-char string.
 */
export interface RoomResponse {
  id: string;
  name: string;
  floor: number;
  capacity: number;
  isAvailable: boolean;
}

/**
 * Mirrors API/DTOs/BookingResponse.cs.
 * `startTime` / `endTime` are C# DateTime, sent as ISO 8601 strings.
 * `type` uses the BookingType union — never a bare `string`.
 */
export interface BookingResponse {
  id: string;
  roomId: string;
  title: string;
  startTime: string; // ISO 8601, e.g. "2026-06-15T14:00:00Z"
  endTime: string; // ISO 8601, e.g. "2026-06-15T15:00:00Z"
  type: BookingType;
}
