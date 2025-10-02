import { sessions } from "@/utils/sessions";
import { Image } from "expo-image";
import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";
import Button from "../Button";

const blurhash = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

const HEADER_HEIGHT = 400;

export default function ParallaxScrollView({ children }: PropsWithChildren) {
    const todaySession = sessions[Math.floor(Math.random() * sessions.length)]
    const scrollRef = useAnimatedRef<Animated.ScrollView>()
    const scrollOffset = useScrollViewOffset(scrollRef)

    const headerAnimatedStyle = useAnimatedStyle(() => {
        //  only apply parallax effect when pulling down (negative scroll offset)
        //  when scrolling up (positive scroll offset), behave like normal scroll
        const translateY = 
            scrollOffset.value <= 0
                ? interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0], [-HEADER_HEIGHT / 2, 0])
                : 0

        const scale = 
            scrollOffset.value <= 0
                ? interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0], [2, 1])
                : 1
        
        return {
            transform: [{translateY}, {scale}]
        }
    })

    return (
        <View style={ styles.container}>
            <Animated.ScrollView 
                ref={scrollRef}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={[{ height: HEADER_HEIGHT, overflow: "hidden"},headerAnimatedStyle]}>
                    <Image 
                        source={todaySession.image} 
                        placeholder={blurhash}
                        style={{
                            width: "100%",
                            height: HEADER_HEIGHT
                        }}
                    />
                </Animated.View>
                <View style={styles.headerContainer}>
                    <View style={{ flex:3}}/>
                    <View style={styles.headerContent}>
                        <Text style={styles.headerSubtitle}>Featured Session</Text>
                        <Text style={styles.headerTitle}>{todaySession.title}</Text>
                        <Text style={styles.headerDescription}>{todaySession.description}</Text>
                        <Button>Start Session</Button>
                    </View>
                    <View style={{ flex:1}}/>
                </View>
                {children}
            </Animated.ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        position: "absolute",
        width: "100%",
        height: HEADER_HEIGHT,
        experimental_backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.5))"
    },
    headerSubtitle: {
        fontSize: 16,
        color: "white",
        opacity: 0.5,
        fontWeight: "bold",
    },
    headerTitle: {
        fontSize:32,
        fontWeight: "bold",
        color: "white"
    },
    headerDescription: {
        fontSize: 16,
        color: "white",
    },
    headerContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    }
})