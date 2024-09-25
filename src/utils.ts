import {NativeModules, PermissionsAndroid, Platform} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {check, PERMISSIONS, request} from 'react-native-permissions';

export const manager = new BleManager();

export const permissionsCheck = async () => {
  if (Platform.OS === 'ios') {
    const locationPermission = await request(
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    );
    if (locationPermission === 'granted') {
      return true;
    }
  }
  if (Platform.OS === 'android') {
    const scanPermission = await check(PERMISSIONS.ANDROID.BLUETOOTH_SCAN);
    const connenctPermission = await check(
      PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
    );
    const locationPermission = await check(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );
    if (scanPermission && connenctPermission && locationPermission) {
      return true;
    }
  }
  return false;
};

export const requestPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    return true;
  }
  if (Platform.OS === 'android') {
    const apiLevel = parseInt(Platform.Version.toString(), 10);

    if (apiLevel < 31) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      return (
        result['android.permission.BLUETOOTH_CONNECT'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_SCAN'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.ACCESS_FINE_LOCATION'] ===
          PermissionsAndroid.RESULTS.GRANTED
      );
    }
  }

  return false;
};

export const requestScan = (
  uuid: string[] | null = null,
  setDeviceList?: React.Dispatch<
    React.SetStateAction<
      | []
      | {
          [key: string]: any;
        }[]
    >
  >,
) => {
  manager.startDeviceScan(uuid, null, (error, device) => {
    if (device) {
      if (setDeviceList) {
        //LIST 용
        // 2개 이상 디바이스를 탐색해 담음
        // 이미 발견된 장치인지 확인 (device.id를 기준으로 중복 체크)

        setDeviceList(prevDevices => {
          const deviceExists = prevDevices.some(d => d.id === device.id);
          if (!deviceExists && device?.name) {
            const saveData = {
              uuid: device.serviceUUIDs,
              name: device.name,
              id: device.id,
              isConnectable: device.isConnectable,
              localName: device.localName,
              mtu: device.mtu,
              rssi: device.rssi,
              serviceData: device.serviceData,
              overflowServiceUUIDs: device.overflowServiceUUIDs,
              solicitedServiceUUIDs: device.solicitedServiceUUIDs,
              txPowerLevel: device.txPowerLevel,
            };
            return [...prevDevices, saveData]; // 중복되지 않는 장치만 추가
          }
          return prevDevices;
        });
      }
      return device;
    }
  });
};

export const getWifiSsid = async () => {
  try {
    const {WifiModule} = NativeModules;
    const ssid = await WifiModule.getSSID();

    return ssid;
  } catch (error) {
    console.log(error);
    return error;
  }
};
