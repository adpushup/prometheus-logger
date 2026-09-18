import type * as types from './types';

import { RegistryManager } from './Registry';
import { MetricsManager } from './Metrics';
import { ServerManager } from './Server';

import { CONSTANTS } from './constants';

export class DependencyManager {
	private static dependencies: Record<string, unknown> = {};

	static init(serviceName: types.ServiceName, serviceConfig: types.ServiceConfig): void {
		this.dependencies[CONSTANTS.DEPENDENCIES.REGISTRY_MANAGER] = new RegistryManager(serviceName);
		this.dependencies[CONSTANTS.DEPENDENCIES.METRICS_MANAGER] = new MetricsManager(
			serviceConfig.metricTypes
		);
		this.dependencies[CONSTANTS.DEPENDENCIES.SERVER_MANAGER] = new ServerManager(
			serviceConfig.port
		);
	}

	static get<TDependency>(name: string): TDependency {
		return this.dependencies[name] as TDependency;
	}
}
