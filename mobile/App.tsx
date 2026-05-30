import React from 'react';
import { StatusBar } from 'react-native';
import TimerScreen from './src/screens/TimerScreen';
import { ThemeProvider } from './src/theme/ThemeContext';

const App = () => {
  return (
    <ThemeProvider>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <TimerScreen />
    </ThemeProvider>
  );
};

export default App;
