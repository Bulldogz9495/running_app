import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getSubscriptionSkus, purchaseSubscription } from 'react-native-iap';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    getSubscriptionSkus().then(setSubscriptions);
  }, []);

  const handleSubscriptionPurchase = async (sku) => {
    const purchase = await purchaseSubscription(sku);
    console.log(purchase);
    // handle purchase success
  }

  return (
    <View style={styles.container}>
      <Text>Payment Screen</Text>
      {subscriptions.map(subscription => (
        <Button
          key={subscription.id}
          title={subscription.id}
          onPress={() => handleSubscriptionPurchase(subscription.id)}
        />
      ))}
    </View>
  );
}
