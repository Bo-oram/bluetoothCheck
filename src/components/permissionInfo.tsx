import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {IMAGES} from '../constants/source';

const PermissionInfo: React.FC<{goAppSettingScreen: () => void}> = ({
  goAppSettingScreen,
}) => {
  return (
    <View style={styles.maiinWrap}>
      <Text style={styles.mainText}>
        앱 사용을 위해{`\n`}접근 권한을 허가해주세요.
      </Text>
      <View
        style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center'}}>
        <View style={styles.iconConWrap}>
          <View style={styles.iconBox}>
            <Image source={IMAGES.ICON_BLE} style={styles.iconImage} />
          </View>
          <Text style={styles.permissionName}>블루투스</Text>
        </View>
        <View style={{width: 16}} />
        <View style={styles.iconConWrap}>
          <View style={styles.iconBox}>
            <Image source={IMAGES.ICON_LOCATION} style={styles.iconImage} />
          </View>
          <Text style={styles.permissionName}>위치</Text>
        </View>
      </View>
      <View style={styles.buttonWrp}>
        <TouchableOpacity onPress={goAppSettingScreen} style={styles.button}>
          <Text style={styles.buttonText}>권한 설정</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maiinWrap: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  iconConWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    padding: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '3a3f50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconImage: {width: 15, height: 15},
  permissionName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#3a3f50',
  },
  buttonWrp: {
    paddingTop: 56,
  },
  button: {
    backgroundColor: '#1A75FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
  },
});

export default PermissionInfo;
