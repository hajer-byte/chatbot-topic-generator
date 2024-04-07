import _ from 'lodash';
import { useEffect, useRef, useContext } from 'react';
import ChatItem from './Chat/ChatItem';
import { GenerateIdeasContext } from '../../../../../context/GenerateIdeasContext';
import { ChatContext } from '../../../../../context/ChatContext';

const Chat = () => {
  const { ideaMessagesIndex, ideaMessages } = useContext(GenerateIdeasContext);

  //create a reference that mark for the bottom of the chat window
  const messagesEndRef = useRef(null);

  //scroll the chat window to the bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // trigger the scrollToBottom function whenever ideaMessages changes
  useEffect(() => {
    scrollToBottom();
  }, [ideaMessages]);

  return (
    <ul className="conversation-list">
      {ideaMessages.map((message, i) => {
        if (i > ideaMessagesIndex) {
          return <div key={i}></div>;
        } else {
          return (
            <ChatContext.Provider
              value={{
                lastItem: ideaMessages.length - 1 === i,
                itemNumber: i,
                message,
              }}
            >
              <ChatItem key={i} />
            </ChatContext.Provider>
          );
        }
      })}
      <div ref={messagesEndRef} />
    </ul>
  );
};

export default Chat;
