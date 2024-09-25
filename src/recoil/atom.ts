import {atom} from 'recoil';
import {diviceListType} from '../types/type';

export const discoveredDeviceList = atom<diviceListType>({
  key: 'DiscoveredDeviceList',
  default: {},
});
