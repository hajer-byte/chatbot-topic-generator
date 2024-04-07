import { Col, Row, Form } from 'react-bootstrap';

const TopicsList = ({ topics, handleSetTopic }) => {
  const handleCheckboxClick = (index) => {
    const newTopics = [...topics];
    newTopics[index].selected = !newTopics[index].selected;
    handleSetTopic(newTopics);
  };

  if (!topics) return <></>;

  return (
    <div className="mb-3">
      {topics.map((topic, index) => (
        <Row>
          <Col md={9}>
            <label htmlFor={`checklist-${index}`}>
              <strong>{topic.topic}</strong> <span style={{ fontWeight: '400' }}>{topic.description}</span>
            </label>
          </Col>
          <Col md={3} className="d-flex">
            <Form.Switch
              type="switch"
              disabled={topic.created}
              className="ms-auto me-auto align-self-center"
              id={`checklist-${index}`}
              selected={topic.selected}
              onClick={() => handleCheckboxClick(index)}
            />
          </Col>
        </Row>
      ))}
    </div>
  );
};
export default TopicsList;
