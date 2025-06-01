export interface IChat {
  _id?: string;
  chatId: string;
  content: string;
  role: "user" | "assistant";
}
