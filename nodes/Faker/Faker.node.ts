import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { faker as baseFaker } from '@faker-js/faker';

function chanceNull(pct: number) {
	return pct && Math.random() * 100 < pct;
}

function genValue(faker: typeof baseFaker, f: any) {
	if (chanceNull(f.nullPct)) return null;

	switch (f.gen) {
		case 'fullName':
			return faker.person.fullName();
		case 'firstName':
			return faker.person.firstName();
		case 'lastName':
			return faker.person.lastName();
		case 'email':
			return faker.internet.email();
		case 'phone':
			return faker.phone.number();
		case 'company':
			return faker.company.name();
		case 'address':
			return faker.location.streetAddress();
		case 'city':
			return faker.location.city();
		case 'country':
			return faker.location.country();
		case 'uuid':
			return faker.string.uuid();
		case 'int':
			return faker.number.int({ min: f.min ?? 0, max: f.max ?? 100 });
		case 'float':
			return Number(
				faker.number
					.float({ min: f.min ?? 0, max: f.max ?? 100, fractionDigits: f.decimals ?? 2 })
					.toFixed(f.decimals ?? 2),
			);
		case 'bool':
			return faker.datatype.boolean();
		case 'datePast':
			return faker.date.past({ years: (f.days ?? 365) / 365 });
		case 'dateFuture':
			return faker.date.future({ years: (f.days ?? 365) / 365 });
		case 'loremSentence':
			return faker.lorem.sentence();
		case 'loremParagraph':
			return faker.lorem.paragraph();
		case 'oneOf': {
			const arr = String(f.choices ?? '')
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean);
			return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
		}
		default:
			return null;
	}
}

export class Faker implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Faker',
		name: 'faker',
		icon: { light: 'file:faker.svg', dark: 'file:faker.dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Basic Example Node',
		defaults: {},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Number of records',
				name: 'count',
				type: 'number',
				default: 1,
				placeholder: 'e.g. 100',
				description: 'How many fake records to generate',
			},
			{
				default: {},
				displayName: 'Fields',
				name: 'fields',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Name',
								name: 'key',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Generator',
								name: 'gen',
								type: 'options',
								default: '',
								options: [
									{ name: 'Full Name', value: 'fullName' },
									{ name: 'First Name', value: 'firstName' },
									{ name: 'Last Name', value: 'lastName' },
									{ name: 'Email', value: 'email' },
									{ name: 'Phone', value: 'phone' },
									{ name: 'Company', value: 'company' },
									{ name: 'Address', value: 'address' },
									{ name: 'City', value: 'city' },
									{ name: 'Country', value: 'country' },
									{ name: 'UUID', value: 'uuid' },
									{ name: 'Integer', value: 'int' },
									{ name: 'Float', value: 'float' },
									{ name: 'Boolean', value: 'bool' },
									{ name: 'Date (Past)', value: 'datePast' },
									{ name: 'Date (Future)', value: 'dateFuture' },
									{ name: 'Lorem Sentence', value: 'loremSentence' },
									{ name: 'Lorem Paragraph', value: 'loremParagraph' },
									{ name: 'Pick From List', value: 'oneOf' },
								],
							},
							{
								displayName: 'Min',
								name: 'min',
								type: 'number',
								default: 0,
								displayOptions: { show: { gen: ['int', 'float'] } },
							},
							{
								displayName: 'Max',
								name: 'max',
								type: 'number',
								default: 100,
								displayOptions: { show: { gen: ['int', 'float'] } },
							},
							{
								displayName: 'Decimals',
								name: 'decimals',
								type: 'number',
								default: 2,
								displayOptions: { show: { gen: ['float'] } },
							},
							{
								displayName: 'Days Range',
								name: 'days',
								type: 'number',
								default: 365,
								displayOptions: { show: { gen: ['datePast', 'dateFuture'] } },
							},
							{
								displayName: 'Choices',
								name: 'choices',
								type: 'string',
								placeholder: 'new,active,churn',
								default: 'new,active,churn',
								displayOptions: { show: { gen: ['oneOf'] } },
							},
							{
								displayName: 'Null %',
								name: 'nullPct',
								type: 'number',
								default: 0,
								description: 'Chance to return null 0–100',
							},
						],
					},
				],
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items: INodeExecutionData[] = [];
		const count = this.getNodeParameter('count', 0) as number;
		const fields = this.getNodeParameter('fields.field', 0, []) as any[];
		const faker = baseFaker;
		for (let i = 0; i < count; i++) {
			const row: any = {};
			for (const f of fields) row[f.key] = genValue(faker, f);
			items.push({ json: row });
		}
		return [items];
	}
}
