---
title: TypeScript 最佳实践
date: 2024-03-09
---

# TypeScript 最佳实践

TypeScript 为 JavaScript 添加了静态类型系统。

## 基础类型

```typescript
// 基本类型
let name: string = "张三"
let age: number = 25
let isActive: boolean = true

// 数组
let numbers: number[] = [1, 2, 3]
let names: Array<string> = ["张三", "李四"]

// 元组
let tuple: [string, number] = ["张三", 25]

// 枚举
enum Color {
  Red,
  Green,
  Blue
}
```

## 接口

```typescript
interface User {
  id: number
  name: string
  email?: string  // 可选属性
  readonly createdAt: Date  // 只读属性
}

const user: User = {
  id: 1,
  name: "张三",
  createdAt: new Date()
}
```

## 类型别名

```typescript
type ID = string | number

type Point = {
  x: number
  y: number
}

type Callback = (data: string) => void
```

## 泛型

```typescript
function identity<T>(arg: T): T {
  return arg
}

// 使用
let output = identity<string>("hello")
let output2 = identity(123)  // 类型推断

// 泛型接口
interface Response<T> {
  data: T
  status: number
  message: string
}

const userResponse: Response<User> = {
  data: { id: 1, name: "张三", createdAt: new Date() },
  status: 200,
  message: "成功"
}
```

## 联合类型和交叉类型

```typescript
// 联合类型
type Status = "pending" | "success" | "error"

// 交叉类型
type Admin = User & {
  role: "admin"
  permissions: string[]
}
```

## 类型守卫

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string"
}

function process(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase())
  } else {
    console.log(value.toFixed(2))
  }
}
```

## 实用工具类型

```typescript
// Partial - 所有属性变为可选
type PartialUser = Partial<User>

// Required - 所有属性变为必需
type RequiredUser = Required<User>

// Pick - 选择部分属性
type UserPreview = Pick<User, "id" | "name">

// Omit - 排除部分属性
type UserWithoutEmail = Omit<User, "email">

// Record - 创建对象类型
type UserMap = Record<string, User>
```

## 最佳实践

1. **优先使用接口而非类型别名**（对于对象类型）
2. **使用严格模式**（`strict: true`）
3. **避免使用 `any`**，使用 `unknown` 代替
4. **为函数参数和返回值添加类型**
5. **使用类型守卫进行类型收窄**
6. **利用类型推断，不要过度注解**

## 配置建议

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```
