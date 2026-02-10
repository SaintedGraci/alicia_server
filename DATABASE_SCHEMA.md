# 🏛️ ALICIA MUNICIPALITY DATABASE SCHEMA

## 📊 Database Overview
**Database Name:** `alicia_db`  
**Purpose:** Digital government system for Alicia Municipality  
**Total Tables:** 7  

---

## 🗂️ TABLE RELATIONSHIPS DIAGRAM

```
┌─────────────────┐
│  MUNICIPALITIES │
│  (id, name)     │ ← Only "Alicia Municipality"
└─────────┬───────┘
          │ 1:N
          ▼
┌─────────────────┐
│   BARANGAYS     │
│ (id, name,      │ ← All neighborhoods in Alicia
│  municipality_  │
│  id, contact)   │
└─────────┬───────┘
          │ 1:N
          ▼
┌─────────────────┐    ┌─────────────────┐
│     USERS       │    │  DOCUMENT_TYPES │
│ (id, username,  │    │ (id, name,      │
│  email, pass,   │    │  type, fee,     │
│  role)          │    │  requirements)  │
└─────────┬───────┘    └─────────────────┘
          │ 1:1                    │
          ▼                        │ Reference
┌─────────────────┐                │
│   RESIDENTS     │                │
│ (id, user_id,   │                │
│  barangay_id,   │                │
│  name, address) │                │
└─────────┬───────┘                │
          │ 1:N                    │
          ▼                        │
┌─────────────────┐                │
│ DOCUMENT_       │ ◄──────────────┘
│ REQUESTS        │
│ (id, resident_  │
│  id, type,      │
│  request_type,  │
│  status)        │
└─────────┬───────┘
          │ 1:N
          ▼
┌─────────────────┐
│ NOTIFICATIONS   │
│ (id, user_id,   │
│  message, type) │
└─────────────────┘
```

---

## 📋 DETAILED TABLE SPECIFICATIONS

### 1. 🏛️ MUNICIPALITIES
**Purpose:** Store municipality information (only Alicia)
```sql
CREATE TABLE municipalities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,        -- "Alicia"
    code VARCHAR(20) NOT NULL UNIQUE,         -- "ALICIA"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
**Sample Data:**
- ID: 1, Name: "Alicia", Code: "ALICIA"

---

### 2. 🏘️ BARANGAYS
**Purpose:** Store all neighborhoods/barangays in Alicia Municipality
```sql
CREATE TABLE barangays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,               -- Barangay name
    municipality_id INT NOT NULL,             -- Links to municipalities(id)
    contact_email VARCHAR(100),               -- Barangay email
    contact_phone VARCHAR(20),                -- Barangay phone
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (municipality_id) REFERENCES municipalities(id) ON DELETE CASCADE
);
```
**Sample Data:**
- Poblacion, San Isidro, Santa Cruz, etc.

---

### 3. 👥 USERS
**Purpose:** Login accounts for all system users
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,     -- Login username
    email VARCHAR(100) NOT NULL UNIQUE,       -- Email address
    password VARCHAR(255) NOT NULL,           -- Hashed password
    role ENUM('resident', 'barangay', 'municipal', 'admin') NOT NULL DEFAULT 'resident',
    is_active BOOLEAN DEFAULT TRUE,           -- Account status
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```
**User Roles:**
- `resident` - Regular citizens
- `barangay` - Barangay officials
- `municipal` - Municipality staff
- `admin` - System administrators

---

### 4. 🏠 RESIDENTS
**Purpose:** Detailed personal information of residents
```sql
CREATE TABLE residents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,              -- Links to users(id)
    barangay_id INT NOT NULL,                 -- Links to barangays(id)
    first_name VARCHAR(50) NOT NULL,          -- First name
    last_name VARCHAR(50) NOT NULL,           -- Last name
    middle_name VARCHAR(50),                  -- Middle name (optional)
    address TEXT NOT NULL,                    -- Full address
    phone VARCHAR(20),                        -- Phone number
    birth_date DATE,                          -- Date of birth
    gender ENUM('Male', 'Female', 'Other'),   -- Gender
    civil_status ENUM('Single', 'Married', 'Widowed', 'Divorced', 'Separated'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (barangay_id) REFERENCES barangays(id) ON DELETE RESTRICT
);
```

---

