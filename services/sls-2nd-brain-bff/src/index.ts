import { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { SagaEvent, EventType, CardCreateMessage } from './types';
import { SNS } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

export const worker = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const snsConfig: SNS.ClientConfiguration = { region: 'ap-southeast-2' };
  const sns = new SNS(snsConfig);
  const newCardRequest: CardCreateMessage = JSON.parse(event?.body);
  const correlationId = uuidv4();
  const cardId = uuidv4();

  console.log(`bff ===> received newCardRequest:`, newCardRequest);
  console.log(EventType.CardCreate);
  const sagaEvent: SagaEvent = {
    eventType: EventType.CardCreate,
    correlationId,
    message: { ...newCardRequest, cardId } as CardCreateMessage,
  };
  const snsMsg: SNS.PublishInput = {
    TopicArn: process.env.INGRESS_TOPIC_ARN,
    Message: JSON.stringify(sagaEvent),
    MessageAttributes: {
      EventType: {
        DataType: 'String',
        StringValue: EventType.CardCreate,
      },
    },
  };
  await sns.publish(snsMsg).promise();

  console.log(
    `bff => published Event: ${EventType.CardCreate}, correlationId: ${correlationId}`,
  );
  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify({ cardId }),
  };
  return response;
};
