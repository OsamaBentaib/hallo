const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server");
const processUpload = require("./../../upload/process");
const Message = require("../../models/Message");
const User = require("../../models/user");

module.exports = {
  Query: {
    getMessages: async (_, { from, start, limit }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const otherUser = await User.findById(from);
        if (!otherUser) throw new UserInputError("User not found");

        const messages = await Message.find({
          $or: [
            { from: user.ID, to: from },
            { to: user.ID, from: from },
          ],
        })
          .skip(start)
          .limit(limit)
          .sort({ createdAt: -1 });

        return messages;
      } catch (err) {
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (_, args, { user, pubsub }) => {
      const { to, content, createdAt, Image } = args;
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const recipient = await User.findById(to);
        if (!recipient) {
          throw new UserInputError("User not found");
        }
        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }
        let image = null;
        if (Image) {
          const uploadImage = await processUpload(Image);
          image = {
            path: uploadImage.path,
            filename: uploadImage.name,
            mimetype: uploadImage.mimetype,
          };
        }
        const message = new Message({
          from: user.ID,
          to: to,
          content: content,
          createdAt: createdAt.toString(),
          Image: image,
        });

        await message.save();
        // For Me / My side
        const MyBadge = await Message.find({
          to: user.ID,
          from: to,
          seen: false,
        });
        const forMe = {
          user: recipient,
          latestMessage: [message],
          badge: MyBadge.length.toString(),
          for: user.ID,
        };
        // For him / other side
        const me = await User.findById(user.ID);
        const RecipientBadge = await Message.find({
          to: recipient._id,
          from: me._id,
          seen: false,
        });
        const forRecipient = {
          user: me,
          latestMessage: [message],
          badge: RecipientBadge.length.toString(),
          for: recipient._id,
        };
        pubsub.publish("NEW_MESSAGE", { newMessage: message });
        pubsub.publish("NEW_CONVERSATION", { newConversation: forMe });
        pubsub.publish("NEW_CONVERSATION", { newConversation: forRecipient });
        return message;
      } catch (err) {
        throw err;
      }
    },
    setSeen: async (_, args, { user, pubsub }) => {
      const { to } = args;
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const recipient = await User.findById(to);
        if (!recipient) {
          throw new UserInputError("User not found");
        }
        const seen = { is: true, from: user.ID, to: to };
        await Message.updateMany(
          { from: to, to: user.ID },
          { seen: true }
        ).then((res) => {
          pubsub.publish("SET_SEEN", {
            seen: seen,
          });
        });
        return { is: true };
      } catch (err) {
        throw err;
      }
    },
    setTyping: async (_, args, { user, pubsub }) => {
      const { to, typing } = args;
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const recipient = await User.findById(to);
        if (!recipient) {
          throw new UserInputError("User not found");
        }
        const type = { is: typing, from: user.ID, to: to };
        if (typing) {
          pubsub.publish("START_TYPING", {
            type: type,
          });
        } else {
          pubsub.publish("STOPED_TYPING", {
            type: type,
          });
        }
        return { is: true };
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("NEW_MESSAGE");
        },
        ({ newMessage }, _, { user }) => {
          const { from, to } = newMessage;
          const ID = user.ID;
          if (
            from.toString() === ID.toString() ||
            to.toString() === ID.toString()
          ) {
            return true;
          }
          return false;
        }
      ),
    },
    newConversation: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("NEW_CONVERSATION");
        },
        ({ newConversation }, _, { user }) => {
          const For = newConversation.for;
          const Me = user.ID;
          if (For.toString() === Me.toString()) {
            return true;
          }
          return false;
        }
      ),
    },
    setSeen: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("SET_SEEN");
        },
        ({ seen }, _, { user }) => {
          const { to } = seen;
          const ID = user.ID;
          if (to.toString() === ID.toString()) {
            return true;
          }
          return false;
        }
      ),
    },
    startTyping: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("START_TYPING");
        },
        ({ type }, _, { user }) => {
          const { to } = type;
          const ID = user.ID;
          if (to.toString() === ID.toString()) {
            return true;
          }
          return false;
        }
      ),
    },
    stopedTyping: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("STOPED_TYPING");
        },
        ({ type }, _, { user }) => {
          const { to } = type;
          const ID = user.ID;
          if (to.toString() === ID.toString()) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
