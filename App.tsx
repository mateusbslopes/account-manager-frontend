import React, { useState } from 'react';
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


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen name="Lista">
          {(props) => <List {...props} accounts={accounts} setAccounts={setAccounts} />}
        </Stack.Screen>
        <Stack.Screen name="Formulario">
          {(props) => <Form {...props} accounts={accounts} setAccounts={setAccounts} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
