export const CONSTANTS = {
	DEFAULTS: {
		PORT: 9090,
		REGISTRY_PREFIX_SEPARATOR: '_'
	},
	DEPENDENCIES: {
		REGISTRY_MANAGER: 'registryManager',
		METRICS_MANAGER: 'metricsManager',
		SERVER_MANAGER: 'serverManager'
	},
	ENDPOINTS: {
		API: {
			ACCESS_TOKEN: '/api/getAccessToken',
			SERVICE_CONFIG: '/api/metricsLogging'
		},
		METRICS: '/metrics'
	},
	HTTP_STATUS: {
		OK: 200,
		NOT_FOUND: 404,
		INTERNAL_SERVER_ERROR: 500
	}
};
