import {useEffect, useState} from 'react';
import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';
import {BleManager, Device} from 'react-native-ble-plx';
import {useSetRecoilState} from 'recoil';
import {discoveredDeviceList} from '../recoil/atom';
import {manager} from '../utils';

const useBluetooth = () => {
  const [isEnable, setIsEnable] = useState<boolean | null>(null);
  //   const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]); // 발견된 장치를 저장하는 상태

  //   const setDeviceList = useSetRecoilState(discoveredDeviceList);

  //   useEffect(() => {
  //     if (discoveredDevices.length > 0) {
  //       console.log(discoveredDevices);
  //     }
  //   }, discoveredDevices);

  // BLE 장치 스캔 시작 (중복 제거)
  //   const scanStart = (uuid: string[] | null = null) => {
  //     // console.log('Starting device scan...');
  //     manager.startDeviceScan(uuid, null, (error, device) => {
  //       if (error) {
  //         // console.log('Scan error:', error.message); // 에러 메시지 출력
  //         if (Platform.OS === 'android') {
  //           ToastAndroid.show('Bluetooth scan failed', ToastAndroid.SHORT);
  //         }
  //         return;
  //       }

  //       if (device) {
  //         // 이미 발견된 장치인지 확인 (device.id를 기준으로 중복 체크)
  //         setDiscoveredDevices(prevDevices => {
  //           const deviceExists = prevDevices.some(d => d.id === device.id);
  //           if (!deviceExists && device?.name) {
  //             // console.log('Discovered new device:', device);
  //             return [...prevDevices, device]; // 중복되지 않는 장치만 추가
  //           }
  //           return prevDevices;
  //         });
  //       }
  //     });
  //   };

  useEffect(() => {
    // 블루투스 상태 변경 감지
    const subscription = manager.onStateChange(state => {
      if (state === 'PoweredOn') {
        setIsEnable(true);
      } else if (state === 'PoweredOff') {
        setIsEnable(false);
      }
    }, true);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      subscription.remove();
    };
  }, []);

  return {isEnable};
};

export default useBluetooth;
