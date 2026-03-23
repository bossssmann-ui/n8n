import type { INodeProperties } from 'n8n-workflow';
import { codespaceGetAllDescription } from './getAll';
import { codespaceGetDescription } from './get';
import { codespaceDeleteDescription } from './delete';
import { codespaceStartDescription } from './start';
import { codespaceStopDescription } from './stop';

const showOnlyForCodespaces = {
	resource: ['codespace'],
};

export const codespaceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCodespaces,
		},
		options: [
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a codespace',
				description: 'Delete a codespace for the authenticated user',
				routing: {
					request: {
						method: 'DELETE',
						url: '=/user/codespaces/{{$parameter.codespaceName}}',
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a codespace',
				description: 'Get a codespace for the authenticated user',
				routing: {
					request: {
						method: 'GET',
						url: '=/user/codespaces/{{$parameter.codespaceName}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get codespaces',
				description: 'List codespaces for the authenticated user',
				routing: {
					request: {
						method: 'GET',
						url: '/user/codespaces',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'codespaces',
								},
							},
						],
					},
				},
			},
			{
				name: 'Start',
				value: 'start',
				action: 'Start a codespace',
				description: 'Start a codespace for the authenticated user',
				routing: {
					request: {
						method: 'POST',
						url: '=/user/codespaces/{{$parameter.codespaceName}}/start',
					},
				},
			},
			{
				name: 'Stop',
				value: 'stop',
				action: 'Stop a codespace',
				description: 'Stop a codespace for the authenticated user',
				routing: {
					request: {
						method: 'POST',
						url: '=/user/codespaces/{{$parameter.codespaceName}}/stop',
					},
				},
			},
		],
		default: 'getAll',
	},
	...codespaceGetAllDescription,
	...codespaceGetDescription,
	...codespaceDeleteDescription,
	...codespaceStartDescription,
	...codespaceStopDescription,
];
