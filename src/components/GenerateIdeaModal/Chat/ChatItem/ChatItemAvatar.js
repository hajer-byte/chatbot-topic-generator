import moment from 'moment';
import { ChatContext } from 'plugins/persona/context/ChatContext';
import { useContext } from 'react';

const ChatItemAvatar = ({ className = '' }) => {
  const { message } = useContext(ChatContext);
  const avatar = message?.userPic;
  const posted = message?.postedOn;
  const postedOnTimestamp = posted === '' ? Math.floor(Date.now() / 1000) : posted;

  const formattedTime = `${moment(new Date(postedOnTimestamp * 1000)).format('HH:mm')}`;

  return (
    <div className="chat-avatar">
      <img className={`${className}`} src={avatar} alt={avatar} />
      <i>{formattedTime}</i>
    </div>
  );
};
export default ChatItemAvatar;
