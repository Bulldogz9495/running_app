import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { formatDate } from '../utils/display_utils';
import styles from '../styles';

const TextMessageModal = ({ selectedMessage, individualMessageModalShow, setIndividualMessageModalShow }) => {
  return (
    <Modal visible={individualMessageModalShow} animationType="slide" styles={styles.container}>
      <View style={styles.container}>
          <Text style={{ fontSize: 24 }}>Message: {selectedMessage?.message}</Text>
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

export default TextMessageModal;