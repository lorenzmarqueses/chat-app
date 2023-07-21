import { Database } from "firebase/database";

interface WriteUserDataProps {
  username: string;
  email: string;
  profile_picture: string;
}

interface WriteUserDataInputProps {
  userId: string;
  user: WriteUserDataProps;
}

interface WriteChatDataInputProps {
  from_userId: string;
  to_userId: string;
  message: string;
}

interface WriteConversationMessageDataInputProps {
  chatId: string;
  userId: string;
  message: string;
}

interface UserDataProps {
  id: string;
  username: string;
  email: string;
  profile_picture: string;
  is_typing: boolean;
}

interface ChatMessageDataProps {
  from: UserDataProps;
  message: string;
  created: string;
}

interface ChatDataProps {
  id: string;
  users: UserDataProps[];
  messages: ChatMessageDataProps[];
}

export type {
  WriteUserDataInputProps,
  WriteChatDataInputProps,
  WriteConversationMessageDataInputProps,
  UserDataProps,
  ChatDataProps,
  ChatMessageDataProps,
};
