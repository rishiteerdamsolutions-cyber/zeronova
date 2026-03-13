# Zeronova NGO Collaboration Platform – Requirements

## 1. Project Vision

The Zeronova NGO Collaboration Platform aims to build a digital ecosystem where:

- **NGOs** can showcase initiatives
- **Volunteers** can discover social opportunities
- **Communities** can collaborate for impact
- **Social innovators** can share ideas

The platform will support social collaboration, transparency, and volunteer engagement.

---

## 2. User Roles

| Role | Responsibilities |
|------|------------------|
| **Admin** | Verification of NGOs, approval of events, reviewing Impact Lab ideas |
| **NGO** | Create events, volunteer opportunities, and campaigns |
| **Volunteer** | Participate in events and contribute to social initiatives |

---

## 3. Authentication

- **Account types:** Volunteer, NGO Organisation
- **Login:** Email, Password
- **Post-login:** Redirect to role-specific dashboard
- **RBAC:** Users can only perform actions allowed for their role

---

## 4. Phase 1 – MVP Features

### 4.1 NGO Registration & Profile System

NGOs register and create organisational profiles.

| Feature | Description |
|---------|-------------|
| NGO registration form | Form to register as an NGO |
| NGO profile page | Public profile for verified NGOs |
| Organisation description | Text describing the NGO |
| Contact details | Email, phone, address, etc. |
| NGO logo upload | Upload and display NGO logo |

### 4.2 Admin NGO Verification

Admins verify NGOs before they become visible.

| Feature | Description |
|---------|-------------|
| Admin approval system | Admins review and act on NGO applications |
| NGO verification status | Pending, Approved, Rejected |
| Approve / Reject NGOs | Actions to approve or reject NGOs |
| Visibility rule | Only verified NGOs visible on the platform |

### 4.3 Volunteer Opportunity Board

NGOs post volunteer opportunities.

**Examples:** Teaching volunteers, Environmental initiatives, Social awareness programs

| Feature | Description |
|---------|-------------|
| Create opportunity | NGOs create new volunteer opportunities |
| View opportunities | Public listing of opportunities |
| Opportunity detail page | Full details of each opportunity |

### 4.4 Events & Campaign Listings

NGOs create social events.

**Examples:** Tree plantation drive, Blood donation camp, Awareness programs

| Feature | Description |
|---------|-------------|
| Event creation | NGOs create new events |
| Event listing | Public listing of events |
| Event details page | Full details of each event |

### 4.5 Event Approval System

Quality control for events.

1. NGO creates event  
2. Event status: **Pending**  
3. Admin reviews event  
4. Admin approves or rejects  
5. Only **approved** events visible publicly  

### 4.6 Contact / Join Form

Visitors contact NGOs or express interest.

| Feature | Description |
|---------|-------------|
| Volunteer interest form | Form for volunteers to express interest |
| Contact form submissions | General contact form for NGOs |
| Admin view of inquiries | Admin can see all inquiries |

### 4.7 Basic Admin Dashboard

Admin panel to manage the platform.

| Feature | Description |
|---------|-------------|
| Manage NGOs | View, verify, approve/reject NGOs |
| Manage events | View, approve/reject events |
| Manage opportunities | View opportunities |
| Manage inquiries | View contact/interest submissions |

---

## 5. Phase 2 – MVP Features

### 5.1 Volunteer Profiles

Volunteers create and manage profiles.

| Feature | Description |
|---------|-------------|
| Skills and interests | Volunteers specify skills and interests |
| Volunteer experience | Track volunteer experience |
| Profile management | Edit and update profile |

### 5.2 Event Registration System

Volunteers register for NGO events.

| Feature | Description |
|---------|-------------|
| Event registration | Volunteers register for events |
| Participant tracking | Track who has registered |
| Volunteer list for NGOs | NGOs see list of registered volunteers |

### 5.3 NGO–Business Collaboration Hub

Section for NGOs to collaborate.

| Feature | Description |
|---------|-------------|
| Partnership announcements | Announce partnerships |
| Collaboration posts | Posts about collaborations |
| Shared initiatives | Showcase shared initiatives |

### 5.4 Messaging System

Communication between NGOs and volunteers.

| Feature | Description |
|---------|-------------|
| Volunteer messaging NGOs | Volunteers can message NGOs |
| NGO inbox | NGOs receive and manage messages |
| Basic notifications | Notifications for new messages |

### 5.5 NGO Document Verification Upload

NGOs upload official documents for verification.

**Examples:** Registration certificate, Legal documents

| Feature | Description |
|---------|-------------|
| Document upload | NGOs upload documents |
| Admin review | Admin reviews uploaded documents |
| Admin approval | Admin approves or rejects documents |

### 5.6 Impact Lab (Idea Submission System)

Users submit social innovation ideas.

**Who can submit:**

- Volunteers  
- NGOs  
- Students / Social innovators  

**Requirements:**

- User must have an account  
- User must be logged in to submit  

---

## 6. Feature Summary by Phase

| Phase | Features |
|-------|----------|
| **Phase 1** | NGO Registration & Profile, Admin NGO Verification, Volunteer Opportunity Board, Events & Campaign Listings, Event Approval System, Contact/Join Form, Basic Admin Dashboard |
| **Phase 2** | Volunteer Profiles, Event Registration System, NGO–Business Collaboration Hub, Messaging System, NGO Document Verification, Impact Lab |

---

*Document version: 1.0 | Based on client requirements*
