import { useState } from 'react';
import { Button, Col, Collapse, Row } from 'react-bootstrap';
import cx from 'classnames';

const CheckedOptions = () => {
  const [collapseStates, setCollapseStates] = useState({});
  const topicOptions = localStorage.getItem('topicOptions') || '';

  const toggleTextArea = (label) => {
    setCollapseStates({ ...collapseStates, [label]: !collapseStates[label] });
  };

  if (!topicOptions) return <></>;

  return (
    <>
      {Object.keys(JSON.parse(topicOptions)).map((option) => {
        return (
          <div key={option}>
            <Row className="d-flex flex-nowrap align-items-center">
              <Col md={10} className="d-flex align-items-center">
                <p>{option}</p>
              </Col>
              <Col md={2} className="d-flex align-items-center justify-content-end">
                <Button onClick={() => toggleTextArea(option)} variant="link" size="sm">
                  <i
                    className={cx(
                      { 'mdi mdi-chevron-up': collapseStates[option] },
                      { 'mdi mdi-chevron-down': !collapseStates[option] }
                    )}
                  />
                </Button>
              </Col>
            </Row>
            <Collapse in={collapseStates[option]}>
              <p className="text-start p-1">{JSON.parse(topicOptions)[option]}</p>
            </Collapse>
          </div>
        );
      })}
    </>
  );
};
export default CheckedOptions;
