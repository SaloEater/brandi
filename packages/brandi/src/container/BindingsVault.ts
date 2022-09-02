import { ResolutionCondition, UnknownCreator } from '../types';
import { Token, TokenValue, tag as createTag } from '../pointers';

import { Binding } from './bindings';
import { ResolutionCache } from './ResolutionCache';

type BindingsMap = Map<ResolutionCondition, Binding | BindingsVault>;

export class BindingsVault {
  private static notag = createTag('NO_TAG');

  public parent: BindingsVault | null = null;

  private readonly map = new Map<symbol, BindingsMap>();

  public copy?(): BindingsVault;

  constructor() {
    
  }

  public set(
    binding: Binding | BindingsVault,
    token: Token,
    condition: ResolutionCondition = BindingsVault.notag,
  ): void {
    const current = this.map.get(token.__s);

    if (current) current.set(condition, binding);
    else
      this.map.set(
        token.__s,
        new Map<ResolutionCondition, Binding | BindingsVault>().set(
          condition,
          binding,
        ),
      );
  }

  private find(
    token: TokenValue,
    conditions?: ResolutionCondition[],
    target?: UnknownCreator,
  ): Binding | BindingsVault | undefined {
    const bindings = this.map.get(token.__s);

    if (bindings === undefined) return undefined;

    if (target) {
      const targetBinding = bindings.get(target);
      if (targetBinding) return targetBinding;
    }

    if (conditions) {
      for (let i = 0, len = conditions.length; i < len; i += 1) {
        const binding = bindings.get(conditions[i]!);
        if (binding) return binding;
      }
    }

    return bindings.get(BindingsVault.notag);
  }

  private resolve(
    token: TokenValue,
    cache: ResolutionCache,
    conditions?: ResolutionCondition[],
    target?: UnknownCreator,
  ): Binding | null {
    const binding = this.find(token, conditions, target);

    if (binding === undefined)
      return this.parent
        ? this.parent.resolve(token, cache, conditions, target)
        : null;

    if (binding instanceof BindingsVault) {
      cache.vaults.push(binding);
      return binding.resolve(token, cache, conditions, target);
    }

    return binding;
  }

  public get(
    token: TokenValue,
    cache: ResolutionCache,
    conditions?: ResolutionCondition[],
    target?: UnknownCreator,
  ): Binding | null {
    const ownBinding = this.resolve(token, cache, conditions, target);

    if (ownBinding) return ownBinding;

    for (let i = 0, v = cache.vaults, len = v.length; i < len; i += 1) {
      const cacheBinding = v[i]!.resolve(token, cache, conditions, target);
      if (cacheBinding) return cacheBinding;
    }

    return null;
  }

  private from(
    callback: (bindings: BindingsMap) => BindingsMap,
  ): BindingsVault {
    const vault = new BindingsVault();
    vault.parent = this.parent;

    this.map.forEach((bindings, key) => {
      vault.map.set(key, callback(bindings));
    });

    return vault;
  }

  public clone(): BindingsVault {
    return this.from(
      (prev) => new Map<ResolutionCondition, Binding | BindingsVault>(prev),
    );
  }
}
