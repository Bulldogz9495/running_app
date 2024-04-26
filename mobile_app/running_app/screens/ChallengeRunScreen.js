import React from 'react';
import { View, Text } from 'react-native';
import { getUserDataFromAsyncStorage } from '../utils/AsyncStorageUtils';

const ChallengeRunScreen = () => {
  const [teams, setTeams] = React.useState([]);

  React.useEffect(() => {
    const fetchTeams = async () => {
      try {
        const userInfo = await getUserDataFromAsyncStorage();
        const url = `${settings.MONGO_API_URL}/Teams/user_id/${encodeURIComponent(userInfo?.data.id)}`;
        const response = await fetch(url);
        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTeams();
  }, []);

  const renderTeam = (team, index) => (
    <View key={index} style={{ borderWidth: 1, padding: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
        {team.name}
      </Text>
      <Text>
        Total team score: {team.total_team_score}
      </Text>
      <Text>
        Date: {team.date}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text style={{ margin: 10 }}>Your teams</Text>
      {teams.map(renderTeam)}
    </View>
  );
};

export default ChallengeRunScreen;

