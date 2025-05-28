  
# 🧠 Bitespeed Identity Reconciliation API

This project solves Bitespeed's identity reconciliation problem by linking customer records based on shared email or phone number. It handles multiple identities, linking logic, and ensures that each identity group is consolidated under a single primary contact.

---

## 🚀 Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL (via [Neon](https://neon.tech))**
- Deployed with: **Render** (or local)

---

## 📦 Project Structure

```
bitespeed-identity-reconciliation/
├── src/
│   ├── index.ts           # Express entry point
│   └── identify.ts        # /identify POST handler
├── prisma/
│   ├── schema.prisma      # DB schema
│   └── migrations/        # Generated migrations
├── .env                   # Environment variables (DATABASE_URL)
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/bitespeed-identity-reconciliation.git
cd bitespeed-identity-reconciliation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Your Database

Provision a free PostgreSQL database on [Neon](https://neon.tech), then copy your connection string into a `.env` file:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<db>?sslmode=require"
```

### 4. Create the Schema

```bash
npx prisma migrate dev --name init
```

To open the Prisma Studio:

```bash
npx prisma studio
```

---

## 🧪 API Usage

### POST `/identify`

Identify or create a contact record based on email and/or phone number.

#### 📥 Request Body

```json
{
  "email": "doc@flux.com",
  "phoneNumber": "1234567890"
}
```

#### 📤 Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@flux.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": []
  }
}
```

---

## 🧑‍💻 Run Locally

```bash
npx ts-node-dev src/index.ts
```

Visit `http://localhost:3000` or test via Postman/cURL:

```bash
curl -X POST http://localhost:3000/identify   -H "Content-Type: application/json"   -d '{"email": "doc@flux.com", "phoneNumber": "1234567890"}'
```

---

## 🌐 Deployment (Optional)

You can deploy this easily using:

- [Render](https://render.com/)
- [Railway](https://railway.app/)

> Make sure to set your `DATABASE_URL` environment variable in the deployment dashboard.

---

## 📄 License

MIT

---

## 🙌 Acknowledgements

Challenge by [Bitespeed](https://bitespeed.in)  
Built by **Sanjay S**
