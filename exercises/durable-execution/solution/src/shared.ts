export const TaskQueueName = "translation-tasks"

export interface TranslationWorkflowInput {
  Name: string;
  LanguageCode: string;
}

export interface TranslationWorkflowOutput {
  HelloMessage: string;
  GoodbyeMessage: string;
}

export interface TranslationActivityInput {
  Term: string;
  LanguageCode: string;
}

export interface TranslationActivityOutput {
  Translation: string;
}
