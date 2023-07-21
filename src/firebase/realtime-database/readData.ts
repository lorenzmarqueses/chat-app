import { DataSnapshot, child, get, getDatabase, onValue, ref } from "firebase/database";
import firebase_app from "../config";
import { ChatDataProps, ChatMessageDataProps, UserDataProps } from "./types";

const db = getDatabase(firebase_app);

/**
 * The function `readUsersData` reads user data from a database and returns it as an array of objects.
 * @returns The function `readUsersData` returns a Promise that resolves to an array of `UserDataProps`
 * objects.
 */
async function readUsersData(): Promise<UserDataProps[]> {
  const dbRef = ref(db);
  const snapshot = await get(child(dbRef, `users/`));
  if (snapshot.exists()) {
    const data: UserDataProps[] = [];
    const dataSnapshots = snapshot.val();
    Object.keys(dataSnapshots).forEach((element) => {
      data.push({
        id: element,
        ...dataSnapshots[element],
      });
    });

    return data;
  } else {
    return [];
  }
}

/**
 * The function `readChatsData` reads chat data from a database and returns it through a callback
 * function.
 * @param {any} onCallBack - The `onCallBack` parameter is a callback function that will be called with
 * the result of reading the chats data. It should accept one parameter, which will be the data
 * retrieved from the database.
 */
async function readChatsData(onCallBack: any) {
  const dbRef = ref(db);

  // watch value on chats collection
  watchChatsData(async (chatSnapshot: any) => {
    // watch value on conversations collection
    watchConversationsData(async (dataConversationSnapshots: any) => {
      // assigning snapshots data to ChatDataProps
      const usersData = await readUsersData();
      const chatKeys = Object.keys(chatSnapshot ?? {});
      if (chatKeys) {
        const data: ChatDataProps[] = [];
        // loop chat snapshots
        chatKeys.forEach((dataChatSnapshotID) => {
          const messages: ChatMessageDataProps[] = [];

          // loop conversation snapshots and push into messages array
          if (dataConversationSnapshots && dataChatSnapshotID in dataConversationSnapshots) {
            const conversation = dataConversationSnapshots[dataChatSnapshotID];
            Object.keys(conversation).forEach((dataConversationSnapshotID: any) => {
              const conversationData = conversation[dataConversationSnapshotID];
              messages.push({
                ...conversationData,
                from: usersData.find((y) => conversationData.from === y.id),
              });
            });
          }

          // push messages array and snapshots data
          data.push({
            id: dataChatSnapshotID,
            users: usersData.filter((x) => chatSnapshot[dataChatSnapshotID].users.includes(x.id)),
            messages: messages,
          });
        });
        // pass the result using callback
        onCallBack(data);
      } else {
        // pass an empty result using callback
        onCallBack([]);
      }
    });
  });
}

async function watchChatsData(onCallBack: any) {
  const dbRef = ref(db);
  // watch value on chats collection
  onValue(
    child(dbRef, `chats/`),
    async (chatSnapshot) => {
      onCallBack(chatSnapshot.val());
    },
    (error) => {
      // pass an empty result using callback
      onCallBack(null);
    }
  );
}

async function watchConversationsData(onCallBack: any) {
  const dbRef = ref(db);

  // watch value on conversations collection
  onValue(
    child(dbRef, `conversations/`),
    async (conversationSnapshot) => {
      // assigning snapshots data to ChatDataProps
      onCallBack(conversationSnapshot.val());
    },
    (error) => {
      // pass an empty result using callback
      onCallBack(null);
    }
  );
}

export { readUsersData, readChatsData };
