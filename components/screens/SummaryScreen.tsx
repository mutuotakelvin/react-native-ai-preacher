import { appwriteConfig, database } from '@/utils/appwrite'
import { ConversationResponse } from '@/utils/types'
import { useUser } from '@clerk/clerk-expo'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { ID } from 'react-native-appwrite'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '../Button'
import Gradient from '../gradient'

export default function SummaryScreen() {
    const { conversationId } = useLocalSearchParams()
    const [ conversation, setConversation ] = useState<ConversationResponse>()
    const { user } = useUser();
    const [ isSaving, setIsSaving ] = useState(false);

    const router = useRouter();

    useEffect(() => {
        getSummary();
    }, []);

    async function getSummary() {
        const response = await fetch(
            `${process.env.EXPO_PUBLIC_BASE_URL}/api/conversations?conversationId=${conversationId}`
        );

        const conv: ConversationResponse = await response.json();
        setConversation(conv);
    }

    console.log('conversation', JSON.stringify(conversation, null, 2));

    async function saveAndContinue() {
        try {
            setIsSaving(true);
            await database.createDocument(appwriteConfig.db, appwriteConfig.table.session, ID.unique(), {
                userId: user?.id,
                convId: conversationId,
                status: conversation?.status,
                tokens: conversation?.metadata.cost,
                callDurationSecs: conversation?.metadata.call_duration_secs,
                callSummaryTitle: conversation?.analysis.call_summary_title,
                transcript: conversation?.transcript.map((t) => t.message).join('\n'),
            });

            router.dismissAll();
        } catch (error) {
            console.error('Error saving and continuing:', error);
        } finally {
            setIsSaving(false);
        }
    }

  return (
    <SafeAreaView>
    <Gradient position="bottom" isSpeaking={false} />
    <ScrollView
        contentInsetAdjustmentBehavior='automatic'
        contentContainerStyle={{ paddingHorizontal: 16 }}
    >
        {
            conversation?.status !== "done" && (
                <View style={{ gap: 16, paddingBottom: 16}}>
                    <Text style={styles.title}>We are processing your call...</Text>
                    <Text style={styles.subtitle}>This may take a few minutes...</Text>
                    <Text style={styles.caption}>You will be notified when it is ready.</Text>
                    <Text style={styles.subtitle}>Curent status: { conversation?.status }</Text>
                    <Button onPress={getSummary}>Refresh</Button>
                </View>
            )
        }

        {
            conversation?.status === "done" && (
                <View style={{ gap: 16, paddingBottom: 16}}>
                    <Text style={styles.title}>{ conversation?.analysis.call_summary_title }</Text>
                    <Text style={styles.subtitle}>{ conversation?.analysis.transcript_summary.trim() }</Text>
                    <Text style={styles.title}>Stats</Text>
                    <Text style={styles.subtitle}>{ conversation?.metadata.call_duration_secs } seconds</Text>
                    {/* tokens used */}
                    <Text style={styles.subtitle}>{ conversation?.metadata.cost } Tokens</Text>
                    <Text style={styles.subtitle}>{ new Date(conversation?.metadata.start_time_unix_secs * 1000).toLocaleString() }</Text>

                    {/* Transcript */}
                    <Text style={styles.title}>Transcript</Text>
                    <Text style={styles.subtitle}>{ conversation?.transcript.map((t) => t.message).join('\n') }</Text>
                </View>
            )
        }
        <View style={{ alignItems: "center"}}>
            <Button onPress={() => saveAndContinue()} disabled={isSaving}>{ isSaving ? 'Saving...' : 'Save and continue' }</Button>
        </View>

    </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    title:{
        fontSize:24,
        fontWeight: 'bold',
    },
    subtitle:{
        fontSize: 12
    },
    caption: {
        fontSize: 12,
        color: "gray"
    }
})