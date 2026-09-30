import {
	Registry,
	Gauge,
	Counter,
	Histogram,
	Summary,
	GaugeConfiguration,
	CounterConfiguration,
	HistogramConfiguration,
	SummaryConfiguration
} from 'prom-client';

export type ServiceName = string;
export type ApiHost = string;
export type Port = number;
export type RefreshToken = string;
export type AccessToken = string;

export type ServiceConfig = {
	port: Port;
	metricTypes: MetricTypeConfig[];
};

export type Register = Registry;

export type MetricConfig<T> = { key: string } & T;

export type MetricConfigMap = {
	gauge: MetricConfig<GaugeConfiguration<string>>;
	counter: MetricConfig<CounterConfiguration<string>>;
	histogram: MetricConfig<HistogramConfiguration<string>>;
	summary: MetricConfig<SummaryConfiguration<string>>;
};

export type MetricInstanceMap = {
	gauge: Gauge<string>;
	counter: Counter<string>;
	histogram: Histogram<string>;
	summary: Summary<string>;
};

export type MetricType = keyof MetricConfigMap;

export type MetricTypeConfig = {
	[T in MetricType]: { type: T; configs: MetricConfigMap[T][] };
}[MetricType];

export type MetricWrappers = {
	[T in MetricType]?: IMetric<T>;
};

export type MetricCtorMap = {
	[T in MetricType]: new (config: Omit<MetricConfigMap[T], 'key'>) => MetricInstanceMap[T];
};

export interface IMetric<T extends MetricType> {
	init(): void;
	get(key: string): MetricInstanceMap[T] | undefined;
}

export interface IRegistryManager {
	get register(): Register;
	init(): void;
}

export interface IMetricsManger {
	get<T extends MetricType>(type: T, key: string): MetricInstanceMap[T] | undefined;
	init(): void;
}

export interface IServerManager {
	start(): void;
	stop(): Promise<void>;
}
