import React, { useState } from 'react';
import styled from 'styled-components';
import { generateTestEventCode, JanosService } from '../utils/janosService';

const TestCodesContainer = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const TestCodesTitle = styled.h4`
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
`;

const TestCodesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TestCodeButton = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

const RandomCodeButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #059669;
  }
`;

const TestCodes: React.FC<{ onCodeSelect: (code: string) => void }> = ({ onCodeSelect }) => {
  const [validCodes] = useState(() => JanosService.getValidEventCodes());

  const handleRandomCode = () => {
    const randomCode = generateTestEventCode();
    onCodeSelect(randomCode);
  };

  return (
    <TestCodesContainer>
      <TestCodesTitle>Códigos de prueba disponibles:</TestCodesTitle>
      <TestCodesList>
        {validCodes.map(code => (
          <TestCodeButton
            key={code}
            onClick={() => onCodeSelect(code)}
            title={`Cliente: ${code}`}
          >
            {code}
          </TestCodeButton>
        ))}
        <RandomCodeButton onClick={handleRandomCode}>
          Código Aleatorio
        </RandomCodeButton>
      </TestCodesList>
    </TestCodesContainer>
  );
};

export default TestCodes;



