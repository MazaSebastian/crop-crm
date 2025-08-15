import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  border-radius: 0.75rem;
  width: 90%;
  max-width: 420px;
  padding: 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
`;

const Header = styled.div`
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.75rem;
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  background: ${p => p.variant === 'secondary' ? '#e5e7eb' : '#10b981'};
  color: ${p => p.variant === 'secondary' ? '#111827' : 'white'};
`;

interface EventModalProps {
  isOpen: boolean;
  initialDate: string; // ISO
  onClose: () => void;
  onSave: (data: { date: string; description: string }) => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, initialDate, onClose, onSave }) => {
  const [date, setDate] = React.useState(initialDate);
  const [description, setDescription] = React.useState('');

  React.useEffect(() => {
    setDate(initialDate);
    setDescription('');
  }, [initialDate, isOpen]);

  if (!isOpen) return null;

  return (
    <Overlay>
      <Modal>
        <Header>Agregar Evento</Header>
        <Row>
          <div>
            <Label>Fecha</Label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div>
            <Label>Descripción</Label>
            <Textarea rows={3} placeholder="Breve descripción" value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </Row>
        <Actions>
          <Button variant="secondary" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="button" onClick={() => onSave({ date, description })}>Guardar</Button>
        </Actions>
      </Modal>
    </Overlay>
  );
};

export default EventModal;



