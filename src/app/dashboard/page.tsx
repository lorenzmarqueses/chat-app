"use client";
import LoadingDialog from "@/component/dialog/loading";
import { useAuthContext } from "@/context/AuthContext";
import logout from "@/firebase/auth/logout";
import { readChatsData, readUsersData } from "@/firebase/realtime-database/readData";
import { ChatDataProps, UserDataProps } from "@/firebase/realtime-database/types";
import { writeChatData, writeConversationMessageData } from "@/firebase/realtime-database/writeData";
import { isoStringToTimeWithAMPM } from "@/utils/isoStringToTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Theme,
  Typography,
} from "@mui/material";
import { makeStyles, withStyles } from "@mui/styles";
import { useRouter } from "next/navigation";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  chatSection: {
    height: "100vh",
    width: "100%",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  sideBarSection: {
    borderRight: "1px solid #e0e0e0",
    background: "#2196F3",
  },
  messageArea: {
    background: "#f8f9fb",
    height: "75vh",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
      width: "12px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#E0E0E0",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
      "&:hover": {
        backgroundColor: "#555",
      },
    },
  },
  bubbleStyle: {
    padding: "10px 15px",
    minWidth: "10%",
    maxWidth: "80%",
  },
  nameLabel: {
    color: "white",
    fontWeight: "900",
  },
  subNameLabel: {
    color: "white",
  },
}));

const CssTextField = withStyles({
  root: {
    "& label": {
      color: "white",
    },
    "& label.Mui-focused": {
      color: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "yellow",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
      "&.Mui-focused fieldset": {
        borderColor: "yellow",
      },
    },
  },
})(TextField);

