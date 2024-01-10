// StockContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const StockContext = createContext();

export const StockProvider = ({ children }) => {
  const [remainingStock, setRemainingStock] = useState({});

  const updateRemainingStock = (newStock) => {
    setRemainingStock(newStock);
  };

  useEffect(() => {
    // Log the remaining stock whenever it changes for debugging purposes
    console.log('Remaining Stock Updated:', remainingStock);
  }, [remainingStock]);

  return (
    <StockContext.Provider value={{ remainingStock, updateRemainingStock }}>
      {children}
    </StockContext.Provider>
  );
};

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
