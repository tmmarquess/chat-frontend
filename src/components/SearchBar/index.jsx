import React, { useState } from 'react';
import { SearchContainer, InputSearch, SearchButton, EmailList, ElementsList } from './style'
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/axios'

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value.trim() !== "") {
      const config = {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      }
      api.get(`/users/search/${value}`, config).then((response) => {
        setSuggestedUsers(response.data);
      }).catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate('/');
        } else {
          console.log(error);
        }
      })
    } else {
      setSuggestedUsers([]);
    }
  };

  const handleSearch = () => {
    if (currentUser !== undefined) {
      const nomePessoa = currentUser.name;
      navigate(`/singlechat/${nomePessoa}`)
    }
  };


  const handleSuggestionClick = (user) => {
    setSearchTerm(user.email);
    setCurrentUser(user);
    setSuggestedUsers([]);
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

      {suggestedUsers.length > 0 && (
        <EmailList>
          {suggestedUsers.map((user) => (
            <ElementsList key={user.email} onClick={() => handleSuggestionClick(user)}>
              {user.name} - [{user.email}]
            </ElementsList>
          ))}
        </EmailList>
      )}
    </SearchContainer>
  );
};
