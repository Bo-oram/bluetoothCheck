import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  StyleSheet,
} from 'react-native';
import {RootStackParamListType, writeType} from '../types/type';
import {useEffect, useState} from 'react';
import {manager} from '../utils';
import base64 from 'react-native-base64';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {PERMISSIONS, request} from 'react-native-permissions';
import Spinner from '../components/spinner';

type Props = NativeStackScreenProps<RootStackParamListType, 'Detail'>;
const DetailScreen: React.FC<Props> = ({route}) => {
  const detailData = route.params.allData;
  const {top, bottom} = useSafeAreaInsets();
  const [infoText, setInfoText] = useState<string | null>(null);
  const [writeData, seetWriteData] = useState<writeType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const writeDataToDevice = async ({
    deviceId,
    serviceUUID,
    characteristicUUID,
    data,
  }: writeType) => {
    try {
      // 데이터를 Base64로 인코딩 (BLE 통신 시 Base64로 인코딩된 데이터가 필요함)
      const base64Data = base64.encode(data);

      // [ data write 로직]
      //   const characteristic =
      //     await manager.writeCharacteristicWithResponseForDevice(
      //       deviceId, // 장치 ID
      //       serviceUUID, // 서비스 UUID
      //       characteristicUUID, // 특성 UUID
      //       base64Data, // Base64로 인코딩된 데이터
      //     );

      seetWriteData({
        deviceId,
        serviceUUID,
        characteristicUUID,
        data: base64Data,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getWifiSsid = async () => {
    //ssid는 위치권한을 필요로합니다.
    //추가로 ios에서 wifi ssid를 겟하려면
    //Wi-Fi 정보 액세스 기능을 지원하는 프로비저닝 프로필이 필요합니다.
    try {
      const {WifiModule} = NativeModules;
      const ssid = await WifiModule.getWifiSSID();
      return ssid;
    } catch (error) {
      throw error;
    }
  };

  const onPressWrite = async () => {
    setLoading(true);
    if (detailData)
      try {
        setInfoText(null);
        const id = detailData.id as string;
        const uuid = detailData.uuid[0] as string;
        // console.log(detailData);
        const wifiSsid = await getWifiSsid();

        await manager.connectToDevice(id);
        await manager.discoverAllServicesAndCharacteristicsForDevice(id);
        const characteristics = await manager.characteristicsForDevice(
          id,
          detailData.uuid[0],
        );

        writeDataToDevice({
          deviceId: id,
          serviceUUID: uuid,
          characteristicUUID: characteristics[0].uuid,
          data: wifiSsid,
        });
        setLoading(false);
      } catch (error: any) {
        setLoading(false);

        setInfoText(error.message);
      }
  };

  useEffect(() => {}, []);
  if (detailData) {
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
          <Text>기기 정보</Text>
        </View>

        <ScrollView>
          {Object.keys(detailData).map((item, idx) => {
            const val = () => {
              if (Array.isArray(detailData[item])) {
                return detailData[item].join(',');
              } else if (typeof detailData[item] === 'object') {
                return Object.values(detailData[item]);
              } else {
                return JSON.stringify(detailData[item]);
              }
            };

            return detailData[item] ? (
              <View
                key={idx}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 5,
                }}>
                <Text style={{marginBottom: 4}}>{item}.</Text>
                <Text
                  style={{
                    borderWidth: 0.5,
                    borderColor: '#ccc',
                    padding: 8,
                    color: 'black',
                  }}>
                  {val() + ''}
                </Text>
              </View>
            ) : (
              <View key={idx} />
            );
          })}
        </ScrollView>
        <View
          style={{
            paddingTop: 24,
          }}>
          {detailData?.uuid ? null : (
            <Text>uuid가 확인 불가인 경우 WRITE 할 수 없습니다.</Text>
          )}
          {infoText ? <Text>{infoText}</Text> : null}
          <TouchableOpacity
            disabled={detailData?.uuid ? false : true}
            style={{
              backgroundColor: detailData?.uuid ? '#1A75FF' : 'gray',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 4,
            }}
            onPress={onPressWrite}>
            {loading ? (
              <Spinner />
            ) : (
              <Text style={{color: 'white', fontSize: 14}}>WRITE</Text>
            )}
          </TouchableOpacity>
        </View>
        {writeData ? (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                padding: 20,
                backgroundColor: '#fff',
              }}>
              <Text style={{fontWeight: 700}}>Write를 위한 데이터</Text>
              <View style={{height: 20}} />
              {Object.keys(writeData).map((item, idx) => {
                const key = item as keyof writeType;

                return (
                  <View style={{marginBottom: 10}}>
                    <Text style={{fontSize: 12, color: 'gray'}}>{key}.</Text>

                    <Text style={{fontSize: 15, color: 'black'}}>
                      {writeData[key]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </View>
    );
  }
};

export default DetailScreen;
