import { useContext } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { GenerateIdeaBodyContext } from "../../../../../context/GenerateIdeaBodyContext";
import { GenerateIdeasContext } from "../../../../../context/GenerateIdeasContext";
import { translateMultiple } from "../../../../../helpers/translation";
import Persona from "./Persona";

const PersonaList = ({ selectedPersona }) => {
  const { setSelectedPersona, ideaMessagesIndex } =
    useContext(GenerateIdeasContext);
  const { personas, handleIncreaseIdeaMessagesIndex } = useContext(
    GenerateIdeaBodyContext
  );

  const handleSelectedPersona = (value) => {
    if (selectedPersona === null) {
      handleIncreaseIdeaMessagesIndex();
    }
    setSelectedPersona(value);
  };

  const translations = translateMultiple(["idea.noPersona"]);

  if (ideaMessagesIndex !== 0) return <></>;
  if (personas?.length === 0)
    return <a href="/persona/add">{translations["idea.noPersona"]} </a>;
  return (
    <div className="mb-3">
      {personas?.map((persona, index) => {
        return (
          <div
            key={index}
            className="persona-selection"
            style={{
              marginLeft: "-1em",
              marginRight: "-1em",
            }}
          >
            <div className="form-check mt-1 ps-2 pe-2">
              <Row style={{ minHeight: "60px" }}>
                <Col
                  md={2}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Form.Check
                    id={`personaList-${index}`}
                    checked={persona.id === selectedPersona}
                    type="radio"
                    onClick={() => handleSelectedPersona(persona.id)}
                    className="ms-2"
                    disabled={ideaMessagesIndex !== 0}
                  />
                </Col>
                <Col md={10} className="d-flex">
                  <Persona persona={persona} />
                </Col>
              </Row>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default PersonaList;
