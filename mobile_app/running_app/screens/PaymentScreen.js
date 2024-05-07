// PaymentScreen.ts
import { CardField, useStripe, createToken } from '@stripe/stripe-react-native';
import { Button } from 'react-native';

export default function PaymentScreen() {

  const onPayPress = async () => {
    const { token, error } = await createToken({ name: 'Name' });
    if (error) {
      console.log('createToken error', error.message);
    } else if (token) {
      console.log('createToken success', token);
      // send token to server to complete payment
      try {
        const response = await fetch(`{settings.MONGO_API_URL}/charge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token.id }),
        });
        const { status } = await response.json();
        console.log('charge status', status);
      } catch (error) {
        console.log('charge error', error.message);
      }
    }
  };


  return (
    <>
        <CardField
        postalCodeEnabled={true}
        placeholders={{
            number: '4242 4242 4242 4242',
        }}
        cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#000000',
        }}
        style={{
            width: '100%',
            height: 50,
            marginVertical: 30,
        }}
        onCardChange={(cardDetails) => {
            console.log('cardDetails', cardDetails);
        }}
        onFocus={(focusedField) => {
            console.log('focusField', focusedField);
        }}
        />
        <Button title="Confirm Payment" onPress={() => onPayPress({})} />
    </>
  );
}