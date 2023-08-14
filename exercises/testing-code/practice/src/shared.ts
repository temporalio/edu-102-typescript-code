export const TASK_QUEUE_NAME = 'translation-tasks';

export interface TranslationWorkflowInput {
  name: string;
  languageCode: string;
}

export interface TranslationWorkflowOutput {
  helloMessage: string;
  goodbyeMessage: string;
}

export interface TranslationActivityInput {
  term: string;
  languageCode: string;
}

export interface TranslationActivityOutput {
  translation: string;
}
