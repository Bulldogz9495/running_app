import { View, Text, Pressable } from "react-native";
import { formatDate } from '../utils/display_utils';


const TextMessageComponent = ({ item, changeSelectedMessage }) => {
    const date = new Date(item.updated);
    const formattedDate = formatDate(date);
    // console.log("Item: ", item);
    if (item.read) {
        return (
            <View style={styles.message}>
              <Text>Message: {item.message}</Text>
              <Text>Sent: {formattedDate}</Text>
            </View>
        );
    } else {
        return (
            <Pressable onPress={() => changeSelectedMessage(item)}>
              <View style={styles.unreadMessage}>
                <Text>Message: {item.message}</Text>
                <Text>Updated: {formattedDate}</Text>
              </View>
            </Pressable>
        );
    }
};

export default TextMessageComponent