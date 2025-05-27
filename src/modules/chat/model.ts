export interface IChat {
  _id: string;
  chatId: string;
  response: string;
  role: "user" | "assistant";
}
