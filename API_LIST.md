# API Endpoints

## Authentication Routes

| Method | Endpoint       | Description                                                                          |
| ------ | -------------- | ------------------------------------------------------------------------------------ |
| POST   | `/auth/signup` | Creates new user account with name, email and password. Returns JWT token in cookie. |
| POST   | `/auth/login`  | Authenticates user with email and password. Returns JWT token in cookie.             |

## Profile Routes

| Method | Endpoint            | Description                                                     |
| ------ | ------------------- | --------------------------------------------------------------- |
| GET    | `/profile`          | Retrieves current authenticated user's profile details          |
| PATCH  | `/profile/update`   | Updates authenticated user's profile information                |
| GET    | `/profile/groups`   | Lists all groups where the authenticated user is a participant  |
| GET    | `/profile/expenses` | Lists all expenses where user is involved (either paid or owes) |

## Group Routes

| Method | Endpoint                   | Description                                                                                   |
| ------ | -------------------------- | --------------------------------------------------------------------------------------------- |
| POST   | `/group/create`            | Creates a new group with name, photo, participants and admins. Creator must be a participant. |
| GET    | `/group/:groupId`          | Retrieves details of a specific group                                                         |
| GET    | `/group/:groupId/expenses` | Gets all expenses associated with a specific group                                            |
| PATCH  | `/group/:groupId`          | Updates group details. Only admins can modify group information.                              |

## Expense Routes

| Method | Endpoint                          | Description                                                                                  |
| ------ | --------------------------------- | -------------------------------------------------------------------------------------------- |
| POST   | `/expense/create`                 | Creates new expense in a group. Requires expense details, participants who paid and who owe. |
| GET    | `/expense/:expenseId`             | Retrieves details of a specific expense                                                      |
| GET    | `/expense/group/summary/:groupId` | Gets expense summary for entire group including total pending amounts                        |
| PATCH  | `/expense/:expenseId`             | Updates expense details. Only creator can modify.                                            |

## Authentication Requirements

- All endpoints except `/auth/signup` and `/auth/login` require valid JWT token
- JWT token is handled via cookies

## Access Controls

- Group expenses can only be accessed by group participants
- Expenses can only be modified by their creators
- Groups must have at least one admin
- User must be a participant to create expenses in a group
- Only group admins can modify group details
