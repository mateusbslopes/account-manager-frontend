import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Form from './src/components/Form';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import List from './src/components/List';

const Stack = createNativeStackNavigator();

// TODO create types file
export type Account = {
  id: string
  accounts: Account[]
}

function App(): React.JSX.Element {

  // TODO temp implementation before redux implementation
  const [accounts, setAccounts] = useState<Account[]>([])

  // TODO create enum for navigation pages
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen name="Lista" options={{...screenStyle}}>
          {(props) => <List {...props} accounts={accounts} setAccounts={setAccounts} />}
        </Stack.Screen>
        <Stack.Screen name="Conta" options={{...screenStyle}}>
          {(props) => <Form {...props} accounts={accounts} setAccounts={setAccounts} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// TODO theming
export const colors = {
  primary: "rgb(90, 43, 140)",
  red: "rgb(237,113,130)",
  green: "rgb(132, 196, 107)",
  white: {
    0: "rgb(255, 255, 255)",
    10: "rgb(239, 238, 245)"
  },
  spacingStep: 4
};

export const screenStyle = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.white[0]
}

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    flex: 1
  },
  card: {
    padding: colors.spacingStep * 4,
    flex: 1,
    backgroundColor: colors.white[10],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  }
});
export default App;
