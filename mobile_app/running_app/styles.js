import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
    profileContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 20,
        backgroundColor: 'lightgreen',
    },
      userDataContainer: {
        alignSelf: 'flex-start',
        width: '100%',
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
    container: {
        flex: 1,
        padding: 10,
        paddingTop: 60,
        backgroundColor: 'lightgreen',
    },
    modal: {
        flex: 1,
        padding: 10,
        paddingTop: 60,
        backgroundColor: 'lightgreen',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greenCircle: {
      backgroundColor: 'rgba(0, 200, 0, 0.55)',
      borderRadius: 0,
      marginBottom: 5,
      height: 100,
      width: 100,
      alignItems: 'center',
      justifyContent: 'center'
    },
    mapScoreStyle: {
      fontSize: 30,
      fontWeight: 'bold'
    },
    mapTextStyle: {
      fontSize: 12,
      textAlign: 'center',
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
    b1: {
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
    userProfileInfo: {
        fontSize: 25,
        // borderColor: 'blue',
        // borderRadius: 5,
        // borderWidth: 1,
        marginBottom: 10,
    },
    userText: {
        fontSize: 20
    },
    pressableArea: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        color: 'lightyellow',
        fontSize: 32,
        borderColor: 'blue',
        borderWidth: 1,
        margin: 10,
        alignItems: "center"
    },
    pressableAreaScary: {
        backgroundColor: 'darkred',
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'black',
        color: 'lightyellow',
        fontSize: 32,
        margin: 10,
        alignItems: "center"
    },
    pressableText: {
        color: 'lightyellow',
        fontSize: 18
    },
    message: {
        marginVertical: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        marginRight: 15,
        marginLeft: 15,
    },
    listItem: { 
        borderWidth: 1, 
        padding: 10, 
        borderWidth: 2.0, 
        borderColor: 'blue',
        borderRadius: 5,
        marginBottom: 2
    },
    iconStyle: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'absolute',
        right: 0, 
        borderRadius: 10, 
        padding: 5, 
        backgroundColor: 'lightgreen'
    },
    iconStyleSelected: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'absolute',
        right: 0, 
        borderRadius: 10, 
        padding: 5, 
        backgroundColor: 'darkgreen'
    },
  });