import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;

  button {
    margin-left: 10px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .cancel {
    background: #ccc;

    &:hover {
      background: #bbb;
    }
  }

  .save {
    background: #4caf50;
    color: white;

    &:hover {
      background: #45a049;
    }
  }
`;

const Modal = ({ onSave, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [dosage, setDosage] = useState('');
  const [instruction, setInstruction] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);

  const handleSave = () => {
    onSave({ name, price, dosage, instruction, quantity, amount });
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Add Medicine</h2>
        <FormGroup>
          <Label>Name</Label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Price</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Dosage</Label>
          <Input type="text" value={dosage} onChange={(e) => setDosage(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Instruction</Label>
          <Input type="text" value={instruction} onChange={(e) => setInstruction(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Quantity</Label>
          <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </FormGroup>
        <FormGroup>
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </FormGroup>
        <ButtonGroup>
          <button className="cancel" onClick={onClose}>Cancel</button>
          <button className="save" onClick={handleSave}>Save</button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;