import type * as types from './types';

import { Registry, collectDefaultMetrics } from 'prom-client';

import { CONSTANTS } from './constants';

export class RegistryManager implements types.IRegistryManager {
	private readonly _register: types.Register;

	constructor(private serviceName: types.ServiceName) {
		this._register = new Registry();
	}

	get register(): types.Register {
		return this._register;
	}

	private getPrefix(): types.ServiceName {
		return this.serviceName + CONSTANTS.DEFAULTS.REGISTRY_PREFIX_SEPARATOR;
	}

	init(): void {
		collectDefaultMetrics({ prefix: this.getPrefix(), register: this.register });
	}
}
