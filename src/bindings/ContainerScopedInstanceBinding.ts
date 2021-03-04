import { Constructor } from '../types';
import type { Container } from '../container';

import { Scope, Type } from './Binding';
import { InstanceBinding } from './InstanceBinding';

export class ContainerScopedInstanceBinding implements InstanceBinding {
  public readonly type = Type.Instance;

  public readonly scope = Scope.Container;

  public readonly instances = new Map<Container, Object>();

  constructor(public readonly value: Constructor) {}
}
