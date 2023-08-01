import React, { useEffect, useRef, useState } from 'react';
import { io as socketIOClient } from 'socket.io-client';
import socketIO from '../../../api/nodeServer/socketIO';
import { fetchRoom } from '../../../api/nodeServer/chatting';
import { useNavigate, useParams } from 'react-router-dom';
import ChatRoom from '../ChatRoom';

let socket;
const name = 'chats';

const ChatRoomContainer = () => {
  const { roomName } = useParams();
  const [socket_state, setSocket_state] = useState('try connecting...');
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [allMessages, setAllMessages] = useState([]);

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  // 채팅방 뒤로 가기
  const navigate = useNavigate();
  const onClickBackBtn = () => {
    navigate(-1, { replace: true });
  };

  // 메세지 보내면 스크롤 밑으로 내리기
  const scrollRef = useRef(null);
  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    socketInitializer();

    return () => {
      console.log('disconected');
      if (socket) {
        socket.disconnect();
        fetchRoom.execute({ roomName });
      }
    };
  }, []);

  async function socketInitializer() {
    socketIO.fetchEnter(`/api/socket?name=${name}`);

    socket = socketIOClient('http://localhost:3030', {
      path: `/${name}/socket.io`,
      withCredentials: true,
      extraHeaders: {
        'my-custom-header': 'testheader1',
      },
    });

    socket.on('connect', () => {
      console.log('connected successfully', socket?.id);
      setSocket_state('connected successfully 👍');
      joinRoom(roomName);
    });

    socket.on('connect_error', (err) => {
      console.warn(`connect_error due to ${err.message}`);
    });

    socket.on('receive-message', (data) => {
      setAllMessages((pre) => [...pre, data]);
    });
  }

  const onSubmitMessage = (e) => {
    if (!socket) {
      return;
    }
    if (!message) {
      return;
    }

    console.log('emitted');
    console.log(username, message);
    socket.emit('send-message', {
      roomName,
      username,
      message,
    });
    setMessage('');
  };

  useEffect(() => {
    // 현재는 양쪽 다 누구라도 채티을 치면 스크롤 밑으로 내려감
    // 자신이 보낸 채팅에 한해서만 스크롤 내리게 해야할 듯
    scrollToBottom();
  }, [allMessages]);

  return (
    <ChatRoom
      message={message}
      onClickBackBtn={onClickBackBtn}
      onChangeMessage={onChangeMessage}
      onSubmitMessage={onSubmitMessage}
      allMessages={allMessages}
      scrollRef={scrollRef}
    />
  );
};

export default ChatRoomContainer;

const joinRoom = (roomName) => {
  socket.emit('joinRoom', { roomName }, () => {
    console.log(`join room[${roomName}]  successfully`);
    fetchRoom.join({ roomName });
  });
};
