export type NotificationType = "info" | "error";

export interface Notification {
  readonly message: string;
  readonly type: NotificationType;
}