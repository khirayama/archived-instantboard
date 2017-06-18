# Web Client

## Screen Spec

### Login

- Link:User
- Link:Main(UnregisteredUser)

### User

- Form:User
  - Input:User.name
  - Input:User.sex
  - Input:User.birthday

### Main

- Tab:
  - Tab:Labels
  - List(Sortable):Tasks
- Tab:
  - List(Sortable):Labels
- Tab:Link:(!Labels) ? Task : Label
- Tab:
  - List:Notification
- Tab:Link:Profile

### Task

- Link:Back
- Button:createTask
- Form:Task
  - Select:Task.label
  - Input:Task.content

### Label

- Link:Back
- Button:createLabel
- Form:Label
  - Input:searchUser
    - focus:sharedUserHistroy
  - Input:Label.name

### Profile

- Link:Back
- Button:Logout
- Button:deleteAccount
