#import <CoreLocation/CoreLocation.h>
#import <NetworkExtension/NetworkExtension.h>
#import <SystemConfiguration/CaptiveNetwork.h>
#import "WifiModule.h"


@interface WifiModule () <CLLocationManagerDelegate>
@property (nonatomic, strong) CLLocationManager *locationManager;
@end

@implementation WifiModule

RCT_EXPORT_MODULE();

- (instancetype)init {
    self = [super init];
    if (self) {
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
    }
    return self;
}


RCT_EXPORT_METHOD(getWifiSSID:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {

    if ([CLLocationManager locationServicesEnabled]) {
        // 위치 권한 체크
        CLAuthorizationStatus status = [CLLocationManager authorizationStatus];
        if (status == kCLAuthorizationStatusDenied || status == kCLAuthorizationStatusRestricted) {
            // 위치 권한이 거부된 경우
            reject(@"PERMISSION_ISSUE", @"위치 권한이 필요해요.", nil);
            return;
        } else if (status == kCLAuthorizationStatusNotDetermined) {
            // 위치 권한이 아직 요청되지 않은 경우 요청
            [self.locationManager requestWhenInUseAuthorization];
            resolve(@"접근권한을 허가한 후 다시 시도해주세요.");
            return;
        }

        // iOS 14 이상에서 NEHotspotNetwork 사용
        if (@available(iOS 14.0, *)) {
            [NEHotspotNetwork fetchCurrentWithCompletionHandler:^(NEHotspotNetwork * _Nullable currentNetwork) {
                if (currentNetwork) {
                    NSString *ssid = currentNetwork.SSID;
                    resolve(ssid);
                } else {
                    // 와이파이가 연결되어 있지 않은 경우
                    reject(@"NO_WIFI_ISSUE", @"와이파이가 연결해주세요.", nil);
                }
            }];
        } else {
            // iOS 14 미만에서 CNCopyCurrentNetworkInfo 사용
            NSString *kSSID = (NSString *)kCNNetworkInfoKeySSID;
            NSArray *interfaces = (__bridge_transfer NSArray *)CNCopySupportedInterfaces();

            for (NSString *interface in interfaces) {
                NSDictionary *info = (__bridge_transfer NSDictionary *)CNCopyCurrentNetworkInfo((__bridge CFStringRef)interface);
                if (info && info[kSSID]) {
                    resolve(info[kSSID]);
                    return;
                }
            }
            // 와이파이가 연결되어 있지 않은 경우
            reject(@"NO_WIFI_ISSUE", @"와이파이가 연결해주세요.", nil);
        }
    } else {
        reject(@"PERMISSION_ISSUE", @"접근권한을 허가한 후 다시 시도해주세요.", nil);
    }
}



+ (BOOL)requiresMainQueueSetup {
    return YES;
}

@end
