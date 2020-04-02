export default interface Record {
  id: string;
  createdAt: number;
  messageText?: string;
  phoneNumber: string;
  recordingStatus: "in progress" | "finished";
}
