import React from 'react';
// import Card from './Card';

function SearchList({filtereddata }) {
  const filtered = filtereddata.map(person => <searchBoxSecond key={person.ID} person={person} />); 
  return (
    <div>
      {filtered}
    </div>
  );
}

export default SearchList;