import { useContext, useEffect, useState } from "react";
import Chat from "./Chat";
import ChatForm from "./ChatForm";
import { useDirectus } from "react-directus";
import { useSelector } from "react-redux";
import { GenerateIdeasContext } from "../context/GenerateIdeasContext";
import { GenerateIdeaBodyContext } from "../context/GenerateIdeaBodyContext";
import useOpenAI from "../openAI/hooks/useOpenAI";
import { useAuth } from "hooks";
import { translateMultiple } from "../helpers/translation";

const GenerateIdeaBody = ({ handleIdeaMessages, handleIdeaMessagesIndex }) => {
  const translations = translateMultiple([
    "idea.generateThemes",
    "ai.restartChat",
    "ai.cp_types",
    "ai.no_tokens",
  ]);
  const { selectedPersona, ideaMessagesIndex, ideaMessages } =
    useContext(GenerateIdeasContext);
  const { generateTopics, topicsLoading } = useOpenAI();
  const { remainingTokens } = useSelector((state) => state["openAIReducer"]);
  const { org } = useAuth();
  const { directus } = useDirectus();
  const [isTyping, setIsTyping] = useState(false);
  const [personas, setPersonas] = useState([]);
  const { orgId } = org;

  const handleIncreaseIdeaMessagesIndex = () => {
    setIsTyping(true);
    setTimeout(() => {
      handleIdeaMessagesIndex((value) => value + 1);
      setIsTyping(false);
    }, 2000);
  };

  const handleNewMessagePosted = async (message) => {
    const updatedIdeaMessages = [...ideaMessages];
    updatedIdeaMessages[ideaMessagesIndex + 1] = {
      ...updatedIdeaMessages[ideaMessagesIndex + 1],
      text: message,
    };
    handleIdeaMessages(updatedIdeaMessages);
    /* increase the index twice to show the user message then show next cp message */
    handleIdeaMessagesIndex((value) => value + 1);
    handleIncreaseIdeaMessagesIndex();
  };

  const handleGenerateTopics = async () => {
    const options = localStorage.getItem("topicOptions");
    const style = localStorage.getItem("topicStyles");
    await generateTopics(
      selectedPersona,
      orgId,
      1,
      ideaMessages[7].text,
      ideaMessages[9].text,
      options,
      style
    );
  };

  const handleGetPersonas = async () => {
    const fetchParams = { sort: "-id" };
    try {
      const { data } = await directus
        .items("persona")
        .readByQuery({
          ...fetchParams,
          fields: ["id", "name", "image.filename_disk", "data"],
        });
      setPersonas(data);
    } catch (error) {
      console.error("persona fetch error", error);
    }
  };

  useEffect(() => {
    if (ideaMessagesIndex < ideaMessages?.length) {
      const updatedIdeaMessages = [...ideaMessages];
      for (let i = 0; i <= ideaMessagesIndex; i++) {
        if (ideaMessages[i].postedOn === "") {
          updatedIdeaMessages[i].postedOn = Math.floor(Date.now() / 1000);
        }
        if (i === 0) {
          handleGetPersonas();
        }
        if (i === 10) {
          handleGenerateTopics();
        }
      }
      handleIdeaMessages(updatedIdeaMessages);
    }
  }, [ideaMessagesIndex]);

  if (remainingTokens < 0) return <div>{translations["ai.no_tokens"]}</div>;

  return (
    <div className="chat-conversation">
      {/* chat messages */}
      <GenerateIdeaBodyContext.Provider
        value={{
          handleGenerateTopics,
          personas,
          handleIncreaseIdeaMessagesIndex,
        }}
      >
        <Chat />
      </GenerateIdeaBodyContext.Provider>

      {/* cp typing message */}
      {isTyping && ideaMessages[ideaMessagesIndex + 1]?.identifier === "cp" && (
        <small className="typing-message m-3">
          {translations["ai.cp_types"]}
        </small>
      )}

      {/* chat form */}
      <ChatForm
        onNewMessagesPosted={handleNewMessagePosted}
        topicsLoading={topicsLoading}
        lastItem={ideaMessages?.length - 1 === ideaMessagesIndex}
      />
    </div>
  );
};

export default GenerateIdeaBody;
