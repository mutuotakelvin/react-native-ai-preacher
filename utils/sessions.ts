import { ImageSourcePropType } from "react-native";

interface Session {
    id: number;
    title: string;
    description: string;
    image: ImageSourcePropType;
}

export const sessions: Session[] = [
    {
        id: 1,
        title: "Overcoming Anxiety",
        description: "Trust God when life feels uncertain.",
        image: require("@/assets/sessions/anxiety.jpg"),
    },
    {
        id: 2,
        title: "Finding Peace",
        description: "Slow down and rest in God's presence.",
        image: require("@/assets/sessions/peace.jpg"),
    },
    {
        id: 3,
        title: "Healing & Forgiveness",
        description: "Let go of hurt and find freedom in forgiveness.",
        image: require("@/assets/sessions/forgiveness.jpg"),
    },
    {
        id: 4,
        title: "Battling Loneliness",
        description: "Remember God is always with you.",
        image: require("@/assets/sessions/loneliness.jpg"),
    },
    {
        id: 5,
        title: "Building Hope",
        description: "Anchor your future in God's promises.",
        image: require("@/assets/sessions/hope.jpg"),
    },
];
