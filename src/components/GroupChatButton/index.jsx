import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  ButtonGroup,
  Popup,
  CancelButton,
  CreateButton,
  CheckboxLabel,
  Checkbox,
  ScrollableList,
  Title,
  GroupTitle,
  Input
} from "./style";
import { api } from "../../services/axios";
import { socket } from "../../services/socket";

export function GroupChatButton() {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [emailsList, setEmailsList] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const navigate = useNavigate();

  const togglePopup = () => {
    setPopupOpen(!isPopupOpen);
  };

  const cancel = () => {
    setPopupOpen(false);
  };

  const createGroup = () => {

    if (groupName.length === 0) {
      alert("digite um nome para o grupo!")
      return;
    }

    console.log('Nome do Grupo:', groupName);
    console.log('Emails Selecionados:', selectedEmails);

    const groupData = {
      creatorEmail: JSON.parse(localStorage.getItem("userData")).email,
      groupName,
      selectedEmails,
    };
    socket.on('groupCreated', (createdGroupData) => {
      console.log(createdGroupData);
      navigate(`/chat/${createdGroupData.id}`)
      setSelectedEmails([]);
      setGroupName("");

      cancel();
    })
    socket.emit('createGroup', groupData);
  };

  const handleGroupNameChange = (event) => {
    setGroupName(event.target.value);
  };

  const handleEmailCheckboxChange = (email) => {
    const updatedEmails = selectedEmails.includes(email)
      ? selectedEmails.filter((e) => e !== email)
      : [...selectedEmails, email];
    setSelectedEmails(updatedEmails);
  };

  useEffect(() => {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
      }
    }
    api.get('/users/emails', config).then((response) => {
      setEmailsList(response.data);
    }).catch((error) => {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate('/');
      } else {
        console.log(error);
      }
    })
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <ButtonGroup onClick={togglePopup}>New Group Chat +</ButtonGroup>

      <Popup isOpen={isPopupOpen}>
        <Title>Create Group</Title>
        <GroupTitle htmlFor="groupName">Group name:</GroupTitle>
        <br />
        <Input
          type="text"
          id="groupName"
          value={groupName}
          onChange={handleGroupNameChange}
          placeholder="Enter group name"
        />

        <br />
        <br />
        <label>Select emails:</label>
        <ScrollableList>
          {emailsList?.map((email) => (
            <CheckboxLabel key={email}>
              <Checkbox
                type="checkbox"
                value={email}
                checked={selectedEmails.includes(email)}
                onChange={() => handleEmailCheckboxChange(email)}
              />
              {email}
            </CheckboxLabel>
          ))}
        </ScrollableList>

        <CancelButton onClick={cancel}>cancel</CancelButton>
        <CreateButton onClick={createGroup}>create group</CreateButton>
      </Popup>
    </>
  );
};