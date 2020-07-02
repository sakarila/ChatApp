// File for a different helper functions

const initMessageNotifications = (user, chats) => {
  const chatsWithNotification = chats.map((chat) => ({ ...chat, messageNotification: chat.latestMessage > user.lastLogin ? 'New messages!' : '' }));
  return chatsWithNotification;
};

export default { initMessageNotifications };
