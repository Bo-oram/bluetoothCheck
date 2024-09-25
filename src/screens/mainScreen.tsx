import {
  AppState,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import PermissionInfo from '../components/permissionInfo';
import {permissionsCheck, requestPermissions} from '../utils';
import DeviceScan from '../components/deviceScan';
import Spinner from '../components/spinner';

const MainScreen: React.FC = () => {
  const [allGranted, setAllGranted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //수동으로 설정할수있도롱 세팅 스크린으로 이동
  const onPressSettingBtn = () => {
    Linking.openSettings();
  };

  const permissionAllCheck = async () => {
    const isAllGranted = await permissionsCheck();
    setAllGranted(isAllGranted);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  //앱이 액티브 상태면 권한 재확인
  //수동으로 권한설정후 돌아왔을땐 권한설정 컴포넌트가 아닌 다른 컴포넌트가 출력되도록 하기위함
  const appStateChange = (nextAppState: string) => {
    if (nextAppState === 'active') {
      permissionAllCheck();
    }
  };

  //앱이 백그라운드인지 엑티브이상태인지에 따라 이벤트 실행되도록 이벤트등록
  useEffect(() => {
    setIsLoading(true);
    requestPermissions();
    permissionAllCheck();
    const subscription = AppState.addEventListener('change', appStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      {!allGranted ? (
        <PermissionInfo goAppSettingScreen={onPressSettingBtn} />
      ) : (
        <DeviceScan />
      )}

      {isLoading ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            zIndex: 99,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>권한 확인중</Text>
          <View style={{height: 16}} />
          <Spinner size={26} />
        </View>
      ) : null}
    </View>
  );
};

export default MainScreen;
