import React from 'react';

export const Component = () => {
  const [count, setCount] = React.useState(0);

  return (
    <div>
      <span>{count}</span>
      <button onClick={() => setCount(count + 1)}>click</button>
    </div>
  );
};
