export interface IChat {
  _id?: string;
  chatId?: string;
  projectId?: string;
  content: string;
  role: "user" | "assistant";
  createdAt?: string;
}
