import type * as types from '../types';

import { Counter, Gauge, Histogram, Summary } from 'prom-client';

import { DependencyManager } from '../DependencyManager';

import { CONSTANTS } from '../constants';

const metrics: types.MetricCtorMap = {
	gauge: Gauge,
	counter: Counter,
	histogram: Histogram,
	summary: Summary
};

export class Metric<T extends types.MetricType> implements types.IMetric<T> {
	private registryManager: types.IRegistryManager;

	private metrics: Map<string, types.MetricInstanceMap[T]>;

	constructor(
		private type: T,
		private metricConfigs: types.MetricConfigMap[T][]
	) {
		this.registryManager = DependencyManager.get(CONSTANTS.DEPENDENCIES.REGISTRY_MANAGER);
		this.metrics = new Map<string, types.MetricInstanceMap[T]>();
	}

	get(metricKey: string): types.MetricInstanceMap[T] | undefined {
		return this.metrics.get(metricKey);
	}

	init(): void {
		this.metricConfigs.forEach(({ key, ...config }) => {
			this.metrics.set(
				key,
				new metrics[this.type]({ ...config, registers: [this.registryManager.register] })
			);
		});
	}
}
