# MongoDB Atlas Setup (FREE - 5 min)

## Step 1 — Account banao
1. Jaao: https://www.mongodb.com/cloud/atlas/register
2. Email se signup karo (ya Google se login karo)

## Step 2 — Free Cluster banao  
1. "Build a Database" click karo
2. **FREE** (M0 Sandbox) select karo
3. Provider: AWS, Region: Mumbai (ap-south-1) select karo
4. Cluster Name: "days-yoga" rakho
5. "Create" click karo (2-3 min lagega)

## Step 3 — User banao
1. Left menu: "Database Access" jaao
2. "Add New Database User" click karo
3. Username: `daysyoga`
4. Password: `DaysYoga2024!` (ya apna password rakho)
5. Role: "Atlas admin" select karo
6. "Add User" click karo

## Step 4 — Network Access
1. Left menu: "Network Access" jaao
2. "Add IP Address" click karo
3. "Allow Access from Anywhere" click karo (0.0.0.0/0)
4. "Confirm" click karo

## Step 5 — Connection String lo
1. Left menu: "Database" jaao
2. "Connect" button click karo
3. "Drivers" select karo
4. Connection string copy karo — kuch aisa dikhega:
   mongodb+srv://daysyoga:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

## Step 6 — .env file update karo
server/.env file mein yeh line update karo:

MONGO_URI=mongodb+srv://daysyoga:DaysYoga2024!@cluster0.xxxxx.mongodb.net/days_yoga?retryWrites=true&w=majority

(apna actual cluster URL daalo)

## Step 7 — Seed + Start
Command Prompt mein:
  cd C:\Users\AYUSH\Desktop\ayuswweb\server
  node scripts/seed.js
  node index.js

Done! ✅
