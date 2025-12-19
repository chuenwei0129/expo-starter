**@react-navigation 与 expo-router 配合使用**是 Expo 生态系统中的一个重要设计模式，两者相辅相成，各自承担不同职责：

## 🔄 **两者关系概述**

```
expo-router (上层抽象，文件式路由)
        ↓
使用 React Navigation API
        ↓
@react-navigation (底层导航引擎，提供核心功能)
```

## 🎯 **各自的核心职责**

### **1. expo-router 主要负责**

- ✅ **文件系统路由** - 自动根据 `app/` 目录结构生成路由
- ✅ **路由声明** - 简化路由配置（无需手动定义 `Stack.Navigator`）
- ✅ **类型安全** - 提供 TypeScript 类型支持
- ✅ **平台一致性** - 统一的路由 API 跨 iOS/Android/Web
- ✅ **深层链接** - 自动处理 URL 映射

**示例**：创建 `/app/profile.js` 自动成为 `/(tabs)/profile` 路由

### **2. @react-navigation 主要负责**

- ✅ **底层导航引擎** - 管理导航状态、历史堆栈
- ✅ **原生导航性能** - 与原生导航 API 交互
- ✅ **导航组件** - 提供 `BottomTabNavigator`、`StackNavigator` 等
- ✅ **手势处理** - 滑动返回、过渡动画
- ✅ **导航上下文** - 提供 `useNavigation()`、`useRoute()` 等 Hook

## 🤝 **为什么需要配合使用？**

### **1. expo-router 依赖于 React Navigation 的底层能力**

```javascript
// exppo-router 内部使用 React Navigation 的组件
// 在 app/_layout.js 中
import { Tabs } from "expo-router";

// 这实际上会渲染 React Navigation 的 <Tab.Navigator>
```

### **2. 灵活性与扩展性**

虽然 `expo-router` 提供了文件式路由，但有时需要：

```javascript
// 在 expo-router 中使用 React Navigation 进行高级配置
import { useNavigation } from "expo-router";

// 实际上使用的是 '@react-navigation/native' 的 useNavigation
// 可以进行更复杂的导航操作
```

### **3. 特定导航模式的实现**

有些复杂导航模式需要直接使用 `@react-navigation`：

```javascript
// expo-router 可能不直接支持某些复杂导航结构
// 此时可以混合使用
import { createDrawerNavigator } from "@react-navigation/drawer";

// 在 expo-router 基础上添加抽屉导航
```

## 📁 **实际项目中的使用模式**

### **模式一：纯 expo-router（简单应用）**

```javascript
// 完全依赖文件系统路由
app/
  ├── index.js          // 首页
  ├── profile.js       // 用户页面
  └── _layout.js       // 根布局
```

**不需要**直接导入 `@react-navigation` 包。

### **模式二：混合使用（中等复杂度）**

```javascript
// app/_layout.js
import { Tabs } from "expo-router";
import { useNavigation } from "expo-router"; // 实际来自 @react-navigation

function Layout() {
  const navigation = useNavigation(); // React Navigation Hook

  return <Tabs>{/* expo-router 管理路由 */}</Tabs>;
}
```

### **模式三：高级自定义（复杂应用）**

```javascript
// 需要自定义导航器时
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

function CustomNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={HomeScreen} />
      {/* 与 expo-router 页面混合使用 */}
    </Stack.Navigator>
  );
}
```

## 🔧 **版本对应关系**

在你提供的 `package.json` 中：

```json
{
  "@react-navigation/bottom-tabs": "^7.4.0", // 用于底部标签
  "@react-navigation/elements": "^2.6.3", // 导航UI元素
  "@react-navigation/native": "^7.1.8", // 核心库
  "expo-router": "~6.0.21" // 文件路由层
}
```

这表明：

- 使用 React Navigation 7.x
- Expo Router 6.x 兼容 React Navigation 7.x

## 💡 **最佳实践建议**

### **何时使用纯 expo-router？**

- ✅ 新项目开始
- ✅ 路由结构相对简单
- ✅ 希望快速开发，减少配置
- ✅ 需要良好的 TypeScript 支持

### **何时需要混合使用 @react-navigation？**

- ✅ 需要自定义导航过渡动画
- ✅ 实现复杂嵌套导航结构
- ✅ 需要特定导航器类型（如抽屉）
- ✅ 深度自定义头部栏
- ✅ 处理特殊的导航逻辑

## 🚫 **常见误区**

1. **误区**："expo-router 替代了 React Navigation"

   - **事实**：expo-router 是 React Navigation 的**上层封装**，不是替代

2. **误区**："使用 expo-router 就不能用 React Navigation API"

   - **事实**：可以混合使用，`useNavigation()` 等 Hook 是相通的

3. **误区**："安装 @react-navigation 是多余的"
   - **事实**：expo-router 运行时需要这些包

## 📊 **总结对比**

| 特性           | expo-router | @react-navigation |
| -------------- | ----------- | ----------------- |
| **配置方式**   | 文件系统    | 代码配置          |
| **学习曲线**   | 较低        | 中等              |
| **TypeScript** | 优秀支持    | 良好支持          |
| **灵活度**     | 中等        | 很高              |
| **适用场景**   | 标准应用    | 复杂导航需求      |

**结论**：`expo-router` 提供了现代的、基于文件系统的路由体验，而 `@react-navigation` 提供了底层的导航能力和灵活性。两者配合使用，既享受了开发便利性，又保留了扩展的可能性。
