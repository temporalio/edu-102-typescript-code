export const TASK_QUEUE_NAME = 'translation-tasks';

export interface TranslationWorkflowInput {
  name: string;
  languageCode: string;
}

export interface TranslationWorkflowOutput {
  helloMessage: string;
  goodbyeMessage: string;
}

// TODO define structs for Activity input and output here
