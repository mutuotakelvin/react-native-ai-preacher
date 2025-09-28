import { useConversation } from '@elevenlabs/react-native';
import React from 'react';
import { Button, Text, View } from 'react-native';

export default function SessionScreen() {
    const conversation = useConversation({
        onConnect: () => console.log('Connected to conversation'),
        onDisconnect: () => console.log('Disconnected from conversation'),
        onMessage: (message) => console.log('Received message:', message),
        onError: (error) => console.error('Conversation error:', error),
        onModeChange: (mode) => console.log('Conversation mode changed:', mode),
        onStatusChange: (prop) => console.log('Conversation status changed:', prop.status),
        onCanSendFeedbackChange: (prop) =>
          console.log('Can send feedback changed:', prop.canSendFeedback),
        onUnhandledClientToolCall: (params) => console.log('Unhandled client tool call:', params),
    });

    const startConversation = async() => {
        try {
            await conversation.startSession({
                agentId: process.env.EXPO_PUBLIC_AGENT_ID,
                dynamicVariables: {
                    user_name: 'John Doe',
                    session_title: 'Forgiveness',
                    session_description: 'Forgiveness is a powerful force that can transform relationships and heal wounds. In this session, we will explore the concept of forgiveness and how it can be applied in our lives.',
                }
            });
        } catch (error) {
            console.error('Error starting conversation:', error);
        }
    }

    const endConversation = async() => {
        try {
            await conversation.endSession();
        } catch (error) {
            console.error('Error ending conversation:', error);
        }
    }
      

  return (
    <View>
      <Text>SessionScreen</Text>
      <Button title="Start Conversation" onPress={startConversation} />
      <Button title="End Conversation" onPress={endConversation} color={"red"} />
    </View>
  )
}