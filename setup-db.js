// This script helps you set up the database tables in Supabase
// You'll need to run this in the Supabase SQL Editor

// Instructions:
// 1. Log in to your Supabase dashboard at https://app.supabase.io
// 2. Select your project
// 3. Go to the SQL Editor
// 4. Copy and paste the contents of schema.sql
// 5. Run the SQL commands

console.log(`
To set up your database tables:

1. Log in to your Supabase dashboard at https://app.supabase.io
2. Select your project
3. Go to the SQL Editor
4. Copy and paste the following SQL commands:

-- Admin Table
CREATE TABLE IF NOT EXISTS "Admin" (
    "AdminID" SERIAL PRIMARY KEY,
    "Username" VARCHAR(50) UNIQUE NOT NULL,
    "Password" VARCHAR(255) NOT NULL,
    "Email" VARCHAR(100) UNIQUE NOT NULL,
    "Role" VARCHAR(20) CHECK ("Role" IN ('super admin', 'admin', 'moderator')) NOT NULL
);

-- Customer Table
CREATE TABLE IF NOT EXISTS "Customer" (
    "CustomerID" SERIAL PRIMARY KEY,
    "FirstName" VARCHAR(50) NOT NULL,
    "LastName" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(100) UNIQUE NOT NULL,
    "PhoneNumber" VARCHAR(20) NOT NULL,
    "Address" VARCHAR(255) NOT NULL,
    "City" VARCHAR(50) NOT NULL,
    "State" VARCHAR(50) NOT NULL,
    "Country" VARCHAR(50) NOT NULL,
    "ZipCode" VARCHAR(20) NOT NULL
);

-- Service Table
CREATE TABLE IF NOT EXISTS "Service" (
    "ServiceID" SERIAL PRIMARY KEY,
    "ServiceName" VARCHAR(100) NOT NULL,
    "Description" TEXT NOT NULL,
    "Price" DECIMAL(10, 2) NOT NULL
);

-- Orders Table
CREATE TABLE IF NOT EXISTS "Orders" (
    "OrderID" SERIAL PRIMARY KEY,
    "OrderDate" DATE NOT NULL,
    "TotalAmount" DECIMAL(10, 2) NOT NULL,
    "Status" VARCHAR(20) CHECK ("Status" IN ('pending', 'shipped', 'delivered')) NOT NULL,
    "CustomerID" INT REFERENCES "Customer"("CustomerID")
);

5. Run the SQL commands

After running these commands, your database tables will be created and the 404 errors should be resolved.
`); 