function Page() {
  const conversationContainerRef = React.useRef<any>(null);
  const classes = useStyles();
  const { user } = useAuthContext();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState<UserDataProps>();
  const [usersList, setusersList] = React.useState<UserDataProps[]>([]);
  const [newUsersList, setnewUsersList] = React.useState<UserDataProps[]>([]);
  const [chatList, setchatList] = React.useState<ChatDataProps[]>([]);
  const [currentUserChatList, setCurrentUserChatList] = React.useState<ChatDataProps[]>([]);
  const [isLoading, setisLoading] = React.useState(false);
  const [isCreateNewChatDialog, setisCreateNewChatDialog] = React.useState(false);
  const [selectedConversationID, setSelectedConversationID] = React.useState<string>("");
  const [messageInput, setMessageInput] = React.useState<string>("");

  React.useEffect(() => {
    initializeUsersDataFetch();
  }, []);

  React.useEffect(() => {
    handleConversationScrollToBottom();
  }, [selectedConversationID, chatList]);

  /**
   * The function initializes the users' data fetch and updates the current user, users list, new users
   * list, chat list, and current user's chat list.
   */
  const initializeUsersDataFetch = async () => {
    if (user != null) {
      const list = await readUsersData();
      setCurrentUser(list.find((x) => x.id === user?.uid));
      setusersList(list.filter((x) => x.id !== user?.uid));
      setnewUsersList(list.filter((x) => x.id !== user?.uid));
      readChatsData((data: ChatDataProps[]) => {
        setchatList(data);
        setCurrentUserChatList(data.filter((x) => x.users.some((y) => y.id === user?.uid)));
      });
    }
  };

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    setisLoading(true);
    logout();
  };

  /**
   * The function `handleSendMessage` sends a message to a selected conversation if the conversation
   * ID, user ID, and message input are valid.
   */
  const handleSendMessage = () => {
    if (selectedConversationID && user?.uid && messageInput != "") {
      writeConversationMessageData({
        chatId: selectedConversationID,
        userId: user?.uid,
        message: messageInput,
      });
      setMessageInput("");
    }
  };

  /**
   * The function `handleKeyDownMessageInput` checks if the key pressed is "Enter" and calls the
   * `handleSendMessage` function if it is.
   * @param {any} event - The `event` parameter is an object that represents the keyboard event that
   * occurred. It contains information about the event, such as the key that was pressed (`event.key`).
   */
  const handleKeyDownMessageInput = (event: any) => {
    if (event.key === "Enter") handleSendMessage();
  };

  /**
   * The function `openCreateNewChat` sets the state variable `isCreateNewChatDialog` to true.
   */
  const openCreateNewChat = () => {
    setisCreateNewChatDialog(true);
  };

  const handleClose = () => {
    setisCreateNewChatDialog(false);
  };

  /**
   * The function "handleSearchUser" filters a list of users based on a keyword entered by the user.
   * @param {any} event - The `event` parameter is an object that represents the event that triggered
   * the function. In this case, it is likely an event object that is generated when the user types
   * into an input field.
   */
  const handleSearchUser = (event: any) => {
    const keyword = event.target.value.toLowerCase();
    setnewUsersList(usersList.filter((x) => x.username.toLowerCase().includes(keyword)));
  };

  /**
   * The function `handleSearchChats` filters the `chatList` based on the `keyword` and updates the
   * `currentUserChatList` with the filtered results.
   * @param {any} event - The `event` parameter is the event object that is triggered when the search
   * input value changes. It is typically an object that contains information about the event, such as
   * the target element and the new value of the input.
   */
  const handleSearchChats = (event: any) => {
    const keyword = event.target.value.toLowerCase();
    const list = chatList.filter((x) => x.users.some((y) => y.id === user?.uid));
    setCurrentUserChatList(list.filter((x) => x.users.some((y) => y.username.includes(keyword))));
  };

  const isUserDataCurrentUser = (userData: UserDataProps) => userData.id === user?.uid;

  /**
   * The function creates a new chat and sends a "Hello" message to a specified user.
   * @param {string} userId - The `userId` parameter is a string that represents the ID of the user
   * with whom the chat is being created.
   */
  const createNewChat = (userId: string) => {
    const currentChat = currentUserChatList.find((x) =>
      x.users.some((y) => y.id === userId || y.id === currentUser?.id)
    );
    if (currentChat?.id) {
      handleClose();
      openChatConversation(currentChat?.id);
      return;
    }
    if (currentUser) {
      handleClose();
      setisLoading(true);
      writeChatData({ from_userId: currentUser.id, to_userId: userId, message: "Hello" });
      setisLoading(false);
    }
  };

  /**
   * The function `openChatConversation` sets the selected conversation ID if there is a current user.
   * @param {string} chatID - A string representing the ID of the chat conversation that needs to be
   * opened.
   */
  const openChatConversation = (chatID: string) => {
    if (currentUser) {
      setSelectedConversationID(chatID);
    }
  };

  /**
   * The function `getOtherUserOnChat` returns the first user in the `users` array that is not the
   * current user.
   * @param {UserDataProps[]} users - An array of UserDataProps objects.
   * @returns The function `getOtherUserOnChat` returns the first user object from the `users` array
   * that has an `id` different from the `user` object's `uid` property.
   */
  const getOtherUserOnChat = (users: UserDataProps[]) => {
    return users.find((x) => x.id !== user?.uid);
  };

  /**
   * The function scrolls the conversation container to the bottom.
   */
  const handleConversationScrollToBottom = () => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  };

  return (
    <div>
      <Grid container component={Paper} className={classes.chatSection}>
        <Grid item xs={3} className={classes.sideBarSection}>
          <List>
            <ListItem key={currentUser?.id}>
              <ListItemIcon>
                <Avatar alt={currentUser?.username} src={currentUser?.profile_picture} />
              </ListItemIcon>
              <ListItemText
                primary={currentUser?.username}
                secondary={currentUser?.email}
                classes={{ primary: classes.nameLabel, secondary: classes.subNameLabel }}
              />
              <IconButton
                edge="end"
                aria-label="more"
                aria-controls="dropdown-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="dropdown-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                keepMounted
              >
                <MenuItem sx={{ width: "120px" }} onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </ListItem>
          </List>
          <Grid item xs={12} style={{ padding: "10px" }}>
            <CssTextField
              size="medium"
              InputProps={{
                sx: {
                  padding: "0px !important",
                  borderRadius: "15px",
                  background: "transparent",
                },
              }}
              label="Search Chats"
              variant="outlined"
              fullWidth
              onChange={handleSearchChats}
            />
          </Grid>
          <List>
            {currentUserChatList?.map((chatData) => (
              <ListItemButton key={chatData.id} onClick={() => openChatConversation(chatData.id)}>
                <ListItemIcon>
                  <Avatar
                    alt={getOtherUserOnChat(chatData.users)?.id}
                    src={getOtherUserOnChat(chatData.users)?.profile_picture}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={getOtherUserOnChat(chatData.users)?.username}
                  secondary={chatData.messages[chatData.messages.length - 1]?.message}
                  classes={{ primary: classes.nameLabel, secondary: classes.subNameLabel }}
                />
              </ListItemButton>
            ))}
          </List>
        </Grid>
        {selectedConversationID ? (
          <Grid item xs={9}>
            <Box
              style={{
                padding: "20px",
                boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)",
              }}
            >
              <Typography variant="h5" textAlign="center">
                {chatList.find((x) => x.id === selectedConversationID)?.users.find((x) => x.id != user?.uid)?.username}
              </Typography>
            </Box>
            <List ref={conversationContainerRef} className={classes.messageArea}>
              {chatList
                .find((x) => x.id === selectedConversationID)
                ?.messages.map((messageData, index) => (
                  <ListItem key={index}>
                    <Grid
                      container
                      justifyContent={isUserDataCurrentUser(messageData.from) ? "flex-end" : "flex-start"}
                      alignItems="flex-end"
                    >
                      {!isUserDataCurrentUser(messageData.from) && (
                        <ListItemIcon>
                          <Avatar alt={"chat_head"} src={messageData.from.profile_picture} />
                        </ListItemIcon>
                      )}
                      <Box
                        className={classes.bubbleStyle}
                        sx={{
                          textAlign: isUserDataCurrentUser(messageData.from) ? "right" : "left",
                          backgroundColor: isUserDataCurrentUser(messageData.from) ? "#2196F3" : "#E0E0E0",
                          color: isUserDataCurrentUser(messageData.from) ? "white" : "#000",
                          borderRadius: isUserDataCurrentUser(messageData.from)
                            ? "15px 15px 0 15px"
                            : "15px 15px 15px 0",
                        }}
                      >
                        <Grid item xs={12}>
                          <ListItemText primary={messageData.message}></ListItemText>
                          <ListItemText
                            sx={{
                              color: isUserDataCurrentUser(messageData.from) ? "white" : "#000",
                            }}
                            secondary={isoStringToTimeWithAMPM(messageData.created)}
                          ></ListItemText>
                        </Grid>
                      </Box>
                      {isUserDataCurrentUser(messageData.from) && (
                        <ListItemIcon sx={{ marginLeft: "10px" }}>
                          <Avatar alt={"chat_head"} src={currentUser?.profile_picture} />
                        </ListItemIcon>
                      )}
                    </Grid>
                  </ListItem>
                ))}
            </List>
            <Divider />
            <Grid container style={{ padding: "20px" }}>
              <Grid item xs={11}>
                <TextField
                  size="medium"
                  InputProps={{
                    sx: { padding: "0px !important", borderRadius: "15px", background: "white" },
                  }}
                  label="Type Something"
                  fullWidth
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDownMessageInput}
                />
              </Grid>
              <Grid item xs={1} textAlign="right">
                <Fab
                  sx={{ background: "#2196F3", color: "white", ":hover": { color: "#2196F3", background: "white" } }}
                  aria-label="add"
                  onClick={handleSendMessage}
                >
                  <SendIcon />
                </Fab>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid item xs={9} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Stack>
              <Typography variant="h5" textAlign="center">
                Nothing Here
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h6">There are no chats in your feed.</Typography>
                <Typography variant="h6" sx={{ color: "#2196F3", cursor: "pointer" }} onClick={openCreateNewChat}>
                  Create a New Chat
                </Typography>
              </Box>
            </Stack>
          </Grid>
        )}
      </Grid>
      <Dialog open={isCreateNewChatDialog} onClose={handleClose}>
        <DialogTitle>Create New Chat</DialogTitle>
        <DialogContent sx={{ minWidth: "500px" }}>
          <DialogContentText>Search a user that you want to message.</DialogContentText>
          <TextField
            margin="dense"
            id="user"
            label="Search User"
            type="user"
            fullWidth
            variant="standard"
            onChange={handleSearchUser}
          />
          <List>
            {newUsersList?.map((userData) => (
              <ListItem key={userData.id} onClick={() => createNewChat(userData.id)}>
                <ListItemIcon>
                  <Avatar alt={userData.id} src={userData.profile_picture} />
                </ListItemIcon>
                <ListItemText primary={userData.username} secondary={userData.email} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
      {/* Loading Dialog */}
      <LoadingDialog isVisible={isLoading} />
    </div>
  );
}

export default Page;
