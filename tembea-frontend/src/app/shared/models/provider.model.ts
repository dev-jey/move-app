export interface IProviderInventory {
  id?: number;
  name?: string;
  user?: string;
  email?: string;
}

export class ProviderModel implements IProviderInventory {
  constructor(
    public name?: string,
    public email?: string,
  ) {}
}
