import { translateMultiple } from './helpers/translation';
import { Trans, useTranslation } from 'react-i18next';
export const PAGE_LIMIT = 12;
export const generateIdeaMessages = (first_name = '') => {
  const { t } = useTranslation();
  const translations = translateMultiple([
    'ai.persona_chat_message',
    'ai.persona_chat_message_2',
    'ai.chat_message_1',
    'ai.example_chat_message_1',
    'ai.chat_message_2',
    'ai.example_chat_message_2',
    'ai.example_chat_message_3',
    'ai.example_chat_message_4',
    'ai.chat_message_3',
    'ai.personaSelectText',
    'ai.topicStyleText',
  ]);
  const personaIdeaMessages = [
    {
      identifier: 'cp',
      text: (
        <Trans t={t} i18nKey="ai.persona_chat_message">
          ({{ name: first_name }})
        </Trans>
      ),
      postedOn: '',
      showPersonas: true,
    },
  ];
  const ideaMessages = [
    {
      identifier: 'user',
      text: translations['ai.personaSelectText'],
      postedOn: '',
    },
    {
      identifier: 'cp',
      text: translations['ai.example_chat_message_3'],
      options: true,
      postedOn: '',
    },
    {
      identifier: 'user',
      text: translations['ai.personaSelectText'],
      postedOn: '',
    },
    {
      identifier: 'cp',
      text: translations['ai.example_chat_message_4'],
      responseStyle: true,
      postedOn: '',
    },
    {
      identifier: 'user',
      text: translations['ai.personaSelectText'],
      postedOn: '',
    },
    {
      identifier: 'cp',
      text: translations['ai.persona_chat_message_2'],
      example: translations['ai.example_chat_message_1'],
      postedOn: '',
    },
    {
      identifier: 'user',
      text: '',
      postedOn: '',
    },
    {
      identifier: 'cp',
      text: translations['ai.chat_message_2'],
      example: translations['ai.example_chat_message_2'],
      postedOn: '',
    },
    {
      identifier: 'user',
      text: '',
      postedOn: '',
    },
    {
      identifier: 'cp',
      text: translations['ai.chat_message_3'],
      postedOn: '',
    },
  ];
  return [...personaIdeaMessages, ...ideaMessages];
};
export const styleResOptions = (ideaMessagesIndex) => {
  const translations = translateMultiple([
    'ai.valuableTopics',
    'ai.engagingTopics',
    'ai.creativeTopics',
    'ai.impactfulTopics',
    'ai.valuableTrendSetting',
    'ai.engagingRelevant',
    'ai.creativeRelevant',
    'ai.impactfulFresh',
  ]);
  const options = [
    { label: translations['ai.valuableTrendSetting'], value: translations['ai.valuableTopics'] },
    { label: translations['ai.engagingRelevant'], value: translations['ai.engagingTopics'] },
    { label: translations['ai.creativeRelevant'], value: translations['ai.creativeTopics'] },
    { label: translations['ai.impactfulFresh'], value: translations['ai.impactfulTopics'] },
  ];

  return options;
};
