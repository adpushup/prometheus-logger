import type * as types from './types';

import http, { Server } from 'http';

import { DependencyManager } from './DependencyManager';

import { CONSTANTS } from './constants';

export class ServerManager implements types.IServerManager {
	private registryManager: types.IRegistryManager;

	private server: Server | null;
	private isShuttingDown: boolean;

	constructor(private port: types.Port = CONSTANTS.DEFAULTS.PORT) {
		this.registryManager = DependencyManager.get(CONSTANTS.DEPENDENCIES.REGISTRY_MANAGER);

		this.server = null;
		this.isShuttingDown = false;
	}

	private setupShutdown(): void {
		const shutdownHandler = async () => {
			if (this.isShuttingDown) return;

			this.isShuttingDown = true;

			await this.stop();
			process.exit(0);
		};

		process.on('SIGTERM', () => shutdownHandler());
		process.on('SIGINT', () => shutdownHandler());
	}

	start(): void {
		const register = this.registryManager.register;

		this.server = http.createServer(async (req, res) => {
			try {
				const { method, url } = req;
				if (method === 'GET' && url === CONSTANTS.ENDPOINTS.METRICS) {
					res.setHeader('Content-Type', register.contentType);
					res.writeHead(CONSTANTS.HTTP_STATUS.OK);
					res.end(await register.metrics());
				} else {
					res.writeHead(CONSTANTS.HTTP_STATUS.NOT_FOUND, { 'Content-Type': 'text/plain' });
					res.end('[metrics] Not Found: Wrong endpoint for fetching metrics.');
				}
			} catch (error) {
				res.writeHead(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR, {
					'Content-Type': 'text/plain'
				});
				res.end('[metrics] Internal Server Error: Failed to fetch metrics.');
			}
		});

		this.server.listen(this.port, () =>
			console.log(`[metrics] server started listening on port::${this.port}`)
		);

		this.setupShutdown();
	}

	stop(): Promise<void> {
		return new Promise((resolve) => {
			if (this.server) {
				this.server.close(() => {
					console.log(`[metrics] server stopped successfully on port::${this.port}`);
					resolve();
				});
			} else {
				resolve();
			}
		});
	}
}
