import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useBluetooth from '../hooks/useBleOnOff';
import {useEffect, useState} from 'react';
import {manager, requestScan} from '../utils';
import Spinner from './spinner';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../types/type';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const DeviceScan: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const {isEnable} = useBluetooth();
  const [deviceList, setDeviceList] = useState<{[key: string]: any}[] | []>([]);
  const [scanning, setScanning] = useState<boolean>(false);
  const [timeoutScript, setTimeoutScript] = useState<NodeJS.Timeout | null>(
    null,
  );

  const {top, bottom} = useSafeAreaInsets();

  // BLE 장치 스캔 시작 (중복 제거)
  const scanStart = (uuid: string[] | null = null) => {
    setDeviceList([]);
    setScanning(true);
    requestScan(null, setDeviceList);
  };
  const scanStop = () => {
    manager.stopDeviceScan();
    setScanning(false);
  };

  const onPressFindBtn = () => {
    scanStart();
  };

  const onPressDeviceItem = (
    targetUuid?: string[],
    allData?: {[key: string]: string},
  ) => {
    navigation.navigate('Detail', {allData});
  };

  useEffect(() => {
    if (isEnable) {
      scanStart();
    } else {
      scanStop();
    }
  }, [isEnable]);

  useEffect(() => {
    if (scanning) {
      const subscript = setTimeout(() => {
        scanStop();
      }, 20000);
      setTimeoutScript(subscript);
    }

    return () => {
      if (timeoutScript) {
        clearTimeout(timeoutScript);
      }
    };
  }, [scanning]);

  if (!isEnable) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>블루투스를 활성화해주세요.</Text>
      </View>
    );
  } else {
    return (
      <View
        style={{flex: 1, padding: 24, marginTop: top, marginBottom: bottom}}>
        <View
          style={{
            borderBottomWidth: 0.5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 5,
          }}>
          <Text>스캔된 디바이스 리스트</Text>
          {scanning ? (
            <Spinner />
          ) : (
            <TouchableOpacity onPress={onPressFindBtn}>
              <Text>찾기</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView>
          {deviceList.map((item, idx) => {
            return (
              <TouchableOpacity
                key={idx}
                style={styles.deviceTextBoxWrap}
                onPress={() => {
                  onPressDeviceItem(item.uuid, item);
                }}>
                <View style={styles.deviceTextBox}>
                  <Text style={styles.deviceTextKey}>name. </Text>
                  <Text style={styles.deviceTextValue}> {item.name}</Text>
                </View>
                <View style={styles.deviceTextBox}>
                  <Text style={styles.deviceTextKey}>uuid. </Text>
                  <Text style={styles.deviceTextValue}>
                    {item.uuid ?? '확인되지 않음'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  deviceTextBoxWrap: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#dcdde5',
    marginVertical: 10,
  },
  deviceTextBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  deviceTextKey: {fontSize: 12, width: 35},
  deviceTextValue: {color: '#000'},
});

export default DeviceScan;
