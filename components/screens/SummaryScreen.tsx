import { ConversationResponse } from '@/utils/types'
import { useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import { ScrollView, Text } from 'react-native'
import Gradient from '../gradient'

export default function SummaryScreen() {
    const { conversationId } = useLocalSearchParams()
    const [ conversation, setConversation ] = useState<ConversationResponse>()

  return (
    <>
    <Gradient position="bottom" isSpeaking={false} />
    <ScrollView
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={{ paddingHorizontal: 16 }}
    >
        <Text>Summary</Text>

    </ScrollView>
    </>
  )
}