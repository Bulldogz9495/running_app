import { View, Text, Modal, FlatList, ActivityIndicator, Pressable, Button } from 'react-native';
import { formatDate } from '../utils/display_utils';
import react from 'react';
import InvitationMessageModal from './invitationMessageModal';
import TextMessageModal from './textMessageModal';

const IndividualMessageModal = ({ selectedMessage, individualMessageModalShow, setIndividualMessageModalShow }) => {
    if (selectedMessage.message_type === "invitation") {
      return (
        <InvitationMessageModal selectedMessage={selectedMessage} individualMessageModalShow={individualMessageModalShow} setIndividualMessageModalShow={setIndividualMessageModalShow} />
      );
    } else if (selectedMessage.message_type === "text") {
        return (
          <TextMessageModal selectedMessage={selectedMessage} individualMessageModalShow={individualMessageModalShow} setIndividualMessageModalShow={setIndividualMessageModalShow} />
        )
    };
};

export default IndividualMessageModal