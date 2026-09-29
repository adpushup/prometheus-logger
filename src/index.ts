import * as types from './types';

import fetch from 'node-fetch';

import { DependencyManager } from './DependencyManager';

import { CONSTANTS } from './constants';

export class Logger {
	private registryManager: types.IRegistryManager | null;
	private serverManager: types.IServerManager | null;
	private metricsManager: types.IMetricsManger | null;

	private serviceConfig: types.ServiceConfig | undefined;

	constructor(
		private serviceName: types.ServiceName,
		private apiHost: types.ApiHost,
		private refreshToken: types.RefreshToken
	) {
		this.registryManager = null;
		this.serverManager = null;
		this.metricsManager = null;
	}

	private initDependencies(): void {
		DependencyManager.init(this.serviceName, this.serviceConfig!);

		this.registryManager = DependencyManager.get(CONSTANTS.DEPENDENCIES.REGISTRY_MANAGER);
		this.metricsManager = DependencyManager.get(CONSTANTS.DEPENDENCIES.METRICS_MANAGER);
		this.serverManager = DependencyManager.get(CONSTANTS.DEPENDENCIES.SERVER_MANAGER);
	}

	log<T extends types.MetricType>(type: T, key: string): types.MetricInstanceMap[T] | undefined {
		return this.metricsManager?.get(type, key);
	}

	private async getAccessToken(): Promise<types.AccessToken> {
		const url = `${this.apiHost}${CONSTANTS.ENDPOINTS.API.ACCESS_TOKEN}`;
		const response = await fetch(url, {
			headers: { authorization: this.refreshToken }
		});

		if (!response.ok) {
			throw new Error(`Failed to get access token: ${response.status} ${response.statusText}`);
		}

		const { token } = await response.json();
		return token;
	}

	private async loadServiceConfig(): Promise<void> {
		const accessToken = await this.getAccessToken();

		const url = `${this.apiHost}${CONSTANTS.ENDPOINTS.API.SERVICE_CONFIG}/${this.serviceName}`;
		const response = await fetch(url, {
			headers: { authorization: accessToken }
		});

		if (!response.ok) {
			throw new Error(
				`Failed to load service config for "${this.serviceName}": ${response.status} ${response.statusText}`
			);
		}

		this.serviceConfig = await response.json();
	}

	async init(): Promise<void> {
		try {
			await this.loadServiceConfig();

			this.initDependencies();

			this.registryManager?.init();
			this.metricsManager?.init();
			this.serverManager?.start();
		} catch (error) {
			throw new Error(`[metrics] Initialization failed: ${(error as Error).message}`);
		}
	}
}
