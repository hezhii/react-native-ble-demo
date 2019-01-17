# react-native-ble-demo

React Native 中使用 BLE 的示例项目。项目包含两个部分，一个是中心设备，另一个是外设。中心设备用来扫描并连接可用的外设，然后读取和写入数据。外设则广播自己，因此中心设备可以搜索并连接自己，还负责处理中心设备的读取和写入数据，同时通过通知的方式主动发送数据给中心设备。

其中，外设只支持在 Android 设备上运行。

## 如何使用

在 Android 设备上运行 `ble_peripheral`：

```bash
$ cd ble_peripheral
$ react-native run-android
```

在另外一台 iOS 或 Android 设备上运行 `ble_central`：

```bash
$ cd ble_central
$ react-native run-ios # or react-native run-android
```

### 外设

打开外设程序，参考使用说明进行操作。

外设程序基于 [react-native-ble-peripheral](https://github.com/himelbrand/react-native-ble-peripheral) 实现。按照文档上的说明，应该是先添加服务和特征，然后再开始广播。但是，我在实际使用的过程中，发现这样操作会报错，如果先开始广播则不会。因此，需要先开始广播，然后添加服务和特征，最后再进行一次广播。

### 中心设备

中心设备基于 [react-native-ble-plx](https://github.com/Polidea/react-native-ble-plx) 实现。

### 在同一台电脑上调试

如果想要在同一台电脑上调试，需要修改其中一个程序的默认端口号，例如：`react-native start --port=8082`。

然后通过 `adb reverse tcp:8081 tcp:8082` 把 8081 端口的请求映射到 8082 上。