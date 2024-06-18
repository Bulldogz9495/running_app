import { Text } from 'react-native';
import styles from '../styles';


export const DisplayTime = ({ totalTimeSeconds }) => {
  const minutes = Math.floor(totalTimeSeconds / 60);
  const seconds = (totalTimeSeconds % 60).toFixed(0).toString().padStart(2, '0');
  let displayMinutes = minutes.toString();
  if (minutes > 99) {
    display = '99+';
  } else {
    display = `${displayMinutes}:${seconds}`
  }
  return (
    <Text style={styles.mapScoreStyle}>{display}</Text>
  );
};

