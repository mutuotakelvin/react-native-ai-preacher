import ParallaxScrollView from "@/components/screens/ParallaxScrollView";
import { appwriteConfig, database, Session } from "@/utils/appwrite";
import { colors } from "@/utils/colors";
import { sessions } from "@/utils/sessions";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Query } from "react-native-appwrite";

export const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

export default function Index() {
  const router = useRouter();
  const [sessionHistory, setSessionHistory] = useState<Session[]>([]);
  const {user} = useUser()

  useEffect(() => {
    fetchSessions();
  }, [user?.id]);

  const fetchSessions = async () => {
    if (!user?.id) {
      alert("User not found");
      return;
    }
    try {
      const { documents } = await database.listDocuments(appwriteConfig.db, 
        appwriteConfig.table.session,
        [Query.equal("userId", user?.id)]
      )
      setSessionHistory(documents as unknown as Session[]);
      console.log("sessionHistory", JSON.stringify(sessionHistory, null, 2));
    } catch (error) {
      console.error(error);
    }
  }
  
  return (
      <ParallaxScrollView>
        <Text style={styles.title}>Explore Sessions</Text>
        <ScrollView 
          contentContainerStyle={{
            paddingLeft: 16,
            gap: 16
          }}
          horizontal
          contentInsetAdjustmentBehavior="automatic"
          showsHorizontalScrollIndicator={false}
          >
          {
            sessions.map((session) => (
              <Pressable key={session.id}
              style={styles.sessionContainer}
              onPress={() => router.navigate({
                pathname: '/session',
                params: { sessionId: session.id }
              })}
              >
                <Image
                  source={session.image}
                  style={styles.sessionImage}
                  contentFit="cover"
                  transition={1000}
                  placeholder={{blurhash}}
                />
                <View
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    experimental_backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.5))",
                    borderRadius: 16,
                  }}
                >

                <Text style={styles.sessionTitle}>{session.title}</Text>
                </View>
              </Pressable>
            ))
          }
        </ScrollView>

        <View
          style={{
            flexGrow: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingRight: 16,
          }}
        >
          <Text style={styles.title}>Recents</Text>
          <Pressable onPress={ fetchSessions }>
            <Ionicons name="refresh-circle-sharp" size={32} color={colors.primary} />
          </Pressable>
        </View>

        <View style={{ gap: 16 }}>
          {
            sessionHistory.length > 0 ? (
              sessionHistory.map((session) => (
                <SessionCard key={session.$id} session={session} />
              ))
            ) : (
              <Text>No sessions found</Text>
            )
          }
        </View>

      </ParallaxScrollView>
  )
}

const SessionCard = ({ session}: { session:Session}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const randomEmoji = useMemo(() => {
    // the 10 emoji should be calm and peaceful
    return [
      '',
      '💛',
      '😊',
      '⭐',
      '🌤️',
      '🌙',
      '🍂',
      '💛',
      '😊',
      '⭐',
      '🌤️',
      '🌙',
    ][Math.floor(Math.random() * 10)];
  }, []);
  return (
    <View
    style={{
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      backgroundColor: "white",
      gap:8,
    }}
    >
      <Text style={{ fontSize: 24}}>{randomEmoji}</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold"}}>{session.callSummaryTitle}</Text>
      { isExpanded ? (
        <>
          <Text style={{ fontSize: 16}}>{session.transcript}</Text>
          <Pressable onPress={() => setIsExpanded(true)}>
            <Text style={{ fontSize: 16, color: colors.primary}}>
              { isExpanded ? 'Show less' : 'Show more' }
            </Text>
          </Pressable>
        </>
      ) : (
        <Pressable onPress={() => setIsExpanded(false)}>
          <Text style={{ fontSize: 16, color: colors.primary}}>
            Show more
          </Text>
        </Pressable>
      )}
      <Text>{session.call_duration_secs} seconds, {session.tokens} tokens</Text>
      <Text>
        { new Date(session.$createdAt).toLocaleString("en-US",{
          weekday: "long",
        }) }
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  sessionContainer: {
    position: "relative",
  },
  sessionImage: {
    width: 250,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
  },
  sessionTitle: {
    position: "absolute",
    width: "100%",
    bottom: 16,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});