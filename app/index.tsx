import { Link } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function Index() {
  return (
    <ScrollView style={styles.container}>
      <Link href="../">
        <Text>Go to a modal</Text>
      </Link>
      <Text style={styles.content}>
        将进酒！ 歌里，酒醒只在花间。 将进酒！ 歌里，酒醒只在花间。
        歌里，酒醒只在花间。 将进酒！ 歌里，酒醒只在花间。 将进酒！
        歌里，酒醒只在花间。 将进酒！ 歌里，酒醒只在花间。 将进酒！
        歌里，酒醒只在花间。 将进酒！ 歌里，酒醒只在花间。 将进酒！
        歌里，酒醒只在花间。 将进酒！ 歌里，酒醒只在花间。 将进酒！
        歌里，酒醒只在花间。 将进酒！ 歌里，酒醒只在花间。 将进酒！
        歌里，酒醒只在花间。 将进酒！ 歌里，酒醒只在花间。 将进酒！
        歌里，酒醒只在花间。 将进酒！ 歌里，酒醒只在花间。 将进酒！
        歌里，酒醒只在花间。歌里，酒醒只在花间。 将进酒！ 歌里，酒醒只在花间。
        将进酒！ 歌里，酒醒只在花间。歌里，酒醒只在花间。 将进酒！
        歌里，酒醒只在花间。 将进酒！ 歌里，酒醒只在花间。
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    fontSize: 60,
  },
});
