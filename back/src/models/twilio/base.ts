export default interface TwilioBaseRequest {
  CallSid: string;
  AccountSid: string;
  From: string;
  To: string;
  CallStatus:
    | "queued"
    | "ringing"
    | "in-progress"
    | "completed"
    | "busy"
    | "failed"
    | "no-answer";
  ApiVersion: string;
  Direction: "inbound" | "outbound-api" | "outbound-dial";
  ForwardedFrom?: string;
  CallerName?: string;
  ParentCallSid?: string;
}
