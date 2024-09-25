import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamListType = {
  Main: undefined;
  Detail: {
    uuid?: string | undefined;
    allData: {[key: string]: string | string[]} | undefined;
  };
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamListType>;

export interface ScreenConfigItemTtype {
  name: keyof RootStackParamListType;
  component: React.ComponentType<any>;
}

export type diviceListType =
  | {
      [key: string]: string | string[];
    }
  | {};

export type writeType = {
  deviceId: string;
  serviceUUID: string;
  characteristicUUID: string;
  data: string;
};
