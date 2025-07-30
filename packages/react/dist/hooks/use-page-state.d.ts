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
export declare function usePageState<T = any>(stateManager: StateManager | null, path: string, defaultValue?: T): UsePageStateReturn<T>;
/**
 * 批量状态Hook
 * 用于同时订阅多个状态路径
 */
export declare function usePageStates<T extends Record<string, any>>(stateManager: StateManager | null, paths: (keyof T)[], defaultValues?: Partial<T>): {
    states: T;
    setStates: (newStates: Partial<T>) => void;
    isLoading: boolean;
};
//# sourceMappingURL=use-page-state.d.ts.map