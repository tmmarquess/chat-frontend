import React, { useState } from 'react';
import { SearchContainer, InputSearch, SearchButton, EmailList, ElementsList } from './style'
import { useNavigate } from 'react-router-dom';

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedEmails, setSuggestedEmails] = useState([]);
  const navigate = useNavigate(); 

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    const suggestions = ['debora@gmail.com', 'thiago@gmail.com', 'bea@gmail.com'];
    const filteredSuggestions = suggestions.filter((email) =>
      email.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestedEmails(filteredSuggestions);
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') { 
      const nomePessoa = searchTerm.split('@')[0] 
      navigate(`/singlechat/${nomePessoa}`)
    }
  };


  const handleSuggestionClick = (email) => {
    setSearchTerm(email);
    setSuggestedEmails([]);
  };

  return (
    <SearchContainer>
      <InputSearch
        type="text"
        placeholder="enter email..."
        value={searchTerm}
        onChange={handleInputChange}
      />

      <SearchButton onClick={handleSearch}>search</SearchButton>

      {suggestedEmails.length > 0 && (
        <EmailList>
          {suggestedEmails.map((email) => (
            <ElementsList key={email} onClick={() => handleSuggestionClick(email)}>
              {email}
            </ElementsList>
          ))}
        </EmailList>
      )}
    </SearchContainer>
  );
};
