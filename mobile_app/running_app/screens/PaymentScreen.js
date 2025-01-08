import React from 'react';
import { View, Text, Pressable, Button } from 'react-native';
import styles from '../styles';
import Purchases from 'react-native-purchases';
import { useContext } from 'react';
import { UserContext } from '../utils/createContext';
import * as Linking  from 'expo-linking';


const PaymentScreen = ( {navigation} ) => {
  const [packages, setPackages] = React.useState([]);
  const [activeSubscription, setActiveSubscription] = React.useState({});
  const { user, setUser } = useContext(UserContext);
  
  React.useEffect(() => {
    initIap();
  }, []);

  const initIap = async () => {
    const key = process.env.EXPO_PUBLIC_APPLE_REVENUE_CAT;
    console.log("user: ", user);
    Purchases.configure({ apiKey: key, appUserId: user.id });
    try {
      const offerings = await Purchases.getOfferings();
      setPackages(offerings.current.availablePackages);
      const activeSubscription = packages.find(pkg => pkg.product.identifier === user.customerInfo.activeSubscriptions[0]);
      setActiveSubscription(activeSubscription);
      console.log("activeSubscription: ", activeSubscription);
      
      // The code is intended to update the user context with customer information after fetching it from Purchases.
      // await setUser({ ...user, customerInfo: await Purchases.getCustomerInfo() });
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable style={styles.pressableArea} onPress={() => navigation.goBack()}>
            <Text style={styles.pressableText}>Go Back</Text>
          </Pressable>
          <Pressable style={styles.pressableArea} onPress={initIap}>
            <Text style={styles.pressableText}>Refresh</Text>
          </Pressable>
        </View>
        {packages.map((product_package, index) => (
          !user?.customerInfo?.activeSubscriptions.includes(product_package?.product?.identifier) ? (
            <View key={`${product_package.identifier}-${index}`} style={{ marginTop: 40, bottomBorderColor: 'blue', borderBottomWidth: 1 }}>
              <Text style={{ fontSize: 26 }}>{product_package.identifier}</Text>
              <Text>{product_package.product.description}</Text>
              <Text style={{ fontWeight: 'bold' }}>${parseFloat(product_package.product.price).toFixed(2)}</Text>
              <Pressable style={styles.pressableArea} onPress={() => { 
                Purchases.purchasePackage(product_package); 
                setUser({ ...user, customerInfo: Purchases.getCustomerInfo() });
                }}>
                <Text style={styles.pressableText}>Buy</Text>
              </Pressable>
            </View>
          ) : ( null )
        ))}
      </View>
      <View style={{ position: 'absolute', bottom: 50, width: '100%' }}>
        {user.customerInfo.activeSubscriptions.length > 0 && (
          <>
            <Text style={{ fontSize: 16 }}>Active Subscription: </Text>
            <Text style={{ fontSize: 24 }}>{activeSubscription?.identifier}</Text>
            <Pressable style={styles.pressableArea} onPress={() => {
              Linking.openURL('https://apps.apple.com/account/subscriptions');
            }}>
              <Text style={styles.pressableText}>Unsubscribe</Text>
            </Pressable>
          </>
        )}
      </View>
    </>
  );
}

export default PaymentScreen;