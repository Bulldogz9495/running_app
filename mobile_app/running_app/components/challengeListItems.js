import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const ChallengeListItemComponent = ({ challenge }) => {
    const navigation = useNavigation();
    return (
      <Pressable onPress={() => navigation.navigate('challengeInfo', { challenge: challenge })}>
            <View style={styles.listItem}>
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{challenge.title}</Text>
                <Text style={{ fontSize: 20 }}>{challenge.score ? challenge.score.toFixed() : '0'} points this week</Text>
                <Text>{(challenge.runs).length} Runs Completed</Text>
                {challenge.score ? <Text>{(challenge.score / (challenge.runs).length).toFixed()} Points per run (avg)</Text> : null}
            </View>
      </Pressable>
    );
  };