import { styleResOptions } from "../../../../../config";
import { GenerateIdeaBodyContext } from "../../../../context/GenerateIdeaBodyContext";
import { GenerateIdeasContext } from "../../../../context/GenerateIdeasContext";
import { useContext, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";

const StylesList = ({ handleStoreValues }) => {
  const [disabled, setDisabled] = useState(false);
  const { ideaMessagesIndex } = useContext(GenerateIdeasContext);
  const { handleIncreaseIdeaMessagesIndex } = useContext(
    GenerateIdeaBodyContext
  );
  const styles = ideaMessagesIndex === 4;
  return (
    <>
      {styleResOptions(ideaMessagesIndex).map((option, index) => (
        <Row style={{ minHeight: "60px" }} key={index}>
          <Col
            md={2}
            className="d-flex align-items-center justify-content-center"
          >
            <Form.Check
              id={`personaList-${index}`}
              type="radio"
              disabled={disabled}
              onClick={() => {
                if (styles) {
                  handleStoreValues("topicStyles", option);
                  handleIncreaseIdeaMessagesIndex();
                  setDisabled(true);
                }
              }}
            />
          </Col>
          <Col md={10} className="d-flex align-items-center">
            <label>{option.label}</label>
          </Col>
        </Row>
      ))}
    </>
  );
};
export default StylesList;
