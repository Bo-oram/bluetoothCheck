import DetailScreen from '../screens/detailScreen';
import MainScreen from '../screens/mainScreen';
import {ScreenConfigItemTtype} from '../types/type';

export const screenConfig: ScreenConfigItemTtype[] = [
  {name: 'Main', component: MainScreen},
  {name: 'Detail', component: DetailScreen},
];
