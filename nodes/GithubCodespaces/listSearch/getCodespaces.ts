import type {
	ILoadOptionsFunctions,
	INodeListSearchResult,
	INodeListSearchItems,
} from 'n8n-workflow';
import { githubCodespacesApiRequest } from '../shared/transport';

type CodespaceItem = {
	name: string;
	display_name?: string;
	web_url: string;
};

type CodespacesResponse = {
	codespaces: CodespaceItem[];
	total_count: number;
};

export async function getCodespaces(
	this: ILoadOptionsFunctions,
	filter?: string,
	paginationToken?: string,
): Promise<INodeListSearchResult> {
	const page = paginationToken ? +paginationToken : 1;
	const per_page = 100;

	let responseData: CodespacesResponse = {
		codespaces: [],
		total_count: 0,
	};

	try {
		responseData = await githubCodespacesApiRequest.call(this, 'GET', '/user/codespaces', {
			page,
			per_page,
		});
	} catch {
		// will fail if the user does not have any codespaces
	}

	const codespaces = responseData.codespaces ?? [];
	const filtered = filter
		? codespaces.filter(
				(item) =>
					item.name.toLowerCase().includes(filter.toLowerCase()) ||
					(item.display_name ?? '').toLowerCase().includes(filter.toLowerCase()),
			)
		: codespaces;

	const results: INodeListSearchItems[] = filtered.map((item: CodespaceItem) => ({
		name: item.display_name ?? item.name,
		value: item.name,
		url: item.web_url,
	}));

	const nextPaginationToken =
		page * per_page < responseData.total_count ? String(page + 1) : undefined;
	return { results, paginationToken: nextPaginationToken };
}
