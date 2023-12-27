import React, {useState} from "react";
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

export function GroupChatButton({ onGroupCreate }){
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [selectedEmails, setSelectedEmails] = useState([]);
  
    const togglePopup = () => {
      setPopupOpen(!isPopupOpen);
    };
  
    const cancel = () => {
      setPopupOpen(false);
    };
  
    const createGroup = () => {
      console.log('Nome do Grupo:', groupName);
      console.log('Emails Selecionados:', selectedEmails);

      const groupData = {
        groupName,
        selectedEmails,
      };

      onGroupCreate(groupData);
  
      cancel();
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
  
    const generateEmailOptions = (numEmails) => {
      const emails = [];
      for (let i = 1; i <= numEmails; i++) {
        emails.push(`email${i}@example.com`);
      }
      return emails;
    };
  
    const emailOptions = generateEmailOptions(20);
  
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
            {emailOptions.map((email) => (
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