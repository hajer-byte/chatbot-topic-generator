import { getImageUrl } from 'lib/files';
import { Col, Row } from 'react-bootstrap';
import fallbackImage from '../../../../../../../../../assets/images/persona.jpg';
import { useAuth } from 'hooks';

const Persona = ({ persona }) => {
  const { org } = useAuth();
  const avatarUrl = persona?.image?.filename_disk ? getImageUrl(persona?.image.filename_disk, org) : fallbackImage;

  return (
    <Row className="mt-2">
      <Col md={4} className="d-flex align-items-center mb-2">
        <img style={{ height: '70px', width: '70px', objectFit: 'cover', borderRadius: '4px' }} src={avatarUrl} />
      </Col>
      <Col md={8} className="d-flex align-items-center">
        <label style={{ display: 'flex', alignItems: 'center' }}>
          <strong>{persona.name}</strong>
        </label>
      </Col>
    </Row>
  );
};
export default Persona;
