import { createContext } from 'react';

export const GenerateIdeasContext = createContext({
  handleResetChat: () => {},
  ideaMessagesIndex: 0,
  ideaMessages: [],
});
