-- Admin Table
CREATE TABLE Admin (
    AdminID SERIAL PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Role VARCHAR(20) CHECK (Role IN ('super admin', 'admin', 'moderator')) NOT NULL
);

-- CRM_Portal Table
CREATE TABLE CRM_Portal (
    PortalID SERIAL PRIMARY KEY,
    PortalName VARCHAR(100) NOT NULL,
    AdministratorID INT REFERENCES Admin(AdminID)
);

-- Employee Table
CREATE TABLE Employee (
    EmployeeID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    Position VARCHAR(50) NOT NULL,
    Department VARCHAR(50) NOT NULL,
    AdminID INT REFERENCES Admin(AdminID)
);

-- Customer Table
CREATE TABLE Customer (
    CustomerID SERIAL PRIMARY KEY,
    FirstName VARCHAR(50) NOT NULL,
    LastName VARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(20) NOT NULL,
    Address VARCHAR(255) NOT NULL,
    City VARCHAR(50) NOT NULL,
    State VARCHAR(50) NOT NULL,
    Country VARCHAR(50) NOT NULL,
    ZipCode VARCHAR(20) NOT NULL
);

-- Service Table
CREATE TABLE Service (
    ServiceID SERIAL PRIMARY KEY,
    ServiceName VARCHAR(100) NOT NULL,
    Description TEXT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL
);

-- Product Table
CREATE TABLE Product (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Description TEXT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    QuantityAvailable INT NOT NULL
);

-- Orders Table
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    OrderDate DATE NOT NULL,
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status VARCHAR(20) CHECK (Status IN ('pending', 'shipped', 'delivered')) NOT NULL,
    CustomerID INT REFERENCES Customer(CustomerID),
    EmployeeID INT REFERENCES Employee(EmployeeID)
);
