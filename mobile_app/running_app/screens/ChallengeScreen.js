import { View, Text, Pressable, FlatList } from 'react-native'
import styles from '../styles';
import { RunComponent } from '../components/RunComponent';
import moment from 'moment';

const ChallengeScreen = ( { navigation, route: { params } }) => {
    challenge = params.challenge
    challenge.runs.sort((a, b) => b.score - a.score)

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable style={styles.pressableArea} onPress={() => navigation.goBack()}>
                    <Text style={styles.pressableText}>Go Back</Text>
                </Pressable>
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 20 }}>{challenge.title}</Text>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>{challenge.description}</Text>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>{Math.ceil((new Date(challenge.end_datetime) - new Date()) / (1000 * 60 * 60 * 24))} days left in the challenge</Text>
            <Text style={{ fontSize: 26, marginBottom: 10 }}>{challenge.score ? challenge.score.toFixed() : '0'} points this week</Text>
            <Text style={{ fontSize: 22 }}>{(challenge.runs).length} Runs Completed</Text>
            <Text style={{ marginBottom: 10 }}>{(challenge.score / (challenge.runs).length).toFixed()} Average Points per run</Text>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Challenge Started: {moment(challenge.start_datetime).format('l')}</Text>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Challenge Ends: {moment(challenge.start_datetime).format('l')}</Text>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 20 }}>Runs: </Text>
                <FlatList
                    data={challenge.runs}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <RunComponent navigation={navigation} run={item} />}
                />
            </View>
        </View>
    )
}

export default ChallengeScreen;