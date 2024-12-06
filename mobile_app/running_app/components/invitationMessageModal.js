import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { formatDate } from '../utils/display_utils';
import styles from '../styles';

const InvitationMessageModal = ({ selectedMessage, individualMessageModalShow, setIndividualMessageModalShow, acceptInvitation }) => {
  const date = new Date(selectedMessage.updated);
  const formattedDate = formatDate(date);

  return (
    <Modal visible={individualMessageModalShow} animationType="slide" styles={styles.container}>
      <View style={styles.container}>
          {/* <Text>Invitation from {selectedMessage.metadata.user_name}</Text> */}
          <Text style={{ fontSize: 24, marginTop: 20, marginBottom: 20 }}>Invitation to join {selectedMessage.metadata.team_name}</Text>
          <Pressable style={[styles.pressableArea, { justifyContent : "center"}]} onPress={() => acceptInvitation(selectedMessage, true)}>
            <Text style={styles.pressableText}>Accept Invitation</Text>
          </Pressable>
          <Pressable style={styles.pressableArea} onPress={() => acceptInvitation(selectedMessage, false)}>
            <Text style={styles.pressableText}>Deny Invitation</Text>
          </Pressable>
          <Text style={{ fontSize: 16, margin: 20 }}>Sent: {formattedDate}</Text>
      </View>
      <View style = {styles.container}>
          <Pressable style={styles.pressableArea} onPress={() => setIndividualMessageModalShow(false)}>
            <Text style={styles.pressableText}>Return to Messages</Text>
          </Pressable>
      </View>
    </Modal>
  );
};

export default InvitationMessageModal;