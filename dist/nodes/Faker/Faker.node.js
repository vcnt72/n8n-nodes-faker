"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Faker = void 0;
const faker_1 = require("@faker-js/faker");
function chanceNull(pct) {
    return pct && Math.random() * 100 < pct;
}
function genValue(faker, f) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (chanceNull(f.nullPct))
        return null;
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
            return faker.number.int({ min: (_a = f.min) !== null && _a !== void 0 ? _a : 0, max: (_b = f.max) !== null && _b !== void 0 ? _b : 100 });
        case 'float':
            return Number(faker.number
                .float({ min: (_c = f.min) !== null && _c !== void 0 ? _c : 0, max: (_d = f.max) !== null && _d !== void 0 ? _d : 100, fractionDigits: (_e = f.decimals) !== null && _e !== void 0 ? _e : 2 })
                .toFixed((_f = f.decimals) !== null && _f !== void 0 ? _f : 2));
        case 'bool':
            return faker.datatype.boolean();
        case 'datePast':
            return faker.date.past({ years: ((_g = f.days) !== null && _g !== void 0 ? _g : 365) / 365 });
        case 'dateFuture':
            return faker.date.future({ years: ((_h = f.days) !== null && _h !== void 0 ? _h : 365) / 365 });
        case 'loremSentence':
            return faker.lorem.sentence();
        case 'loremParagraph':
            return faker.lorem.paragraph();
        case 'oneOf': {
            const arr = String((_j = f.choices) !== null && _j !== void 0 ? _j : '')
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
        }
        default:
            return null;
    }
}
class Faker {
    constructor() {
        this.description = {
            displayName: 'Faker',
            name: 'faker',
            icon: { light: 'file:faker.svg', dark: 'file:faker.dark.svg' },
            group: ['input'],
            version: 1,
            description: 'Basic Example Node',
            defaults: {},
            inputs: ["main"],
            outputs: ["main"],
            usableAsTool: true,
            properties: [
                {
                    displayName: 'Number of Records',
                    name: 'count',
                    type: 'number',
                    default: 1,
                    placeholder: 'e.g. 100',
                    description: 'How many fake records to generate',
                },
                {
                    displayName: 'Fields',
                    default: {},
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
                                    displayName: 'Choices',
                                    name: 'choices',
                                    type: 'string',
                                    placeholder: 'new,active,churn',
                                    default: 'new,active,churn',
                                    displayOptions: { show: { gen: ['oneOf'] } },
                                },
                                {
                                    displayName: 'Days Range',
                                    name: 'days',
                                    type: 'number',
                                    default: 365,
                                    displayOptions: { show: { gen: ['datePast', 'dateFuture'] } },
                                },
                                {
                                    displayName: 'Decimals',
                                    name: 'decimals',
                                    type: 'number',
                                    default: 2,
                                    displayOptions: { show: { gen: ['float'] } },
                                },
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
                                    default: 'email',
                                    options: [
                                        { name: 'Address', value: 'address' },
                                        { name: 'Boolean', value: 'bool' },
                                        { name: 'City', value: 'city' },
                                        { name: 'Company', value: 'company' },
                                        { name: 'Country', value: 'country' },
                                        { name: 'Date (Future)', value: 'dateFuture' },
                                        { name: 'Date (Past)', value: 'datePast' },
                                        { name: 'Email', value: 'email' },
                                        { name: 'First Name', value: 'firstName' },
                                        { name: 'Float', value: 'float' },
                                        { name: 'Full Name', value: 'fullName' },
                                        { name: 'Integer', value: 'int' },
                                        { name: 'Last Name', value: 'lastName' },
                                        { name: 'Lorem Paragraph', value: 'loremParagraph' },
                                        { name: 'Lorem Sentence', value: 'loremSentence' },
                                        { name: 'Phone', value: 'phone' },
                                        { name: 'Pick From List', value: 'oneOf' },
                                        { name: 'UUID', value: 'uuid' },
                                    ],
                                },
                                {
                                    displayName: 'Max',
                                    name: 'max',
                                    type: 'number',
                                    default: 100,
                                    displayOptions: { show: { gen: ['int', 'float'] } },
                                },
                                {
                                    displayName: 'Min',
                                    name: 'min',
                                    type: 'number',
                                    default: 0,
                                    displayOptions: { show: { gen: ['int', 'float'] } },
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
    }
    async execute() {
        const items = [];
        const count = this.getNodeParameter('count', 0);
        const fields = this.getNodeParameter('fields.field', 0, []);
        const faker = faker_1.faker;
        for (let i = 0; i < count; i++) {
            const row = {};
            for (const f of fields) {
                row[f.key] = genValue(faker, f);
                row[`${f.key}_${typeof f}`] = true;
            }
            items.push({ json: row });
        }
        return [items];
    }
}
exports.Faker = Faker;
//# sourceMappingURL=Faker.node.js.map