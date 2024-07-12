import { View, Text, Modal, FlatList, ActivityIndicator, Pressable, Button } from 'react-native';
import { formatDate } from '../utils/display_utils';
import react from 'react';


const IndividualMessageModal = ({ selectedMessage, individualMessageModalShow, setIndividualMessageModalShow, acceptInvitation }) => {
    if (selectedMessage.message_type === "invitation") {
        return (
          <Modal visible={individualMessageModalShow} animationType="slide" styles={styles.container}>
            <View style={styles.message}>
                <Text>Invitation from {selectedMessage.metadata.user_name}</Text>
                <Text>Join {selectedMessage.metadata.team_name}</Text>
                <Button title="Accept Invitation" onPress={() => acceptInvitation(selectedMessage, true)} />
                <Button title="Deny Invitation" onPress={() => acceptInvitation(selectedMessage, false)} />
                <Text>Sent: {formattedDate}</Text>
            </View>
            <View style = {styles.container}>
                <Pressable style={styles.pressableArea} onPress={() => setIndividualMessageModalShow(false)}>
                  <Text style={styles.pressableText}>Return to Messages</Text>
                </Pressable>
            </View>
          </Modal>
        );
    } else if (selectedMessage.message_type === "text") {
        return (
            <Modal visible={individualMessageModalShow} animationType="slide" styles={styles.container}>
            <View style={styles.container}>
                <Text style={{ fontSize: 24 }}>{selectedMessage?.message}</Text>
                <Text style={{ fontSize: 16 }}>From : {selectedMessage?.metadata?.user_name}</Text>
                <Text style={{ fontSize: 16 }}>Sent: {formatDate(new Date(selectedMessage?.updated))}</Text>
            </View>
            <View style = {styles.container}>
                <Pressable style={styles.pressableArea} onPress={() => setIndividualMessageModalShow(false)}>
                  <Text style={styles.pressableText}>Return to Messages</Text>
                </Pressable>
            </View>
        </Modal>
        );
    };
};

export default IndividualMessageModal