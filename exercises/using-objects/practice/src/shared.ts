export const TaskQueueName = "translation-tasks"

export interface TranslationWorkflowInput {
  Name: string;
  LanguageCode: string;
}

export interface TranslationWorkflowOutput {
  HelloMessage: string;
  GoodbyeMessage: string;
}

// TODO define structs for Activity input and output here
