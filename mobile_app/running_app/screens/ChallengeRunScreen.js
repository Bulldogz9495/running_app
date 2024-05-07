import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';
import { settings } from '../utils/settings';
import { sampleData } from '../utils/sample_data';

const ChallengeRunScreen = () => {
  const [teams, setTeams] = React.useState([]);
  const [expandedTeam, setExpandedTeam] = React.useState(null);

  React.useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userInfo = await getUserDataFromAsyncStorage();
        console.log("USERINFO: ", userInfo);
        const url = `${settings.MONGO_API_URL}/Teams/user_id/${encodeURIComponent(userInfo?.data.id)}`;
        const response = await fetch(url);
        const data = await response.json();
        console.log("Teams Data: ", data);
        setTeams(data);
      } catch (error) {
        console.error(error);
        setTeams(sampleData.teams);
      }
    };
    fetchTeams();
  }, []);

  const renderTeam = ({ item, index }) => {
    const isExpanded = item._id === expandedTeam;

    return (
      <View key={index} style={{ borderWidth: 1, padding: 10 }}>
        <Pressable onPress={() => setExpandedTeam(isExpanded ? null : item._id)}>
          <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
            {item.name}
          </Text>
          <Text>
            Total Motto: {item.motto}
          </Text>
          <Text>
            Last Challenge Score: {item.last_challenge_score}
          </Text>
          <Text>
            Last Challenge Date: {item.last_challenge_date}
          </Text>
          <View>
            <Text>Team Size: {item.members.length}</Text>
          </View>
        </Pressable>
        {isExpanded && (
          <FlatList
            data={item.members_info}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Text key={index}>
                {item.first_name} {item.last_name}
              </Text>
            )}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ margin: 10 }}>Your teams</Text>
      <FlatList
        data={teams}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTeam}
      />
    </View>
  );
};

export default ChallengeRunScreen;

