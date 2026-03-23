import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCodespaceStart = {
	operation: ['start'],
	resource: ['codespace'],
};

export const codespaceStartDescription: INodeProperties[] = [
	{
		displayName: 'Codespace Name',
		name: 'codespaceName',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: showOnlyForCodespaceStart,
		},
		modes: [
			{
				displayName: 'Codespace',
				name: 'list',
				type: 'list',
				placeholder: 'Select a codespace...',
				typeOptions: {
					searchListMethod: 'getCodespaces',
					searchable: true,
					searchFilterRequired: false,
				},
			},
			{
				displayName: 'By Name',
				name: 'name',
				type: 'string',
				placeholder: 'e.g. my-codespace-abc123',
				validation: [
					{
						type: 'regex',
						properties: {
							regex: '^[-_a-zA-Z0-9]+$',
							errorMessage: 'Not a valid codespace name',
						},
					},
				],
			},
		],
	},
];
