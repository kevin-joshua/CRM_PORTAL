// This script provides sample data to insert into your Supabase database tables
// You'll need to run this in the Supabase SQL Editor after creating the tables

console.log(`
To insert sample data into your database tables:

1. Log in to your Supabase dashboard at https://app.supabase.io
2. Select your project
3. Go to the SQL Editor
4. Copy and paste the following SQL commands:

-- Insert sample admin users
INSERT INTO "Admin" ("Username", "Password", "Email", "Role")
VALUES 
  ('admin1', 'hashed_password_here', 'admin1@example.com', 'admin'),
  ('admin2', 'hashed_password_here', 'admin2@example.com', 'moderator');

-- Insert sample customers
INSERT INTO "Customer" ("FirstName", "LastName", "Email", "PhoneNumber", "Address", "City", "State", "Country", "ZipCode")
VALUES 
  ('John', 'Doe', 'john.doe@example.com', '123-456-7890', '123 Main St', 'New York', 'NY', 'USA', '10001'),
  ('Jane', 'Smith', 'jane.smith@example.com', '098-765-4321', '456 Oak Ave', 'Los Angeles', 'CA', 'USA', '90001');

-- Insert sample services
INSERT INTO "Service" ("ServiceName", "Description", "Price")
VALUES 
  ('Web Development', 'Custom website development services', 999.99),
  ('Mobile App Development', 'Native and cross-platform mobile app development', 1499.99),
  ('SEO Optimization', 'Search engine optimization services', 499.99);

-- Insert sample orders
INSERT INTO "Orders" ("OrderDate", "TotalAmount", "Status", "CustomerID")
VALUES 
  ('2023-01-15', 999.99, 'delivered', 1),
  ('2023-02-20', 1499.99, 'shipped', 1),
  ('2023-03-10', 499.99, 'pending', 2);

5. Run the SQL commands

Note: Replace 'hashed_password_here' with actual hashed passwords for security.
For a real application, you should use a secure password hashing algorithm.
`); 