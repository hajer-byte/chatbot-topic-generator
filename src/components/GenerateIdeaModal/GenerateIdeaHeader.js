import { Col, Row } from "react-bootstrap";
import { translateMultiple } from "../helpers/translation";

const GenerateIdeaHeader = ({ ideaMessagesIndex, handleResetChat }) => {
  const translations = translateMultiple([
    "idea.generateThemes",
    "ai.restartChat",
  ]);

  return (
    <Row className="my-3 mx-2">
      <Col>
        <h4 className="modal-title">{translations["idea.generateThemes"]}</h4>
      </Col>
      <Col className="col-auto">
        <button
          disabled={ideaMessagesIndex === 0}
          className="btn btn-danger waves-effect waves-light py-1 px-2"
          onClick={() => handleResetChat(true)}
        >
          <i className="mdi mdi-refresh fs-4" />
        </button>
      </Col>
    </Row>
  );
};

export default GenerateIdeaHeader;
