/* eslint-disable @n8n/community-nodes/no-restricted-imports */
// This node is intended for self-hosted n8n environments only.
// It uses Node.js built-ins (child_process, util) not available on n8n Cloud.
import { exec } from 'child_process';
import { promisify } from 'util';
/* eslint-enable @n8n/community-nodes/no-restricted-imports */
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const execAsync = promisify(exec);

export class ArbitraryProgram implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Arbitrary Program',
		name: 'arbitraryProgram',
		icon: 'file:arbitraryProgram.svg',
		group: ['transform'],
		version: 1,
		description: 'Execute an arbitrary program or shell command',
		defaults: {
			name: 'Arbitrary Program',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Command',
				name: 'command',
				type: 'string',
				default: '',
				placeholder: 'echo "Hello World"',
				description: 'The command or program to execute. Only use trusted, static commands — avoid injecting unsanitized external data into this field.',
				required: true,
			},
			{
				displayName: 'Working Directory',
				name: 'cwd',
				type: 'string',
				default: '',
				placeholder: '/tmp',
				description: 'The working directory in which to execute the command. Defaults to the current working directory of the n8n process.',
			},
			{
				displayName: 'Execution Timeout',
				name: 'timeout',
				type: 'number',
				default: 10000,
				description: 'Maximum execution time in milliseconds. Set to 0 for no timeout.',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const command = this.getNodeParameter('command', itemIndex, '') as string;
				const cwd = this.getNodeParameter('cwd', itemIndex, '') as string;
				const timeout = this.getNodeParameter('timeout', itemIndex, 10000) as number;

				if (!command.trim()) {
					throw new NodeOperationError(this.getNode(), 'Command cannot be empty', { itemIndex });
				}

				const execOptions: { cwd?: string; timeout?: number } = {};
				if (cwd.trim()) {
					execOptions.cwd = cwd.trim();
				}
				if (timeout > 0) {
					execOptions.timeout = timeout;
				}

				const { stdout, stderr } = await execAsync(command, execOptions);

				returnData.push({
					json: {
						stdout: stdout.trimEnd(),
						stderr: stderr.trimEnd(),
						command,
					},
					pairedItem: itemIndex,
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							command: this.getNodeParameter('command', itemIndex, '') as string,
						},
						pairedItem: itemIndex,
					});
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, { itemIndex });
				}
			}
		}

		return [returnData];
	}
}
