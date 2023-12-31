import React, { useEffect } from 'react';
import ChatOpen from '../ChatOpen';
import { useSelector, useDispatch } from 'react-redux';
import { openChatModal, closeChatModal } from '../../../store/chatModalSlice';
import { openContractModal } from '../../../store/contractSlice';
import { useNavigate } from 'react-router';

const ChatOpenContainer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isChatOpen = useSelector((state) => {
    return state.chatModal.isOpen;
  });

  const isContractOpen = useSelector((state) => {
    return state.contract.isOpen;
  });

  const onClickChatBtn = () => {
    dispatch(openChatModal());
  };

  const closeChat = (e) => {
    if (e.data === 'closeChatModal') {
      console.log(e);
      dispatch(closeChatModal());
    }
  };

  const moveStorePost = (e) => {
    if (e.data.msg === 'moveStorePage') {
      navigate(`store/${e.data.id}`);
    }
  };

  const makeContract = (e) => {
    if (e.data.msg === 'openContract') {
      dispatch(
        openContractModal({
          post: e.data.post,
          producer: e.data.producer,
          consumer: e.data.consumer,
          myId: e.data.myId,
          chatRoomId: e.data.chatRoomId,
          contractId: e.data.contractId,
        })
      );
    }
  };
  const moveAuctionPost = (e) => {
    if (e.data.msg === 'moveAuctionPage') {
      navigate(`auction/${e.data.id}`);
    }
  };
  useEffect(() => {
    // 이벤트리스너 한 번만 추가
    window.addEventListener('message', closeChat, false);
    window.addEventListener('message', moveStorePost, false);
    window.addEventListener('message', makeContract, false);
    window.addEventListener('message', moveAuctionPost, false);

    return () => {
      //언마운트되면 이벤트리스너 제거
      window.removeEventListener('message', closeChat);
      window.removeEventListener('message', moveStorePost);
      window.removeEventListener('message', makeContract);
      window.removeEventListener('message', moveAuctionPost);
    };
  }, []);

  return (
    <ChatOpen
      isChatOpen={isChatOpen}
      onClickChatBtn={onClickChatBtn}
      isContractOpen={isContractOpen}
    />
  );
};

export default ChatOpenContainer;
