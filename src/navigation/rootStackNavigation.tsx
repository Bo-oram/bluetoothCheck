import {RootStackParamListType} from '../types/type';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {screenConfig} from './stacks';

const Stack = createNativeStackNavigator<RootStackParamListType>();

const RootStackNavigation: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={'Main'}>
      {screenConfig.map(screen => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
        />
      ))}
    </Stack.Navigator>
  );
};

export default RootStackNavigation;
