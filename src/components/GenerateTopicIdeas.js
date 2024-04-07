import { useState } from "react";
import { generateIdeaMessages } from "../../config";
import useOpenAI from "./openAI/hooks/useOpenAI";
import GenerateIdeaHeader from "./GenerateIdeaModal/GenerateIdeaHeader";
import GenerateIdeaBody from "./GenerateIdeaModal/GenerateIdeaBody";
import { Card } from "react-bootstrap";
import { translateMultiple } from "./helpers/translation";
import useUser from "plugins/account/hooks/user"; //this is related to CP
import { GenerateIdeasContext } from "./context/GenerateIdeasContext";
import SimpleBar from "simplebar-react";

const GenerateTopicIdeas = () => {
  const { resetTopics, generateToken, handleLoadingChange } = useOpenAI();
  const { user = {} } = useUser(true);
  const { first_name } = user;
  const initialIdeaMessages = [...generateIdeaMessages(first_name)];

  const [ideaMessages, setIdeaMessages] = useState(initialIdeaMessages);
  const [ideaMessagesIndex, setIdeaMessagesIndex] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const translations = translateMultiple(["menu.topicFinder"]);

  const handleIdeaMessages = (message) => {
    setIdeaMessages(message);
  };
  const handleIdeaMessagesIndex = (index) => {
    setIdeaMessagesIndex(index);
  };

  const handleResetChat = () => {
    resetTopics();
    setIdeaMessages(initialIdeaMessages);
    setIdeaMessagesIndex(0);
    setSelectedPersona(null);

    if (generateToken) {
      generateToken.cancel();
      handleLoadingChange(false);
    }
  };
  return (
    <SimpleBar style={{ height: "850px" }} className="page-title-box">
      <h1 className="ms-3 page-title d-inline-block">
        {translations["menu.topicFinder"]}
      </h1>
      <Card>
        <GenerateIdeaHeader
          ideaMessagesIndex={ideaMessagesIndex}
          handleResetChat={handleResetChat}
        />
        <GenerateIdeasContext.Provider
          value={{
            handleResetChat,
            setSelectedPersona,
            selectedPersona,
            ideaMessagesIndex,
            ideaMessages,
          }}
        >
          <GenerateIdeaBody
            handleIdeaMessages={handleIdeaMessages}
            handleIdeaMessagesIndex={handleIdeaMessagesIndex}
          />
        </GenerateIdeasContext.Provider>
      </Card>
    </SimpleBar>
  );
};

export default GenerateTopicIdeas;
