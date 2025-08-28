/**
 silent – disables all logs (least important in terms of action).

trace – very fine-grained logs, mostly used for deep debugging.

debug – used for general debugging.

info – normal operational messages.

warn – something unexpected but not causing failure.

error – an issue that caused failure in some part of the application.

fatal – a critical issue that might cause the system to shut down.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";
