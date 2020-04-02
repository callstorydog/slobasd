export interface Record {
  id: string;
  createdAt: number;
  messageText: string;
  phoneNumber: string;
  audioUrl: string;
  attachedImages: string[];
  tags: string[];
}
