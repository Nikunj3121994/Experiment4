# 喜结婚礼汇

### iOS项目设置
* npm install 安装 react-native 组件
* pod install 安装iOS组件
* 设置info.plist,
- View controller-based status bar appearance = NO; 
- Fonts provided by application = Ionicons.ttf; 
- App Transport Security Settings = YES

### 功能规划 
* 添加React-Native到iOS项目
* 酒店列表
* 酒店档期查询
* 预约看场地

#### 酒店智能排序（喜结网推荐排序)
* 根据rank值从高到低排序
* rank值： rank: 0 - 100, 缺省10， 有喜结网人工设置，不对外公布
* rank值相同，使用酒店评分和评论数排序
