import { useContext, useEffect, useState } from "react";
import { Button, Col, Collapse, Row } from "react-bootstrap";
import { GenerateIdeasContext } from "../../../../../context/GenerateIdeasContext";
import { ChatContext } from "../../../../../context/ChatContext";
import { GenerateIdeaBodyContext } from "../../../../../context/GenerateIdeaBodyContext";
import { translateMultiple } from "../../../../../helpers/translation";
import cx from "classnames";
import _ from "lodash";

const TopicOptionsList = ({ selectedPersona, handleStoreValues }) => {
  const [optionFields, setOptionsFields] = useState([{}]);
  const [collapseStatesUser, setCollapseUserStates] = useState({});
  const [checkbox, setCheckbox] = useState({});
  const [textareaValues, setTextareaValues] = useState({});
  const { ideaMessagesIndex } = useContext(GenerateIdeasContext);
  const { handleIncreaseIdeaMessagesIndex, personas } = useContext(
    GenerateIdeaBodyContext
  );
  const { itemNumber } = useContext(ChatContext);
  const translations = translateMultiple([
    "persona.individualNotes",
    "persona.goals",
    "persona.commonObjections",
    "persona.challenges",
    "ui.apply",
    "persona.addText",
  ]);

  const toggleTextAreaUser = (label) => {
    setCollapseUserStates({
      ...collapseStatesUser,
      [label]: !collapseStatesUser[label],
    });
  };

  const removeHTMLTags = (text) => text?.replace(/<[^>]+>/g, "") || "";

  const handleGenerateOptions = () => {
    const selectedPersonaData = personas.find(
      ({ id }) => Number(id) === Number(selectedPersona)
    )?.data;
    if (selectedPersonaData) {
      const { goals, individualNotes, challenges, objections } =
        JSON.parse(selectedPersonaData);
      setOptionsFields([
        { label: translations["persona.goals"], value: removeHTMLTags(goals) },
        {
          label: translations["persona.individualNotes"],
          value: removeHTMLTags(individualNotes),
        },
        {
          label: translations["persona.challenges"],
          value: removeHTMLTags(challenges),
        },
        {
          label: translations["persona.commonObjections"],
          value: removeHTMLTags(objections),
        },
      ]);
    }
  };

  const handleCheckboxChange = (label, value) => {
    if (value) {
      setCheckbox({ ...checkbox, [label]: value });
    }
  };

  useEffect(() => {
    handleGenerateOptions();
  }, [selectedPersona]);

  const handleTextChange = (label, value) => {
    setTextareaValues({ ...textareaValues, [label]: value });
    setOptionsFields((prevFields) =>
      prevFields.map((field) =>
        field.label === label ? { ...field, value } : field
      )
    );
    if (checkbox[label]) {
      setCheckbox({ ...checkbox, [label]: value });
    }
  };
  if (personas.length === 0) return <></>;
  return (
    <div className="options-checkboxes">
      {optionFields.map((option, index) => (
        <div key={index}>
          <Row className="d-flex align-items-center">
            <Col md={10}>
              <label className="d-flex align-items-center">
                <input
                  disabled={itemNumber !== 2 || !option?.value}
                  type="checkbox"
                  onChange={(e) =>
                    handleCheckboxChange(
                      option.label,
                      e.target.checked ? option?.value : ""
                    )
                  }
                  className="me-3"
                />
                {option.label}
              </label>
            </Col>
            <Col
              md={2}
              className="d-flex align-items-center justify-content-end"
            >
              <Button
                onClick={() => toggleTextAreaUser(option.label)}
                variant="link"
                size="sm"
              >
                <i
                  className={cx(
                    { "mdi mdi-chevron-up": collapseStatesUser[option.label] },
                    {
                      "mdi mdi-chevron-down": !collapseStatesUser[option.label],
                    }
                  )}
                />
              </Button>
            </Col>
          </Row>
          <Collapse in={collapseStatesUser[option.label]}>
            <textarea
              className="form-control"
              rows="5"
              value={textareaValues[option.label] || option.value}
              onChange={(e) => handleTextChange(option.label, e.target.value)}
              placeholder={translations["persona.addText"]}
            />
          </Collapse>
        </div>
      ))}
      <Button
        onClick={() => {
          handleStoreValues("topicOptions", checkbox);
          handleIncreaseIdeaMessagesIndex();
        }}
        className={`mt-2 mb-2 ms-2 btn btn-secondary float-left position-relative`}
        variant="success"
        disabled={ideaMessagesIndex !== 2 || _.isEmpty(checkbox)}
      >
        {translations["ui.apply"]}
      </Button>
    </div>
  );
};

export default TopicOptionsList;
