export default interface RecordingStatusCallback {
  AccountSid: string;
  CallSid: string;
  RecordingSid: string;
  RecordingUrl: string;
  RecordingStatus: "completed" | "failed";
  RecordingDuration: number;
  RecordingChannels: number;
  RecordingSource: string;
}
