import { Component } from '@monorepo/component';
import React from 'react';

const App = () => {
  const text = "text";

  return (
    <div className="App">
      <Component />
      <span>{text}</span>
    </div>
  );
};

export default App;
