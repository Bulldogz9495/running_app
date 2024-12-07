import { View, Text, Pressable } from "react-native";
import { formatDate } from '../utils/display_utils';


const TextMessageComponent = ({ item, changeSelectedMessage }) => {
    const date = new Date(item.updated);
    const formattedDate = formatDate(date);
    if (item.read) {
        return (
          <Pressable onPress={() => changeSelectedMessage(item)}>
            <View style={styles.message}>
              <Text>Message: {item.message}</Text>
              {item.metadata?.creator_name && <Text>From: {item.metadata?.creator_name}</Text>}
              <Text>Sent: {formattedDate}</Text>
            </View>
          </Pressable>
        );
    } else {
        return (
            <Pressable onPress={() => changeSelectedMessage(item)}>
              <View style={styles.unreadMessage}>
                <Text>Message: {item.message}</Text>
                {item.metadata?.creator_name && <Text>From: {item.metadata?.creator_name}</Text>}
                <Text>Updated: {formattedDate}</Text>
              </View>
            </Pressable>
        );
    }
};

export default TextMessageComponent