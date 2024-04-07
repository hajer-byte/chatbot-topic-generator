import React, { useContext } from "react";
import cx from "classnames";
import ChatItemAvatar from "./ChatItem/ChatItemAvatar";
import ChatItemText from "./ChatItem/ChatItemText";
import useUser from "/account/hooks/user"; //this is related to CP
import { getImageUrl } from "lib/files"; //this is related to CP
import cpIcon from "../../assets/images/cp-logo-small.png";
import profileFallback from "../../../assets/images/profile-fallback.png";
import { useAuth } from "hooks";
import { ChatContext } from "plugins/persona/context/ChatContext";

const ChatItem = () => {
  const { user } = useUser();
  const { org } = useAuth();
  const { message } = useContext(ChatContext);
  const { avatar, first_name, last_name } = user;
  const avatarUrl = avatar
    ? getImageUrl(avatar.filename_disk, org)
    : profileFallback;

  message.userPic = message.identifier === "user" ? avatarUrl : cpIcon;
  message.userName =
    message.identifier === "user"
      ? `${first_name} ${last_name}`
      : "Contentpepper";

  /* clearfix used to clear floated content within a container */

  return (
    <li className={cx("clearfix", { odd: message.identifier == "user" })}>
      <ChatItemAvatar />
      <ChatItemText />
    </li>
  );
};

export default ChatItem;
