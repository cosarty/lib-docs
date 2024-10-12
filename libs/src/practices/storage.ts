type RestParameters<T extends (...args: any[]) => any> = T extends (
  arg1: any,
  ...args: infer R
) => any
  ? R
  : never;

// 去除函数第一个参数
type OmitFunctionFirstParameters<T extends (...args: any[]) => any> = (
  ...args: RestParameters<T>
) => ReturnType<T>;

class Storage<E extends object, T extends keyof E> {
  set(key: T, data: E[T], expire?: number) {
    window.localStorage.setItem(
      key as string,
      JSON.stringify({
        data,
        expire: expire ? new Date().getTime() + expire : undefined,
      })
    );
  }

  get(key: T, defaultValue?: E[T]): E[T] | undefined {
    let user = window.localStorage.getItem(key as string) as any;
    if (user) {
      user = typeof user === 'string' ? JSON.parse(user) : user;
      if (user.expire && user.expire < new Date().getTime()) {
        this.remove(key);
        return defaultValue;
      }
      return user.data;
    }
    return defaultValue;
  }
  remove(key: T) {
    window.localStorage.removeItem(key as string);
  }
}

type StorageInstance<E extends object, T extends keyof E> = InstanceType<
  typeof Storage<E, T>
>;

type StorageType<E extends object, F extends keyof E> = {
  [T in keyof StorageInstance<E, F>]: StorageInstance<E, F>[T] extends Function
    ? OmitFunctionFirstParameters<StorageInstance<E, F>[T]>
    : never;
};

/**
 * 设计了一个全局storage,提高体验感
 */
export const createStorage = <E extends object>() =>
  new Proxy<{
    [T in keyof E]: StorageType<E, T>;
  }>(
    new Storage() as any,
    {
      get<T extends keyof E>(target: StorageInstance<E, T>, propKey: T) {
        return {
          get: (defaultValue?: E[T]) =>
            defaultValue
              ? target.get(propKey, defaultValue)
              : target.get(propKey),

          set: (data: E[T], expire?: number) =>
            target.set(propKey, data, expire),
          remove: () => target.remove(propKey),
        };
      },
    } as any
  );