### 5. 📄 DOCUMENT_REQUESTS ⭐ **MAIN TABLE**
**Purpose:** All document requests from residents
```sql
CREATE TABLE document_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT NOT NULL,                 -- Who requested (links to residents)
    document_type VARCHAR(100) NOT NULL,      -- What document they want
    request_type ENUM('barangay', 'municipal') NOT NULL,  -- Where to process
    barangay_id INT NULL,                     -- Only for barangay requests
    status ENUM('pending', 'processing', 'approved', 'ready', 'completed', 'rejected') DEFAULT 'pending',
    purpose TEXT,                             -- Why they need it
    notes TEXT,                               -- Staff notes
    processed_by INT NULL,                    -- Which staff processed it
    document_number VARCHAR(50) NULL,         -- Generated document number
    fee_amount DECIMAL(10,2) DEFAULT 0.00,    -- How much to pay
    payment_status ENUM('unpaid', 'paid', 'waived') DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,              -- When completed
    FOREIGN KEY (resident_id) REFERENCES residents(id) ON DELETE CASCADE,
    FOREIGN KEY (barangay_id) REFERENCES barangays(id) ON DELETE SET NULL,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
);
```

**Request Types:**
- `barangay` - Processed by barangay officials
- `municipal` - Processed by municipality staff

**Status Flow:**
```
pending → processing → approved → ready → completed
                    ↘ rejected
```

---

### 6. 📋 DOCUMENT_TYPES
**Purpose:** Available documents and their details
```sql
CREATE TABLE document_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,               -- Document name
    type ENUM('barangay', 'municipal') NOT NULL,  -- Which office handles it
    description TEXT,                         -- What the document is for
    requirements TEXT,                        -- What to bring
    fee DECIMAL(10,2) DEFAULT 0.00,          -- Cost
    processing_days INT DEFAULT 1,           -- How long it takes
    is_active BOOLEAN DEFAULT TRUE,          -- Still available?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Barangay Documents:**
- Barangay Clearance (₱50.00)
- Certificate of Residency (₱30.00)
- Barangay ID (₱100.00)
- Certificate of Indigency (Free)

**Municipal Documents:**
- Business Permit (₱500.00)
- Municipal Clearance (₱100.00)
- Building Permit (₱1,000.00)
- Mayor's Permit (₱200.00)

---

### 7. 🔔 NOTIFICATIONS
**Purpose:** Updates and alerts for users
```sql
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                     -- Who gets the notification
    title VARCHAR(200) NOT NULL,              -- Notification title
    message TEXT NOT NULL,                    -- Notification content
    type ENUM('info', 'success', 'warning', 'error') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,            -- Has user seen it?
    related_request_id INT NULL,              -- Links to document_requests
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_request_id) REFERENCES document_requests(id) ON DELETE SET NULL
);
```

---

## 🔄 SYSTEM WORKFLOW

### **For Residents:**
1. **Register** → Creates `users` and `residents` records
2. **Login** → Access dashboard
3. **Request Document** → Creates `document_requests` record
4. **Get Notifications** → Updates in `notifications` table
5. **Track Status** → Check `document_requests.status`

### **For Barangay Officials:**
1. **Login** with `role = 'barangay'`
2. **View Requests** → See `document_requests` where `request_type = 'barangay'`
3. **Process Requests** → Update `status` and `notes`
4. **Send Notifications** → Create `notifications` records

### **For Municipal Staff:**
1. **Login** with `role = 'municipal'`
2. **View Requests** → See `document_requests` where `request_type = 'municipal'`
3. **Process Requests** → Update `status` and `notes`
4. **Send Notifications** → Create `notifications` records

---

## 📊 KEY RELATIONSHIPS

1. **Municipality ↔ Barangays** (1:N)
   - One municipality has many barangays

2. **Users ↔ Residents** (1:1)
   - Each user account has one resident profile

3. **Barangays ↔ Residents** (1:N)
   - Each barangay has many residents

4. **Residents ↔ Document Requests** (1:N)
   - Each resident can make many requests

5. **Users ↔ Notifications** (1:N)
   - Each user can have many notifications

6. **Document Requests ↔ Notifications** (1:N)
   - Each request can generate multiple notifications

---

## 🔍 IMPORTANT INDEXES

- `document_requests.status` - For filtering by status
- `document_requests.request_type` - For barangay vs municipal
- `document_requests.resident_id` - For user's requests
- `document_requests.created_at` - For chronological sorting
- `notifications.user_id, is_read` - For unread notifications

---

## 🎯 BUSINESS RULES

1. **Only ONE municipality** - Alicia Municipality
2. **Two request types** - Barangay or Municipal
3. **Role-based access** - Users see only relevant data
4. **Status tracking** - Clear workflow from pending to completed
5. **Fee management** - Each document type has a fee
6. **Notification system** - Users get updates on their requests

---

## 🛡️ SECURITY FEATURES

- **Password hashing** - All passwords are encrypted
- **Role-based access** - Different permissions per role
- **Foreign key constraints** - Data integrity maintained
- **Soft deletes** - Important data preserved
- **Audit trails** - Created/updated timestamps

---

*Generated for Alicia Municipality Digital Government System*
*Database Schema Version 1.0*