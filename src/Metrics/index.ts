import type * as types from '../types';

import { Metric } from './Metric';

export class MetricsManager implements types.IMetricsManger {
	private metricWrappers: types.MetricWrappers;

	constructor(private metricTypes: types.MetricTypeConfig[]) {
		this.metricWrappers = {};
	}

	private register<T extends types.MetricType>(type: T, configs: types.MetricConfigMap[T][]): void {
		this.metricWrappers[type] = new Metric(type, configs) as types.MetricWrappers[T];
		this.metricWrappers[type]?.init();
	}

	get<T extends types.MetricType>(type: T, key: string): types.MetricInstanceMap[T] | undefined {
		return this.metricWrappers[type]?.get(key);
	}

	init(): void {
		this.metricTypes.forEach(({ type, configs }) => this.register(type, configs));
	}
}
