import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { GenerateIdeasContext } from "plugins/persona/context/GenerateIdeasContext";
import { useContext, useState } from "react";
import { FormInput } from "components"; //this is related to CP
import { translateMultiple } from "../../helpers/translation";

const ChatForm = (props) => {
  const { topicsLoading, lastItem, onNewMessagesPosted } = props;
  const [isFilled, setIsFilled] = useState(false);
  const { ideaMessagesIndex } = useContext(GenerateIdeasContext);
  const translations = translateMultiple([
    "form.field_submit",
    "form.yourResponse",
    "form.enterYourResponse",
  ]);

  const methods = useForm();
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = methods;

  const handleValidMessageSubmit = ({ newMessage }) => {
    onNewMessagesPosted(newMessage);
    reset();
  };

  if (ideaMessagesIndex < 6) return <></>;

  return (
    <>
      <form
        name="chat-form"
        id="chat-form"
        onSubmit={handleSubmit(handleValidMessageSubmit)}
        className="needs-validation m-2"
      >
        <Row>
          <Col>
            <FormInput
              type="text"
              name="newMessage"
              className="form-control chat-input"
              placeholder={translations["form.yourResponse"]}
              register={register}
              onChange={(e) => {
                setIsFilled(e.target.value.length > 0);
              }}
              key="newMessage"
              errors={errors}
            />
          </Col>
          <Col className="col-auto">
            <button
              type="submit"
              className="btn btn-success chat-send waves-effect waves-light"
              disabled={topicsLoading || lastItem || !isFilled}
            >
              {translations["form.field_submit"]}
            </button>
          </Col>
        </Row>
      </form>
    </>
  );
};

export default ChatForm;
