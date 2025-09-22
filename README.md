# n8n-nodes-faker (Unofficial)

A custom **n8n node** that generates random data using [@faker-js/faker](https://github.com/faker-js/faker).  
This node is useful for creating **test data**, seeding databases, or populating services like **Airtable**, **Google Sheets**, or **CRMs** directly inside n8n workflows.

⚠️ **Disclaimer**: This is an **unofficial node**. It is not maintained, endorsed, or supported by the n8n team or by fakerjs team.

---

## ✨ Features

- Generate fake records with configurable **count**.
- Supports common fields:
  - Name
  - Email
  - Phone
  - Company
  - Address
  - Lorem text
- Output in standard JSON format, ready to connect to other n8n nodes.

---

## 📦 Installation

1. Clone or download this repository.
2. Install dependencies (Faker):

   ```bash
   npm install
   npm install @faker-js/faker
   ```

```bash
npm run build
```

Symlink or copy the built package into your n8n custom nodes folder:

Configure:

- Number of Records → how many items to generate (default = 1).
- Fields → choose which fields you want included.
- Connect the output to Airtable, Sheets, or any other node.

Example output

```json
[
 {
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "(123) 456-7890",
  "company": "Acme Corp",
  "address": "123 Main Street"
 }
]
```
