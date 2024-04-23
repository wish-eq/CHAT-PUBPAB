const {
    login,
    joinRoom,
    sendMessage,
    unsendMessage,
    announceMessage,
    removeAnnounce,
    getMessageInRoom,
    getAllUsers,
    getAllRooms,
    getUserRooms,
    pinChat,
    leaveRoom
} = require('./users');

module.exports = (io) => {
    io.on("connection", (socket) => {
        socket.emit("userId", socket.id);

        socket.on('register', (data) => {
            const userId = socket.id; // Correctly using socket.id
            const username = data.username;
            login(userId, username)
                .then(() => {
                    console.log(`User ${username} logged in with ID ${userId}`);
                })
                .catch(console.error);
        });

        socket.on("join-room", async ({ username, room, private }) => {
            try {
                await joinRoom(socket.id, username, room, private);
                socket.join(room);
            } catch (error) {
                console.error("Error in join-room:", error);
            }
        });

        socket.on("send-message", async (message) => {
            try {
                const m = await sendMessage(message);
                if (m) {
                    io.to(message.room).emit("message", m);
                }
            } catch (error) {
                console.error("Error in send-message:", error);
            }
        });

        socket.on("unsend-message", async (message) => {
            try {
                await unsendMessage(message);
                io.to(message.room).emit("remove-message", message);
            } catch (error) {
                console.error("Error in unsend-message:", error);
            }
        });

        socket.on("announce-message", async (message) => {
            try {
                await announceMessage(message);
                io.to(message.room).emit("new-announce", message);
            } catch (error) {
                console.error("Error in announce-message:", error);
            }
        });

        socket.on("remove-announce", async ({ room }) => {
            try {
                await removeAnnounce(room);
                io.to(room).emit("announce-removed", room);
            } catch (error) {
                console.error("Error in remove-announce:", error);
            }
        });

        socket.on("get-past-messages", async ({ room }) => {
            try {
                const past_messages = await getMessageInRoom(room);
                io.to(room).emit("past-messages", { room: room, messages: past_messages });
            } catch (error) {
                console.error("Error in get-past-messages:", error);
            }
        });

        socket.on("get-all-users", async () => {
            try {
                const users = await getAllUsers();
                io.emit("users", users);
            } catch (error) {
                console.error("Error in get-all-users:", error);
            }
        });

        socket.on("get-all-rooms", async (private) => {
            try {
                const getPrivate = !(private === undefined);
                const rooms = await getAllRooms(getPrivate);
                io.emit("rooms", rooms);
            } catch (error) {
                console.error("Error in get-all-rooms:", error);
            }
        });

        socket.on("get-user-rooms", async ({ username }) => {
            try {
                const rooms = await getUserRooms(username);
                io.to(socket.id).emit("user-rooms", rooms);
            } catch (error) {
                console.error("Error in get-user-rooms:", error);
            }
        });

        socket.on("pin-chat", async ({ username, room, pinStatus }) => {
            try {
                await pinChat(username, room, pinStatus);
            } catch (error) {
                console.error("Error in pin-chat:", error);
            }
        });

        socket.on("leave-room", async ({ username, room }) => {
            try {
                await leaveRoom(username, room);
                socket.leave(room);
            } catch (error) {
                console.error("Error in leave-room:", error);
            }
        });
    });
};
