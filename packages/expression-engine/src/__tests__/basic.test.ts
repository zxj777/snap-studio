import { describe, it, expect } from 'vitest';
import { ExpressionEngine, ContextManager, defaultEngine } from '../index.js';

describe('ExpressionEngine - 基于 jexl', () => {
  const context = ContextManager.createContext({
    state: {
      user: {
        name: '张三',
        age: 25,
        vip: true,
        profile: {
          avatar: 'https://example.com/avatar.jpg'
        }
      },
      count: 42,
      items: ['苹果', '香蕉', '橙子'],
      notifications: [
        { id: 1, read: false },
        { id: 2, read: true },
        { id: 3, read: false }
      ]
    }
  });

  describe('基础变量替换', () => {
    it('应该能替换简单变量', async () => {
      const result = await defaultEngine.process('Hello {{state.user.name}}!', context);
      expect(result).toBe('Hello 张三!');
    });

    it('应该能替换多个变量', async () => {
      const template = '用户: {{state.user.name}}, 年龄: {{state.user.age}}';
      const result = await defaultEngine.process(template, context);
      expect(result).toBe('用户: 张三, 年龄: 25');
    });

    it('应该能处理嵌套对象', async () => {
      const result = await defaultEngine.process('头像: {{state.user.profile.avatar}}', context);
      expect(result).toBe('头像: https://example.com/avatar.jpg');
    });
  });

  describe('jexl 高级特性', () => {
    it('应该支持条件表达式', async () => {
      const result = await defaultEngine.process(
        '用户类型: {{state.user.vip ? "VIP会员" : "普通用户"}}', 
        context
      );
      expect(result).toBe('用户类型: VIP会员');
    });

    it('应该支持数组操作', async () => {
      const result = await defaultEngine.process(
        '商品数量: {{state.items | length}}', 
        context
      );
      expect(result).toBe('商品数量: 3');
    });

    it('应该支持数组过滤', async () => {
      const result = await defaultEngine.process(
        '未读消息: {{state.notifications[.read == false] | length}}', 
        context
      );
      expect(result).toBe('未读消息: 2');
    });

    it('应该支持字符串转换', async () => {
      const result = await defaultEngine.process(
        '用户名: {{state.user.name | upper}}', 
        context
      );
      expect(result).toBe('用户名: 张三');
    });

    it('应该支持数学运算', async () => {
      const result = await defaultEngine.process(
        '明年年龄: {{state.user.age + 1}}', 
        context
      );
      expect(result).toBe('明年年龄: 26');
    });

    it('应该支持比较运算', async () => {
      const result = await defaultEngine.process(
        '是否成年: {{state.user.age >= 18 ? "是" : "否"}}', 
        context
      );
      expect(result).toBe('是否成年: 是');
    });
  });

  describe('同步操作', () => {
    it('应该支持同步处理', () => {
      const result = defaultEngine.processSync('Hello {{state.user.name}}!', context);
      expect(result).toBe('Hello 张三!');
    });

    it('应该支持同步求值', () => {
      const result = defaultEngine.evaluateSync('state.user.age + 1', context);
      expect(result).toBe(26);
    });
  });

  describe('错误处理', () => {
    it('不存在的路径应该保持原样', async () => {
      const result = await defaultEngine.process('值: {{state.nonexistent}}', context);
      expect(result).toBe('值: {{state.nonexistent}}');
    });

    it('没有表达式的字符串应该原样返回', async () => {
      const result = await defaultEngine.process('普通字符串', context);
      expect(result).toBe('普通字符串');
    });

    it('语法错误应该保持原样', async () => {
      const result = await defaultEngine.process('错误: {{state.user.}}', context);
      expect(result).toBe('错误: {{state.user.}}');
    });
  });

  describe('自定义转换函数', () => {
    it('应该能添加自定义转换函数', async () => {
      const engine = new ExpressionEngine();
      
      // 添加格式化货币的转换函数
      engine.addTransform('currency', (value: number) => {
        return `¥${value.toFixed(2)}`;
      });
      
      const testContext = ContextManager.createContext({
        state: { price: 99.9 }
      });
      
      const result = await engine.process('价格: {{state.price | currency}}', testContext);
      expect(result).toBe('价格: ¥99.90');
    });
  });

  describe('上下文管理', () => {
    it('应该能合并上下文', () => {
      const base = ContextManager.createContext({
        state: { a: 1, b: 2 }
      });
      
      const merged = ContextManager.mergeContext(base, {
        state: { b: 3, c: 4 }
      });
      
      expect(merged.state).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('应该能创建局部上下文', () => {
      const parent = ContextManager.createContext({
        state: { global: 'value' }
      });
      
      const scoped = ContextManager.createScopedContext(parent, {
        local: 'data'
      });
      
      expect(scoped.state.global).toBe('value');
      expect(scoped.state.local).toBe('data');
    });
  });
});

