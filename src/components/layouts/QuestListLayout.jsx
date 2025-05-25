import React, { useState } from 'react';
import { Card, Container, Button, Modal, Row, Col } from 'react-bootstrap';

/**
 *
 * @param {Array} QuestList
 * @returns
 */
const QuestListLayout = ({ QuestList, isOwner, handleSelectQuest }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);

  const handleShowModal = (quest) => {
    setSelectedQuest(quest);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQuest(null);
  };

  if (!QuestList || QuestList.length === 0) {
    return (
      <Container>
        <Card className='mt-3'>
          <Card.Body>
            <Card.Text className='text-center'>표시할 퀘스트가 없습니다.</Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      {QuestList.map((quest) => (
        <Card
          key={quest.quest_id}
          className='mb-3'
        >
          <Card.Body>
            <Row className='align-items-center'>
              <Col md={8}>
                <Card.Title>{quest.quest_name}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>
                  난이도: {quest.quest_difficult} | 타입: {quest.quest_type}
                </Card.Subtitle>
              </Col>
              <Col
                md={4}
                className='text-md-end'
              >
                <Button
                  variant='info'
                  size='sm'
                  className='me-2'
                  onClick={() => handleShowModal(quest)}
                >
                  자세히
                </Button>
                {isOwner && (
                  <Button
                    variant='primary'
                    size='sm'
                    onClick={() => handleSelectQuest(quest.quest_name)}
                  >
                    선택하기
                  </Button>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}

      {selectedQuest && (
        <Modal
          show={showModal}
          onHide={handleCloseModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedQuest.quest_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>설명:</strong> {selectedQuest.quest_description}
            </p>
            <p>
              <strong>난이도:</strong> {selectedQuest.quest_difficult}
            </p>
            <p>
              <strong>타입:</strong> {selectedQuest.quest_type}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={handleCloseModal}
            >
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default QuestListLayout;
