
---

# 🔄 Data Restoration Guide (For New Laptops)

This section explains **how to retrieve and load StartupForge data into Docker containers** after setup.

> ⚠️ Important
> Docker images **do not contain data**.
> Data must be restored from the provided backups.

---

## 📦 Required Backup Files

Make sure the following files are present in the `backups/` folder:

```
backups/
├── startupforge_db.sql
├── neo4j_volume1_YYYYMMDD_HHMM.tar.gz
└── neo4j_volume2_YYYYMMDD_HHMM.tar.gz
```

---

## 🐘 PostgreSQL — Restore Database Data

### 1️⃣ Ensure Postgres container is running

```bash
docker ps
```

If not:

```bash
docker compose up -d postgres
```

---

### 2️⃣ Restore database

#### Windows (PowerShell)

```powershell
Get-Content backups\startupforge_db.sql | `
docker exec -i startupforge-postgres `
psql -U postgres -d startupforge_db
```

#### Linux / macOS

```bash
docker exec -i startupforge-postgres \
psql -U postgres -d startupforge_db \
< backups/startupforge_db.sql
```

---

### 3️⃣ Verify restore

```bash
docker exec -it startupforge-postgres \
psql -U postgres -d startupforge_db -c "\dt"
```

Expected tables:

```
investors
founders
connections
connection_requests
```

---

## 🧠 Neo4j — Restore Graph Data

### 1️⃣ Stop Neo4j container

```bash
docker stop startupforge-neo4j
```

---

### 2️⃣ Restore Neo4j volume 1

```bash
docker run --rm \
  -v neo4j_volume1:/data \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/neo4j_volume1_YYYYMMDD_HHMM.tar.gz -C /
```

---

### 3️⃣ Restore Neo4j volume 2

```bash
docker run --rm \
  -v neo4j_volume2:/data \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/neo4j_volume2_YYYYMMDD_HHMM.tar.gz -C /
```

---

### 4️⃣ Restart Neo4j

```bash
docker start startupforge-neo4j
```

---

### 5️⃣ Verify Neo4j

Open browser:

```
http://localhost:7474
```

Login:

```
Username: neo4j
Password: password
```

Run:

```cypher
MATCH (n) RETURN labels(n), count(*) LIMIT 10;
```

---

## 🔐 Data Safety Notes

* Containers can be deleted safely
* Volumes preserve data
* Backups allow full restoration anytime
* This setup works on **any OS**

---

## 🛑 Full Reset (If Needed)

```bash
docker compose down -v
docker compose up -d
```

Then repeat restore steps above.

---

## ✅ Summary (For Evaluators / Teammates)

```bash
docker compose up -d
# restore postgres
# restore neo4j
```

Data is now fully available inside containers.

---

If you want, I can now:

* Merge this into a **single README**
* Write a **one-click restore script**
* Convert this into a **submission-ready setup document**

Just say the word.
