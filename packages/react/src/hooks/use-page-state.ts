import { useState, useEffect, useCallback } from 'react';
import type { StateManager } from '@snap-studio/core';

/**
 * 页面状态Hook返回值
 */
export interface UsePageStateReturn<T = any> {
  /** 状态值 */
  value: T;
  /** 设置状态值 */
  setValue: (newValue: T) => void;
  /** 合并状态值（适用于对象） */
  mergeValue: (partialValue: Partial<T>) => void;
  /** 删除状态值 */
  deleteValue: () => void;
  /** 是否正在加载 */
  isLoading: boolean;
}

/**
 * 页面状态Hook
 * 用于订阅和操作渲染引擎的全局状态
 * 
 * @param stateManager 状态管理器实例
 * @param path 状态路径
 * @param defaultValue 默认值
 * 
 * @example
 * ```tsx
 * function UserProfile({ engine }) {
 *   const { value: user, setValue: setUser, isLoading } = usePageState(
 *     engine.stateManager,
 *     'user',
 *     { name: '', email: '' }
 *   );
 *   
 *   const updateName = (name: string) => {
 *     setUser({ ...user, name });
 *   };
 *   
 *   if (isLoading) return <div>Loading...</div>;
 *   
 *   return (
 *     <div>
 *       <h1>{user.name}</h1>
 *       <p>{user.email}</p>
 *       <button onClick={() => updateName('New Name')}>
 *         Update Name
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePageState<T = any>(
  stateManager: StateManager | null,
  path: string,
  defaultValue?: T
): UsePageStateReturn<T> {
  const [value, setInternalValue] = useState<T>(() => {
    if (!stateManager) return defaultValue as T;
    const currentValue = stateManager.get(path);
    return currentValue !== undefined ? currentValue : defaultValue as T;
  });
  
  const [isLoading, setIsLoading] = useState(!stateManager);
  
  // 订阅状态变化
  useEffect(() => {
    if (!stateManager) {
      setIsLoading(true);
      return;
    }
    
    setIsLoading(false);
    
    // 获取初始值
    const initialValue = stateManager.get(path);
    if (initialValue !== undefined) {
      setInternalValue(initialValue);
    }
    
    // 订阅状态变化
    const subscriptionId = stateManager.subscribe(path, (newState, oldState, changedPath) => {
      if (changedPath === path || changedPath.startsWith(path + '.') || path.startsWith(changedPath + '.')) {
        const newValue = stateManager.get(path);
        setInternalValue(newValue !== undefined ? newValue : defaultValue as T);
      }
    });
    
    return () => {
      stateManager.unsubscribe(subscriptionId);
    };
  }, [stateManager, path, defaultValue]);
  
  /**
   * 设置状态值
   */
  const setValue = useCallback((newValue: T) => {
    if (!stateManager) {
      console.warn('StateManager not available');
      return;
    }
    
    stateManager.set(path, newValue);
  }, [stateManager, path]);
  
  /**
   * 合并状态值
   */
  const mergeValue = useCallback((partialValue: Partial<T>) => {
    if (!stateManager) {
      console.warn('StateManager not available');
      return;
    }
    
    if (typeof partialValue === 'object' && partialValue !== null) {
      stateManager.merge(path, partialValue as Record<string, any>);
    } else {
      console.warn('mergeValue only works with object values');
    }
  }, [stateManager, path]);
  
  /**
   * 删除状态值
   */
  const deleteValue = useCallback(() => {
    if (!stateManager) {
      console.warn('StateManager not available');
      return;
    }
    
    stateManager.delete(path);
  }, [stateManager, path]);
  
  return {
    value,
    setValue,
    mergeValue,
    deleteValue,
    isLoading
  };
}

/**
 * 批量状态Hook
 * 用于同时订阅多个状态路径
 */
export function usePageStates<T extends Record<string, any>>(
  stateManager: StateManager | null,
  paths: (keyof T)[],
  defaultValues?: Partial<T>
): {
  states: T;
  setStates: (newStates: Partial<T>) => void;
  isLoading: boolean;
} {
  const [states, setInternalStates] = useState<T>(() => {
    if (!stateManager) return (defaultValues || {}) as T;
    
    const initialStates = {} as T;
    paths.forEach(path => {
      const value = stateManager.get(path as string);
      initialStates[path] = value !== undefined ? value : defaultValues?.[path];
    });
    
    return initialStates;
  });

  
  const [isLoading, setIsLoading] = useState(!stateManager);
  
  // 订阅多个状态路径
  useEffect(() => {
    if (!stateManager) {
      setIsLoading(true);
      return;
    }

    
    setIsLoading(false);
    
    // 立即获取当前状态
    const currentStates = {} as T;
    paths.forEach(path => {
      const value = stateManager.get(path as string);
      currentStates[path] = value !== undefined ? value : defaultValues?.[path];
    });
    console.log('🔄 usePageStates initial states:', currentStates);
    setInternalStates(currentStates);
    
    const subscriptionIds: string[] = [];
    
    paths.forEach(path => {
      const subscriptionId = stateManager.subscribe(path as string, (newState, oldState, changedPath) => {
        console.log('🔔 State change notification:', {
          path: path as string,
          changedPath,
          newValue: stateManager.get(path as string)
        });
        
        const newStates = {} as T;
        paths.forEach(p => {
          const value = stateManager.get(p as string);
          newStates[p] = value !== undefined ? value : defaultValues?.[p];
        });
        console.log('🔄 usePageStates updated states:', newStates);
        setInternalStates(newStates);
      });
      
      subscriptionIds.push(subscriptionId);
    });
    
    return () => {
      subscriptionIds.forEach(id => {
        stateManager.unsubscribe(id);
      });
    };
  }, [stateManager, JSON.stringify(paths), JSON.stringify(defaultValues)]);
  
  /**
   * 批量设置状态
   */
  const setStates = useCallback((newStates: Partial<T>) => {
    if (!stateManager) {
      console.warn('StateManager not available');
      return;
    }
    
    Object.entries(newStates).forEach(([path, value]) => {
      if (paths.includes(path as keyof T)) {
        stateManager.set(path, value);
      }
    });
  }, [stateManager, paths]);
  
  return {
    states,
    setStates,
    isLoading
  };
}