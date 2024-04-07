import { useContext, useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDirectus } from "react-directus";
import { useHistory } from "react-router-dom";
import { translateMultiple } from "../../../helpers/translation";
import { createOne } from "lib/directus"; //this is related to CP
import TopicsList from "./ChatItemText/TopicsList";
import CheckedOptions from "./ChatItemText/options/CheckedOptions";
import PersonaList from "./ChatItemText/personas/Personalist";
import StylesList from "./ChatItemText/StylesList";
import Persona from "./ChatItemText/personas/Persona";
import TopicOptionsList from "./ChatItemText/options/TopicOptionsList";
import { GenerateIdeasContext } from "../../../context/GenerateIdeasContext";
import { GenerateIdeaBodyContext } from "../../../context/GenerateIdeaBodyContext";
import { ChatContext } from "../../../context/ChatContext";
import { TopicsContext } from "../../../context/TopicsContext";
import useOpenAI from "../../../openAI/hooks/useOpenAI";

import _ from "lodash";

const ChatItemText = () => {
  const { handleResetChat, selectedPersona, ideaMessagesIndex } =
    useContext(GenerateIdeasContext);
  const { personas, handleIncreaseIdeaMessagesIndex } = useContext(
    GenerateIdeaBodyContext
  );
  const { itemNumber, lastItem, message } = useContext(ChatContext);
  const { refreshList, toggle } = useContext(TopicsContext);
  const { userName, text, options, responseStyle, example, showPersonas } =
    message;
  const { setTopics, topics, topicsLoading } = useOpenAI();
  const topicStyles = localStorage.getItem("topicStyles");
  const { directus } = useDirectus();

  const [copied, setCopied] = useState(false);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(example);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.log("copyTextError", error);
    }
  };

  const history = useHistory();
  const translations = translateMultiple([
    "ai.themes_loading",
    "ui.apply",
    "persona.copied",
  ]);

  const handleSetTopic = (value) => {
    setTopics(value);
  };
  const handleCreateIdeas = async () => {
    const updatedTopics = topics.map((topic) => ({
      ...topic,
      created: topic.selected && !topic.created ? true : topic.created,
    }));
    await Promise.all(
      updatedTopics
        .filter((topic) => topic.selected && !topic.created)
        .map(async (topic) => {
          await createOne(directus, "idea", {
            name: topic.topic,
            description: topic.description,
            persona: {
              id: selectedPersona,
            },
            status: "idea",
          });
        })
    );
    handleSetTopic(updatedTopics);
    refreshList();
    handleResetChat();
    toggle();
    if (selectedPersona) {
      history.push(`/persona/${selectedPersona}?showTopics=true`);
    }
  };

  const handleStoreValues = (key, value) => {
    localStorage.setItem(key, _.isEmpty(value) ? "" : JSON.stringify(value));
  };

  const selectedPersonaData = personas.find(
    ({ id }) => Number(id) === Number(selectedPersona)
  );

  useEffect(() => {
    (itemNumber === 1 || ideaMessagesIndex === 3 || ideaMessagesIndex === 5) &&
      handleIncreaseIdeaMessagesIndex();
  }, [selectedPersona]);

  const showOptions = ideaMessagesIndex === 2;

  return (
    <div className="conversation-text">
      <div className="ctext-wrap">
        <i>{userName}</i>
        <p className="text-start my-1">
          {text}
          {example && (
            <i className="italic">
              {example}
              <span
                className="mdi mdi-content-copy mx-1 position-relative"
                onClick={handleCopyClick}
                style={{ cursor: "pointer" }}
              >
                {/* Tooltip to indicate text copied */}
                {copied && (
                  <div className="tooltip-copy">
                    {translations["persona.copied"]}
                  </div>
                )}
              </span>
            </i>
          )}
        </p>

        {/* list all personas */}
        {showPersonas && <PersonaList selectedPersona={selectedPersona} />}
        {/* selected persona  */}
        {itemNumber === 1 && <Persona persona={selectedPersonaData} />}

        {/* list all options */}
        {showOptions && options && (
          <TopicOptionsList
            selectedPersona={selectedPersona}
            options={options}
            handleStoreValues={handleStoreValues}
          />
        )}
        {/* the checked options */}
        {itemNumber === 3 && <CheckedOptions />}

        {/* list all styles */}
        {responseStyle && <StylesList handleStoreValues={handleStoreValues} />}
        {/* the checked style */}
        {topicStyles && itemNumber === 5 && (
          <p className="my-1 text-start">{JSON.parse(topicStyles).value}</p>
        )}

        {/* list the generated topics  */}
        {lastItem && topicsLoading && (
          <>
            <p>{translations["ai.themes_loading"]}</p>
            <Spinner
              as="span"
              size="sm"
              className="me-2"
              animation="border"
              role="status"
            />
          </>
        )}
        {lastItem && topics.length > 0 && (
          <>
            <TopicsList topics={topics} handleSetTopic={handleSetTopic} />
            <Button
              onClick={handleCreateIdeas}
              className="me-2"
              disabled={
                topics.findIndex((topic) => topic.selected && !topic.created) <
                0
              }
              variant="success"
            >
              {translations["ui.apply"]}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatItemText;
