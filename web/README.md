# Instantboard Web Client

## Screen Spec

### Login

- Link:User|Main

### User

- Form:User
  - Input:User.name

### Main

- Tab:
  - Tab:Labels
  - List(Sortable):Tasks
- Tab:
  - List(Sortable):Labels
- Tab:Link:(!Labels) ? Task : Label
- Tab:
  - List:Notification
- Tab:
  - View:Profile

### Task

- Link:Back
- Button:createTask
- Form:Task
  - Select:Task.label
  - Input:Task.content

### Label

- Link:Back
- Link:Member
- Button:createLabel
- Form:Label
  - Input:Label.name

### Member

- Link:Back
- List:Members
- Button:createRequest

### Profile

- Link:Back
- Button:Logout
- Button:deleteAccount
