import { Database, getDatabase, push, ref, set } from "firebase/database";
import firebase_app from "../config";
import { WriteChatDataInputProps, WriteConversationMessageDataInputProps, WriteUserDataInputProps } from "./types";

const db = getDatabase(firebase_app);

/**
 * The function `writeUserData` writes user data to a specific location in the database.
 * @param {WriteUserDataInputProps}  - - `userId`: The unique identifier for the user.
 */
function writeUserData({ userId, user }: WriteUserDataInputProps) {
  set(ref(db, "users/" + userId), user);
}
 
/**
 * The function `writeChatData` creates a new chat and conversation in a database, and returns the key
 * of the new chat.
 * @param {WriteChatDataInputProps}  - - `from_userId`: The ID of the user sending the message.
 * @returns the key of the newly created chat.
 */
function writeChatData({ from_userId, to_userId, message }: WriteChatDataInputProps): string | null {
  const newChatRef = push(ref(db, "chats/"));
  set(newChatRef, {
    users: [from_userId, to_userId],
  });
  if (message) {
    const newConversationRef = push(ref(db, "conversations/" + newChatRef.key));
    set(newConversationRef, {
      message,
      from: from_userId,
      created: new Date().toISOString(),
    });
  }
  return newChatRef.key;
}

/**
 * The function writes a conversation message data to a specific chat in a database.
 * @param {WriteConversationMessageDataInputProps}  - - `chatId`: The ID of the chat or conversation
 * where the message will be written.
 */
function writeConversationMessageData({ chatId, userId, message }: WriteConversationMessageDataInputProps) {
  const newConversationRef = push(ref(db, "conversations/" + chatId));
  set(newConversationRef, {
    message,
    from: userId,
    created: new Date().toISOString(),
  });
}

export { writeUserData, writeChatData, writeConversationMessageData };
