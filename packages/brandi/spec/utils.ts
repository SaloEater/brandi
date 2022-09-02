export type Expect<T extends true> = T;

export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

export const setEnv = (value: string): (() => void) => {
  
};

export const wait = <T>(callback: () => T): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(callback());
    }, 20);
  });
