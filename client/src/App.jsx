import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
const backend_url = import.meta.env.VITE_BACKEND_URL;
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";

const App = () => {
  const socket = useMemo(() => io(backend_url), []);
  const [receivedMessage, setReceivedMessage] = useState([]);
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setsocketId] = useState("");
  const [room, setRoom] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {
      message: { message, roomName },
    });
    setMessage("");
    setRoomName("");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", room);
    // console.log("====================================");
    // console.log(room);
    // console.log("====================================");
    setRoom("");
  };
  useEffect(() => {
    socket.on("connect", () => {
      setsocketId(socket.id);
      // socket.on("msg", (data) => {
      //   console.log("msg", data);
      // });

      socket.on("received-message", (data) => {
        console.log("data", data.message);
        setReceivedMessage((message) => [...message, data]);
      });
    });
  });
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="div" gutterBottom>
        Socket.io chat server
      </Typography>
      <Box sx={{ height: 500 }}>
        <Typography variant="h5" component="div" gutter-Bottom>
          {socketId}
        </Typography>
        <form onSubmit={joinRoomHandler}>
          <Typography variant="h6" component="div" gutter-Bottom>
            <h5>Join Room</h5>
            <TextField
              id="outline-basic"
              label="Room"
              // variant="Outline"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            ></TextField>
            <Button type="submit" variant="contained" color="primary">
              Join
            </Button>
          </Typography>
        </form>
        <form onSubmit={handleSubmit}>
          <TextField
            id="outline-basic"
            label="Room Name"
            // variant="Outline"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          ></TextField>
          <TextField
            id="outline-basic"
            label="Message"
            // variant="Outline"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></TextField>
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>
        <Stack>
          {receivedMessage.map((message, index) => {
            return (
              <Box key={index}>
                <Typography variant="h6" component="div" gutterBottom>
                  {message}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </Container>
  );
};

export default App;
