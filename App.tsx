import React from 'react';
import Form from './src/components/Form';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Formulario" component={Form} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
