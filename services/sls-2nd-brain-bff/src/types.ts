export interface SagaEvent {
  eventType: EventType;
  correlationId: string;
  message: CardCreateMessage | CardCreateSuccessMessage;
}
export interface CardCreateMessage {
  question: string;
  options: Option[];
  answer: Answer;
}
export interface CardCreateSuccessMessage extends CardCreateMessage {
  cardId: string;
}

export enum EventType {
  CardCreate = 'CardCreate',
  CardCreatedSuccess = 'CardCreatedSuccess',
  CardUpdate = 'CardUpdate',
  CardUpdateSuccess = 'CardUpdateSuccess',
  CardDelete = 'CardDelete',
  CardDeleteSuccess = 'CardDeleteSuccess',
}

export interface Card {
  id: string;
  question: string;
  options: Option[];
  answer: Answer;
}

export interface Option {
  id: string;
  content: string;
}
export interface Answer {
  optionId: string;
  explanation: string;
  additionalInsights?: string[];
}
