import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    greenCircle: {
      backgroundColor: 'rgba(0, 200, 0, 0.55)',
      borderRadius: 100,
      height: 100,
      width: 100,
      alignItems: 'center',
      justifyContent: 'center'
    },
    mapTextStyle: {
      fontSize: 18
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'lightgreen',
    },
    topLoginContainer: {
        width: '100%',
    },
    loginLabel: {
        fontSize: 30,
        marginBottom: 5,
        color: 'black',
    },
    inputLogin: {
        width: '100%',
        fontSize: 25,
        height: 60,
        borderColor: 'blue',
        borderWidth: 2,
        borderRadius: 25,
        margin: 5,
        padding: 15,
        color: 'black',
    },
    errorLogin: {
        color: 'red',
        marginBottom: 10,
    },
    teamInput: {
        flex: 1, 
        borderColor: 'gray', 
        borderWidth: 1, 
        padding: 10
    },
    button: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        color: 'lightyellow',
        fontSize: 32,
        borderColor: 'blue',
        borderWidth: 1,
    },
    userText: {
        fontSize: 20
    }
  });