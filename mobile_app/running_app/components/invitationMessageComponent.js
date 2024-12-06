import { View, Text, Button, Pressable } from "react-native";
import { formatDate } from '../utils/display_utils';
import { markMessageRead, acceptInvitation } from "../utils/api";

const InvitationMessageComponent = ({ item, changeSelectedMessage }) => {
    const handleAcceptInvitation = async (item, accepted) => {
        acceptInvitation(item.metadata.team_id, item.metadata.invitation_id, accepted)
        response2 = markMessageRead(item.id);
        setMessages(prevMessages => prevMessages.map(message => {
            if (message.id === item.id) {
            return {...message, "read": true}; // Update with the new data
            }
            return message; // Return unchanged items
        }));
        console.log(responseData);
        navigation.navigate('Challenge Run');
    }
    

    console.log("Item: ", item);
    const date = new Date(item?.updated);
    const formattedDate = formatDate(date);
    return (
        !item?.read ? (
          <Pressable onPress={() => changeSelectedMessage(item)}>
            <View style={styles.unreadMessage}>
              <Text>Invitation from {item?.metadata?.user_name}</Text>
              <Text>Join {item?.metadata?.team_name}</Text>
              <Text>Sent: {formattedDate}</Text>
              <View style={styles.buttons}>
                <Button title="Accept Invitation" onPress={() => handleAcceptInvitation(item, true)} />
                <Button title="Deny Invitation" onPress={() => handleAcceptInvitation(item, false)} />
              </View>
            </View>
          </Pressable>
        ) : (
          <Pressable onPress={() => changeSelectedMessage(item)}>
            <View style={styles.message}>
              <Text>Invitation from {item?.metadata?.user_name}</Text>
              <Text>Join {item?.metadata?.team_name}</Text>
              <Text>Updated: {formattedDate}</Text>
            </View>
          </Pressable>
        )
    );
};

export default InvitationMessageComponent;